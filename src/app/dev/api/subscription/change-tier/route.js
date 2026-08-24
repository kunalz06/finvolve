import { getAdminDb } from "@/lib/firebase-admin";
import { corsJson, corsPreflight } from "@/lib/server/cors";
import { z } from "zod";
import { getRazorpayServerCredentials } from "@/lib/server/payments";
import { SUBSCRIPTION_TIERS, VALID_TIERS, getPlanAmountPaise, getSetupFeePaise } from "@/lib/server/subscription-plans";
import { sendSubscriptionEmailSafe, tierNames } from "@/lib/server/subscription-emails";
import { checkRateLimit, getRequestIp } from "@/lib/server/rate-limit";

const changeTierSchema = z.object({
    email: z.string().trim().email().max(255),
    currentSubscriptionId: z.string().min(1),
    newTier: z.enum(VALID_TIERS),
});

export function OPTIONS(request) {
    return corsPreflight(request);
}

export async function POST(request) {
    const ip = getRequestIp(request);
    const limit = checkRateLimit(`sub-tier:${ip}`, { windowMs: 60_000, maxRequests: 5 });
    if (!limit.allowed) {
        return corsJson(request, { error: "Too many requests. Please retry shortly." }, { status: 429 });
    }

    try {
        const json = await request.json();
        const parsed = changeTierSchema.safeParse(json);
        if (!parsed.success) {
            return corsJson(request, { error: "Invalid payload.", details: parsed.error.flatten() }, { status: 400 });
        }

        const { email, currentSubscriptionId, newTier } = parsed.data;
        const db = getAdminDb();

        // Verify the subscription belongs to this email
        const subDoc = await db.collection("subscriptions").doc(currentSubscriptionId).get();
        if (!subDoc.exists) {
            return corsJson(request, { error: "Subscription not found." }, { status: 404 });
        }
        const subData = subDoc.data();
        if (subData.email !== email) {
            return corsJson(request, { error: "Email does not match this subscription." }, { status: 403 });
        }
        if (subData.status !== "active") {
            return corsJson(request, { error: "Only active subscriptions can change plans." }, { status: 400 });
        }
        if (subData.tier === newTier) {
            return corsJson(request, { error: "You are already on this plan." }, { status: 400 });
        }

        const oldTier = subData.tier;
        const newPlan = SUBSCRIPTION_TIERS[newTier];
        const razorpaySubId = subData.razorpaySubscriptionId;

        // Call Razorpay to change the plan
        if (razorpaySubId) {
            try {
                const { keyId, keySecret } = getRazorpayServerCredentials();
                const Razorpay = (await import("razorpay")).default;
                const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

                // Ensure the new plan exists
                const { ensurePlanExists } = await import("@/lib/server/payments");
                // We need to create/find the Razorpay plan - inline the logic
                const planDocRef = db.collection("config").doc(`plan_${newTier}`);
                const planDoc = await planDocRef.get();
                let planId;
                if (planDoc.exists && planDoc.data().razorpayPlanId && planDoc.data().monthlyAmount === newPlan.monthlyAmountINR) {
                    planId = planDoc.data().razorpayPlanId;
                } else {
                    const rpPlan = await razorpay.plans.create({
                        period: "monthly",
                        interval: 1,
                        item: {
                            name: newPlan.name,
                            amount: getPlanAmountPaise(newTier),
                            currency: "INR",
                            description: newPlan.description,
                        },
                        notes: { tier: newTier, source: "dev_infinity_cloud" },
                    });
                    planId = rpPlan.id;
                    const { FieldValue } = await import("firebase-admin/firestore");
                    await planDocRef.set({
                        razorpayPlanId: planId,
                        tier: newTier,
                        monthlyAmount: newPlan.monthlyAmountINR,
                        setupFee: newPlan.setupFeeINR,
                        createdAt: FieldValue.serverTimestamp(),
                    });
                }

                // Use Razorpay's subscription upgrade/downgrade
                await razorpay.subscriptions.update(razorpaySubId, {
                    plan_id: planId,
                });
            } catch (rpErr) {
                console.error("Razorpay tier change failed:", rpErr.message);
                return corsJson(request, { error: `Failed to update plan on payment provider. ${rpErr.message}` }, { status: 502 });
            }
        }

        // Update Firestore - store pending tier change, actual tier update happens next cycle
        const { FieldValue } = await import("firebase-admin/firestore");
        await db.collection("subscriptions").doc(currentSubscriptionId).update({
            pendingTierChange: {
                from: oldTier,
                to: newTier,
                requestedAt: FieldValue.serverTimestamp(),
            },
            updatedAt: FieldValue.serverTimestamp(),
        });

        // Send tier change email
        sendSubscriptionEmailSafe({
            to: email,
            name: subData.name,
            action: "tier_change",
            planName: tierNames[oldTier] || oldTier,
            newPlanName: tierNames[newTier] || newTier,
            subscriptionId: currentSubscriptionId,
        });

        return corsJson(request, {
            success: true,
            message: `Plan change scheduled. Your subscription will move from ${tierNames[oldTier] || oldTier} to ${tierNames[newTier] || newTier} at the next billing cycle.`,
            from: oldTier,
            to: newTier,
        });
    } catch (error) {
        console.error("Tier change failed:", error.message);
        return corsJson(request, { error: "Unable to change subscription tier." }, { status: 500 });
    }
}

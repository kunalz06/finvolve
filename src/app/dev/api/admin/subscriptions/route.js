import { getAdminDb, verifyAdminFromRequest } from "@/lib/firebase-admin";
import { corsJson, corsPreflight } from "@/lib/server/cors";
import { z } from "zod";
import { checkRateLimit, getRequestIp } from "@/lib/server/rate-limit";
import { getRazorpayServerCredentials } from "@/lib/server/payments";
import { SUBSCRIPTION_TIERS, VALID_TIERS } from "@/lib/server/subscription-plans";
import { sendSubscriptionEmailSafe, tierNames } from "@/lib/server/subscription-emails";

const adminActionSchema = z.object({
    subscriptionId: z.string().min(1),
    action: z.enum(["cancel", "pause", "resume", "change_tier"]),
    newTier: z.string().optional(),
});

export function OPTIONS(request) {
    return corsPreflight(request);
}

// GET: List all subscriptions (admin only)
export async function GET(request) {
    const admin = await verifyAdminFromRequest(request);
    if (!admin.ok) {
        return corsJson(request, { error: admin.error }, { status: admin.status });
    }

    try {
        const db = getAdminDb();
        const snapshot = await db
            .collection("subscriptions")
            .orderBy("createdAt", "desc")
            .limit(200)
            .get();

        const subscriptions = snapshot.docs.map((doc) => {
            const d = doc.data();
            return {
                id: doc.id,
                tier: d.tier,
                name: d.name || "",
                email: d.email || "",
                phone: d.phone || "",
                status: d.status,
                monthlyAmount: d.monthlyAmount,
                setupFee: d.setupFee,
                cycleCount: d.cycleCount || 0,
                currentPeriodEnd: d.currentPeriodEnd || null,
                createdAt: d.createdAt?.toDate?.()?.toISOString?.() || null,
                activatedAt: d.activatedAt?.toDate?.()?.toISOString?.() || null,
                cancelledAt: d.cancelledAt?.toDate?.()?.toISOString?.() || null,
                pausedAt: d.pausedAt?.toDate?.()?.toISOString?.() || null,
                pendingTierChange: d.pendingTierChange || null,
            };
        });

        return corsJson(request, { subscriptions });
    } catch (error) {
        console.error("Admin subscription list failed:", error.message);
        return corsJson(request, { error: "Unable to fetch subscriptions." }, { status: 500 });
    }
}

// PATCH: Admin manage subscription (cancel, pause, resume, change tier)
export async function PATCH(request) {
    const ip = getRequestIp(request);
    const limit = checkRateLimit(`admin-sub:${ip}`, { windowMs: 60_000, maxRequests: 30 });
    if (!limit.allowed) {
        return corsJson(request, { error: "Too many requests." }, { status: 429 });
    }

    const admin = await verifyAdminFromRequest(request);
    if (!admin.ok) {
        return corsJson(request, { error: admin.error }, { status: admin.status });
    }

    try {
        const json = await request.json();
        const parsed = adminActionSchema.safeParse(json);
        if (!parsed.success) {
            return corsJson(request, { error: "Invalid payload.", details: parsed.error.flatten() }, { status: 400 });
        }

        const { subscriptionId, action, newTier } = parsed.data;
        const db = getAdminDb();
        const subRef = db.collection("subscriptions").doc(subscriptionId);
        const subSnap = await subRef.get();

        if (!subSnap.exists) {
            return corsJson(request, { error: "Subscription not found." }, { status: 404 });
        }

        const subData = subSnap.data();
        const razorpaySubId = subData.razorpaySubscriptionId;
        const { FieldValue } = await import("firebase-admin/firestore");

        if (action === "change_tier") {
            if (!newTier || !VALID_TIERS.includes(newTier)) {
                return corsJson(request, { error: "Invalid target tier." }, { status: 400 });
            }
            if (subData.tier === newTier) {
                return corsJson(request, { error: "Already on this tier." }, { status: 400 });
            }

            if (razorpaySubId) {
                try {
                    const { keyId, keySecret } = getRazorpayServerCredentials();
                    const Razorpay = (await import("razorpay")).default;
                    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

                    const newPlan = SUBSCRIPTION_TIERS[newTier];
                    const planDocRef = db.collection("config").doc(`plan_${newTier}`);
                    const planDoc = await planDocRef.get();
                    let planId;
                    if (planDoc.exists && planDoc.data().razorpayPlanId && planDoc.data().monthlyAmount === newPlan.monthlyAmountINR) {
                        planId = planDoc.data().razorpayPlanId;
                    } else {
                        const rpPlan = await razorpay.plans.create({
                            period: "monthly", interval: 1,
                            item: { name: newPlan.name, amount: newPlan.monthlyAmountINR * 100, currency: "INR", description: newPlan.description },
                            notes: { tier: newTier, source: "dev_infinity_cloud" },
                        });
                        planId = rpPlan.id;
                        await planDocRef.set({
                            razorpayPlanId: planId, tier: newTier,
                            monthlyAmount: newPlan.monthlyAmountINR, setupFee: newPlan.setupFeeINR,
                            createdAt: FieldValue.serverTimestamp(),
                        });
                    }

                    await razorpay.subscriptions.update(razorpaySubId, { plan_id: planId });
                } catch (rpErr) {
                    console.error("Admin Razorpay tier change failed:", rpErr.message);
                    return corsJson(request, { error: `Razorpay error: ${rpErr.message}` }, { status: 502 });
                }
            }

            const oldTier = subData.tier;
            await subRef.update({
                pendingTierChange: { from: oldTier, to: newTier, requestedAt: FieldValue.serverTimestamp() },
                updatedAt: FieldValue.serverTimestamp(),
            });

            sendSubscriptionEmailSafe({
                to: subData.email, name: subData.name, action: "tier_change",
                planName: tierNames[oldTier] || oldTier, newPlanName: tierNames[newTier] || newTier,
                subscriptionId,
            });

            return corsJson(request, { success: true, action: "change_tier", from: oldTier, to: newTier });
        }

        // Cancel, Pause, Resume via Razorpay
        if (razorpaySubId) {
            try {
                const { keyId, keySecret } = getRazorpayServerCredentials();
                const Razorpay = (await import("razorpay")).default;
                const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

                if (action === "cancel") await razorpay.subscriptions.cancel(razorpaySubId);
                else if (action === "pause") await razorpay.subscriptions.pause(razorpaySubId, { pause_at: "now" });
                else if (action === "resume") await razorpay.subscriptions.resume(razorpaySubId, { resume_at: "now" });
            } catch (rpErr) {
                console.error(`Admin Razorpay ${action} failed:`, rpErr.message);
                return corsJson(request, { error: `Razorpay error: ${rpErr.message}` }, { status: 502 });
            }
        }

        const updateData = { updatedAt: FieldValue.serverTimestamp() };
        if (action === "cancel") {
            updateData.status = "cancelled";
            updateData.cancelledAt = FieldValue.serverTimestamp();
            updateData.cancelReason = "admin_action";
        } else if (action === "pause") {
            updateData.status = "paused";
            updateData.pausedAt = FieldValue.serverTimestamp();
        } else if (action === "resume") {
            updateData.status = "active";
            updateData.resumedAt = FieldValue.serverTimestamp();
        }

        await subRef.update(updateData);

        sendSubscriptionEmailSafe({
            to: subData.email, name: subData.name, action,
            planName: tierNames[subData.tier] || subData.tier, subscriptionId,
        });

        return corsJson(request, { success: true, action, subscriptionId, status: updateData.status });
    } catch (error) {
        console.error("Admin subscription manage failed:", error.message);
        return corsJson(request, { error: "Unable to manage subscription." }, { status: 500 });
    }
}

import Razorpay from "razorpay";
import { z } from "zod";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";
import { corsJson, corsPreflight } from "@/lib/server/cors";
import {
    getRazorpayServerCredentials,
} from "@/lib/server/payments";
import {
    SUBSCRIPTION_TIERS,
    VALID_TIERS,
    SUBSCRIPTION_TOTAL_CYCLES,
    getSetupFeePaise,
} from "@/lib/server/subscription-plans";
import { checkRateLimit, getRequestIp } from "@/lib/server/rate-limit";

const payloadSchema = z.object({
    tier: z.enum(VALID_TIERS),
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(255),
    phone: z.string().trim().min(7).max(32),
});

/**
 * Ensure a Razorpay Plan exists for the given tier.
 * Caches the plan_id in Firestore (config/subscription_plans/{tier}).
 */
async function ensurePlanExists(razorpay, db, tier) {
    const planConfig = SUBSCRIPTION_TIERS[tier];
    const docRef = db.collection("config").doc(`plan_${tier}`);
    const doc = await docRef.get();

    // Validate cached plan matches current price
    if (doc.exists && doc.data().razorpayPlanId) {
        const cached = doc.data();
        if (cached.monthlyAmount === planConfig.monthlyAmountINR) {
            return cached.razorpayPlanId;
        }
    }

    // Determine billing period
    const periodDays = planConfig.billingPeriodDays;
    const planParams = periodDays && periodDays < 30
        ? { period: "daily", interval: periodDays }
        : { period: "monthly", interval: 1 };

    const plan = await razorpay.plans.create({
        ...planParams,
        item: {
            name: planConfig.name,
            amount: planConfig.monthlyAmountINR * 100,
            currency: "INR",
            description: planConfig.description,
        },
        notes: { tier, source: "dev_infinity_cloud" },
    });

    await docRef.set({
        razorpayPlanId: plan.id,
        tier,
        monthlyAmount: planConfig.monthlyAmountINR,
        setupFee: planConfig.setupFeeINR,
        createdAt: FieldValue.serverTimestamp(),
    });

    return plan.id;
}

export function OPTIONS(request) {
    return corsPreflight(request);
}

export async function POST(request) {
    const ip = getRequestIp(request);
    const limit = checkRateLimit(`sub-create:${ip}`, {
        windowMs: 60_000,
        maxRequests: 8,
    });

    if (!limit.allowed) {
        return corsJson(
            request,
            { error: "Too many requests. Please retry shortly." },
            { status: 429 },
        );
    }

    try {
        const json = await request.json();
        const parsed = payloadSchema.safeParse(json);
        if (!parsed.success) {
            return corsJson(
                request,
                { error: "Invalid payload.", details: parsed.error.flatten() },
                { status: 400 },
            );
        }

        const { tier, name, email, phone } = parsed.data;
        const planConfig = SUBSCRIPTION_TIERS[tier];

        const { keyId, keySecret } = getRazorpayServerCredentials();
        const razorpay = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });
        const db = getAdminDb();

        // Check for existing active subscription for this email + tier.
        let existingSub = null;
        try {
            const existingSubs = await db
                .collection("subscriptions")
                .where("email", "==", email)
                .where("tier", "==", tier)
                .limit(10)
                .get();

            for (const doc of existingSubs.docs) {
                const data = doc.data();
                if (data.status === "active") {
                    existingSub = { id: doc.id, ...data };
                    break;
                }
            }
        } catch (firestoreError) {
            console.warn("Subscription duplicate-check query failed, skipping:", firestoreError.message);
        }

        if (existingSub) {
            return corsJson(
                request,
                {
                    error: `You already have an active ${planConfig.name} subscription. Please check your dashboard or contact support.`,
                    existingSubscriptionId: existingSub.id,
                },
                { status: 409 },
            );
        }

        // Ensure the Razorpay plan exists
        const planId = await ensurePlanExists(razorpay, db, tier);

        // Build addons for the one-time setup fee
        const setupFeePaise = getSetupFeePaise(tier);
        const addons = setupFeePaise > 0
            ? [{
                  item: {
                      name: `${planConfig.name} — One-time Setup Fee`,
                      amount: setupFeePaise,
                      currency: "INR",
                  },
              }]
            : [];

        // Create the Razorpay subscription only.
        // Firestore record is created by the webhook AFTER successful payment.
        const subscription = await razorpay.subscriptions.create({
            plan_id: planId,
            total_count: SUBSCRIPTION_TOTAL_CYCLES,
            customer_notify: 1,
            addons,
            notes: {
                tier,
                email,
                name,
                phone,
                source: "dev_infinity_cloud",
            },
        });

        const firstChargeAmount =
            planConfig.monthlyAmountINR * 100 + setupFeePaise;

        return corsJson(request, {
            subscriptionId: subscription.id,
            checkoutKey: keyId,
            tier,
            planName: planConfig.name,
            monthlyAmount: planConfig.monthlyAmountINR,
            setupFee: planConfig.setupFeeINR,
            firstChargeAmount,
            currency: "INR",
        });
    } catch (error) {
        console.error("Failed to create subscription:", error.message);
        console.error("Stack:", error.stack);
        return corsJson(
            request,
            { error: "Unable to create subscription right now. Please try again.", debug: error.message },
            { status: 500 },
        );
    }
}

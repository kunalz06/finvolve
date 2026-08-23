import crypto from "crypto";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";
import { SUBSCRIPTION_TIERS } from "@/lib/server/subscription-plans";

/**
 * Verifies the Razorpay webhook signature.
 * Uses the RAZORPAY_WEBHOOK_SECRET environment variable.
 */
function verifyWebhookSignature(body, signature, secret) {
    const expected = crypto
        .createHmac("sha256", secret)
        .update(body)
        .digest("hex");

    const providedBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);
    if (providedBuffer.length !== expectedBuffer.length) {
        return false;
    }

    return crypto.timingSafeEqual(providedBuffer, expectedBuffer);
}

/**
 * Build the initial Firestore document for a newly activated subscription.
 * Called only after the first successful payment.
 */
function buildNewSubscriptionDoc(subscriptionId, entity, notes) {
    const tier = notes?.tier || "base";
    const planConfig = SUBSCRIPTION_TIERS[tier];
    if (!planConfig) return null;

    const periodEnd = new Date();
    periodEnd.setDate(periodEnd.getDate() + 30);

    return {
        tier,
        name: notes?.name || "",
        email: notes?.email || "",
        phone: notes?.phone || "",
        status: "active",
        razorpaySubscriptionId: subscriptionId,
        razorpayPlanId: entity?.plan_id || "",
        activatedAt: FieldValue.serverTimestamp(),
        currentPeriodStart: FieldValue.serverTimestamp(),
        currentPeriodEnd: periodEnd.toISOString(),
        computeUsage: {
            totalAllowed: planConfig.computeHours.total,
            usedThisPeriod: 0,
            firstHalfUsed: 0,
            secondHalfUsed: 0,
        },
        apiUsage: {
            gpt: { allowed: planConfig.apiAccess.gptHours, used: 0 },
            gemini: { allowed: planConfig.apiAccess.geminiHours, used: 0 },
            claude: { allowed: planConfig.apiAccess.claudeHours, used: 0 },
        },
        monthlyAmount: planConfig.monthlyAmountINR,
        setupFee: planConfig.setupFeeINR,
        cycleCount: 1,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
    };
}

/**
 * Reset period usage counters for a new billing cycle.
 */
function buildPeriodResetUpdate(tier) {
    const planConfig = SUBSCRIPTION_TIERS[tier];
    if (!planConfig) return {};

    return {
        computeUsage: {
            totalAllowed: planConfig.computeHours.total,
            usedThisPeriod: 0,
            firstHalfUsed: 0,
            secondHalfUsed: 0,
        },
        apiUsage: {
            gpt: { allowed: planConfig.apiAccess.gptHours, used: 0 },
            gemini: { allowed: planConfig.apiAccess.geminiHours, used: 0 },
            claude: { allowed: planConfig.apiAccess.claudeHours, used: 0 },
        },
    };
}

export async function POST(request) {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
        console.error("RAZORPAY_WEBHOOK_SECRET is not configured.");
        return new Response("Webhook not configured", { status: 500 });
    }

    const signature = request.headers.get("x-razorpay-signature");
    if (!signature) {
        return new Response("Missing signature", { status: 400 });
    }

    const rawBody = await request.text();

    if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
        return new Response("Invalid signature", { status: 400 });
    }

    let event;
    try {
        event = JSON.parse(rawBody);
    } catch {
        return new Response("Invalid JSON", { status: 400 });
    }

    const { event: eventType, payload } = event;
    const entity = payload?.subscription?.entity;
    const subscriptionId = entity?.id;

    if (!subscriptionId) {
        return new Response("OK", { status: 200 });
    }

    const db = getAdminDb();
    const subRef = db.collection("subscriptions").doc(subscriptionId);

    try {
        switch (eventType) {
            case "subscription.activated": {
                // First successful payment — create the Firestore record now.
                const subSnap = await subRef.get();
                if (!subSnap.exists) {
                    const notes = entity?.notes || {};
                    const doc = buildNewSubscriptionDoc(subscriptionId, entity, notes);
                    if (doc) {
                        await subRef.set(doc);
                        console.log(`Webhook: created subscription ${subscriptionId} (${notes.tier}) after activation.`);
                    }
                } else {
                    // Document already exists (edge case) — just activate it.
                    const periodEnd = new Date();
                    periodEnd.setDate(periodEnd.getDate() + 30);
                    const tier = subSnap.data()?.tier;
                    await subRef.update({
                        status: "active",
                        activatedAt: FieldValue.serverTimestamp(),
                        currentPeriodStart: FieldValue.serverTimestamp(),
                        currentPeriodEnd: periodEnd.toISOString(),
                        cycleCount: FieldValue.increment(1),
                        updatedAt: FieldValue.serverTimestamp(),
                        ...(tier ? buildPeriodResetUpdate(tier) : {}),
                    });
                }
                break;
            }

            case "subscription.charged": {
                const subSnap = await subRef.get();
                if (!subSnap.exists) break;

                const chargeEntity = payload.payment?.entity;
                if (chargeEntity?.status === "captured") {
                    const tier = subSnap.data()?.tier;
                    const periodEnd = new Date();
                    periodEnd.setDate(periodEnd.getDate() + 30);
                    await subRef.update({
                        cycleCount: FieldValue.increment(1),
                        lastChargedAt: FieldValue.serverTimestamp(),
                        lastChargeAmount: chargeEntity.amount,
                        currentPeriodStart: FieldValue.serverTimestamp(),
                        currentPeriodEnd: periodEnd.toISOString(),
                        updatedAt: FieldValue.serverTimestamp(),
                        ...(tier ? buildPeriodResetUpdate(tier) : {}),
                    });
                }
                break;
            }

            case "subscription.completed": {
                await subRef.update({
                    status: "completed",
                    completedAt: FieldValue.serverTimestamp(),
                    updatedAt: FieldValue.serverTimestamp(),
                });
                break;
            }

            case "subscription.paused": {
                await subRef.update({
                    status: "paused",
                    pausedAt: FieldValue.serverTimestamp(),
                    updatedAt: FieldValue.serverTimestamp(),
                });
                break;
            }

            case "subscription.resumed": {
                await subRef.update({
                    status: "active",
                    resumedAt: FieldValue.serverTimestamp(),
                    updatedAt: FieldValue.serverTimestamp(),
                });
                break;
            }

            case "subscription.cancelled": {
                await subRef.update({
                    status: "cancelled",
                    cancelledAt: FieldValue.serverTimestamp(),
                    cancelReason: entity?.ended_at ? "end_of_term" : "user_requested",
                    updatedAt: FieldValue.serverTimestamp(),
                });
                break;
            }

            case "subscription.halted": {
                await subRef.update({
                    status: "halted",
                    haltedAt: FieldValue.serverTimestamp(),
                    updatedAt: FieldValue.serverTimestamp(),
                });
                break;
            }

            default:
                break;
        }
    } catch (error) {
        console.error(`Webhook processing error for ${eventType}:`, error.message);
    }

    return new Response("OK", { status: 200 });
}

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
    const entity = payload?.subscription?.entity || payload?.payment?.entity;
    const subscriptionId = entity?.id;

    if (!subscriptionId) {
        return new Response("OK", { status: 200 });
    }

    const db = getAdminDb();
    const subRef = db.collection("subscriptions").doc(subscriptionId);
    const subSnap = await subRef.get();

    if (!subSnap.exists) {
        console.warn(`Webhook: subscription ${subscriptionId} not found in Firestore.`);
        return new Response("OK", { status: 200 });
    }

    const subData = subSnap.data();
    const tier = subData.tier;
    const updateData = { updatedAt: FieldValue.serverTimestamp() };

    try {
        switch (eventType) {
            case "subscription.activated": {
                updateData.status = "active";
                updateData.activatedAt = FieldValue.serverTimestamp();
                updateData.currentPeriodStart = FieldValue.serverTimestamp();
                // Approximate end: 30 days from now
                const periodEnd = new Date();
                periodEnd.setDate(periodEnd.getDate() + 30);
                updateData.currentPeriodEnd = periodEnd.toISOString();
                updateData.cycleCount = FieldValue.increment(1);
                Object.assign(updateData, buildPeriodResetUpdate(tier));
                break;
            }

            case "subscription.charged": {
                const chargeEntity = payload.payment?.entity;
                if (chargeEntity?.status === "captured") {
                    updateData.cycleCount = FieldValue.increment(1);
                    updateData.lastChargedAt = FieldValue.serverTimestamp();
                    updateData.lastChargeAmount = chargeEntity.amount;
                    updateData.currentPeriodStart = FieldValue.serverTimestamp();
                    const periodEnd = new Date();
                    periodEnd.setDate(periodEnd.getDate() + 30);
                    updateData.currentPeriodEnd = periodEnd.toISOString();
                    Object.assign(updateData, buildPeriodResetUpdate(tier));
                }
                break;
            }

            case "subscription.completed": {
                updateData.status = "completed";
                updateData.completedAt = FieldValue.serverTimestamp();
                break;
            }

            case "subscription.paused": {
                updateData.status = "paused";
                updateData.pausedAt = FieldValue.serverTimestamp();
                break;
            }

            case "subscription.resumed": {
                updateData.status = "active";
                updateData.resumedAt = FieldValue.serverTimestamp();
                break;
            }

            case "subscription.cancelled": {
                updateData.status = "cancelled";
                updateData.cancelledAt = FieldValue.serverTimestamp();
                updateData.cancelReason =
                    entity?.ended_at ? "end_of_term" : "user_requested";
                break;
            }

            case "subscription.halted": {
                updateData.status = "halted";
                updateData.haltedAt = FieldValue.serverTimestamp();
                break;
            }

            default:
                break;
        }

        await subRef.update(updateData);
    } catch (error) {
        console.error(`Webhook processing error for ${eventType}:`, error.message);
    }

    return new Response("OK", { status: 200 });
}

import Razorpay from "razorpay";
import { z } from "zod";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";
import { corsJson, corsPreflight } from "@/lib/server/cors";
import {
    PAYMENT_SOURCE,
    QUICK_START_AMOUNT_INR,
    getRazorpayServerCredentials,
    hashToken,
} from "@/lib/server/payments";
import { checkRateLimit, getRequestIp } from "@/lib/server/rate-limit";
import { getCanonicalSiteUrl } from "@/lib/server/site-url";
import { createCashfreeOrder, getCashfreeServerConfig } from "@/lib/server/cashfree";

const payloadSchema = z.object({
    source: z.enum([PAYMENT_SOURCE.QUICK_START, PAYMENT_SOURCE.PAYMENT_PORTAL]),
    amount: z.number().int().positive().optional(),
    paymentRequestId: z.string().min(6).optional(),
    token: z.string().min(16).optional(),
    provider: z.enum(["razorpay", "cashfree"]).optional(),
}).superRefine((data, ctx) => {
    if (data.source === PAYMENT_SOURCE.QUICK_START && data.provider) {
        ctx.addIssue({ code: "custom", path: ["provider"], message: "Provider selection is only available for payment portal requests." });
    }
});

const MAX_PAYMENT_INR = 5_00_000;
const MIN_PAYMENT_INR = 1;

export function OPTIONS(request) {
    return corsPreflight(request);
}

export async function POST(request) {
    const ip = getRequestIp(request);
    const limit = checkRateLimit(`create-order:${ip}`, {
        windowMs: 60_000,
        maxRequests: 12,
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

        const { source, amount, paymentRequestId, token } = parsed.data;
        const provider = parsed.data.provider || "razorpay";
        let amountInInr = QUICK_START_AMOUNT_INR;
        let notes = { source };

        if (source === PAYMENT_SOURCE.PAYMENT_PORTAL) {
            if (!paymentRequestId || !token) {
                return corsJson(
                    request,
                    { error: "Missing payment request token or id." },
                    { status: 400 },
                );
            }

            const db = getAdminDb();
            const paymentRef = db.collection("payment_requests").doc(paymentRequestId);
            const snapshot = await paymentRef.get();
            if (!snapshot.exists) {
                return corsJson(
                    request,
                    { error: "Payment request not found." },
                    { status: 404 },
                );
            }

            const payment = snapshot.data();
            if (provider === "cashfree" && payment.source !== PAYMENT_SOURCE.PAYMENT_PORTAL) {
                return corsJson(request, { error: "Payment request source mismatch." }, { status: 400 });
            }
            const providedHash = hashToken(token);
            const expiresAtMs = payment.tokenExpiresAt?.toMillis?.() ?? 0;
            const tokenMatches = payment.tokenHash && payment.tokenHash === providedHash;

            if (!tokenMatches || !expiresAtMs || Date.now() > expiresAtMs) {
                return corsJson(
                    request,
                    { error: "Payment link is invalid or expired." },
                    { status: 401 },
                );
            }

            if (payment.status === "paid") {
                return corsJson(
                    request,
                    { error: "Payment request is already paid." },
                    { status: 409 },
                );
            }

            amountInInr = Number(payment.amount);
            notes = {
                ...notes,
                paymentRequestId,
            };

            // Keep a server-side timestamp trail for attempted initiations.
            await paymentRef.update({
                lastOrderInitiatedAt: FieldValue.serverTimestamp(),
            });
        }

        if (
            !Number.isFinite(amountInInr) ||
            amountInInr < MIN_PAYMENT_INR ||
            amountInInr > MAX_PAYMENT_INR
        ) {
            return corsJson(
                request,
                { error: "Amount outside allowed range." },
                { status: 400 },
            );
        }

        if (typeof amount === "number" && amount !== amountInInr) {
            return corsJson(
                request,
                { error: "Amount mismatch detected." },
                { status: 400 },
            );
        }

        const amountInPaisa = amountInInr * 100;
        if (provider === "cashfree") {
            const paymentRef = getAdminDb().collection("payment_requests").doc(paymentRequestId);
            const payment = (await paymentRef.get()).data();
            if (payment.currency !== "INR" || !payment.clientName || !payment.clientEmail) {
                return corsJson(request, { error: "Payment request is missing required trusted customer or currency data." }, { status: 400 });
            }
            const providerOrderId = `portal_${paymentRequestId}_${Date.now()}`.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 45);
            const siteUrl = getCanonicalSiteUrl(request);
            const cashfreeOrder = await createCashfreeOrder({
                orderId: providerOrderId,
                amount: amountInInr,
                currency: payment.currency,
                paymentRequestId,
                clientName: payment.clientName,
                clientEmail: payment.clientEmail,
                notifyUrl: `${siteUrl}/dev/api/cashfree/webhook`,
            });
            await paymentRef.update({ provider, providerOrderId, providerStatus: cashfreeOrder.order_status, lastOrderInitiatedAt: FieldValue.serverTimestamp() });
            return corsJson(request, {
                id: cashfreeOrder.order_id,
                paymentSessionId: cashfreeOrder.payment_session_id,
                amount: cashfreeOrder.order_amount,
                currency: cashfreeOrder.order_currency,
                provider,
                cashfreeMode: getCashfreeServerConfig().environment,
                source,
                paymentRequestId,
            });
        }

        const { keyId, keySecret } = getRazorpayServerCredentials();
        const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
        const order = await razorpay.orders.create({
            amount: amountInPaisa,
            currency: "INR",
            receipt: `${source}_${Math.random().toString(36).slice(2, 10)}`,
            notes,
        });

        return corsJson(request, {
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            source,
            paymentRequestId: paymentRequestId || null,
            checkoutKey: keyId,
            provider,
            returnUrl: `${getCanonicalSiteUrl(request)}/dev/payments`,
        });
    } catch (error) {
        console.error("Failed to create payment order:", error.message);
        return corsJson(
            request,
            { error: "Unable to create payment order right now." },
            { status: 500 },
        );
    }
}

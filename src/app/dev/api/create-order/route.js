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

const payloadSchema = z.object({
    source: z.enum([PAYMENT_SOURCE.QUICK_START, PAYMENT_SOURCE.PAYMENT_PORTAL]),
    amount: z.number().int().positive().optional(),
    paymentRequestId: z.string().min(6).optional(),
    token: z.string().min(16).optional(),
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

        const { keyId, keySecret } = getRazorpayServerCredentials();
        const razorpay = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });

        const { source, amount, paymentRequestId, token } = parsed.data;
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
            returnUrl: `${getCanonicalSiteUrl(request)}/dev/payments`,
        });
    } catch (error) {
        console.error("Failed to create Razorpay order:", error.message);
        return corsJson(
            request,
            { error: "Unable to create payment order right now." },
            { status: 500 },
        );
    }
}

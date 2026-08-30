import Razorpay from "razorpay";
import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";
import { getAdminDb } from "@/lib/firebase-admin";
import { corsJson, corsPreflight } from "@/lib/server/cors";
import {
    PAYMENT_SOURCE,
    QUICK_START_AMOUNT_PAISE,
    getRazorpayServerCredentials,
    hashToken,
    verifyRazorpaySignature,
} from "@/lib/server/payments";
import {
    renderProjectRequestAcknowledgementHtml,
    sendNewsletterMail,
} from "@/lib/server/newsletter";
import { checkRateLimit, getRequestIp } from "@/lib/server/rate-limit";

const quickStartDataSchema = z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(255),
    phone: z.string().trim().min(7).max(32),
    projectType: z.string().trim().min(2).max(80),
    description: z.string().trim().min(10).max(3000),
});

const payloadSchema = z.object({
    source: z.enum([PAYMENT_SOURCE.QUICK_START, PAYMENT_SOURCE.PAYMENT_PORTAL]),
    razorpay_payment_id: z.string().min(8),
    razorpay_order_id: z.string().min(8),
    razorpay_signature: z.string().min(16),
    paymentRequestId: z.string().min(6).optional(),
    token: z.string().min(16).optional(),
    quickStartData: quickStartDataSchema.optional(),
});

export function OPTIONS(request) {
    return corsPreflight(request);
}

export async function POST(request) {
    const ip = getRequestIp(request);
    const limit = checkRateLimit(`verify-payment:${ip}`, {
        windowMs: 60_000,
        maxRequests: 20,
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

        const data = parsed.data;
        const { keyId, keySecret } = getRazorpayServerCredentials();

        const signatureValid = verifyRazorpaySignature({
            orderId: data.razorpay_order_id,
            paymentId: data.razorpay_payment_id,
            signature: data.razorpay_signature,
            keySecret,
        });

        if (!signatureValid) {
            return corsJson(
                request,
                { error: "Invalid payment signature." },
                { status: 400 },
            );
        }

        const razorpay = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });
        const order = await razorpay.orders.fetch(data.razorpay_order_id);

        if (data.source === PAYMENT_SOURCE.QUICK_START) {
            if (!data.quickStartData) {
                return corsJson(
                    request,
                    { error: "Quick start details are missing." },
                    { status: 400 },
                );
            }

            if (Number(order.amount) !== QUICK_START_AMOUNT_PAISE) {
                return corsJson(
                    request,
                    { error: "Order amount mismatch." },
                    { status: 400 },
                );
            }
            if (order?.notes?.source !== PAYMENT_SOURCE.QUICK_START) {
                return corsJson(
                    request,
                    { error: "Order source mismatch." },
                    { status: 400 },
                );
            }

            const db = getAdminDb();
            const existing = await db
                .collection("requests")
                .where("paymentId", "==", data.razorpay_payment_id)
                .limit(1)
                .get();

            if (!existing.empty) {
                return corsJson(request, {
                    success: true,
                    alreadyProcessed: true,
                    requestId: existing.docs[0].id,
                });
            }

            const quickStartRequest = await db.collection("requests").add({
                ...data.quickStartData,
                createdAt: FieldValue.serverTimestamp(),
                status: "paid_priority",
                isQuickStart: true,
                paymentId: data.razorpay_payment_id,
                orderId: data.razorpay_order_id,
                signature: data.razorpay_signature,
                wizardSubmission: false,
                acknowledgementEmailSent: false,
            });

            try {
                await sendNewsletterMail({
                    to: data.quickStartData.email,
                    subject: "We received your DEV Infinity quick-start request",
                    text: `Hi ${data.quickStartData.name},\n\nPayment is confirmed and we received your quick-start project request.\n\nProject type: ${data.quickStartData.projectType}\n\n${data.quickStartData.description}`,
                    html: renderProjectRequestAcknowledgementHtml({
                        ...data.quickStartData,
                        timeline: "priority",
                    }),
                });
                await quickStartRequest.update({
                    acknowledgementEmailSent: true,
                    acknowledgementEmailSentAt: FieldValue.serverTimestamp(),
                });
            } catch (mailError) {
                console.error("Quick-start acknowledgement email failed:", mailError.message);
                await quickStartRequest.update({
                    acknowledgementEmailError: mailError.message || "Acknowledgement email failed.",
                });
            }

            return corsJson(request, {
                success: true,
                requestId: quickStartRequest.id,
            });
        }

        if (!data.paymentRequestId || !data.token) {
            return corsJson(
                request,
                { error: "Missing payment request id/token." },
                { status: 400 },
            );
        }

        const db = getAdminDb();
        const paymentRef = db.collection("payment_requests").doc(data.paymentRequestId);
        const paymentSnap = await paymentRef.get();

        if (!paymentSnap.exists) {
            return corsJson(
                request,
                { error: "Payment request not found." },
                { status: 404 },
            );
        }

        const payment = paymentSnap.data();
        const tokenHash = hashToken(data.token);
        const tokenMatches = payment.tokenHash && payment.tokenHash === tokenHash;
        const expiresAtMs = payment.tokenExpiresAt?.toMillis?.() ?? 0;
        if (!tokenMatches || !expiresAtMs || Date.now() > expiresAtMs) {
            return corsJson(
                request,
                { error: "Payment link is invalid or expired." },
                { status: 401 },
            );
        }

        const expectedAmountPaise = Number(payment.amount) * 100;
        if (!Number.isFinite(expectedAmountPaise) || Number(order.amount) !== expectedAmountPaise) {
            return corsJson(
                request,
                { error: "Order amount mismatch." },
                { status: 400 },
            );
        }
        if (order?.notes?.source !== PAYMENT_SOURCE.PAYMENT_PORTAL) {
            return corsJson(
                request,
                { error: "Order source mismatch." },
                { status: 400 },
            );
        }
        if (order?.notes?.paymentRequestId !== data.paymentRequestId) {
            return corsJson(
                request,
                { error: "Payment request mismatch." },
                { status: 400 },
            );
        }

        if (payment.status === "paid") {
            return corsJson(request, {
                success: true,
                alreadyProcessed: true,
                paymentRequestId: paymentSnap.id,
            });
        }

        await paymentRef.update({
            status: "paid",
            razorpayPaymentId: data.razorpay_payment_id,
            razorpayOrderId: data.razorpay_order_id,
            paidAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });

        return corsJson(request, {
            success: true,
            paymentRequestId: paymentSnap.id,
        });
    } catch (error) {
        console.error("Payment verification failed:", error.message);
        return corsJson(
            request,
            { error: "Unable to verify payment right now." },
            { status: 500 },
        );
    }
}

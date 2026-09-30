import crypto from "crypto";
import { getAdminDb } from "@/lib/firebase-admin";
import { corsJson } from "@/lib/server/cors";
import { settleRentalBillPayment } from "@/lib/server/rental-payment-settlement";

function verifyWebhookSignature(rawBody, signature, secret) {
    if (!signature || !secret) return false;

    const expected = crypto
        .createHmac("sha256", secret)
        .update(rawBody)
        .digest("hex");

    const supplied = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);
    if (supplied.length !== expectedBuffer.length) return false;

    return crypto.timingSafeEqual(supplied, expectedBuffer);
}

/**
 * Razorpay returns the customer to this route after the SMS-only Payment Link
 * checkout. State is never mutated from GET query parameters; the signed
 * webhook below is the authoritative settlement path.
 */
export async function GET() {
    return redirectResponse();
}

/**
 * Signed Razorpay webhook for the SMS-only rental Payment Link.
 * The DEV Infinity portal and this SMS link both settle the same
 * payment_requests record, so either channel is idempotent.
 */
export async function POST(request) {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
        console.error("RAZORPAY_WEBHOOK_SECRET is not configured.");
        return new Response("Webhook not configured", { status: 500 });
    }

    const signature = request.headers.get("x-razorpay-signature");
    const rawBody = await request.text();

    if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
        return new Response("Invalid signature", { status: 400 });
    }

    try {
        const event = JSON.parse(rawBody);

        if (event.event !== "payment_link.paid") {
            return corsJson(request, { received: true });
        }

        const paymentLinkEntity = event.payload?.payment_link?.entity || {};
        const paymentEntity = event.payload?.payment?.entity || {};
        const notes = paymentLinkEntity.notes || paymentEntity.notes || {};

        const rentalId = notes.rentalId;
        const paymentRequestId = notes.paymentRequestId;
        const paymentId = paymentEntity.id;
        const paymentLinkId = paymentLinkEntity.id;

        if (
            notes.type !== "rental_bill_sms" ||
            !rentalId ||
            !paymentRequestId ||
            !paymentId
        ) {
            console.warn("Rental Payment Link webhook missing trusted association data.");
            return corsJson(request, { received: true });
        }

        const db = getAdminDb();
        const settlement = await settleRentalBillPayment({
            db,
            rentalId,
            paymentRequestId,
            paymentId,
            provider: "razorpay_payment_link",
            paymentLinkId,
        });

        return corsJson(request, { received: true, settlement });
    } catch (error) {
        console.error("Rental webhook error:", error.message);
        return corsJson(request, { error: "Webhook processing failed." }, { status: 500 });
    }
}

function redirectResponse() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://devsoftwareai.live";
    const url = new URL("/dev/cloud", siteUrl);
    url.searchParams.set("rental", "bill_payment_returned");
    return Response.redirect(url.toString(), 302);
}

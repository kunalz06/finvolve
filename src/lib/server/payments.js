import crypto from "crypto";

export const PAYMENT_SOURCE = {
    QUICK_START: "quick_start",
    PAYMENT_PORTAL: "payment_portal",
};

export const QUICK_START_AMOUNT_INR = 99;
export const QUICK_START_AMOUNT_PAISE = QUICK_START_AMOUNT_INR * 100;

export function hashToken(token) {
    return crypto.createHash("sha256").update(token).digest("hex");
}

export function createPaymentToken() {
    return crypto.randomBytes(24).toString("hex");
}

export function verifyRazorpaySignature({
    orderId,
    paymentId,
    signature,
    keySecret,
}) {
    const payload = `${orderId}|${paymentId}`;
    const expected = crypto
        .createHmac("sha256", keySecret)
        .update(payload)
        .digest("hex");

    const providedBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);
    if (providedBuffer.length !== expectedBuffer.length) {
        return false;
    }

    return crypto.timingSafeEqual(providedBuffer, expectedBuffer);
}

export function getRazorpayServerCredentials() {
    // Razorpay key ids are public identifiers, so we can safely reuse the
    // browser key id on the server when a separate server copy is not set.
    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
        throw new Error("Missing Razorpay server credentials.");
    }

    return { keyId, keySecret };
}

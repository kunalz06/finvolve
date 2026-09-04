import crypto from "crypto";
import { FieldValue } from "firebase-admin/firestore";
import { PAYMENT_SOURCE } from "@/lib/server/payments";

const CASHFREE_API_VERSION = "2023-08-01";

export function getCashfreeServerConfig() {
    const clientId = process.env.CASHFREE_CLIENT_ID;
    const clientSecret = process.env.CASHFREE_CLIENT_SECRET;
    const environment = process.env.CASHFREE_ENVIRONMENT === "production" ? "production" : "sandbox";
    if (!clientId || !clientSecret) throw new Error("Missing Cashfree server credentials.");
    return {
        clientId,
        clientSecret,
        environment,
        baseUrl: environment === "production" ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg",
    };
}

async function cashfreeRequest(path, options = {}) {
    const config = getCashfreeServerConfig();
    const response = await fetch(`${config.baseUrl}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "x-api-version": CASHFREE_API_VERSION,
            "x-client-id": config.clientId,
            "x-client-secret": config.clientSecret,
            ...options.headers,
        },
        cache: "no-store",
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.message || `Cashfree request failed (${response.status}).`);
    return body;
}

export function createCashfreeOrder({ orderId, amount, currency, paymentRequestId, clientName, clientEmail, notifyUrl }) {
    return cashfreeRequest("/orders", {
        method: "POST",
        body: JSON.stringify({
            order_id: orderId,
            order_amount: amount,
            order_currency: currency,
            customer_details: {
                customer_id: `client_${paymentRequestId}`.slice(0, 50),
                customer_name: clientName,
                customer_email: clientEmail,
                customer_phone: "9999999999",
            },
            order_meta: { notify_url: notifyUrl },
            order_note: `payment_request:${paymentRequestId}`,
            order_tags: { source: PAYMENT_SOURCE.PAYMENT_PORTAL, paymentRequestId },
        }),
    });
}

export async function fetchSuccessfulCashfreePayment(orderId) {
    const [order, payments] = await Promise.all([
        cashfreeRequest(`/orders/${encodeURIComponent(orderId)}`),
        cashfreeRequest(`/orders/${encodeURIComponent(orderId)}/payments`),
    ]);
    const payment = Array.isArray(payments)
        ? payments.find((item) => item.payment_status === "SUCCESS")
        : null;
    return { order, payment };
}

export function verifyCashfreeWebhookSignature({ rawBody, timestamp, signature }) {
    const secret = process.env.CASHFREE_CLIENT_SECRET;
    const timestampMs = Number(timestamp);
    if (!secret || !timestamp || !signature || !Number.isFinite(timestampMs) || Math.abs(Date.now() - timestampMs) > 5 * 60 * 1000) return false;
    const expected = crypto.createHmac("sha256", secret).update(`${timestamp}${rawBody}`).digest("base64");
    const supplied = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);
    return supplied.length === expectedBuffer.length && crypto.timingSafeEqual(supplied, expectedBuffer);
}

export async function markCashfreePaymentPaid({ db, paymentRequestId, providerOrderId, order, payment }) {
    if (!order || order.order_id !== providerOrderId || order.order_status !== "PAID") {
        throw new Error("Cashfree order is not paid.");
    }
    if (!payment || payment.order_id !== providerOrderId || payment.payment_status !== "SUCCESS") {
        throw new Error("Cashfree payment is not successful.");
    }

    const paymentRef = db.collection("payment_requests").doc(paymentRequestId);
    return db.runTransaction(async (transaction) => {
        const snapshot = await transaction.get(paymentRef);
        if (!snapshot.exists) throw new Error("Payment request not found.");
        const record = snapshot.data();
        const expectedAmount = Number(record.amount);
        if (record.source !== PAYMENT_SOURCE.PAYMENT_PORTAL || record.provider !== "cashfree") throw new Error("Payment provider association mismatch.");
        if (record.providerOrderId !== providerOrderId) throw new Error("Payment order association mismatch.");
        if (record.currency !== "INR" || order.order_currency !== "INR" || payment.payment_currency !== "INR") throw new Error("Payment currency mismatch.");
        if (Number(order.order_amount) !== expectedAmount || Number(payment.payment_amount) !== expectedAmount) throw new Error("Payment amount mismatch.");
        if (record.status === "paid") return { alreadyProcessed: true };
        transaction.update(paymentRef, {
            status: "paid",
            provider: "cashfree",
            providerOrderId,
            providerPaymentId: String(payment.cf_payment_id),
            providerStatus: payment.payment_status,
            paidAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });
        return { alreadyProcessed: false };
    });
}

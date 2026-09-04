import { getAdminDb } from "@/lib/firebase-admin";
import { fetchSuccessfulCashfreePayment, markCashfreePaymentPaid, verifyCashfreeWebhookSignature } from "@/lib/server/cashfree";

export async function POST(request) {
    const rawBody = await request.text();
    const timestamp = request.headers.get("x-webhook-timestamp");
    const signature = request.headers.get("x-webhook-signature");
    if (!verifyCashfreeWebhookSignature({ rawBody, timestamp, signature })) {
        return Response.json({ error: "Invalid webhook signature." }, { status: 401 });
    }

    try {
        const event = JSON.parse(rawBody);
        const providerOrderId = event?.data?.order?.order_id;
        const eventPayment = event?.data?.payment;
        if (!providerOrderId || eventPayment?.payment_status !== "SUCCESS") {
            return Response.json({ received: true });
        }

        const db = getAdminDb();
        const matches = await db.collection("payment_requests")
            .where("providerOrderId", "==", providerOrderId)
            .limit(2)
            .get();
        if (matches.size !== 1) return Response.json({ error: "Unknown or ambiguous order." }, { status: 400 });
        const paymentRequestId = matches.docs[0].id;
        const authoritative = await fetchSuccessfulCashfreePayment(providerOrderId);
        if (String(authoritative.payment?.cf_payment_id) !== String(eventPayment.cf_payment_id)) {
            return Response.json({ error: "Payment id mismatch." }, { status: 400 });
        }
        await markCashfreePaymentPaid({ db, paymentRequestId, providerOrderId, ...authoritative });
        return Response.json({ received: true });
    } catch (error) {
        console.error("Cashfree webhook processing failed:", error.message);
        return Response.json({ error: "Webhook could not be processed." }, { status: 400 });
    }
}

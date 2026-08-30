import { getAdminDb } from "@/lib/firebase-admin";
import { corsJson } from "@/lib/server/cors";
import { FieldValue } from "firebase-admin/firestore";
import { sendRentalBillPaidEmail } from "@/lib/server/rental-emails";

/**
 * Razorpay Payment Link callback (GET redirect after user pays).
 * Query params: razorpay_payment_id, razorpay_payment_link_id, razorpay_payment_link_reference_id,
 *               razorpay_payment_link_status, rentalId (from notes).
 *
 * Also handles the `payment_link.paid` webhook event (POST) for server-side confirmation.
 */
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get("razorpay_payment_id");
    const paymentLinkId = searchParams.get("razorpay_payment_link_id");
    const status = searchParams.get("razorpay_payment_link_status");
    const rentalId = searchParams.get("rentalId");

    if (!paymentId || !rentalId) {
        return corsJson(request, { error: "Missing parameters." }, { status: 400 });
    }

    return handleBillPayment({ paymentId, paymentLinkId, status, rentalId, request });
}

export async function POST(request) {
    try {
        const json = await request.json();

        // Handle Razorpay webhook for payment_link.paid
        const event = json.event;
        if (event === "payment_link.paid") {
            const payload = json.payload?.payment_link || json.payload?.payment || {};
            const paymentEntity = json.payload?.payment || {};
            const paymentId = paymentEntity.id || payload.payment_id;
            const notes = payload.notes || paymentEntity.notes || {};
            const rentalId = notes.rentalId;
            const type = notes.type;

            if (type === "rental_bill" && rentalId) {
                return handleBillPayment({ paymentId, paymentLinkId: payload.id, rentalId, request });
            }
        }

        return corsJson(request, { received: true });
    } catch (error) {
        console.error("Rental webhook error:", error.message);
        return corsJson(request, { error: "Webhook processing failed." }, { status: 500 });
    }
}

async function handleBillPayment({ paymentId, paymentLinkId, rentalId, request }) {
    const db = getAdminDb();
    const rentalRef = db.collection("rentals").doc(rentalId);
    const snap = await rentalRef.get();

    if (!snap.exists) {
        console.warn(`Rental ${rentalId} not found for bill payment ${paymentId}`);
        return redirectResponse(request);
    }

    const rental = snap.data();
    if (rental.status === "paid" || rental.status === "settled") {
        return redirectResponse(request);
    }

    await rentalRef.update({
        status: "paid",
        billPaymentId: paymentId,
        billPaymentLinkId: paymentLinkId || rental.billPaymentLinkId,
        billPaidAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
    });

    // Send payment confirmation email
    try {
        await sendRentalBillPaidEmail({
            to: rental.email,
            name: rental.name,
            rentalId,
            hoursUsed: rental.hoursUsed,
            totalPaid: rental.billAmountINR,
        });
    } catch (mailErr) {
        console.error("Rental bill paid email failed:", mailErr.message);
    }

    return redirectResponse(request);
}

function redirectResponse(request) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://devsoftwareai.live";
    const url = new URL("/dev/cloud", siteUrl);
    url.searchParams.set("rental", "bill_paid");
    return Response.redirect(url.toString(), 302);
}
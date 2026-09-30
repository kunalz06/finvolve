import Razorpay from "razorpay";
import { FieldValue } from "firebase-admin/firestore";
import { PAYMENT_PURPOSE, getRazorpayServerCredentials } from "./payments";
import { sendRentalBillPaidEmail } from "./rental-emails";

export async function settleRentalBillPayment({
    db,
    rentalId,
    paymentRequestId,
    paymentId,
    provider,
    providerOrderId = null,
    paymentLinkId = null,
}) {
    if (!rentalId) return { rentalSettled: false, reason: "missing_rental_id" };

    const rentalRef = db.collection("rentals").doc(rentalId);
    const paymentRef = paymentRequestId
        ? db.collection("payment_requests").doc(paymentRequestId)
        : null;

    let rentalData = null;
    let newlySettled = false;

    await db.runTransaction(async (transaction) => {
        const rentalSnap = await transaction.get(rentalRef);
        if (!rentalSnap.exists) throw new Error("Rental not found.");

        rentalData = rentalSnap.data();

        if (paymentRef) {
            const paymentSnap = await transaction.get(paymentRef);
            if (!paymentSnap.exists) throw new Error("Rental payment request not found.");

            const payment = paymentSnap.data();
            if (payment.purpose !== PAYMENT_PURPOSE.RENTAL_BILL || payment.rentalId !== rentalId) {
                throw new Error("Rental payment request association mismatch.");
            }

            if (payment.status !== "paid") {
                transaction.update(paymentRef, {
                    status: "paid",
                    provider,
                    providerPaymentId: paymentId || null,
                    providerOrderId: providerOrderId || paymentLinkId || null,
                    providerStatus: "paid",
                    paidAt: FieldValue.serverTimestamp(),
                    updatedAt: FieldValue.serverTimestamp(),
                });
            }
        }

        if (!["paid", "settled"].includes(rentalData.status)) {
            newlySettled = true;
            transaction.update(rentalRef, {
                status: "paid",
                billPaymentId: paymentId || null,
                billPaymentProvider: provider,
                billPaymentRequestId: paymentRequestId || rentalData.billPaymentRequestId || null,
                billPaidAt: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp(),
            });
        }
    });

    // If the DEV Infinity portal was paid first, cancel the SMS-only native
    // Razorpay link so the customer cannot accidentally pay the same bill twice.
    if (
        provider !== "razorpay_payment_link" &&
        rentalData?.billSmsPaymentLinkId
    ) {
        try {
            const { keyId, keySecret } = getRazorpayServerCredentials();
            const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
            await razorpay.paymentLink.cancel(rentalData.billSmsPaymentLinkId);
            await rentalRef.update({
                billSmsNotificationStatus: "cancelled_after_portal_payment",
                updatedAt: FieldValue.serverTimestamp(),
            });
        } catch (cancelError) {
            console.warn("Unable to cancel rental SMS payment link:", cancelError.message);
        }
    }

    if (newlySettled && rentalData) {
        try {
            await sendRentalBillPaidEmail({
                to: rentalData.email,
                name: rentalData.name,
                rentalId,
                hoursUsed: rentalData.hoursUsed,
                totalPaid: rentalData.billAmountINR,
            });
        } catch (mailError) {
            console.error("Rental bill paid email failed:", mailError.message);
        }
    }

    return {
        rentalSettled: true,
        alreadySettled: !newlySettled,
        rentalId,
    };
}

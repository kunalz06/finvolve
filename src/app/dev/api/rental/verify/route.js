import Razorpay from "razorpay";
import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";
import { getAdminDb } from "@/lib/firebase-admin";
import { corsJson, corsPreflight } from "@/lib/server/cors";
import { getRazorpayServerCredentials, verifyRazorpaySignature } from "@/lib/server/payments";
import { RENTAL_CONFIG } from "@/lib/server/rental-plans";
import { sendRentalActivatedEmail } from "@/lib/server/rental-emails";
import { checkRateLimit, getRequestIp } from "@/lib/server/rate-limit";

const payloadSchema = z.object({
    rentalId: z.string().min(6),
    razorpay_payment_id: z.string().min(8),
    razorpay_order_id: z.string().min(8),
    razorpay_signature: z.string().min(16),
});

export function OPTIONS(request) {
    return corsPreflight(request);
}

export async function POST(request) {
    const ip = getRequestIp(request);
    const limit = checkRateLimit(`rental-verify:${ip}`, { windowMs: 60_000, maxRequests: 12 });
    if (!limit.allowed) {
        return corsJson(request, { error: "Too many requests." }, { status: 429 });
    }

    try {
        const json = await request.json();
        const parsed = payloadSchema.safeParse(json);
        if (!parsed.success) {
            return corsJson(request, { error: "Invalid payload.", details: parsed.error.flatten() }, { status: 400 });
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
            return corsJson(request, { error: "Invalid payment signature." }, { status: 400 });
        }

        const db = getAdminDb();
        const rentalRef = db.collection("rentals").doc(data.rentalId);
        const rentalSnap = await rentalRef.get();
        if (!rentalSnap.exists) {
            return corsJson(request, { error: "Rental not found." }, { status: 404 });
        }

        const rental = rentalSnap.data();
        if (rental.status !== "pending_payment") {
            return corsJson(request, { success: true, alreadyProcessed: true, status: rental.status });
        }
        if (rental.razorpayOrderId !== data.razorpay_order_id) {
            return corsJson(request, { error: "Order ID mismatch." }, { status: 400 });
        }

        // Verify amount with Razorpay
        const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
        const order = await razorpay.orders.fetch(data.razorpay_order_id);
        if (Number(order.amount) !== RENTAL_CONFIG.upfrontFeeINR * 100) {
            return corsJson(request, { error: "Order amount mismatch." }, { status: 400 });
        }

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + rental.days);

        await rentalRef.update({
            status: "active",
            razorpayPaymentId: data.razorpay_payment_id,
            activatedAt: FieldValue.serverTimestamp(),
            expiresAt,
            updatedAt: FieldValue.serverTimestamp(),
        });

        // Send activation email
        try {
            await sendRentalActivatedEmail({
                to: rental.email,
                name: rental.name,
                rentalId: data.rentalId,
                days: rental.days,
                expiresAt: expiresAt.toISOString(),
            });
        } catch (mailErr) {
            console.error("Rental activation email failed:", mailErr.message);
        }

        return corsJson(request, {
            success: true,
            rentalId: data.rentalId,
            status: "active",
            days: rental.days,
            expiresAt: expiresAt.toISOString(),
        });
    } catch (error) {
        console.error("Rental verification failed:", error.message);
        return corsJson(request, { error: "Unable to verify rental payment." }, { status: 500 });
    }
}

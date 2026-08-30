import Razorpay from "razorpay";
import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";
import { getAdminDb } from "@/lib/firebase-admin";
import { corsJson, corsPreflight } from "@/lib/server/cors";
import { getRazorpayServerCredentials } from "@/lib/server/payments";
import { calculateRentalBill, getBillBreakdown, RENTAL_CONFIG } from "@/lib/server/rental-plans";
import { sendRentalBillEmail } from "@/lib/server/rental-emails";
import { checkRateLimit, getRequestIp } from "@/lib/server/rate-limit";

const generateSchema = z.object({
    rentalId: z.string().min(6),
    hoursUsed: z.number().min(0).max(99999),
});

export function OPTIONS(request) {
    return corsPreflight(request);
}

/**
 * POST — Generate bill for a rental (admin-only, auth-gated on admin page).
 * Calculates bill, creates Razorpay payment link, sends email.
 *
 * GET — List rentals with optional status filter (admin-only).
 */
export async function POST(request) {
    const ip = getRequestIp(request);
    const limit = checkRateLimit(`rental-bill:${ip}`, { windowMs: 60_000, maxRequests: 8 });
    if (!limit.allowed) {
        return corsJson(request, { error: "Too many requests." }, { status: 429 });
    }

    try {
        const json = await request.json();
        const parsed = generateSchema.safeParse(json);
        if (!parsed.success) {
            return corsJson(request, { error: "Invalid payload.", details: parsed.error.flatten() }, { status: 400 });
        }

        const { rentalId, hoursUsed } = parsed.data;
        const db = getAdminDb();
        const rentalRef = db.collection("rentals").doc(rentalId);
        const snap = await rentalRef.get();

        if (!snap.exists) {
            return corsJson(request, { error: "Rental not found." }, { status: 404 });
        }

        const rental = snap.data();
        if (rental.status !== "active") {
            return corsJson(request, { error: `Rental is '${rental.status}', cannot generate bill.` }, { status: 400 });
        }

        const billAmount = calculateRentalBill(hoursUsed);
        const billBreakdown = getBillBreakdown(hoursUsed);

        // Update rental record
        const updates = {
            status: "billed",
            hoursUsed,
            billAmountINR: billAmount,
            billBreakdown,
            billGeneratedAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        };

        // If there's usage, create a Razorpay payment link
        let paymentUrl = null;
        if (billAmount > 0) {
            const { keyId, keySecret } = getRazorpayServerCredentials();
            const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

            const link = await razorpay.paymentLink.create({
                amount: billAmount * 100,
                currency: "INR",
                accept_partial: false,
                description: `DEV Infinity Cloud — Rental Bill (${rentalId})`,
                customer: {
                    name: rental.name,
                    email: rental.email,
                    contact: rental.phone,
                },
                notify: { sms: true, email: false },
                reminder_enable: true,
                notes: {
                    rentalId,
                    type: "rental_bill",
                    hoursUsed: String(hoursUsed),
                },
                callback_url: `${process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "https://devsoftware.vercel.app"}/dev/api/rental/webhook`,
                callback_method: "get",
            });

            paymentUrl = link.short_url;
            updates.billPaymentLink = paymentUrl;
            updates.billPaymentLinkId = link.id;
        } else {
            // Zero usage — mark as settled immediately
            updates.status = "settled";
        }

        await rentalRef.update(updates);

        // Send bill email
        try {
            await sendRentalBillEmail({
                to: rental.email,
                name: rental.name,
                rentalId,
                days: rental.days,
                hoursUsed,
                billBreakdown,
                paymentUrl,
            });
        } catch (mailErr) {
            console.error("Rental bill email failed:", mailErr.message);
        }

        return corsJson(request, {
            success: true,
            rentalId,
            hoursUsed,
            billAmountINR: billAmount,
            billBreakdown,
            paymentUrl,
            status: billAmount > 0 ? "billed" : "settled",
        });
    } catch (error) {
        console.error("Rental bill generation failed:", error.message);
        return corsJson(request, { error: "Unable to generate bill.", debug: error.message }, { status: 500 });
    }
}

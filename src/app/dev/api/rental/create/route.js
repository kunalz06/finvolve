import Razorpay from "razorpay";
import { z } from "zod";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";
import { corsJson, corsPreflight } from "@/lib/server/cors";
import { getRazorpayServerCredentials } from "@/lib/server/payments";
import { RENTAL_CONFIG } from "@/lib/server/rental-plans";
import { checkRateLimit, getRequestIp } from "@/lib/server/rate-limit";

const VALID_DAYS = RENTAL_CONFIG.timeOptions.map((o) => o.days);

const payloadSchema = z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(255),
    phone: z.string().trim().min(7).max(32),
    days: z
        .number()
        .int()
        .min(1)
        .refine((d) => VALID_DAYS.includes(d), {
            message: `Invalid duration. Choose from: ${VALID_DAYS.join(", ")} days`,
        }),
});

export function OPTIONS(request) {
    return corsPreflight(request);
}

export async function POST(request) {
    const ip = getRequestIp(request);
    const limit = checkRateLimit(`rental-create:${ip}`, {
        windowMs: 60_000,
        maxRequests: 6,
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

        const { name, email, phone, days } = parsed.data;
        const { keyId, keySecret } = getRazorpayServerCredentials();

        // Check for existing active rental
        const db = getAdminDb();
        try {
            const existing = await db
                .collection("rentals")
                .where("email", "==", email)
                .where("status", "==", "active")
                .limit(1)
                .get();
            if (!existing.empty) {
                return corsJson(
                    request,
                    {
                        error: `You already have an active rental (${existing.docs[0].id}). Please wait for it to expire or contact support.`,
                    },
                    { status: 409 },
                );
            }
        } catch (queryErr) {
            console.warn("Rental duplicate-check query failed, skipping:", queryErr.message);
        }

        // Create Razorpay order for the upfront fee
        const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
        const upfrontPaise = RENTAL_CONFIG.upfrontFeeINR * 100;

        const order = await razorpay.orders.create({
            amount: upfrontPaise,
            currency: "INR",
            receipt: `rental_upfront_${Date.now()}`,
            notes: {
                source: "cloud_rental",
                rental_days: String(days),
                email,
                name,
                phone,
            },
        });

        // Pre-create the rental record as "pending_payment"
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + days);

        const rentalRef = await db.collection("rentals").add({
            name,
            email,
            phone,
            days,
            status: "pending_payment",
            upfrontFeeINR: RENTAL_CONFIG.upfrontFeeINR,
            hoursUsed: 0,
            billAmountINR: 0,
            expiresAt,
            razorpayOrderId: order.id,
            razorpayPaymentId: null,
            billPaymentId: null,
            billPaymentLink: null,
            createdAt: FieldValue.serverTimestamp(),
            activatedAt: null,
            billGeneratedAt: null,
            billPaidAt: null,
        });

        return corsJson(request, {
            rentalId: rentalRef.id,
            orderId: order.id,
            checkoutKey: keyId,
            upfrontFee: RENTAL_CONFIG.upfrontFeeINR,
            currency: "INR",
            days,
        });
    } catch (error) {
        console.error("Rental creation failed:", error.message);
        return corsJson(
            request,
            { error: "Unable to create rental right now. Please try again.", debug: error.message },
            { status: 500 },
        );
    }
}

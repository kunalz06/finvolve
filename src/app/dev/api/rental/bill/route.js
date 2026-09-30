import Razorpay from "razorpay";
import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";
import { getAdminDb, verifyAdminFromRequest } from "@/lib/firebase-admin";
import { corsJson, corsPreflight } from "@/lib/server/cors";
import { getRazorpayServerCredentials } from "@/lib/server/payments";
import { calculateRentalBill, getBillBreakdown } from "@/lib/server/rental-plans";
import { sendRentalBillEmail } from "@/lib/server/rental-emails";
import { checkRateLimit, getRequestIp } from "@/lib/server/rate-limit";

const payloadSchema = z
    .object({
        rentalId: z.string().min(6),
        action: z.enum(["generate", "resend_email"]).default("generate"),
        hoursUsed: z.number().min(0).max(99999).optional(),
    })
    .superRefine((value, ctx) => {
        if (value.action === "generate" && typeof value.hoursUsed !== "number") {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["hoursUsed"],
                message: "hoursUsed is required when generating a bill.",
            });
        }
    });

export function OPTIONS(request) {
    return corsPreflight(request);
}

function safeMailError(error) {
    return String(error?.message || "Rental bill email failed.").slice(0, 500);
}

async function sendAndTrackBillEmail({
    rentalRef,
    rental,
    rentalId,
    hoursUsed,
    billBreakdown,
    paymentUrl,
}) {
    try {
        const mailResult = await sendRentalBillEmail({
            to: rental.email,
            name: rental.name,
            rentalId,
            days: rental.days,
            hoursUsed,
            billBreakdown,
            paymentUrl,
        });

        await rentalRef.update({
            billEmailStatus: "sent",
            billEmailSentAt: FieldValue.serverTimestamp(),
            billEmailLastAttemptAt: FieldValue.serverTimestamp(),
            billEmailLastError: FieldValue.delete(),
            billEmailMessageId: mailResult?.messageId || null,
            updatedAt: FieldValue.serverTimestamp(),
        });

        return {
            emailSent: true,
            emailMessageId: mailResult?.messageId || null,
        };
    } catch (mailErr) {
        const emailError = safeMailError(mailErr);
        console.error("Rental bill email failed:", emailError);

        await rentalRef.update({
            billEmailStatus: "failed",
            billEmailLastAttemptAt: FieldValue.serverTimestamp(),
            billEmailLastError: emailError,
            updatedAt: FieldValue.serverTimestamp(),
        });

        return { emailSent: false, emailError };
    }
}

/**
 * POST
 * - action=generate: calculate a rental bill, create one Razorpay payment link,
 *   request both Razorpay SMS + email notifications, and send the detailed bill email.
 * - action=resend_email: resend only the detailed bill email using the existing
 *   payment link. This never creates a second Razorpay link or duplicate SMS.
 */
export async function POST(request) {
    const ip = getRequestIp(request);
    const limit = checkRateLimit(`rental-bill:${ip}`, { windowMs: 60_000, maxRequests: 12 });
    if (!limit.allowed) {
        return corsJson(request, { error: "Too many requests." }, { status: 429 });
    }

    const adminAuth = await verifyAdminFromRequest(request);
    if (!adminAuth.ok) {
        return corsJson(request, { error: adminAuth.error }, { status: adminAuth.status });
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

        const { rentalId, action } = parsed.data;
        const db = getAdminDb();
        const rentalRef = db.collection("rentals").doc(rentalId);
        const snap = await rentalRef.get();

        if (!snap.exists) {
            return corsJson(request, { error: "Rental not found." }, { status: 404 });
        }

        const rental = snap.data();

        if (action === "resend_email") {
            if (!rental.billGeneratedAt || !["billed", "paid", "settled"].includes(rental.status)) {
                return corsJson(
                    request,
                    { error: "A bill must be generated before its email can be resent." },
                    { status: 400 },
                );
            }

            const storedHours = Number(rental.hoursUsed || 0);
            const billBreakdown = rental.billBreakdown || getBillBreakdown(storedHours);
            const delivery = await sendAndTrackBillEmail({
                rentalRef,
                rental,
                rentalId,
                hoursUsed: storedHours,
                billBreakdown,
                paymentUrl: rental.billPaymentLink || null,
            });

            if (!delivery.emailSent) {
                return corsJson(
                    request,
                    {
                        error: "The detailed bill email could not be sent.",
                        emailSent: false,
                        emailError: delivery.emailError,
                    },
                    { status: 502 },
                );
            }

            return corsJson(request, {
                success: true,
                rentalId,
                action,
                emailSent: true,
                emailMessageId: delivery.emailMessageId,
            });
        }

        if (rental.status !== "active") {
            return corsJson(
                request,
                { error: `Rental is '${rental.status}', cannot generate bill.` },
                { status: 400 },
            );
        }

        const hoursUsed = parsed.data.hoursUsed;
        const billAmount = calculateRentalBill(hoursUsed);
        const billBreakdown = getBillBreakdown(hoursUsed);

        const updates = {
            status: "billed",
            hoursUsed,
            billAmountINR: billAmount,
            billBreakdown,
            billGeneratedAt: FieldValue.serverTimestamp(),
            billEmailStatus: "pending",
            billEmailLastError: FieldValue.delete(),
            updatedAt: FieldValue.serverTimestamp(),
        };

        let paymentUrl = null;
        let razorpayNotificationRequested = false;

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
                // Keep Razorpay SMS and also send the same payment link by email.
                notify: { sms: true, email: true },
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
            razorpayNotificationRequested = true;
            updates.billPaymentLink = paymentUrl;
            updates.billPaymentLinkId = link.id;
            updates.billRazorpayNotificationChannels = {
                sms: true,
                email: true,
            };
            updates.billRazorpayNotificationRequestedAt = FieldValue.serverTimestamp();
        } else {
            updates.status = "settled";
        }

        await rentalRef.update(updates);

        const delivery = await sendAndTrackBillEmail({
            rentalRef,
            rental,
            rentalId,
            hoursUsed,
            billBreakdown,
            paymentUrl,
        });

        return corsJson(request, {
            success: true,
            rentalId,
            hoursUsed,
            billAmountINR: billAmount,
            billBreakdown,
            paymentUrl,
            status: billAmount > 0 ? "billed" : "settled",
            razorpayNotifications: {
                requested: razorpayNotificationRequested,
                sms: razorpayNotificationRequested,
                email: razorpayNotificationRequested,
            },
            emailSent: delivery.emailSent,
            emailError: delivery.emailError || null,
            emailMessageId: delivery.emailMessageId || null,
        });
    } catch (error) {
        console.error("Rental bill generation failed:", error.message);
        return corsJson(
            request,
            { error: "Unable to generate bill.", debug: error.message },
            { status: 500 },
        );
    }
}

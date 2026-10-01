import Razorpay from "razorpay";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { z } from "zod";
import { getAdminDb, verifyAdminFromRequest } from "@/lib/firebase-admin";
import { corsJson, corsPreflight } from "@/lib/server/cors";
import {
    PAYMENT_PURPOSE,
    PAYMENT_SOURCE,
    createPaymentToken,
    getRazorpayServerCredentials,
    hashToken,
} from "@/lib/server/payments";
import {\n    calculateRentalBill,\n    getBillBreakdown,\n    shouldRefreshRentalPaymentLink,\n} from "@/lib/server/rental-plans";
import { sendRentalBillEmail } from "@/lib/server/rental-emails";
import { checkRateLimit, getRequestIp } from "@/lib/server/rate-limit";
import { getCanonicalSiteUrl } from "@/lib/server/site-url";

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

async function createRentalPortalPayment({
    request,
    db,
    rental,
    rentalId,
    amount,
    hoursUsed,
}) {
    const siteUrl = getCanonicalSiteUrl(request);
    if (!siteUrl) {
        throw new Error("Site URL is not configured on the server.");
    }

    const token = createPaymentToken();
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000);
    const paymentRef = db.collection("payment_requests").doc();

    await paymentRef.set({
        amount,
        currency: "INR",
        source: PAYMENT_SOURCE.PAYMENT_PORTAL,
        purpose: PAYMENT_PURPOSE.RENTAL_BILL,
        rentalId,
        status: "pending",
        clientName: rental.name,
        clientEmail: rental.email,
        notes: `DEV Infinity Cloud rental usage bill · ${hoursUsed} compute hours`,
        tokenHash,
        tokenExpiresAt: Timestamp.fromDate(expiresAt),
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        createdByUid: "rental_billing",
        createdByEmail: "",
        paymentLinkEmailSent: false,
    });

    return {
        paymentRef,
        paymentRequestId: paymentRef.id,
        paymentUrl: `${siteUrl.replace(/\/$/, "")}/dev/payments?token=${token}`,
        expiresAt,
    };
}

async function createRentalSmsLink({
    rental,
    rentalId,
    paymentRequestId,
    billAmount,
    hoursUsed,
    expiresAt,
    siteUrl,
}) {
    const { keyId, keySecret } = getRazorpayServerCredentials();
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const amountPaise = Math.round(billAmount * 100);

    return razorpay.paymentLink.create({
        amount: amountPaise,
        currency: "INR",
        accept_partial: false,
        reference_id: paymentRequestId,
        description: `DEV Infinity Cloud — Rental ${rentalId} · ${hoursUsed} compute hours · INR ${billAmount} due`,
        customer: {
            name: rental.name,
            email: rental.email,
            contact: rental.phone,
        },
        // Keep the requested Razorpay SMS channel, but do not email the
        // Razorpay short URL. Email uses the DEV Infinity payment portal.
        notify: { sms: true, email: false },
        reminder_enable: true,
        expire_by: Math.floor(expiresAt.getTime() / 1000),
        notes: {
            rentalId,
            paymentRequestId,
            type: "rental_bill_sms",
            hoursUsed: String(hoursUsed),
        },
        callback_url: `${siteUrl.replace(/\/$/, "")}/dev/cloud?rental=bill_payment_returned`,
        callback_method: "get",
    });
}

/**
 * POST
 * - action=generate: calculate a prorated rental bill, create the same
 *   tokenized DEV Infinity payment portal link used for project payments,
 *   keep Razorpay SMS as a secondary notification channel, and email the
 *   detailed bill using the portal URL.
 * - action=resend_email: resend only the detailed bill email using the
 *   existing portal payment URL; this does not create another SMS link.
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
            const billAmount = Number(rental.billAmountINR ?? billBreakdown.totalINR ?? 0);
            let paymentUrl = rental.billPaymentLink || null;

            if (
                rental.status === "billed" &&
                shouldRefreshRentalPaymentLink({
                    billAmountINR: billAmount,
                    paymentUrl,
                    expiresAt: rental.billPaymentPortalExpiresAt,
                })
            ) {
                const portal = await createRentalPortalPayment({
                    request,
                    db,
                    rental,
                    rentalId,
                    amount: billAmount,
                    hoursUsed: storedHours,
                });

                paymentUrl = portal.paymentUrl;
                await rentalRef.update({
                    billPaymentLink: paymentUrl,
                    billPaymentRequestId: portal.paymentRequestId,
                    billPaymentPortalExpiresAt: Timestamp.fromDate(portal.expiresAt),
                    updatedAt: FieldValue.serverTimestamp(),
                });
            }

            const delivery = await sendAndTrackBillEmail({
                rentalRef,
                rental,
                rentalId,
                hoursUsed: storedHours,
                billBreakdown,
                paymentUrl,
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
                paymentUrl,
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
            status: billAmount > 0 ? "billed" : "settled",
            hoursUsed,
            billAmountINR: billAmount,
            billBreakdown,
            billGeneratedAt: FieldValue.serverTimestamp(),
            billEmailStatus: "pending",
            billEmailLastError: FieldValue.delete(),
            updatedAt: FieldValue.serverTimestamp(),
        };

        let paymentUrl = null;
        let paymentRequestId = null;
        let smsRequested = false;
        let smsError = null;

        if (billAmount > 0) {
            const portal = await createRentalPortalPayment({
                request,
                db,
                rental,
                rentalId,
                amount: billAmount,
                hoursUsed,
            });
            paymentUrl = portal.paymentUrl;
            paymentRequestId = portal.paymentRequestId;

            updates.billPaymentLink = paymentUrl;
            updates.billPaymentRequestId = paymentRequestId;
            updates.billPaymentPortalExpiresAt = Timestamp.fromDate(portal.expiresAt);

            try {
                const siteUrl = getCanonicalSiteUrl(request);
                const smsLink = await createRentalSmsLink({
                    rental,
                    rentalId,
                    paymentRequestId,
                    billAmount,
                    hoursUsed,
                    expiresAt: portal.expiresAt,
                    siteUrl,
                });

                smsRequested = true;
                updates.billSmsPaymentLinkId = smsLink.id;
                updates.billSmsPaymentLink = smsLink.short_url;
                updates.billSmsNotificationRequestedAt = FieldValue.serverTimestamp();
                updates.billSmsNotificationStatus = "requested";
            } catch (smsLinkError) {
                smsError = String(smsLinkError?.message || "Razorpay SMS notification failed.").slice(0, 500);
                console.error("Rental bill SMS link creation failed:", smsError);
                updates.billSmsNotificationStatus = "failed";
                updates.billSmsNotificationError = smsError;
            }
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
            paymentRequestId,
            status: billAmount > 0 ? "billed" : "settled",
            notifications: {
                portalEmail: delivery.emailSent,
                razorpaySms: smsRequested,
                razorpaySmsError: smsError,
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

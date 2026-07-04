import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { z } from "zod";
import { getAdminDb, verifyAdminFromRequest } from "@/lib/firebase-admin";
import { corsJson, corsPreflight } from "@/lib/server/cors";
import { createPaymentToken, hashToken } from "@/lib/server/payments";
import { checkRateLimit, getRequestIp } from "@/lib/server/rate-limit";
import { renderPaymentLinkHtml, sendNewsletterMail } from "@/lib/server/newsletter";
import { getCanonicalSiteUrl } from "@/lib/server/site-url";

const optionalTrimmedString = (schema) =>
    z.preprocess((value) => {
        if (typeof value !== "string") return value;
        const trimmed = value.trim();
        return trimmed.length === 0 ? undefined : trimmed;
    }, schema.optional());

const payloadSchema = z.object({
    amount: z.coerce.number().int().positive().max(5_00_000),
    clientName: z.string().trim().min(2).max(120),
    clientEmail: z.string().trim().email().max(255),
    notes: optionalTrimmedString(z.string().max(500)),
    expiresInHours: z.coerce.number().int().min(1).max(24 * 30).optional(),
});

export function OPTIONS(request) {
    return corsPreflight(request);
}

export async function POST(request) {
    const ip = getRequestIp(request);
    const limit = checkRateLimit(`admin-payment-link:${ip}`, {
        windowMs: 60_000,
        maxRequests: 30,
    });
    if (!limit.allowed) {
        return corsJson(
            request,
            { error: "Too many requests. Please retry shortly." },
            { status: 429 },
        );
    }

    const adminAuth = await verifyAdminFromRequest(request);
    if (!adminAuth.ok) {
        return corsJson(request, { error: adminAuth.error }, { status: adminAuth.status });
    }

    try {
        const json = await request.json();
        const parsed = payloadSchema.safeParse(json);
        if (!parsed.success) {
            console.error(
                "Invalid admin payment-link payload:",
                JSON.stringify(parsed.error.flatten()),
            );
            return corsJson(
                request,
                { error: "Invalid payload.", details: parsed.error.flatten() },
                { status: 400 },
            );
        }

        const payload = parsed.data;
        const token = createPaymentToken();
        const tokenHash = hashToken(token);
        const expiresInHours = payload.expiresInHours || 72;
        const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);

        const db = getAdminDb();
        const docRef = await db.collection("payment_requests").add({
            amount: payload.amount,
            currency: "INR",
            status: "pending",
            clientName: payload.clientName,
            clientEmail: payload.clientEmail || "",
            notes: payload.notes || "",
            tokenHash,
            tokenExpiresAt: Timestamp.fromDate(expiresAt),
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
            createdByUid: adminAuth.decoded.uid,
            createdByEmail: adminAuth.decoded.email || "",
            paymentLinkEmailSent: false,
        });

        const siteUrl = getCanonicalSiteUrl(request);
        if (!siteUrl) {
            return corsJson(
                request,
                { error: "Site URL is not configured on the server." },
                { status: 500 },
            );
        }

        const paymentUrl = `${siteUrl}/dev/payments?token=${token}`;
        let emailSent = false;

        try {
            await sendNewsletterMail({
                to: payload.clientEmail,
                subject: "Your DEV Infinity payment link",
                text: `Hi ${payload.clientName},\n\nYour secure DEV Infinity payment link is ready.\n\nAmount: INR ${payload.amount.toLocaleString("en-IN")}\nExpires: ${expiresAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}\n\nOpen the link: ${paymentUrl}`,
                html: renderPaymentLinkHtml({
                    clientName: payload.clientName,
                    amount: payload.amount,
                    currency: "INR",
                    paymentUrl,
                    expiresAt,
                    notes: payload.notes,
                }),
            });
            emailSent = true;
            await docRef.update({
                paymentLinkEmailSent: true,
                paymentLinkEmailSentAt: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp(),
            });
        } catch (mailError) {
            console.error("Payment link email failed:", mailError.message);
            await docRef.update({
                paymentLinkEmailError: mailError.message || "Payment link email failed.",
                updatedAt: FieldValue.serverTimestamp(),
            });
        }

        return corsJson(request, {
            success: true,
            paymentRequestId: docRef.id,
            paymentUrl,
            emailSent,
            expiresAt: expiresAt.toISOString(),
        });
    } catch (error) {
        console.error("Payment link creation failed:", error.message);

        const message = String(error?.message || "");
        const code = String(error?.code || "");
        const isFirebaseAdminConfigIssue =
            code === "app/invalid-credential" ||
            message.includes("Unable to detect a Project Id") ||
            message.includes("Failed to determine project ID") ||
            message.includes("Could not load the default credentials") ||
            message.includes("Failed to fetch a valid Google OAuth2 access token") ||
            message.includes("DECODER routines::unsupported");

        if (isFirebaseAdminConfigIssue) {
            return corsJson(
                request,
                { error: "Firebase Admin is not configured correctly on the server." },
                { status: 500 },
            );
        }

        return corsJson(
            request,
            { error: message || "Unable to create payment link." },
            { status: 500 },
        );
    }
}

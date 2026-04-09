import { NextResponse } from "next/server";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { z } from "zod";
import { getAdminDb, verifyAdminFromRequest } from "@/lib/firebase-admin";
import { createPaymentToken, hashToken } from "@/lib/server/payments";
import { checkRateLimit, getRequestIp } from "@/lib/server/rate-limit";

const payloadSchema = z.object({
    amount: z.number().int().positive().max(5_00_000),
    clientName: z.string().trim().min(2).max(120),
    clientEmail: z.string().trim().email().max(255).optional(),
    notes: z.string().trim().max(500).optional(),
    expiresInHours: z.number().int().min(1).max(24 * 30).optional(),
});

function getSiteUrl(request) {
    const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
    if (envUrl) {
        return envUrl.replace(/\/$/, "");
    }

    const proto = request.headers.get("x-forwarded-proto") || "https";
    const host = request.headers.get("host");
    return host ? `${proto}://${host}` : "";
}

export async function POST(request) {
    const ip = getRequestIp(request);
    const limit = checkRateLimit(`admin-payment-link:${ip}`, {
        windowMs: 60_000,
        maxRequests: 30,
    });
    if (!limit.allowed) {
        return NextResponse.json(
            { error: "Too many requests. Please retry shortly." },
            { status: 429 },
        );
    }

    const adminAuth = await verifyAdminFromRequest(request);
    if (!adminAuth.ok) {
        return NextResponse.json({ error: adminAuth.error }, { status: adminAuth.status });
    }

    try {
        const json = await request.json();
        const parsed = payloadSchema.safeParse(json);
        if (!parsed.success) {
            return NextResponse.json(
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
        });

        const siteUrl = getSiteUrl(request);
        const paymentUrl = `${siteUrl}/finvolve/payments?token=${token}`;

        return NextResponse.json({
            success: true,
            paymentRequestId: docRef.id,
            paymentUrl,
            expiresAt: expiresAt.toISOString(),
        });
    } catch (error) {
        console.error("Payment link creation failed:", error.message);
        return NextResponse.json(
            { error: "Unable to create payment link." },
            { status: 500 },
        );
    }
}

import { z } from "zod";
import { getAdminDb } from "@/lib/firebase-admin";
import { corsJson, corsPreflight } from "@/lib/server/cors";
import { hashToken } from "@/lib/server/payments";
import { checkRateLimit, getRequestIp } from "@/lib/server/rate-limit";

const sessionSchema = z.object({
    token: z.string().min(16),
});

export function OPTIONS(request) {
    return corsPreflight(request);
}

export async function POST(request) {
    const ip = getRequestIp(request);
    const limit = checkRateLimit(`payment-session:${ip}`, {
        windowMs: 60_000,
        maxRequests: 20,
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
        const parsed = sessionSchema.safeParse(json);
        if (!parsed.success) {
            return corsJson(
                request,
                { error: "Invalid token payload.", details: parsed.error.flatten() },
                { status: 400 },
            );
        }

        const tokenHash = hashToken(parsed.data.token);
        const db = getAdminDb();
        const snap = await db
            .collection("payment_requests")
            .where("tokenHash", "==", tokenHash)
            .limit(1)
            .get();

        if (snap.empty) {
            return corsJson(
                request,
                { error: "Invalid payment link." },
                { status: 404 },
            );
        }

        const doc = snap.docs[0];
        const payment = doc.data();
        const expiresAtMs = payment.tokenExpiresAt?.toMillis?.() ?? 0;
        if (!expiresAtMs || Date.now() > expiresAtMs) {
            return corsJson(
                request,
                { error: "Payment link has expired." },
                { status: 410 },
            );
        }

        return corsJson(request, {
            id: doc.id,
            amount: Number(payment.amount),
            currency: payment.currency || "INR",
            status: payment.status || "pending",
            clientName: payment.clientName || "",
            clientEmail: payment.clientEmail || "",
            expiresAt: payment.tokenExpiresAt?.toDate?.()?.toISOString() || null,
        });
    } catch (error) {
        console.error("Payment session load failed:", error.message);
        return corsJson(
            request,
            { error: "Could not load payment session." },
            { status: 500 },
        );
    }
}

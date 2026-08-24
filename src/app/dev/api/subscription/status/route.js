import { getAdminDb } from "@/lib/firebase-admin";
import { corsJson, corsPreflight } from "@/lib/server/cors";
import { z } from "zod";

const querySchema = z.object({
    email: z.string().trim().email().max(255),
});

export function OPTIONS(request) {
    return corsPreflight(request);
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || "";

    const parsed = querySchema.safeParse({ email });
    if (!parsed.success) {
        return corsJson(
            request,
            { error: "A valid email is required." },
            { status: 400 },
        );
    }

    try {
        const db = getAdminDb();
        const snapshot = await db
            .collection("subscriptions")
            .where("email", "==", parsed.data.email)
            .orderBy("createdAt", "desc")
            .limit(1)
            .get();

        if (snapshot.empty) {
            return corsJson(request, {
                found: false,
                message: "No subscription found for this email.",
            });
        }

        const doc = snapshot.docs[0];
        const data = doc.data();

        return corsJson(request, {
            found: true,
            subscriptionId: doc.id,
            tier: data.tier,
            status: data.status,
            monthlyAmount: data.monthlyAmount,
            setupFee: data.setupFee,
            cycleCount: data.cycleCount || 0,
            currentPeriodStart: data.currentPeriodStart
                ? (typeof data.currentPeriodStart === "string"
                    ? data.currentPeriodStart
                    : data.currentPeriodStart?.toDate?.()?.toISOString?.() || null)
                : null,
            currentPeriodEnd: data.currentPeriodEnd || null,
            createdAt: data.createdAt
                ? data.createdAt.toDate?.()?.toISOString?.() || null
                : null,
            computeUsage: data.computeUsage || null,
            apiUsage: data.apiUsage || null,
        });
    } catch (error) {
        console.error("Subscription status check failed:", error.message);
        return corsJson(
            request,
            { error: "Unable to check subscription status right now." },
            { status: 500 },
        );
    }
}

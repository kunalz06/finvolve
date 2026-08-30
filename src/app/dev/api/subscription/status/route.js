import { getAdminDb } from "@/lib/firebase-admin";
import { corsJson, corsPreflight } from "@/lib/server/cors";
import { z } from "zod";

const querySchema = z.object({
    email: z.string().trim().email().max(255),
});

const manageActionSchema = z.object({
    email: z.string().trim().email().max(255),
    action: z.enum(["cancel", "pause", "resume"]),
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
            .limit(10)
            .get();

        if (snapshot.empty) {
            return corsJson(request, {
                found: false,
                message: "No subscription found for this email.",
            });
        }

        // Sort by createdAt descending in memory (avoids composite index requirement)
        const docs = snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => {
                const aTime = a.createdAt?.toDate?.()?.getTime?.() || (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0);
                const bTime = b.createdAt?.toDate?.()?.getTime?.() || (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0);
                return bTime - aTime;
            });

        // Return the most recent active/paused subscription, or the latest one
        let best = null;
        for (const data of docs) {
            if (data.status === "active" || data.status === "paused") {
                best = data;
                break;
            }
        }
        if (!best) {
            best = docs[0];
        }

        const data = best;

        return corsJson(request, {
            found: true,
            subscriptionId: data.id,
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
            currentPeriodEnd: data.currentPeriodEnd
                ? (typeof data.currentPeriodEnd === "string"
                    ? data.currentPeriodEnd
                    : data.currentPeriodEnd?.toDate?.()?.toISOString?.() || null)
                : null,
            createdAt: data.createdAt
                ? data.createdAt.toDate?.()?.toISOString?.() || null
                : null,
            computeUsage: data.computeUsage || null,
            apiUsage: data.apiUsage || null,
            razorpaySubscriptionId: data.razorpaySubscriptionId || null,
        });
    } catch (error) {
        console.error("Subscription status check failed:", error.message);
        return corsJson(
            request,
            { error: "Unable to check subscription status right now.", debug: error.message },
            { status: 500 },
        );
    }
}

export async function PATCH(request) {
    try {
        const json = await request.json();
        const parsed = manageActionSchema.safeParse(json);
        if (!parsed.success) {
            return corsJson(request, { error: "Invalid request. Provide a valid email and action (cancel, pause, or resume)." }, { status: 400 });
        }

        const { email, action } = parsed.data;
        const db = getAdminDb();

        // Find the active/paused subscription for this email
        const snapshot = await db
            .collection("subscriptions")
            .where("email", "==", email)
            .limit(10)
            .get();

        let targetDoc = null;
        let targetData = null;
        for (const doc of snapshot.docs) {
            const d = doc.data();
            if (d.status === "active" || d.status === "paused") {
                targetDoc = doc;
                targetData = d;
                break;
            }
        }

        if (!targetDoc) {
            return corsJson(request, { error: "No active or paused subscription found for this email." }, { status: 404 });
        }

        const { FieldValue } = await import("firebase-admin/firestore");
        const razorpaySubId = targetData.razorpaySubscriptionId;

        // Call Razorpay API to perform the action
        let razorpayAction = null;
        if (razorpaySubId) {
            try {
                const { getRazorpayServerCredentials } = await import("@/lib/server/payments");
                const { keyId, keySecret } = getRazorpayServerCredentials();
                const Razorpay = (await import("razorpay")).default;
                const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

                if (action === "cancel") {
                    await razorpay.subscriptions.cancel(razorpaySubId);
                    razorpayAction = "cancelled";
                } else if (action === "pause") {
                    await razorpay.subscriptions.pause(razorpaySubId, { pause_at: "now" });
                    razorpayAction = "paused";
                } else if (action === "resume") {
                    await razorpay.subscriptions.resume(razorpaySubId, { resume_at: "now" });
                    razorpayAction = "resumed";
                }
            } catch (rpErr) {
                console.error(`Razorpay ${action} failed:`, rpErr.message);
                return corsJson(request, { error: `Failed to ${action} subscription via payment provider. ${rpErr.message}` }, { status: 502 });
            }
        }

        // Update Firestore
        const updateData = { updatedAt: FieldValue.serverTimestamp() };
        if (action === "cancel") {
            updateData.status = "cancelled";
            updateData.cancelledAt = FieldValue.serverTimestamp();
            updateData.cancelReason = "user_requested";
        } else if (action === "pause") {
            updateData.status = "paused";
            updateData.pausedAt = FieldValue.serverTimestamp();
        } else if (action === "resume") {
            updateData.status = "active";
            updateData.resumedAt = FieldValue.serverTimestamp();
        }

        await db.collection("subscriptions").doc(targetDoc.id).update(updateData);

        // Send email notification
        try {
            const { sendSubscriptionEmail } = await import("@/lib/server/subscription-emails");
            const planName = targetData.tier === "base" ? "Starter" : targetData.tier === "medium" ? "Pro" : "Enterprise";
            await sendSubscriptionEmail({
                to: email,
                name: targetData.name || "Subscriber",
                action,
                planName,
                subscriptionId: targetDoc.id,
            });
        } catch (emailErr) {
            console.warn(`Subscription ${action} email failed:`, emailErr.message);
        }

        return corsJson(request, { success: true, action, subscriptionId: targetDoc.id, status: updateData.status });
    } catch (error) {
        console.error("Subscription manage failed:", error.message);
        return corsJson(request, { error: "Unable to process subscription action." }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";
import { getAdminDb, verifyAdminFromRequest } from "@/lib/firebase-admin";
import { checkRateLimit, getRequestIp } from "@/lib/server/rate-limit";
import {
    NEWSLETTER_COLLECTION,
    getUnsubscribeUrl,
    renderNewsletterHtml,
    sendNewsletterMail,
} from "@/lib/server/newsletter";

const payloadSchema = z.object({
    subject: z.string().trim().min(3).max(160),
    body: z.string().trim().min(10).max(5000),
});

export async function POST(request) {
    const ip = getRequestIp(request);
    const limit = checkRateLimit(`admin-newsletter-send:${ip}`, {
        windowMs: 60_000,
        maxRequests: 5,
    });

    if (!limit.allowed) {
        return NextResponse.json(
            { error: "Too many newsletter send attempts. Please retry shortly." },
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
                { error: "Invalid newsletter payload.", details: parsed.error.flatten() },
                { status: 400 },
            );
        }

        const db = getAdminDb();
        const subscribers = await db
            .collection(NEWSLETTER_COLLECTION)
            .where("status", "==", "active")
            .limit(500)
            .get();

        if (subscribers.empty) {
            return NextResponse.json(
                { error: "No active newsletter subscribers yet." },
                { status: 400 },
            );
        }

        const { subject, body } = parsed.data;
        const failures = [];
        let sentCount = 0;

        for (const subscriberDoc of subscribers.docs) {
            const subscriber = subscriberDoc.data();
            if (!subscriber.email || !subscriber.unsubscribeToken) continue;

            const unsubscribeUrl = getUnsubscribeUrl({
                request,
                token: subscriber.unsubscribeToken,
            });

            try {
                await sendNewsletterMail({
                    to: subscriber.email,
                    subject,
                    text: body,
                    unsubscribeUrl,
                    html: renderNewsletterHtml({
                        title: subject,
                        body,
                        unsubscribeUrl,
                    }),
                });

                sentCount += 1;
                await subscriberDoc.ref.update({
                    lastNewsletterSentAt: FieldValue.serverTimestamp(),
                    lastEmailError: FieldValue.delete(),
                    updatedAt: FieldValue.serverTimestamp(),
                });
            } catch (mailError) {
                failures.push(subscriber.email);
                await subscriberDoc.ref.update({
                    lastEmailError: mailError.message || "Newsletter email failed.",
                    updatedAt: FieldValue.serverTimestamp(),
                });
            }
        }

        await db.collection("newsletter_campaigns").add({
            subject,
            body,
            sentCount,
            failureCount: failures.length,
            failedRecipients: failures.slice(0, 50),
            createdAt: FieldValue.serverTimestamp(),
            createdByUid: adminAuth.decoded.uid,
            createdByEmail: adminAuth.decoded.email || "",
        });

        return NextResponse.json({
            success: true,
            sentCount,
            failureCount: failures.length,
        });
    } catch (error) {
        console.error("Newsletter send failed:", error.message);
        return NextResponse.json(
            { error: error.message || "Unable to send newsletter right now." },
            { status: 500 },
        );
    }
}

import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";
import { getAdminDb } from "@/lib/firebase-admin";
import { checkRateLimit, getRequestIp } from "@/lib/server/rate-limit";
import {
    NEWSLETTER_COLLECTION,
    createUnsubscribeToken,
    getUnsubscribeUrl,
    normalizeNewsletterEmail,
    renderNewsletterHtml,
    sendNewsletterMail,
} from "@/lib/server/newsletter";

const subscribeSchema = z.object({
    email: z.string().trim().email().max(255),
    name: z.string().trim().max(120).optional(),
});

export async function POST(request) {
    const ip = getRequestIp(request);
    const limit = checkRateLimit(`newsletter-subscribe:${ip}`, {
        windowMs: 60_000,
        maxRequests: 8,
    });

    if (!limit.allowed) {
        return NextResponse.json(
            { error: "Too many signup attempts. Please retry shortly." },
            { status: 429 },
        );
    }

    try {
        const json = await request.json();
        const parsed = subscribeSchema.safeParse(json);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Enter a valid email address.", details: parsed.error.flatten() },
                { status: 400 },
            );
        }

        const db = getAdminDb();
        const email = normalizeNewsletterEmail(parsed.data.email);
        const name = parsed.data.name?.trim() || "";

        const existing = await db
            .collection(NEWSLETTER_COLLECTION)
            .where("emailLower", "==", email)
            .limit(1)
            .get();

        let subscriberRef;
        let unsubscribeToken = createUnsubscribeToken();
        let shouldSendWelcome = true;

        if (!existing.empty) {
            const existingData = existing.docs[0].data();
            if (existingData.status === "active" && existingData.unsubscribeToken) {
                unsubscribeToken = existingData.unsubscribeToken;
                shouldSendWelcome = false;
            }
        }

        const payload = {
            email,
            emailLower: email,
            ...(name ? { name } : {}),
            status: "active",
            source: "footer",
            unsubscribeToken,
            updatedAt: FieldValue.serverTimestamp(),
            ...(shouldSendWelcome && !existing.empty ? { resubscribedAt: FieldValue.serverTimestamp() } : {}),
        };

        if (existing.empty) {
            subscriberRef = await db.collection(NEWSLETTER_COLLECTION).add({
                ...payload,
                createdAt: FieldValue.serverTimestamp(),
                subscribedAt: FieldValue.serverTimestamp(),
            });
        } else {
            subscriberRef = existing.docs[0].ref;
            await subscriberRef.update(payload);
        }

        if (!shouldSendWelcome) {
            return NextResponse.json({
                success: true,
                emailSent: false,
                message: "You are already subscribed.",
            });
        }

        const unsubscribeUrl = getUnsubscribeUrl({ request, token: unsubscribeToken });
        const subject = "Welcome to the Finvolve newsletter";
        const body = `Thanks for subscribing${name ? `, ${name}` : ""}.\n\nYou will now receive product, software, and Finvolve updates from us.`;

        try {
            await sendNewsletterMail({
                to: email,
                subject,
                text: body,
                unsubscribeUrl,
                html: renderNewsletterHtml({
                    title: "You are subscribed",
                    body,
                    unsubscribeUrl,
                }),
            });

            await subscriberRef.update({
                welcomeEmailSentAt: FieldValue.serverTimestamp(),
                lastEmailError: FieldValue.delete(),
            });
        } catch (mailError) {
            console.error("Newsletter welcome email failed:", mailError.message);
            await subscriberRef.update({
                lastEmailError: mailError.message || "Welcome email failed.",
            });

            return NextResponse.json({
                success: true,
                emailSent: false,
                message: "You are subscribed, but the welcome email could not be sent right now.",
            });
        }

        return NextResponse.json({
            success: true,
            emailSent: true,
            message: "You are subscribed. Please check your email.",
        });
    } catch (error) {
        console.error("Newsletter subscribe failed:", error.message);
        return NextResponse.json(
            { error: error.message || "Unable to subscribe right now." },
            { status: 500 },
        );
    }
}

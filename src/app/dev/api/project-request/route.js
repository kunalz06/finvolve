import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";
import { getAdminDb } from "@/lib/firebase-admin";
import {
    renderProjectRequestAcknowledgementHtml,
    sendNewsletterMail,
} from "@/lib/server/newsletter";
import { checkRateLimit, getRequestIp } from "@/lib/server/rate-limit";
import { corsJson, corsPreflight } from "@/lib/server/cors";

const requestSchema = z.object({
    projectType: z.string().trim().min(2).max(120),
    timeline: z.number().int().min(2).max(24),
    budget: z.string().trim().min(1).max(80),
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(255),
    description: z.string().trim().min(10).max(3000),
});

export function OPTIONS(request) {
    return corsPreflight(request);
}

export async function POST(request) {
    const ip = getRequestIp(request);
    const limit = checkRateLimit(`project-request:${ip}`, {
        windowMs: 60_000,
        maxRequests: 8,
    });

    if (!limit.allowed) {
        return corsJson(
            request,
            { error: "Too many project requests. Please retry shortly." },
            { status: 429 },
        );
    }

    try {
        const json = await request.json();
        const parsed = requestSchema.safeParse(json);
        if (!parsed.success) {
            return corsJson(
                request,
                { error: "Please complete the required project details.", details: parsed.error.flatten() },
                { status: 400 },
            );
        }

        const data = parsed.data;
        const db = getAdminDb();
        const requestRef = await db.collection("requests").add({
            ...data,
            createdAt: FieldValue.serverTimestamp(),
            status: "new",
            wizardSubmission: true,
            acknowledgementEmailSent: false,
        });

        let emailSent = false;
        try {
            await sendNewsletterMail({
                to: data.email,
                subject: "We received your DEV Infinity project request",
                text: `Hi ${data.name},\n\nWe received your project request and will review it carefully.\n\nProject type: ${data.projectType}\nTimespan: ${data.timeline} weeks\n\n${data.description}`,
                html: renderProjectRequestAcknowledgementHtml(data),
            });
            emailSent = true;
            await requestRef.update({
                acknowledgementEmailSent: true,
                acknowledgementEmailSentAt: FieldValue.serverTimestamp(),
            });
        } catch (mailError) {
            console.error("Project acknowledgement email failed:", mailError.message);
            await requestRef.update({
                acknowledgementEmailError: mailError.message || "Acknowledgement email failed.",
            });
        }

        return corsJson(request, {
            success: true,
            requestId: requestRef.id,
            emailSent,
        });
    } catch (error) {
        console.error("Project request submission failed:", error.message);
        return corsJson(
            request,
            { error: "Unable to submit your project request right now." },
            { status: 500 },
        );
    }
}

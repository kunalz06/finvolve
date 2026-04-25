import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";
import { NEWSLETTER_COLLECTION, getNewsletterSiteUrl } from "@/lib/server/newsletter";

function redirectToStatus(request, status) {
    const siteUrl = getNewsletterSiteUrl(request);
    return NextResponse.redirect(`${siteUrl}/dev/newsletter/unsubscribe?status=${status}`);
}

export async function GET(request) {
    const token = new URL(request.url).searchParams.get("token") || "";

    if (!token || token.length < 32) {
        return redirectToStatus(request, "invalid");
    }

    try {
        const db = getAdminDb();
        const snap = await db
            .collection(NEWSLETTER_COLLECTION)
            .where("unsubscribeToken", "==", token)
            .limit(1)
            .get();

        if (snap.empty) {
            return redirectToStatus(request, "invalid");
        }

        await snap.docs[0].ref.update({
            status: "unsubscribed",
            unsubscribedAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });

        return redirectToStatus(request, "success");
    } catch (error) {
        console.error("Newsletter unsubscribe failed:", error.message);
        return redirectToStatus(request, "error");
    }
}

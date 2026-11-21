import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { reconcileCourseRefund, reconcileCourseWebhook } from "@/lib/server/course-payments";

export const runtime = "nodejs";

export async function POST(request) {
    const secret = process.env.COURSE_RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) return NextResponse.json({ error: "Webhook is unavailable." }, { status: 503 });
    const signature = request.headers.get("x-razorpay-signature") || "";
    const body = await request.text();
    const expected = createHmac("sha256", secret).update(body).digest("hex");
    if (!/^[a-f0-9]{64}$/.test(signature) || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
        return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
    }

    try {
        const event = JSON.parse(body);
        if (event.event === "payment.captured" || event.event === "refund.processed") {
            const payment = event.payload?.payment?.entity;
            const paymentId = payment?.id || event.payload?.refund?.entity?.payment_id;
            if (/^pay_[A-Za-z0-9]+$/.test(paymentId || "")) {
                if (/^order_[A-Za-z0-9]+$/.test(payment?.order_id || "")) {
                    await reconcileCourseWebhook(payment.order_id, paymentId);
                } else if (event.event === "refund.processed") {
                    await reconcileCourseRefund(paymentId);
                }
            }
        }
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Course payment webhook failed", error.code || error.name);
        return NextResponse.json({ error: "Unable to process event." }, { status: 500 });
    }
}

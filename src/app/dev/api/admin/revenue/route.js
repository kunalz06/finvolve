import Razorpay from "razorpay";
import { getAdminDb, verifyAdminFromRequest } from "@/lib/firebase-admin";
import { corsJson, corsPreflight } from "@/lib/server/cors";
import { getRazorpayServerCredentials } from "@/lib/server/payments";
import { checkRateLimit, getRequestIp } from "@/lib/server/rate-limit";

const PAGE_SIZE = 100;
const MAX_PAGES = 100;

async function getRazorpayRevenue() {
    const { keyId, keySecret } = getRazorpayServerCredentials();
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    let skip = 0;
    let totalINR = 0;
    let paymentCount = 0;

    for (let page = 0; page < MAX_PAGES; page += 1) {
        const result = await razorpay.payments.all({
            count: PAGE_SIZE,
            skip,
        });

        const items = Array.isArray(result?.items) ? result.items : [];
        for (const payment of items) {
            if (payment?.status !== "captured" || payment?.currency !== "INR") continue;

            const amount = Number(payment.amount || 0);
            const refunded = Number(payment.amount_refunded || 0);
            const netPaise = Math.max(0, amount - refunded);

            totalINR += netPaise / 100;
            paymentCount += 1;
        }

        if (items.length < PAGE_SIZE) break;
        skip += items.length;
    }

    return {
        totalINR: Math.round(totalINR * 100) / 100,
        paymentCount,
    };
}

async function getCashfreeRevenue() {
    const db = getAdminDb();
    const snapshot = await db
        .collection("payment_requests")
        .where("status", "==", "paid")
        .limit(2000)
        .get();

    let totalINR = 0;
    let paymentCount = 0;

    snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.provider !== "cashfree") return;

        const amount = Number(data.amount || 0);
        if (!Number.isFinite(amount) || amount <= 0) return;

        totalINR += amount;
        paymentCount += 1;
    });

    return {
        totalINR: Math.round(totalINR * 100) / 100,
        paymentCount,
    };
}

export function OPTIONS(request) {
    return corsPreflight(request);
}

export async function GET(request) {
    const ip = getRequestIp(request);
    const limit = checkRateLimit(`admin-revenue:${ip}`, {
        windowMs: 60_000,
        maxRequests: 20,
    });

    if (!limit.allowed) {
        return corsJson(request, { error: "Too many requests." }, { status: 429 });
    }

    const admin = await verifyAdminFromRequest(request);
    if (!admin.ok) {
        return corsJson(request, { error: admin.error }, { status: admin.status });
    }

    try {
        const [razorpay, cashfree] = await Promise.all([
            getRazorpayRevenue(),
            getCashfreeRevenue(),
        ]);

        const totalINR = Math.round((razorpay.totalINR + cashfree.totalINR) * 100) / 100;

        return corsJson(request, {
            totalINR,
            paymentCount: razorpay.paymentCount + cashfree.paymentCount,
            breakdown: {
                razorpay,
                cashfree,
            },
            calculatedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Admin revenue calculation failed:", error.message);
        return corsJson(request, { error: "Unable to calculate revenue." }, { status: 500 });
    }
}

import Razorpay from "razorpay";
import { corsJson, corsPreflight } from "@/lib/server/cors";

export function OPTIONS(request) {
    return corsPreflight(request);
}

export async function POST(request) {
    try {
        const key_id = process.env.RAZORPAY_KEY_ID;
        const key_secret = process.env.RAZORPAY_KEY_SECRET;

        if (!key_id || !key_secret) {
            return corsJson(
                request,
                { error: "Razorpay keys are missing" },
                { status: 500 }
            );
        }

        const razorpay = new Razorpay({
            key_id: key_id,
            key_secret: key_secret,
        });

        const options = {
            amount: 5000 * 100, // 5000 INR in paise
            currency: "INR",
            receipt: "receipt_" + Math.random().toString(36).substring(7),
        };

        const order = await razorpay.orders.create(options);
        return corsJson(request, order);
    } catch (error) {
        console.error("Error creating Razorpay order:", error.message);
        return corsJson(
            request,
            { error: "Error creating order" },
            { status: 500 }
        );
    }
}

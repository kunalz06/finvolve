import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        // Check for keys in both standard and NEXT_PUBLIC formats to be robust
        const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        const key_secret = process.env.RAZORPAY_KEY_SECRET;

        console.log("Debug: Checking Razorpay Keys");
        console.log("Key ID found:", !!key_id, key_id ? `(${key_id.substring(0, 4)}...)` : "Missing");
        console.log("Key Secret found:", !!key_secret, key_secret ? `(${key_secret.substring(0, 4)}...)` : "Missing");

        if (!key_id || !key_secret) {
            throw new Error("Razorpay keys are missing. Please check your .env.local file.");
        }

        const razorpay = new Razorpay({
            key_id: key_id,
            key_secret: key_secret,
        });

        const options = {
            amount: 99 * 100, // amount in smallest currency unit (paise) -> 99 INR
            currency: "INR",
            receipt: "receipt_" + Math.random().toString(36).substring(7),
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json(order);
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        return NextResponse.json({
            error: error.message || "Error creating order",
            debug: {
                keyIdFound: !!(process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID),
                keySecretFound: !!process.env.RAZORPAY_KEY_SECRET,
                envKeys: Object.keys(process.env).filter(k => k.includes('RAZORPAY'))
            }
        }, { status: 500 });
    }
}

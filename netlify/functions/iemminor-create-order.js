const Razorpay = require("razorpay");

exports.handler = async function handler(event) {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers: { Allow: "POST" },
            body: JSON.stringify({ error: "Method not allowed" }),
        };
    }

    try {
        const keyId = process.env.IEM_RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_IEM_RAZORPAY_KEY_ID;
        const keySecret = process.env.IEM_RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "IEM Razorpay keys are not configured." }),
            };
        }

        const razorpay = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });

        const order = await razorpay.orders.create({
            amount: 800000,
            currency: "INR",
            receipt: `iem_minor_${Date.now()}`,
            notes: {
                source: "iemminor_netlify",
            },
        });

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: order.id,
                amount: order.amount,
                currency: order.currency,
                checkoutKey: keyId,
            }),
        };
    } catch (error) {
        console.error("IEM order creation failed:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Unable to create payment order." }),
        };
    }
};

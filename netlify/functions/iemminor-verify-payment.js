const crypto = require("node:crypto");

exports.handler = async function handler(event) {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers: { Allow: "POST" },
            body: JSON.stringify({ error: "Method not allowed" }),
        };
    }

    try {
        const keySecret = process.env.IEM_RAZORPAY_KEY_SECRET;
        if (!keySecret) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "IEM Razorpay secret is not configured." }),
            };
        }

        const body = JSON.parse(event.body || "{}");
        const orderId = body.razorpay_order_id;
        const paymentId = body.razorpay_payment_id;
        const signature = body.razorpay_signature;

        if (!orderId || !paymentId || !signature) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing payment verification fields." }),
            };
        }

        const expected = crypto
            .createHmac("sha256", keySecret)
            .update(`${orderId}|${paymentId}`)
            .digest("hex");

        const valid =
            Buffer.byteLength(signature) === Buffer.byteLength(expected) &&
            crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));

        if (!valid) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Invalid payment signature." }),
            };
        }

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ success: true }),
        };
    } catch (error) {
        console.error("IEM payment verification failed:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Unable to verify payment." }),
        };
    }
};

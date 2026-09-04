const fs = require("fs");
const path = require("path");

const envPath = path.join(process.cwd(), ".env.local");

try {
    if (!fs.existsSync(envPath)) {
        console.error("Missing .env.local file.");
        process.exit(1);
    }

    const content = fs.readFileSync(envPath, "utf8");
    console.log(".env.local is readable as UTF-8");

    const lines = content.split("\n");
    let hasPublicKeyId = false;
    let hasServerKeyId = false;
    let hasKeySecret = false;
    let hasCashfreeClientId = false;
    let hasCashfreeClientSecret = false;
    let hasCashfreeEnvironment = false;

    lines.forEach((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("NEXT_PUBLIC_RAZORPAY_KEY_ID=")) {
            hasPublicKeyId = true;
            console.log("Found NEXT_PUBLIC_RAZORPAY_KEY_ID");
        }
        if (trimmed.startsWith("RAZORPAY_KEY_ID=")) {
            hasServerKeyId = true;
            console.log("Found RAZORPAY_KEY_ID");
        }
        if (trimmed.startsWith("RAZORPAY_KEY_SECRET=")) {
            hasKeySecret = true;
            console.log("Found RAZORPAY_KEY_SECRET");
        }
        if (trimmed.startsWith("CASHFREE_CLIENT_ID=")) hasCashfreeClientId = true;
        if (trimmed.startsWith("CASHFREE_CLIENT_SECRET=")) hasCashfreeClientSecret = true;
        if (trimmed.startsWith("CASHFREE_ENVIRONMENT=")) hasCashfreeEnvironment = true;
        if (trimmed.startsWith("NEXT_PUBLIC_CASHFREE_")) {
            console.error("Cashfree secrets must not use NEXT_PUBLIC_* variables.");
            process.exitCode = 1;
        }
    });

    if (hasPublicKeyId && hasServerKeyId && hasKeySecret) {
        console.log("All Razorpay keys are present.");
    } else {
        console.error("Missing Razorpay keys in .env.local");
        if (!hasPublicKeyId) {
            console.error("  - Missing NEXT_PUBLIC_RAZORPAY_KEY_ID");
        }
        if (!hasServerKeyId) {
            console.error("  - Missing RAZORPAY_KEY_ID");
        }
        if (!hasKeySecret) {
            console.error("  - Missing RAZORPAY_KEY_SECRET");
        }
    }
    if (hasCashfreeClientId && hasCashfreeClientSecret && hasCashfreeEnvironment) {
        console.log("All Cashfree server settings are present.");
    } else {
        console.error("Missing Cashfree server settings in .env.local");
        if (!hasCashfreeClientId) console.error("  - Missing CASHFREE_CLIENT_ID");
        if (!hasCashfreeClientSecret) console.error("  - Missing CASHFREE_CLIENT_SECRET");
        if (!hasCashfreeEnvironment) console.error("  - Missing CASHFREE_ENVIRONMENT");
    }
} catch (err) {
    console.error("Error reading .env.local:", err.message);
}

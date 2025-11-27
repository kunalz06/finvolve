const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');

try {
    if (!fs.existsSync(envPath)) {
        console.error("❌ .env.local file not found!");
        process.exit(1);
    }

    const content = fs.readFileSync(envPath, 'utf8');
    console.log("✅ .env.local is readable as UTF-8");

    const lines = content.split('\n');
    let hasKeyId = false;
    let hasKeySecret = false;

    lines.forEach(line => {
        if (line.trim().startsWith('NEXT_PUBLIC_RAZORPAY_KEY_ID=')) {
            hasKeyId = true;
            console.log("✅ Found NEXT_PUBLIC_RAZORPAY_KEY_ID");
        }
        if (line.trim().startsWith('RAZORPAY_KEY_SECRET=')) {
            hasKeySecret = true;
            console.log("✅ Found RAZORPAY_KEY_SECRET");
        }
    });

    if (hasKeyId && hasKeySecret) {
        console.log("🎉 All Razorpay keys are present!");
    } else {
        console.error("❌ Missing Razorpay keys in .env.local");
        if (!hasKeyId) console.error("   - Missing NEXT_PUBLIC_RAZORPAY_KEY_ID");
        if (!hasKeySecret) console.error("   - Missing RAZORPAY_KEY_SECRET");
    }

} catch (err) {
    console.error("❌ Error reading .env.local:", err.message);
}

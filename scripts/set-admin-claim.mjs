import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { loadLocalEnv } from "./load-local-env.mjs";

function printUsage() {
    console.log(
        "Usage: npm run set-admin -- <uid> [email]\n" +
        "Example: npm run set-admin -- abc123uid admin@example.com"
    );
}

async function main() {
    const [, , uid, email] = process.argv;

    loadLocalEnv();

    if (!uid) {
        printUsage();
        process.exit(1);
    }

    const serviceAccount = parseServiceAccountFromEnv();
    const app = getApps()[0] || initializeApp({
        credential: serviceAccount ? cert(serviceAccount) : applicationDefault(),
    });
    const auth = getAuth(app);

    const userRecord = await auth.getUser(uid);
    const nextClaims = {
        ...(userRecord.customClaims || {}),
        role: "admin",
        admin: true,
    };

    await auth.setCustomUserClaims(uid, nextClaims);

    if (email && userRecord.email && userRecord.email !== email) {
        console.warn(
            `Warning: provided email (${email}) does not match Firebase user email (${userRecord.email}).`
        );
    }

    console.log(`Admin claim set for UID: ${uid}`);
    if (userRecord.email) {
        console.log(`User email: ${userRecord.email}`);
    }
    console.log("Claims applied:");
    console.log(JSON.stringify(nextClaims, null, 2));
    console.log("Ask the user to sign out and sign back in to refresh their token.");
}

function parseServiceAccountFromEnv() {
    const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (rawJson) {
        const parsed = JSON.parse(rawJson);
        if (parsed.private_key) {
            parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
        }
        return parsed;
    }

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!projectId || !clientEmail || !privateKey) {
        return null;
    }

    return {
        project_id: projectId,
        client_email: clientEmail,
        private_key: privateKey,
    };
}

main().catch((error) => {
    console.error("Failed to set admin claim:", error.message);
    process.exit(1);
});

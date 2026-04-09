import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

let cachedApp = null;

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

export function getAdminApp() {
    if (cachedApp) return cachedApp;
    if (getApps().length > 0) {
        cachedApp = getApps()[0];
        return cachedApp;
    }

    const serviceAccount = parseServiceAccountFromEnv();
    if (serviceAccount) {
        cachedApp = initializeApp({
            credential: cert(serviceAccount),
        });
        return cachedApp;
    }

    // Fallback for environments where ADC is configured.
    cachedApp = initializeApp({
        credential: applicationDefault(),
    });
    return cachedApp;
}

export function getAdminDb() {
    return getFirestore(getAdminApp());
}

export function getAdminAuth() {
    return getAuth(getAdminApp());
}

export async function verifyAdminFromRequest(request) {
    const authHeader = request.headers.get("authorization") || "";
    if (!authHeader.startsWith("Bearer ")) {
        return { ok: false, status: 401, error: "Missing bearer token." };
    }

    const idToken = authHeader.slice("Bearer ".length).trim();
    if (!idToken) {
        return { ok: false, status: 401, error: "Missing ID token." };
    }

    try {
        const decoded = await getAdminAuth().verifyIdToken(idToken);
        const isAdmin = decoded.role === "admin" || decoded.admin === true;

        if (!isAdmin) {
            return { ok: false, status: 403, error: "Admin access required." };
        }

        return { ok: true, decoded };
    } catch (error) {
        console.error("Admin token verification failed:", error.message);

        const message = String(error?.message || "");
        const code = String(error?.code || "");
        const isServerConfigIssue =
            code === "app/invalid-credential" ||
            message.includes("Unable to detect a Project Id") ||
            message.includes("Failed to determine project ID") ||
            message.includes("credential implementation") ||
            message.includes("Could not load the default credentials") ||
            message.includes("Failed to fetch a valid Google OAuth2 access token");

        if (isServerConfigIssue) {
            return {
                ok: false,
                status: 500,
                error: "Firebase Admin is not configured correctly on the server.",
            };
        }

        return { ok: false, status: 401, error: "Invalid or expired token." };
    }
}

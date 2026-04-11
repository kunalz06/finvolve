import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

let cachedApp = null;

function stripWrappingQuotes(value) {
    const trimmed = String(value || "").trim();
    if (
        (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
        (trimmed.startsWith("'") && trimmed.endsWith("'"))
    ) {
        return trimmed.slice(1, -1);
    }

    return trimmed;
}

function normalizePrivateKey(value) {
    if (!value) return "";

    const withoutQuotes = stripWrappingQuotes(value).replace(/\\"/g, '"');
    const withNewlines = withoutQuotes.replace(/\\n/g, "\n");

    if (withNewlines.includes("-----BEGIN PRIVATE KEY-----")) {
        return withNewlines;
    }

    try {
        const decoded = Buffer.from(withoutQuotes, "base64").toString("utf8");
        if (decoded.includes("-----BEGIN PRIVATE KEY-----")) {
            return decoded.replace(/\\n/g, "\n");
        }
    } catch {
        // Keep the original value below so Firebase Admin returns a useful error.
    }

    return withNewlines;
}

function parseServiceAccountJson(rawJson) {
    const normalized = stripWrappingQuotes(rawJson).replace(/\\"/g, '"');

    try {
        return JSON.parse(normalized);
    } catch {
        const decoded = Buffer.from(normalized, "base64").toString("utf8");
        return JSON.parse(decoded);
    }
}

function parseServiceAccountFromEnv() {
    const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (rawJson) {
        const parsed = parseServiceAccountJson(rawJson);
        if (parsed.private_key) {
            parsed.private_key = normalizePrivateKey(parsed.private_key);
        }
        return parsed;
    }

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);

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
            message.includes("Failed to fetch a valid Google OAuth2 access token") ||
            message.includes("DECODER routines::unsupported");

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

import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "../src/lib/firebase-admin.js";
import { loadLocalEnv } from "./load-local-env.mjs";
import { createPaymentToken, hashToken } from "../src/lib/server/payments.js";

const LEGACY_LINK_EXPIRY_DAYS = 30;

function getSiteUrl() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "";
    return siteUrl.replace(/\/$/, "");
}

async function main() {
    loadLocalEnv();
    const db = getAdminDb();
    const snapshot = await db.collection("payment_requests").get();
    const siteUrl = getSiteUrl();

    let updated = 0;
    const generatedLinks = [];
    for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const hasLegacyFields = Boolean(data.username || data.password);
        if (!hasLegacyFields) {
            continue;
        }

        const isPending = (data.status || "pending") !== "paid";
        const needsReplacementToken = isPending && (!data.tokenHash || !data.tokenExpiresAt);

        if (needsReplacementToken && !siteUrl) {
            throw new Error(
                `Missing NEXT_PUBLIC_SITE_URL or SITE_URL for unpaid legacy payment ${docSnap.id}. ` +
                "Set one of those env vars before running the migration so replacement links can be generated."
            );
        }

        const update = {
            clientName: data.clientName || data.username || "Client",
            clientEmail: data.clientEmail || "",
            username: FieldValue.delete(),
            password: FieldValue.delete(),
            updatedAt: FieldValue.serverTimestamp(),
        };

        if (needsReplacementToken) {
            const token = createPaymentToken();
            const expiresAt = new Date(Date.now() + LEGACY_LINK_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

            update.tokenHash = hashToken(token);
            update.tokenExpiresAt = Timestamp.fromDate(expiresAt);

            generatedLinks.push({
                id: docSnap.id,
                clientName: update.clientName,
                url: `${siteUrl}/finvolve/payments?token=${token}`,
                expiresAt: expiresAt.toISOString(),
            });
        }

        await docSnap.ref.update(update);
        updated += 1;
    }

    console.log(`Scrubbed legacy credentials from ${updated} payment request(s).`);
    if (generatedLinks.length > 0) {
        console.log("Replacement payment links:");
        generatedLinks.forEach((item) => {
            console.log(`- ${item.id} (${item.clientName}) -> ${item.url} (expires ${item.expiresAt})`);
        });
    }
}

main().catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
});

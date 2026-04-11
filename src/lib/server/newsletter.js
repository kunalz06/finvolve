import crypto from "crypto";
import nodemailer from "nodemailer";

export const NEWSLETTER_COLLECTION = "newsletter_subscribers";

export function normalizeNewsletterEmail(email) {
    return String(email || "").trim().toLowerCase();
}

export function createUnsubscribeToken() {
    return crypto.randomBytes(32).toString("hex");
}

export function getNewsletterSiteUrl(request) {
    const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
    if (envUrl) return envUrl.replace(/\/$/, "");

    const proto = request?.headers?.get("x-forwarded-proto") || "https";
    const host = request?.headers?.get("host");
    return host ? `${proto}://${host}` : "";
}

export function getUnsubscribeUrl({ request, token }) {
    return `${getNewsletterSiteUrl(request)}/finvolve/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;
}

function getBooleanEnv(value, fallback = false) {
    if (value === undefined || value === null || value === "") return fallback;
    return ["1", "true", "yes"].includes(String(value).toLowerCase());
}

function getTransportConfig() {
    const host = process.env.NEWSLETTER_SMTP_HOST;
    const port = Number(process.env.NEWSLETTER_SMTP_PORT || 465);
    const user = process.env.NEWSLETTER_SMTP_USER;
    const pass = process.env.NEWSLETTER_SMTP_PASS;

    if (!host || !user || !pass) {
        throw new Error("Newsletter SMTP is not configured.");
    }

    return {
        host,
        port,
        secure: getBooleanEnv(process.env.NEWSLETTER_SMTP_SECURE, port === 465),
        auth: { user, pass },
    };
}

function getFromAddress() {
    const fromEmail = process.env.NEWSLETTER_FROM_EMAIL || process.env.NEWSLETTER_SMTP_USER;
    const fromName = process.env.NEWSLETTER_FROM_NAME || "Finvolve";

    if (!fromEmail) {
        throw new Error("Newsletter from email is not configured.");
    }

    return `"${fromName.replace(/"/g, "")}" <${fromEmail}>`;
}

function escapeHtml(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export function renderNewsletterHtml({ title, body, unsubscribeUrl }) {
    const safeTitle = escapeHtml(title);
    const safeBody = escapeHtml(body).replace(/\n/g, "<br />");
    const safeUnsubscribeUrl = escapeHtml(unsubscribeUrl);

    return `
        <div style="margin:0;padding:32px;background:#eef3ff;font-family:Segoe UI,Arial,sans-serif;color:#142033;">
            <div style="max-width:640px;margin:0 auto;background:rgba(255,255,255,0.9);border:1px solid rgba(255,255,255,0.8);border-radius:28px;padding:32px;box-shadow:0 24px 60px rgba(24,34,66,0.14);">
                <p style="margin:0 0 12px;color:#7c5cff;font-size:12px;letter-spacing:0.22em;text-transform:uppercase;font-weight:700;">Finvolve Newsletter</p>
                <h1 style="margin:0 0 20px;font-size:28px;line-height:1.2;color:#111827;">${safeTitle}</h1>
                <div style="font-size:16px;line-height:1.75;color:#46556f;">${safeBody}</div>
                <hr style="border:0;border-top:1px solid #e5e7eb;margin:32px 0 20px;" />
                <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.6;">
                    You are receiving this because you subscribed to Finvolve updates.
                    <a href="${safeUnsubscribeUrl}" style="color:#7c5cff;">Unsubscribe</a>
                </p>
            </div>
        </div>
    `;
}

export async function sendNewsletterMail({ to, subject, text, html, unsubscribeUrl }) {
    const transporter = nodemailer.createTransport(getTransportConfig());
    const from = getFromAddress();

    return transporter.sendMail({
        from,
        to,
        replyTo: process.env.NEWSLETTER_REPLY_TO || process.env.NEWSLETTER_SMTP_USER,
        subject,
        text: `${text}\n\nUnsubscribe: ${unsubscribeUrl}`,
        html,
    });
}

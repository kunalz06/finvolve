import crypto from "crypto";
import nodemailer from "nodemailer";
import { getCanonicalApiUrl, getCanonicalSiteUrl } from "@/lib/server/site-url";

export const NEWSLETTER_COLLECTION = "newsletter_subscribers";

export function normalizeNewsletterEmail(email) {
    return String(email || "").trim().toLowerCase();
}

export function createUnsubscribeToken() {
    return crypto.randomBytes(32).toString("hex");
}

export function getNewsletterSiteUrl(request) {
    return getCanonicalSiteUrl(request);
}

export function getNewsletterApiUrl(request) {
    return getCanonicalApiUrl(request);
}

export function getUnsubscribeUrl({ request, token }) {
    return `${getNewsletterApiUrl(request)}/dev/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;
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
    const fromName = process.env.NEWSLETTER_FROM_NAME || "DEV Infinity";

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
                <p style="margin:0 0 12px;color:#7c5cff;font-size:12px;letter-spacing:0.22em;text-transform:uppercase;font-weight:700;">DEV♾️ Newsletter</p>
                <h1 style="margin:0 0 20px;font-size:28px;line-height:1.2;color:#111827;">${safeTitle}</h1>
                <div style="font-size:16px;line-height:1.75;color:#46556f;">${safeBody}</div>
                <hr style="border:0;border-top:1px solid #e5e7eb;margin:32px 0 20px;" />
                <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.6;">
                    You are receiving this because you subscribed to DEV♾️ updates.
                    <a href="${safeUnsubscribeUrl}" style="color:#7c5cff;">Unsubscribe</a>
                </p>
            </div>
        </div>
    `;
}

export async function sendNewsletterMail({ to, subject, text, html, unsubscribeUrl }) {
    const transporter = nodemailer.createTransport(getTransportConfig());
    const from = getFromAddress();
    const textBody = unsubscribeUrl ? `${text}\n\nUnsubscribe: ${unsubscribeUrl}` : text;

    return transporter.sendMail({
        from,
        to,
        replyTo: process.env.NEWSLETTER_REPLY_TO || process.env.NEWSLETTER_SMTP_USER,
        subject,
        text: textBody,
        html,
    });
}

export function renderProjectRequestAcknowledgementHtml({ name, projectType, timeline, description }) {
    const safeName = escapeHtml(name || "there");
    const safeProjectType = escapeHtml(projectType || "your project");
    const timelineLabel = typeof timeline === "number" ? `${timeline} weeks` : (timeline || "to be discussed");
    const safeTimeline = escapeHtml(timelineLabel);
    const safeDescription = escapeHtml(description).replace(/\n/g, "<br />");

    return `
        <div style="margin:0;padding:32px;background:#f5f2ea;font-family:Segoe UI,Arial,sans-serif;color:#101820;">
            <div style="max-width:640px;margin:0 auto;background:#fffaf0;border:2px solid #101820;border-radius:18px;padding:32px;box-shadow:8px 8px 0 #101820;">
                <p style="margin:0 0 12px;color:#2457ff;font-size:12px;text-transform:uppercase;font-weight:800;">DEV Infinity</p>
                <h1 style="margin:0 0 18px;font-size:28px;line-height:1.2;color:#101820;">We received your project request</h1>
                <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:#46515f;">Hi ${safeName}, thanks for sharing your idea. We have your request and will review it carefully before getting back to you.</p>
                <div style="border:2px solid #101820;border-radius:14px;padding:18px;background:#ffffff;">
                    <p style="margin:0 0 8px;"><strong>Project type:</strong> ${safeProjectType}</p>
                    <p style="margin:0 0 8px;"><strong>Timespan:</strong> ${safeTimeline}</p>
                    <p style="margin:0;"><strong>Description:</strong><br />${safeDescription}</p>
                </div>
                <p style="margin:22px 0 0;font-size:14px;line-height:1.7;color:#5e6773;">You do not need to do anything else right now. We will reply from this same email channel.</p>
            </div>
        </div>
    `;
}

export function renderPaymentLinkHtml({ clientName, amount, currency = "INR", paymentUrl, expiresAt, notes }) {
    const safeName = escapeHtml(clientName || "there");
    const safeAmount = escapeHtml(`${currency} ${Number(amount || 0).toLocaleString("en-IN")}`);
    const safePaymentUrl = escapeHtml(paymentUrl);
    const safeExpiresAt = escapeHtml(expiresAt ? new Date(expiresAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) : "soon");
    const safeNotes = notes ? escapeHtml(notes).replace(/\n/g, "<br />") : "";

    return `
        <div style="margin:0;padding:32px;background:#f5f2ea;font-family:Segoe UI,Arial,sans-serif;color:#101820;">
            <div style="max-width:640px;margin:0 auto;background:#fffaf0;border:2px solid #101820;border-radius:18px;padding:32px;box-shadow:8px 8px 0 #101820;">
                <p style="margin:0 0 12px;color:#2457ff;font-size:12px;text-transform:uppercase;font-weight:800;">DEV Infinity</p>
                <h1 style="margin:0 0 18px;font-size:28px;line-height:1.2;color:#101820;">Your secure payment link is ready</h1>
                <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:#46515f;">Hi ${safeName}, please use the secure link below to complete your payment.</p>
                <div style="border:2px solid #101820;border-radius:14px;padding:18px;background:#ffffff;">
                    <p style="margin:0 0 8px;"><strong>Amount:</strong> ${safeAmount}</p>
                    <p style="margin:0 0 16px;"><strong>Link expires:</strong> ${safeExpiresAt}</p>
                    <a href="${safePaymentUrl}" style="display:inline-block;background:#2457ff;color:#ffffff;text-decoration:none;border:2px solid #101820;border-radius:12px;padding:12px 18px;font-weight:800;">Open payment link</a>
                </div>
                ${safeNotes ? `<p style="margin:20px 0 0;font-size:14px;line-height:1.7;color:#46515f;"><strong>Note:</strong><br />${safeNotes}</p>` : ""}
                <p style="margin:22px 0 0;font-size:13px;line-height:1.7;color:#5e6773;">If the button does not open, paste this link into your browser:<br /><span style="word-break:break-all;">${safePaymentUrl}</span></p>
            </div>
        </div>
    `;
}

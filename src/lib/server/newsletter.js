import crypto from "crypto";
import nodemailer from "nodemailer";
import { getCanonicalApiUrl, getCanonicalSiteUrl } from "@/lib/server/site-url";
import { SUPPORT_EMAIL } from "@/lib/site-contact";
import { ensureEmailBrandLogo } from "./email-layout.mjs";
export { EMAIL_LOGO_URL, renderEmailBrandLogo, ensureEmailBrandLogo } from "./email-layout.mjs";
export { renderNewsletterHtml, renderProjectRequestAcknowledgementHtml, renderPaymentLinkHtml } from "./email-templates.mjs";

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

export async function sendNewsletterMail({ to, subject, text, html, unsubscribeUrl }) {
    const transporter = nodemailer.createTransport(getTransportConfig());
    const from = getFromAddress();
    const textBody = unsubscribeUrl ? `${text}\n\nUnsubscribe: ${unsubscribeUrl}` : text;

    return transporter.sendMail({
        from,
        to,
        replyTo: process.env.NEWSLETTER_REPLY_TO || SUPPORT_EMAIL,
        subject,
        text: textBody,
        html: ensureEmailBrandLogo(html),
    });
}

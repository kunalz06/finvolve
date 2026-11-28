import { sendNewsletterMail } from "./newsletter";
import { getCanonicalSiteUrl } from "./site-url";
import { SUPPORT_EMAIL } from "../site-contact";
import { renderSubscriptionHtml } from "./subscription-email-templates.mjs";
export { tierNames } from "./subscription-email-templates.mjs";

const subjectByAction = {
    activated: "🚀 Your DEV Infinity Cloud subscription is now active!",
    charged: "🧾 DEV Infinity Cloud — Monthly billing receipt",
    cancelled: "DEV Infinity Cloud — Subscription cancellation confirmed",
    paused: "⏸️ Your DEV Infinity Cloud subscription has been paused",
    resumed: "⚡ Your DEV Infinity Cloud subscription is now resumed",
    tier_change: "🔄 DEV Infinity Cloud — Plan update confirmed",
};

/**
 * Send a subscription-related email using the newsletter SMTP system.
 */
export async function sendSubscriptionEmail({
    to,
    name,
    action,
    planName,
    subscriptionId,
    amount,
    newPlanName,
}) {
    const subject =
        subjectByAction[action] || "DEV Infinity Cloud — Subscription Update";
    const html = renderSubscriptionHtml({
        name,
        action,
        planName,
        subscriptionId,
        amount,
        newPlanName,
    });

    const siteUrl = getCanonicalSiteUrl() || "https://devsoftware.vercel.app";
    const dashboardUrl = `${siteUrl.replace(/\/$/, "")}/dev/cloud/dashboard`;

    const actionTextMap = {
        activated: `Your DEV Infinity Cloud subscription for ${planName} is now active. Your compute hours and AI model APIs are available.`,
        paused: `Your DEV Infinity Cloud subscription for ${planName} has been paused. Your billing is on hold and usage is frozen.`,
        resumed: `Your DEV Infinity Cloud subscription for ${planName} has been resumed. Your compute and API access are restored.`,
        cancelled: `Your DEV Infinity Cloud subscription for ${planName} has been cancelled. You have access until the end of your billing cycle.`,
        charged: `Your monthly renewal payment for DEV Infinity Cloud (${planName}) was successful.`,
        tier_change: `Your DEV Infinity Cloud subscription will change from ${planName} to ${newPlanName} at your next billing cycle.`,
    };

    const textBody = `Hi ${name || "Subscriber"},\n\n${
        actionTextMap[action] || `Your subscription has been updated (${action}).`
    }\n\nPlan: ${planName}\nSubscription ID: ${subscriptionId || "N/A"}\n\nAccess your Cloud Dashboard anytime: ${dashboardUrl}\n\nSupport: ${SUPPORT_EMAIL}\nDEV Infinity Cloud`;

    return sendNewsletterMail({
        to,
        subject,
        text: textBody,
        html,
    });
}

/**
 * Send a subscription email (fire-and-forget). Logs errors but never throws.
 */
export function sendSubscriptionEmailSafe({
    to,
    name,
    action,
    planName,
    subscriptionId,
    amount,
    newPlanName,
}) {
    sendSubscriptionEmail({
        to,
        name,
        action,
        planName,
        subscriptionId,
        amount,
        newPlanName,
    }).catch((err) => {
        console.warn(
            `[subscription-email] ${action} email to ${to} failed:`,
            err.message,
        );
    });
}

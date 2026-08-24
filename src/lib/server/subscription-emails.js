import { sendNewsletterMail } from "./newsletter";

function escapeHtml(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

const tierNames = { base: "Starter", medium: "Pro", highest: "Enterprise" };

const subjectByAction = {
    activated: "Your DEV Infinity Cloud subscription is now active!",
    charged: "DEV Infinity Cloud — Monthly billing receipt",
    cancelled: "Your DEV Infinity Cloud subscription has been cancelled",
    paused: "Your DEV Infinity Cloud subscription has been paused",
    resumed: "Your DEV Infinity Cloud subscription is now resumed",
    tier_change: "Your DEV Infinity Cloud plan has been updated",
};

function renderSubscriptionHtml({ name, action, planName, subscriptionId, amount, newPlanName }) {
    const safeName = escapeHtml(name || "there");
    const safePlan = escapeHtml(planName || "Cloud");
    const safeSubId = escapeHtml(subscriptionId || "");
    const safeAmount = amount ? escapeHtml(`INR ${Number(amount || 0).toLocaleString("en-IN")}`) : "";
    const safeNewPlan = escapeHtml(newPlanName || "");

    const contentMap = {
        activated: `
            <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#46556f;">Hi ${safeName}, your <strong>${safePlan}</strong> subscription on DEV Infinity Cloud is now <span style="color:#10b981;font-weight:700;">active</span>. You can start using your compute hours and AI model APIs right away.</p>
            <div style="border:2px solid #101820;border-radius:14px;padding:18px;background:#ffffff;margin-bottom:16px;">
                <p style="margin:0 0 8px;"><strong>Plan:</strong> ${safePlan}</p>
                <p style="margin:0 0 8px;"><strong>Subscription ID:</strong> ${safeSubId || "N/A"}</p>
                <p style="margin:0;">Access your dashboard anytime to track usage and manage your subscription.</p>
            </div>`,
        charged: `
            <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#46556f;">Hi ${safeName}, your monthly billing cycle for <strong>${safePlan}</strong> has been processed successfully.</p>
            <div style="border:2px solid #101820;border-radius:14px;padding:18px;background:#ffffff;margin-bottom:16px;">
                <p style="margin:0 0 8px;"><strong>Amount charged:</strong> ${safeAmount}</p>
                <p style="margin:0 0 8px;"><strong>Plan:</strong> ${safePlan}</p>
                <p style="margin:0;">Your usage counters have been reset for the new billing period.</p>
            </div>`,
        cancelled: `
            <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#46556f;">Hi ${safeName}, your <strong>${safePlan}</strong> subscription on DEV Infinity Cloud has been <span style="color:#ef4444;font-weight:700;">cancelled</span> as requested. You will retain access until the end of your current billing period.</p>
            <div style="border:2px solid #101820;border-radius:14px;padding:18px;background:#ffffff;margin-bottom:16px;">
                <p style="margin:0 0 8px;"><strong>Plan:</strong> ${safePlan}</p>
                <p style="margin:0;">If you changed your mind, you can subscribe again from the Cloud page.</p>
            </div>`,
        paused: `
            <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#46556f;">Hi ${safeName}, your <strong>${safePlan}</strong> subscription has been <span style="color:#f59e0b;font-weight:700;">paused</span>. Your billing is on hold and your usage is frozen.</p>
            <div style="border:2px solid #101820;border-radius:14px;padding:18px;background:#ffffff;margin-bottom:16px;">
                <p style="margin:0 0 8px;"><strong>Plan:</strong> ${safePlan}</p>
                <p style="margin:0;">Resume anytime from your Cloud Dashboard to reactivate your subscription.</p>
            </div>`,
        resumed: `
            <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#46556f;">Hi ${safeName}, your <strong>${safePlan}</strong> subscription is <span style="color:#10b981;font-weight:700;">active again</span>. Welcome back! Your usage counters have been reset for the new period.</p>
            <div style="border:2px solid #101820;border-radius:14px;padding:18px;background:#ffffff;margin-bottom:16px;">
                <p style="margin:0 0 8px;"><strong>Plan:</strong> ${safePlan}</p>
                <p style="margin:0;">Your compute hours and API access are now available.</p>
            </div>`,
        tier_change: `
            <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#46556f;">Hi ${safeName}, your subscription has been updated from <strong>${safePlan}</strong> to <strong>${safeNewPlan}</strong>. The new plan will take effect at the start of your next billing cycle.</p>
            <div style="border:2px solid #101820;border-radius:14px;padding:18px;background:#ffffff;margin-bottom:16px;">
                <p style="margin:0 0 8px;"><strong>Previous plan:</strong> ${safePlan}</p>
                <p style="margin:0 0 8px;"><strong>New plan:</strong> ${safeNewPlan}</p>
                <p style="margin:0;">Until then, your current plan benefits continue as-is.</p>
            </div>`,
    };

    const bodyHtml = contentMap[action] || contentMap.activated;

    return `
        <div style="margin:0;padding:32px;background:#f5f2ea;font-family:Segoe UI,Arial,sans-serif;color:#101820;">
            <div style="max-width:640px;margin:0 auto;background:#fffaf0;border:2px solid #101820;border-radius:18px;padding:32px;box-shadow:8px 8px 0 #101820;">
                <p style="margin:0 0 12px;color:#2457ff;font-size:12px;text-transform:uppercase;font-weight:800;">DEV Infinity Cloud</p>
                <h1 style="margin:0 0 18px;font-size:24px;line-height:1.2;color:#101820;">Subscription Update</h1>
                ${bodyHtml}
                <p style="margin:22px 0 0;font-size:14px;line-height:1.7;color:#5e6773;">Visit your <a href="https://devsoftware.vercel.app/dev/cloud/dashboard" style="color:#2457ff;">Cloud Dashboard</a> to manage your subscription.</p>
                <hr style="border:0;border-top:1px solid #e5e7eb;margin:24px 0 16px;" />
                <p style="margin:0;color:#6b7280;font-size:12px;line-height:1.6;">DEV Infinity Cloud | <a href="mailto:support@finvolve.dev" style="color:#2457ff;">support@finvolve.dev</a></p>
            </div>
        </div>
    `;
}

/**
 * Send a subscription-related email using the existing newsletter SMTP system.
 */
export async function sendSubscriptionEmail({ to, name, action, planName, subscriptionId, amount, newPlanName }) {
    const subject = subjectByAction[action] || "DEV Infinity Cloud — Subscription Update";
    const html = renderSubscriptionHtml({ name, action, planName, subscriptionId, amount, newPlanName });

    return sendNewsletterMail({
        to,
        subject,
        text: `Hi ${name || "there"}, your DEV Infinity Cloud subscription has been ${action}. Plan: ${planName}. Manage your subscription at https://devsoftware.vercel.app/dev/cloud/dashboard`,
        html,
    });
}

/**
 * Send a subscription email (fire-and-forget). Logs errors but never throws.
 */
export function sendSubscriptionEmailSafe({ to, name, action, planName, subscriptionId, amount, newPlanName }) {
    sendSubscriptionEmail({ to, name, action, planName, subscriptionId, amount, newPlanName }).catch((err) => {
        console.warn(`[subscription-email] ${action} email to ${to} failed:`, err.message);
    });
}

export { tierNames };

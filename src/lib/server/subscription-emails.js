import { sendNewsletterMail } from "./newsletter";
import { getCanonicalSiteUrl } from "./site-url";
import { SUBSCRIPTION_TIERS } from "./subscription-plans";

function escapeHtml(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export const tierNames = {
    base: "Starter Plan",
    medium: "Pro Plan",
    highest: "Enterprise Plan",
};

const subjectByAction = {
    activated: "🚀 Your DEV Infinity Cloud subscription is now active!",
    charged: "🧾 DEV Infinity Cloud — Monthly billing receipt",
    cancelled: "DEV Infinity Cloud — Subscription cancellation confirmed",
    paused: "⏸️ Your DEV Infinity Cloud subscription has been paused",
    resumed: "⚡ Your DEV Infinity Cloud subscription is now resumed",
    tier_change: "🔄 DEV Infinity Cloud — Plan update confirmed",
};

const statusConfigByAction = {
    activated: {
        badgeText: "ACTIVE & PROVISIONED",
        badgeBg: "#ecfdf5",
        badgeBorder: "#10b981",
        badgeColor: "#047857",
        title: "Welcome to DEV Infinity Cloud",
    },
    charged: {
        badgeText: "PAYMENT SUCCESSFUL",
        badgeBg: "#ecfdf5",
        badgeBorder: "#10b981",
        badgeColor: "#047857",
        title: "Monthly Billing Receipt",
    },
    paused: {
        badgeText: "SUBSCRIPTION PAUSED",
        badgeBg: "#fffbeb",
        badgeBorder: "#f59e0b",
        badgeColor: "#b45309",
        title: "Subscription Temporarily Paused",
    },
    resumed: {
        badgeText: "SUBSCRIPTION RESUMED",
        badgeBg: "#eff6ff",
        badgeBorder: "#3b82f6",
        badgeColor: "#1d4ed8",
        title: "Welcome Back to Cloud Services",
    },
    cancelled: {
        badgeText: "CANCELLATION CONFIRMED",
        badgeBg: "#fef2f2",
        badgeBorder: "#ef4444",
        badgeColor: "#b91c1c",
        title: "Subscription Cancelled",
    },
    tier_change: {
        badgeText: "PLAN UPDATE SCHEDULED",
        badgeBg: "#f5f3ff",
        badgeBorder: "#8b5cf6",
        badgeColor: "#6d28d9",
        title: "Plan Transition Scheduled",
    },
};

function getPlanDetails(planName) {
    const rawKey = Object.keys(SUBSCRIPTION_TIERS).find(
        (key) =>
            SUBSCRIPTION_TIERS[key].name.toLowerCase() ===
                String(planName).toLowerCase() ||
            tierNames[key]?.toLowerCase() === String(planName).toLowerCase() ||
            key === String(planName).toLowerCase(),
    );

    return rawKey ? SUBSCRIPTION_TIERS[rawKey] : null;
}

function renderSubscriptionHtml({
    name,
    action,
    planName,
    subscriptionId,
    amount,
    newPlanName,
}) {
    const safeName = escapeHtml(name || "Subscriber");
    const safePlan = escapeHtml(planName || "Cloud");
    const safeSubId = escapeHtml(subscriptionId || "N/A");
    const safeAmount = amount
        ? escapeHtml(`INR ${Number(amount || 0).toLocaleString("en-IN")}`)
        : "";
    const safeNewPlan = escapeHtml(newPlanName || "Updated Plan");

    const siteUrl = getCanonicalSiteUrl() || "https://devsoftware.vercel.app";
    const dashboardUrl = `${siteUrl.replace(/\/$/, "")}/dev/cloud/dashboard`;
    const cloudPageUrl = `${siteUrl.replace(/\/$/, "")}/dev/cloud`;
    const supportEmail = "mitraricky06@gmail.com";

    const config = statusConfigByAction[action] || statusConfigByAction.activated;
    const planInfo = getPlanDetails(planName);

    let specificContent = "";

    switch (action) {
        case "activated":
            specificContent = `
                <p style="margin:0 0 18px;font-size:16px;line-height:1.75;color:#334155;">
                    Hi <strong>${safeName}</strong>, your <strong>${safePlan}</strong> subscription is now active! Your dedicated compute resources and AI model API access have been provisioned and are ready for use.
                </p>
                
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;background:#ffffff;border:2px solid #101820;border-radius:14px;overflow:hidden;box-shadow:4px 4px 0 #101820;">
                    <tr>
                        <td style="padding:14px 18px;background:#f8fafc;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Plan Tier</td>
                        <td style="padding:14px 18px;background:#ffffff;border-bottom:1px solid #e2e8f0;font-size:14px;font-weight:700;color:#0f172a;">${safePlan}</td>
                    </tr>
                    <tr>
                        <td style="padding:14px 18px;background:#f8fafc;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Subscription ID</td>
                        <td style="padding:14px 18px;background:#ffffff;border-bottom:1px solid #e2e8f0;font-size:13px;font-family:Consolas,monospace;color:#2457ff;font-weight:700;">${safeSubId}</td>
                    </tr>
                    ${
                        planInfo
                            ? `
                    <tr>
                        <td style="padding:14px 18px;background:#f8fafc;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Compute Allocation</td>
                        <td style="padding:14px 18px;background:#ffffff;border-bottom:1px solid #e2e8f0;font-size:14px;color:#334155;"><strong>${planInfo.computeHours.total} hours / month</strong></td>
                    </tr>
                    <tr>
                        <td style="padding:14px 18px;background:#f8fafc;font-size:12px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">AI Model APIs</td>
                        <td style="padding:14px 18px;background:#ffffff;font-size:14px;color:#334155;">
                            ${planInfo.apiAccess.freeLLMs ? '<span style="display:inline-block;margin-right:6px;padding:2px 8px;background:#f1f5f9;border-radius:6px;font-size:12px;font-weight:600;">Free LLMs</span>' : ""}
                            ${planInfo.apiAccess.gpt ? `<span style="display:inline-block;margin-right:6px;padding:2px 8px;background:#f1f5f9;border-radius:6px;font-size:12px;font-weight:600;">GPT (${planInfo.apiAccess.gptHours}h)</span>` : ""}
                            ${planInfo.apiAccess.gemini ? `<span style="display:inline-block;margin-right:6px;padding:2px 8px;background:#f1f5f9;border-radius:6px;font-size:12px;font-weight:600;">Gemini (${planInfo.apiAccess.geminiHours}h)</span>` : ""}
                            ${planInfo.apiAccess.claude ? '<span style="display:inline-block;padding:2px 8px;background:#f1f5f9;border-radius:6px;font-size:12px;font-weight:600;">Claude</span>' : ""}
                        </td>
                    </tr>
                    `
                            : ""
                    }
                </table>

                <div style="margin:24px 0;padding:18px;background:#f0f7ff;border-left:4px solid #2457ff;border-radius:8px;">
                    <p style="margin:0 0 6px;font-size:14px;font-weight:800;color:#1e3a8a;">Next Steps:</p>
                    <ul style="margin:0;padding-left:20px;font-size:14px;line-height:1.7;color:#334155;">
                        <li>Log in to your <strong>Cloud Dashboard</strong> using your email address.</li>
                        <li>Monitor your compute hour burn rate and AI API token utilization.</li>
                        <li>Manage your active subscription settings anytime.</li>
                    </ul>
                </div>
            `;
            break;

        case "paused":
            specificContent = `
                <p style="margin:0 0 18px;font-size:16px;line-height:1.75;color:#334155;">
                    Hi <strong>${safeName}</strong>, your <strong>${safePlan}</strong> subscription on DEV Infinity Cloud has been successfully <strong style="color:#b45309;">paused</strong>.
                </p>
                
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;background:#ffffff;border:2px solid #101820;border-radius:14px;overflow:hidden;box-shadow:4px 4px 0 #101820;">
                    <tr>
                        <td style="padding:14px 18px;background:#f8fafc;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Status</td>
                        <td style="padding:14px 18px;background:#ffffff;border-bottom:1px solid #e2e8f0;font-size:14px;font-weight:700;color:#b45309;">Paused (Billing on hold)</td>
                    </tr>
                    <tr>
                        <td style="padding:14px 18px;background:#f8fafc;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Plan Tier</td>
                        <td style="padding:14px 18px;background:#ffffff;border-bottom:1px solid #e2e8f0;font-size:14px;font-weight:700;color:#0f172a;">${safePlan}</td>
                    </tr>
                    <tr>
                        <td style="padding:14px 18px;background:#f8fafc;font-size:12px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Subscription ID</td>
                        <td style="padding:14px 18px;background:#ffffff;font-size:13px;font-family:Consolas,monospace;color:#2457ff;font-weight:700;">${safeSubId}</td>
                    </tr>
                </table>

                <div style="margin:24px 0;padding:18px;background:#fffbeb;border-left:4px solid #f59e0b;border-radius:8px;">
                    <p style="margin:0 0 6px;font-size:14px;font-weight:800;color:#92400e;">What this means:</p>
                    <ul style="margin:0;padding-left:20px;font-size:14px;line-height:1.7;color:#78350f;">
                        <li>Your recurring monthly billing has been halted immediately.</li>
                        <li>Compute runtime and API requests are temporarily placed on standby.</li>
                        <li>Your account data and workspace configurations are securely preserved.</li>
                        <li>You can click <strong>Resume</strong> anytime from your dashboard to reactivate instantly.</li>
                    </ul>
                </div>
            `;
            break;

        case "resumed":
            specificContent = `
                <p style="margin:0 0 18px;font-size:16px;line-height:1.75;color:#334155;">
                    Hi <strong>${safeName}</strong>, your <strong>${safePlan}</strong> subscription on DEV Infinity Cloud is now <strong style="color:#047857;">active again</strong>. Welcome back!
                </p>
                
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;background:#ffffff;border:2px solid #101820;border-radius:14px;overflow:hidden;box-shadow:4px 4px 0 #101820;">
                    <tr>
                        <td style="padding:14px 18px;background:#f8fafc;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Status</td>
                        <td style="padding:14px 18px;background:#ffffff;border-bottom:1px solid #e2e8f0;font-size:14px;font-weight:700;color:#047857;">Active & Ready</td>
                    </tr>
                    <tr>
                        <td style="padding:14px 18px;background:#f8fafc;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Plan Tier</td>
                        <td style="padding:14px 18px;background:#ffffff;border-bottom:1px solid #e2e8f0;font-size:14px;font-weight:700;color:#0f172a;">${safePlan}</td>
                    </tr>
                    <tr>
                        <td style="padding:14px 18px;background:#f8fafc;font-size:12px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Subscription ID</td>
                        <td style="padding:14px 18px;background:#ffffff;font-size:13px;font-family:Consolas,monospace;color:#2457ff;font-weight:700;">${safeSubId}</td>
                    </tr>
                </table>

                <div style="margin:24px 0;padding:18px;background:#ecfdf5;border-left:4px solid #10b981;border-radius:8px;">
                    <p style="margin:0 0 6px;font-size:14px;font-weight:800;color:#065f46;">Access Restored:</p>
                    <p style="margin:0;font-size:14px;line-height:1.7;color:#064e3b;">
                        Your compute engine quotas and AI model endpoints are fully operational. Your usage counters have been refreshed for this billing period.
                    </p>
                </div>
            `;
            break;

        case "cancelled":
            specificContent = `
                <p style="margin:0 0 18px;font-size:16px;line-height:1.75;color:#334155;">
                    Hi <strong>${safeName}</strong>, this email confirms that your <strong>${safePlan}</strong> subscription on DEV Infinity Cloud has been <strong style="color:#b91c1c;">cancelled</strong>.
                </p>
                
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;background:#ffffff;border:2px solid #101820;border-radius:14px;overflow:hidden;box-shadow:4px 4px 0 #101820;">
                    <tr>
                        <td style="padding:14px 18px;background:#f8fafc;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Plan Cancelled</td>
                        <td style="padding:14px 18px;background:#ffffff;border-bottom:1px solid #e2e8f0;font-size:14px;font-weight:700;color:#0f172a;">${safePlan}</td>
                    </tr>
                    <tr>
                        <td style="padding:14px 18px;background:#f8fafc;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Subscription ID</td>
                        <td style="padding:14px 18px;background:#ffffff;border-bottom:1px solid #e2e8f0;font-size:13px;font-family:Consolas,monospace;color:#64748b;">${safeSubId}</td>
                    </tr>
                    <tr>
                        <td style="padding:14px 18px;background:#f8fafc;font-size:12px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Future Billing</td>
                        <td style="padding:14px 18px;background:#ffffff;font-size:14px;color:#059669;font-weight:700;">No further charges</td>
                    </tr>
                </table>

                <div style="margin:24px 0;padding:18px;background:#fef2f2;border-left:4px solid #ef4444;border-radius:8px;">
                    <p style="margin:0 0 6px;font-size:14px;font-weight:800;color:#991b1b;">Important Information:</p>
                    <ul style="margin:0;padding-left:20px;font-size:14px;line-height:1.7;color:#7f1d1d;">
                        <li>You will retain compute and API access until the end of your current 30-day billing cycle.</li>
                        <li>No additional recurring renewal payments will be charged to your payment method.</li>
                        <li>If you ever want to re-activate or switch to another plan, you can subscribe again anytime from our Cloud Portal.</li>
                    </ul>
                </div>
            `;
            break;

        case "charged":
            specificContent = `
                <p style="margin:0 0 18px;font-size:16px;line-height:1.75;color:#334155;">
                    Hi <strong>${safeName}</strong>, your monthly renewal payment for <strong>${safePlan}</strong> has been successfully processed.
                </p>
                
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;background:#ffffff;border:2px solid #101820;border-radius:14px;overflow:hidden;box-shadow:4px 4px 0 #101820;">
                    <tr>
                        <td style="padding:14px 18px;background:#f8fafc;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Amount Paid</td>
                        <td style="padding:14px 18px;background:#ffffff;border-bottom:1px solid #e2e8f0;font-size:16px;font-weight:800;color:#047857;">${safeAmount || "Paid"}</td>
                    </tr>
                    <tr>
                        <td style="padding:14px 18px;background:#f8fafc;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Plan Tier</td>
                        <td style="padding:14px 18px;background:#ffffff;border-bottom:1px solid #e2e8f0;font-size:14px;font-weight:700;color:#0f172a;">${safePlan}</td>
                    </tr>
                    <tr>
                        <td style="padding:14px 18px;background:#f8fafc;font-size:12px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Subscription ID</td>
                        <td style="padding:14px 18px;background:#ffffff;font-size:13px;font-family:Consolas,monospace;color:#2457ff;font-weight:700;">${safeSubId}</td>
                    </tr>
                </table>

                <div style="margin:24px 0;padding:18px;background:#ecfdf5;border-left:4px solid #10b981;border-radius:8px;">
                    <p style="margin:0 0 6px;font-size:14px;font-weight:800;color:#065f46;">Cycle Refreshed:</p>
                    <p style="margin:0;font-size:14px;line-height:1.7;color:#064e3b;">
                        Your compute hours and model quotas have been renewed for the next 30 days. You can track your usage metrics in your Cloud Dashboard.
                    </p>
                </div>
            `;
            break;

        case "tier_change":
            specificContent = `
                <p style="margin:0 0 18px;font-size:16px;line-height:1.75;color:#334155;">
                    Hi <strong>${safeName}</strong>, your plan change request from <strong>${safePlan}</strong> to <strong>${safeNewPlan}</strong> has been scheduled.
                </p>
                
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;background:#ffffff;border:2px solid #101820;border-radius:14px;overflow:hidden;box-shadow:4px 4px 0 #101820;">
                    <tr>
                        <td style="padding:14px 18px;background:#f8fafc;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Current Plan</td>
                        <td style="padding:14px 18px;background:#ffffff;border-bottom:1px solid #e2e8f0;font-size:14px;font-weight:600;color:#64748b;">${safePlan}</td>
                    </tr>
                    <tr>
                        <td style="padding:14px 18px;background:#f8fafc;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">New Plan</td>
                        <td style="padding:14px 18px;background:#ffffff;border-bottom:1px solid #e2e8f0;font-size:15px;font-weight:800;color:#2457ff;">${safeNewPlan}</td>
                    </tr>
                    <tr>
                        <td style="padding:14px 18px;background:#f8fafc;font-size:12px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Effective Date</td>
                        <td style="padding:14px 18px;background:#ffffff;font-size:14px;font-weight:600;color:#0f172a;">Next monthly billing cycle</td>
                    </tr>
                </table>

                <div style="margin:24px 0;padding:18px;background:#f5f3ff;border-left:4px solid #8b5cf6;border-radius:8px;">
                    <p style="margin:0;font-size:14px;line-height:1.7;color:#5b21b6;">
                        You will continue enjoying your current ${safePlan} quota until the current billing period concludes. The updated pricing and expanded resource limits of ${safeNewPlan} will apply automatically on renewal.
                    </p>
                </div>
            `;
            break;

        default:
            specificContent = `
                <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#334155;">
                    Hi ${safeName}, your subscription on DEV Infinity Cloud for <strong>${safePlan}</strong> has been updated.
                </p>
            `;
    }

    const ctaButtonUrl = action === "cancelled" ? cloudPageUrl : dashboardUrl;
    const ctaButtonText =
        action === "cancelled"
            ? "Explore Cloud Plans"
            : action === "paused"
              ? "Manage / Resume in Dashboard"
              : "Open Cloud Dashboard";

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(config.title)}</title>
</head>
<body style="margin:0;padding:0;background:#f1ece1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#101820;-webkit-font-smoothing:antialiased;">
    <div style="width:100%;padding:40px 16px 48px;background:#f1ece1;">
        <div style="max-width:620px;margin:0 auto;background:#fffaf0;border:2px solid #101820;border-radius:20px;box-shadow:8px 8px 0 #101820;overflow:hidden;">
            
            <!-- Brand Header -->
            <div style="padding:28px 32px 20px;background:#ffffff;border-bottom:2px solid #101820;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td align="left" style="vertical-align:middle;">
                            <span style="display:inline-block;padding:4px 10px;background:#2457ff;color:#ffffff;font-size:12px;font-weight:900;letter-spacing:0.08em;border-radius:8px;text-transform:uppercase;border:1.5px solid #101820;box-shadow:2px 2px 0 #101820;">DEV♾️</span>
                            <span style="margin-left:10px;font-size:18px;font-weight:800;color:#101820;letter-spacing:-0.02em;">Cloud Services</span>
                        </td>
                        <td align="right" style="vertical-align:middle;">
                            <span style="display:inline-block;padding:5px 12px;background:${config.badgeBg};border:1.5px solid ${config.badgeBorder};color:${config.badgeColor};font-size:11px;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;border-radius:999px;">
                                ${config.badgeText}
                            </span>
                        </td>
                    </tr>
                </table>
            </div>

            <!-- Main Body -->
            <div style="padding:32px 32px 28px;">
                <h1 style="margin:0 0 16px;font-size:24px;line-height:1.25;font-weight:900;color:#0f172a;letter-spacing:-0.02em;">
                    ${escapeHtml(config.title)}
                </h1>
                
                ${specificContent}

                <!-- CTA Button -->
                <div style="margin:32px 0 16px;text-align:center;">
                    <a href="${ctaButtonUrl}" style="display:inline-block;padding:14px 32px;background:#2457ff;color:#ffffff;text-decoration:none;font-size:15px;font-weight:800;border:2px solid #101820;border-radius:12px;box-shadow:4px 4px 0 #101820;transition:all 0.2s ease;">
                        ${ctaButtonText} &rarr;
                    </a>
                </div>
            </div>

            <!-- Footer -->
            <div style="padding:24px 32px;background:#f8fafc;border-top:2px solid #101820;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td align="left" style="font-size:12px;line-height:1.6;color:#64748b;">
                            <strong>DEV Infinity Cloud</strong> &bull; AI Compute & Model Services<br />
                            Need assistance? Email <a href="mailto:${supportEmail}" style="color:#2457ff;font-weight:600;text-decoration:none;">${supportEmail}</a>
                        </td>
                        <td align="right" style="vertical-align:top;font-size:12px;color:#64748b;">
                            <a href="${dashboardUrl}" style="color:#2457ff;font-weight:600;text-decoration:none;">Dashboard</a> &bull; 
                            <a href="${cloudPageUrl}" style="color:#2457ff;font-weight:600;text-decoration:none;">Plans</a>
                        </td>
                    </tr>
                </table>
            </div>

        </div>
    </div>
</body>
</html>
    `;
}

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
    }\n\nPlan: ${planName}\nSubscription ID: ${subscriptionId || "N/A"}\n\nAccess your Cloud Dashboard anytime: ${dashboardUrl}\n\nSupport: mitraricky06@gmail.com\nDEV Infinity Cloud`;

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

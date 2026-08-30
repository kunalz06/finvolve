import { sendNewsletterMail } from "./newsletter";
import { RENTAL_CONFIG, getBillBreakdown } from "./rental-plans";

function escapeHtml(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function emailShell({ badge, badgeBg, badgeBorder, badgeColor, heading, body }) {
    return `
<!DOCTYPE html>
<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f2ea;font-family:'Segoe UI',Roboto,Arial,sans-serif;color:#101820;-webkit-text-size-adjust:100%;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f2ea;padding:32px 16px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;">

      <!-- Brand Header -->
      <tr><td style="padding:0 0 24px;text-align:center;">
        <table cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr>
          <td style="background:#2457ff;color:#fff;font-size:18px;font-weight:900;letter-spacing:0.04em;padding:10px 20px;border-radius:10px;border:2px solid #101820;box-shadow:3px 3px 0 #101820;">
            DEV&#8734; Cloud
          </td>
        </tr></table>
        <p style="margin:10px 0 0;font-size:11px;font-weight:700;color:#8a8580;text-transform:uppercase;letter-spacing:0.1em;">Cloud Infrastructure &amp; AI Models</p>
      </td></tr>

      <!-- Main Card -->
      <tr><td style="background:#fffaf0;border:2px solid #101820;border-radius:18px;overflow:hidden;box-shadow:6px 6px 0 #101820;">

        <!-- Badge -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background:${badgeBg};border-bottom:2px solid ${badgeBorder};padding:14px 24px;">
          <tr><td style="text-align:center;">
            <span style="display:inline-block;background:${badgeBg};border:2px solid ${badgeBorder};border-radius:8px;padding:5px 14px;">
              <span style="color:${badgeColor};font-size:11px;font-weight:800;letter-spacing:0.1em;">${badge}</span>
            </span>
          </td></tr>
        </table>

        <!-- Body Content -->
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:28px 28px 8px;">
          <tr><td>
            ${body}
          </td></tr>
        </table>

      </td></tr>

      <!-- Footer -->
      <tr><td style="padding:24px 12px 0;text-align:center;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border-top:2px solid #d6cfc2;padding-top:18px;">
          <tr><td style="text-align:center;">
            <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#8a8580;">DEV Infinity Cloud &middot; devsoftwareai.live</p>
            <p style="margin:0 0 4px;font-size:11px;color:#a8a39d;">This is an automated transactional email regarding your cloud rental.</p>
            <p style="margin:0;font-size:11px;color:#a8a39d;">Questions? <a href="https://devsoftwareai.live/dev/contact" style="color:#2457ff;font-weight:600;">Contact our team</a></p>
          </td></tr>
        </table>
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`;
}

/**
 * Email sent when a rental is activated (upfront fee paid).
 */
export function renderRentalActivatedHtml({ name, rentalId, days, expiresAt }) {
    const safeName = escapeHtml(name || "there");
    const safeRentalId = escapeHtml(rentalId || "");
    const safeDays = escapeHtml(String(days));
    const safeExpires = expiresAt
        ? escapeHtml(new Date(expiresAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }))
        : "Not available";
    const upfrontFee = RENTAL_CONFIG.upfrontFeeINR;

    const body = `
        <h1 style="margin:0 0 6px;font-size:24px;line-height:1.3;color:#101820;font-weight:900;">Your Cloud Rental is Now Live</h1>
        <p style="margin:0 0 20px;font-size:14px;line-height:1.75;color:#46515f;">Hi <strong>${safeName}</strong>, your compute rental is active. You now have <strong>${safeDays} days</strong> of dedicated cloud compute access starting right now.</p>

        <!-- Summary Table -->
        <table width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #101820;border-radius:14px;overflow:hidden;margin-bottom:20px;">
          <tr><td style="background:#ebe5d9;padding:11px 18px;border-bottom:2px solid #101820;">
            <p style="margin:0;font-size:12px;font-weight:800;color:#101820;text-transform:uppercase;letter-spacing:0.06em;">Rental Summary</p>
          </td></tr>
          <tr><td>
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;">
              <tr style="border-bottom:1px solid #e8e2d6;">
                <td style="padding:11px 18px;color:#5e6773;font-weight:600;">Rental ID</td>
                <td style="padding:11px 18px;text-align:right;font-weight:700;color:#101820;font-family:Consolas,'Courier New',monospace;font-size:12px;">${safeRentalId}</td>
              </tr>
              <tr style="border-bottom:1px solid #e8e2d6;">
                <td style="padding:11px 18px;color:#5e6773;font-weight:600;">Duration</td>
                <td style="padding:11px 18px;text-align:right;font-weight:700;color:#101820;">${safeDays} Days</td>
              </tr>
              <tr style="border-bottom:1px solid #e8e2d6;">
                <td style="padding:11px 18px;color:#5e6773;font-weight:600;">Access Expires At</td>
                <td style="padding:11px 18px;text-align:right;font-weight:700;color:#101820;">${safeExpires}</td>
              </tr>
              <tr style="border-bottom:1px solid #e8e2d6;">
                <td style="padding:11px 18px;color:#5e6773;font-weight:600;">Upfront Fee Paid</td>
                <td style="padding:11px 18px;text-align:right;font-weight:700;color:#047857;">&#8377;${upfrontFee}</td>
              </tr>
              <tr>
                <td style="padding:11px 18px;color:#5e6773;font-weight:600;">Usage Billing</td>
                <td style="padding:11px 18px;text-align:right;font-weight:700;color:#101820;">&#8377;${RENTAL_CONFIG.computeRateINR} per ${RENTAL_CONFIG.computeHoursPerUnit} hours</td>
              </tr>
            </table>
          </td></tr>
        </table>

        <!-- How Billing Works -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border:2px solid #d6cfc2;border-radius:12px;overflow:hidden;margin-bottom:20px;">
          <tr><td style="padding:14px 18px;">
            <p style="margin:0 0 8px;font-size:12px;font-weight:800;color:#101820;text-transform:uppercase;letter-spacing:0.06em;">How Billing Works</p>
            <table cellpadding="0" cellspacing="0" style="font-size:13px;line-height:1.8;color:#5e6773;">
              <tr><td style="padding:2px 0 2px 4px;vertical-align:top;">1.</td><td style="padding:2px 0 2px 8px;">After your ${safeDays}-day period ends, your actual compute usage is calculated.</td></tr>
              <tr><td style="padding:2px 0 2px 4px;vertical-align:top;">2.</td><td style="padding:2px 0 2px 8px;">Every ${RENTAL_CONFIG.computeHoursPerUnit} hours of compute costs <strong>&#8377;${RENTAL_CONFIG.computeRateINR}</strong>.</td></tr>
              <tr><td style="padding:2px 0 2px 4px;vertical-align:top;">3.</td><td style="padding:2px 0 2px 8px;">A detailed bill with a secure Razorpay payment link will be emailed to you.</td></tr>
              <tr><td style="padding:2px 0 2px 4px;vertical-align:top;">4.</td><td style="padding:2px 0 2px 8px;">You only pay for what you use &mdash; nothing more.</td></tr>
            </table>
          </td></tr>
        </table>

        <!-- CTA -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="text-align:center;padding:4px 0 0;">
            <p style="margin:0;font-size:13px;line-height:1.7;color:#5e6773;">If you have any questions, reach out via our <a href="https://devsoftwareai.live/dev/contact" style="color:#2457ff;font-weight:600;">contact page</a>.</p>
          </td></tr>
        </table>
    `;

    return emailShell({
        badge: "RENTAL ACTIVE &amp; PROVISIONED",
        badgeBg: "#ecfdf5",
        badgeBorder: "#10b981",
        badgeColor: "#047857",
        heading: "Your Cloud Rental is Now Live",
        body,
    });
}

/**
 * Email sent when the usage bill is generated after rental period ends.
 * Contains a Razorpay payment link for the bill amount.
 */
export function renderRentalBillHtml({ name, rentalId, days, hoursUsed, billBreakdown, paymentUrl }) {
    const safeName = escapeHtml(name || "there");
    const safeRentalId = escapeHtml(rentalId || "");
    const safeDays = escapeHtml(String(days));
    const bd = billBreakdown || getBillBreakdown(hoursUsed || 0);
    const safePaymentUrl = escapeHtml(paymentUrl || "");

    const body = `
        <h1 style="margin:0 0 6px;font-size:24px;line-height:1.3;color:#101820;font-weight:900;">Your Compute Usage Bill is Ready</h1>
        <p style="margin:0 0 20px;font-size:14px;line-height:1.75;color:#46515f;">Hi <strong>${safeName}</strong>, your ${safeDays}-day cloud rental has ended. Based on your actual compute usage, here is your bill.</p>

        <!-- Bill Details -->
        <table width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #101820;border-radius:14px;overflow:hidden;margin-bottom:20px;">
          <tr><td style="background:#ebe5d9;padding:11px 18px;border-bottom:2px solid #101820;">
            <p style="margin:0;font-size:12px;font-weight:800;color:#101820;text-transform:uppercase;letter-spacing:0.06em;">Bill Details</p>
          </td></tr>
          <tr><td>
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;">
              <tr style="border-bottom:1px solid #e8e2d6;">
                <td style="padding:11px 18px;color:#5e6773;font-weight:600;">Rental ID</td>
                <td style="padding:11px 18px;text-align:right;font-weight:700;color:#101820;font-family:Consolas,'Courier New',monospace;font-size:12px;">${safeRentalId}</td>
              </tr>
              <tr style="border-bottom:1px solid #e8e2d6;">
                <td style="padding:11px 18px;color:#5e6773;font-weight:600;">Rental Duration</td>
                <td style="padding:11px 18px;text-align:right;font-weight:700;color:#101820;">${safeDays} Days</td>
              </tr>
              <tr style="border-bottom:1px solid #e8e2d6;">
                <td style="padding:11px 18px;color:#5e6773;font-weight:600;">Compute Hours Used</td>
                <td style="padding:11px 18px;text-align:right;font-weight:700;color:#101820;">${bd.hoursUsed} hours</td>
              </tr>
              <tr style="border-bottom:1px solid #e8e2d6;">
                <td style="padding:11px 18px;color:#5e6773;font-weight:600;">Billing Units</td>
                <td style="padding:11px 18px;text-align:right;font-weight:700;color:#101820;">${bd.units} unit${bd.units !== 1 ? "s" : ""} &times; ${bd.hoursUsed > 0 ? RENTAL_CONFIG.computeHoursPerUnit : ""} hours</td>
              </tr>
              <tr style="border-bottom:1px solid #e8e2d6;">
                <td style="padding:11px 18px;color:#5e6773;font-weight:600;">Rate</td>
                <td style="padding:11px 18px;text-align:right;font-weight:700;color:#101820;">&#8377;${bd.ratePerUnit} / ${RENTAL_CONFIG.computeHoursPerUnit} hours</td>
              </tr>
              <tr>
                <td style="padding:13px 18px;font-size:14px;font-weight:800;color:#101820;">Total Due</td>
                <td style="padding:13px 18px;text-align:right;font-size:17px;font-weight:900;color:#b45309;">&#8377;${bd.totalINR.toLocaleString("en-IN")}</td>
              </tr>
            </table>
          </td></tr>
        </table>

        ${bd.totalINR > 0 ? `
        <!-- Payment CTA -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
          <tr><td style="text-align:center;padding:8px 0;">
            <a href="${safePaymentUrl}" style="display:inline-block;background:#2457ff;color:#ffffff;text-decoration:none;border:2px solid #101820;border-radius:12px;padding:14px 36px;font-size:15px;font-weight:800;box-shadow:4px 4px 0 #101820;">Pay &#8377;${bd.totalINR.toLocaleString("en-IN")} Now</a>
            <p style="margin:10px 0 0;font-size:11px;color:#8a8580;font-weight:600;">Secure payment powered by Razorpay</p>
          </td></tr>
        </table>

        <!-- Fallback Link -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border:2px solid #d6cfc2;border-radius:12px;overflow:hidden;margin-bottom:20px;">
          <tr><td style="padding:12px 16px;">
            <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#8a8580;text-transform:uppercase;letter-spacing:0.06em;">Button not working?</p>
            <p style="margin:0;font-size:12px;line-height:1.6;color:#5e6773;word-break:break-all;">${safePaymentUrl}</p>
          </td></tr>
        </table>
        ` : `
        <!-- No Usage Notice -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#ecfdf5;border:2px solid #10b981;border-radius:12px;overflow:hidden;margin-bottom:20px;">
          <tr><td style="padding:14px 18px;">
            <p style="margin:0;font-size:13px;font-weight:700;color:#047857;">No compute usage was recorded during your rental period. You have no additional charges.</p>
          </td></tr>
        </table>
        `}

        <!-- Help -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="text-align:center;">
            <p style="margin:0;font-size:13px;line-height:1.7;color:#5e6773;">Questions about this bill? <a href="https://devsoftwareai.live/dev/contact" style="color:#2457ff;font-weight:600;">Contact our team</a></p>
          </td></tr>
        </table>
    `;

    return emailShell({
        badge: "USAGE BILL GENERATED",
        badgeBg: "#fef3c7",
        badgeBorder: "#f59e0b",
        badgeColor: "#b45309",
        heading: "Your Compute Usage Bill is Ready",
        body,
    });
}

/**
 * Email sent when the user pays the usage bill.
 */
export function renderRentalBillPaidHtml({ name, rentalId, hoursUsed, totalPaid }) {
    const safeName = escapeHtml(name || "there");
    const safeRentalId = escapeHtml(rentalId || "");
    const safeTotal = escapeHtml(`\u20B9${Number(totalPaid || 0).toLocaleString("en-IN")}`);

    const body = `
        <h1 style="margin:0 0 6px;font-size:24px;line-height:1.3;color:#101820;font-weight:900;">Rental Bill Payment Confirmed</h1>
        <p style="margin:0 0 20px;font-size:14px;line-height:1.75;color:#46515f;">Hi <strong>${safeName}</strong>, we received your payment for cloud rental <strong style="font-family:Consolas,'Courier New',monospace;font-size:12px;">${safeRentalId}</strong>. Your account is fully settled.</p>

        <!-- Receipt Table -->
        <table width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #101820;border-radius:14px;overflow:hidden;margin-bottom:20px;">
          <tr><td style="background:#ebe5d9;padding:11px 18px;border-bottom:2px solid #101820;">
            <p style="margin:0;font-size:12px;font-weight:800;color:#101820;text-transform:uppercase;letter-spacing:0.06em;">Payment Receipt</p>
          </td></tr>
          <tr><td>
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;">
              <tr style="border-bottom:1px solid #e8e2d6;">
                <td style="padding:11px 18px;color:#5e6773;font-weight:600;">Rental ID</td>
                <td style="padding:11px 18px;text-align:right;font-weight:700;color:#101820;font-family:Consolas,'Courier New',monospace;font-size:12px;">${safeRentalId}</td>
              </tr>
              <tr style="border-bottom:1px solid #e8e2d6;">
                <td style="padding:11px 18px;color:#5e6773;font-weight:600;">Compute Hours Used</td>
                <td style="padding:11px 18px;text-align:right;font-weight:700;color:#101820;">${hoursUsed || 0} hours</td>
              </tr>
              <tr>
                <td style="padding:13px 18px;font-size:14px;font-weight:800;color:#101820;">Amount Paid</td>
                <td style="padding:13px 18px;text-align:right;font-size:17px;font-weight:900;color:#047857;">${safeTotal}</td>
              </tr>
            </table>
          </td></tr>
        </table>

        <!-- Thank You -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#ecfdf5;border:2px solid #10b981;border-radius:12px;overflow:hidden;margin-bottom:20px;">
          <tr><td style="padding:14px 18px;text-align:center;">
            <p style="margin:0 0 4px;font-size:16px;font-weight:900;color:#047857;">Payment Successful</p>
            <p style="margin:0;font-size:13px;line-height:1.7;color:#065f46;">Thank you for using DEV Infinity Cloud. You can rent again anytime from our <a href="https://devsoftwareai.live/dev/cloud" style="color:#2457ff;font-weight:700;">cloud page</a>.</p>
          </td></tr>
        </table>
    `;

    return emailShell({
        badge: "BILL PAID SUCCESSFULLY",
        badgeBg: "#ecfdf5",
        badgeBorder: "#10b981",
        badgeColor: "#047857",
        heading: "Rental Bill Payment Confirmed",
        body,
    });
}

/**
 * Send the rental activation email.
 */
export async function sendRentalActivatedEmail({ to, name, rentalId, days, expiresAt }) {
    return sendNewsletterMail({
        to,
        subject: `Your DEV Infinity Cloud rental is now active (${days} days)`,
        text: `Hi ${name},\n\nYour ${days}-day cloud compute rental is now active (ID: ${rentalId}).\n\nAccess expires at: ${expiresAt ? new Date(expiresAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) : "N/A"}.\n\nUpfront fee: INR ${RENTAL_CONFIG.upfrontFeeINR}\nUsage billing: INR ${RENTAL_CONFIG.computeRateINR} per ${RENTAL_CONFIG.computeHoursPerUnit} hours of compute.\n\nYou will receive a usage bill with a payment link after your rental period ends.`,
        html: renderRentalActivatedHtml({ name, rentalId, days, expiresAt }),
    });
}

/**
 * Send the usage bill email with Razorpay payment link.
 */
export async function sendRentalBillEmail({ to, name, rentalId, days, hoursUsed, billBreakdown, paymentUrl }) {
    const bd = billBreakdown || getBillBreakdown(hoursUsed || 0);
    return sendNewsletterMail({
        to,
        subject: `Your DEV Infinity Cloud usage bill \u2014 \u20B9${bd.totalINR.toLocaleString("en-IN")}`,
        text: `Hi ${name},\n\nYour ${days}-day cloud rental (ID: ${rentalId}) has ended.\n\nCompute hours used: ${bd.hoursUsed}\nBilling units: ${bd.units}\nRate: INR ${bd.ratePerUnit} per ${RENTAL_CONFIG.computeHoursPerUnit} hours\nTotal due: INR ${bd.totalINR.toLocaleString("en-IN")}\n\nPay here: ${paymentUrl}`,
        html: renderRentalBillHtml({ name, rentalId, days, hoursUsed, billBreakdown: bd, paymentUrl }),
    });
}

/**
 * Send the bill payment confirmation email.
 */
export async function sendRentalBillPaidEmail({ to, name, rentalId, hoursUsed, totalPaid }) {
    return sendNewsletterMail({
        to,
        subject: "DEV Infinity Cloud \u2014 Rental bill payment confirmed",
        text: `Hi ${name},\n\nPayment of INR ${totalPaid} received for rental ${rentalId}.\n\nCompute hours used: ${hoursUsed || 0}\nAmount paid: INR ${totalPaid}\n\nYour account is fully settled. Thank you!`,
        html: renderRentalBillPaidHtml({ name, rentalId, hoursUsed, totalPaid }),
    });
}

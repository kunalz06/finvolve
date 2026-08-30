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

    return `
        <div style="margin:0;padding:32px;background:#f5f2ea;font-family:Segoe UI,Arial,sans-serif;color:#101820;">
            <div style="max-width:640px;margin:0 auto;background:#fffaf0;border:2px solid #101820;border-radius:18px;padding:32px;box-shadow:8px 8px 0 #101820;">
                <p style="margin:0 0 12px;color:#2457ff;font-size:12px;text-transform:uppercase;font-weight:800;">DEV Infinity Cloud</p>

                <div style="display:inline-block;background:#ecfdf5;border:2px solid #10b981;border-radius:8px;padding:6px 14px;margin-bottom:18px;">
                    <span style="color:#047857;font-size:12px;font-weight:800;letter-spacing:0.08em;">RENTAL ACTIVE &amp; PROVISIONED</span>
                </div>

                <h1 style="margin:0 0 14px;font-size:26px;line-height:1.25;color:#101820;">Your Cloud Rental is Now Live</h1>

                <p style="margin:0 0 22px;font-size:15px;line-height:1.7;color:#46515f;">Hi ${safeName}, your compute rental is active. You now have <strong>${safeDays} days</strong> of dedicated cloud compute access starting right now.</p>

                <div style="border:2px solid #101820;border-radius:14px;overflow:hidden;">
                    <div style="padding:14px 18px;background:#ebe5d9;border-bottom:2px solid #101820;">
                        <p style="margin:0;font-size:13px;font-weight:800;color:#101820;">Rental Summary</p>
                    </div>
                    <table style="width:100%;border-collapse:collapse;font-size:14px;">
                        <tr style="border-bottom:1px solid #d6cfc2;">
                            <td style="padding:12px 18px;color:#5e6773;font-weight:600;">Rental ID</td>
                            <td style="padding:12px 18px;text-align:right;font-weight:700;color:#101820;">${safeRentalId}</td>
                        </tr>
                        <tr style="border-bottom:1px solid #d6cfc2;">
                            <td style="padding:12px 18px;color:#5e6773;font-weight:600;">Duration</td>
                            <td style="padding:12px 18px;text-align:right;font-weight:700;color:#101820;">${safeDays} Days</td>
                        </tr>
                        <tr style="border-bottom:1px solid #d6cfc2;">
                            <td style="padding:12px 18px;color:#5e6773;font-weight:600;">Access Expires At</td>
                            <td style="padding:12px 18px;text-align:right;font-weight:700;color:#101820;">${safeExpires}</td>
                        </tr>
                        <tr style="border-bottom:1px solid #d6cfc2;">
                            <td style="padding:12px 18px;color:#5e6773;font-weight:600;">Upfront Fee Paid</td>
                            <td style="padding:12px 18px;text-align:right;font-weight:700;color:#10b981;">INR ${upfrontFee}</td>
                        </tr>
                        <tr>
                            <td style="padding:12px 18px;color:#5e6773;font-weight:600;">Usage Billing</td>
                            <td style="padding:12px 18px;text-align:right;font-weight:700;color:#101820;">INR ${RENTAL_CONFIG.computeRateINR} per ${RENTAL_CONFIG.computeHoursPerUnit} hours</td>
                        </tr>
                    </table>
                </div>

                <div style="margin-top:22px;padding:14px 18px;background:#ffffff;border:2px solid #d6cfc2;border-radius:12px;">
                    <p style="margin:0 0 8px;font-size:13px;font-weight:800;color:#101820;">How billing works</p>
                    <ul style="margin:0;padding-left:20px;font-size:13px;line-height:1.8;color:#5e6773;">
                        <li>After your ${safeDays}-day period ends, your actual compute usage is calculated.</li>
                        <li>Every ${RENTAL_CONFIG.computeHoursPerUnit} hours of compute costs INR ${RENTAL_CONFIG.computeRateINR}.</li>
                        <li>A detailed bill with a secure Razorpay payment link will be emailed to you.</li>
                        <li>You only pay for what you use — nothing more.</li>
                    </ul>
                </div>

                <p style="margin:22px 0 0;font-size:13px;line-height:1.7;color:#5e6773;">If you have any questions, reach out via the <a href="https://devsoftwareai.live/dev/contact" style="color:#2457ff;">contact page</a>.</p>
            </div>
        </div>
    `;
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

    return `
        <div style="margin:0;padding:32px;background:#f5f2ea;font-family:Segoe UI,Arial,sans-serif;color:#101820;">
            <div style="max-width:640px;margin:0 auto;background:#fffaf0;border:2px solid #101820;border-radius:18px;padding:32px;box-shadow:8px 8px 0 #101820;">
                <p style="margin:0 0 12px;color:#2457ff;font-size:12px;text-transform:uppercase;font-weight:800;">DEV Infinity Cloud</p>

                <div style="display:inline-block;background:#fef3c7;border:2px solid #f59e0b;border-radius:8px;padding:6px 14px;margin-bottom:18px;">
                    <span style="color:#b45309;font-size:12px;font-weight:800;letter-spacing:0.08em;">USAGE BILL GENERATED</span>
                </div>

                <h1 style="margin:0 0 14px;font-size:26px;line-height:1.25;color:#101820;">Your Compute Usage Bill is Ready</h1>

                <p style="margin:0 0 22px;font-size:15px;line-height:1.7;color:#46515f;">Hi ${safeName}, your ${safeDays}-day cloud rental has ended. Based on your actual compute usage, here is your bill.</p>

                <div style="border:2px solid #101820;border-radius:14px;overflow:hidden;">
                    <div style="padding:14px 18px;background:#ebe5d9;border-bottom:2px solid #101820;">
                        <p style="margin:0;font-size:13px;font-weight:800;color:#101820;">Bill Details</p>
                    </div>
                    <table style="width:100%;border-collapse:collapse;font-size:14px;">
                        <tr style="border-bottom:1px solid #d6cfc2;">
                            <td style="padding:12px 18px;color:#5e6773;font-weight:600;">Rental ID</td>
                            <td style="padding:12px 18px;text-align:right;font-weight:700;color:#101820;">${safeRentalId}</td>
                        </tr>
                        <tr style="border-bottom:1px solid #d6cfc2;">
                            <td style="padding:12px 18px;color:#5e6773;font-weight:600;">Rental Duration</td>
                            <td style="padding:12px 18px;text-align:right;font-weight:700;color:#101820;">${safeDays} Days</td>
                        </tr>
                        <tr style="border-bottom:1px solid #d6cfc2;">
                            <td style="padding:12px 18px;color:#5e6773;font-weight:600;">Compute Hours Used</td>
                            <td style="padding:12px 18px;text-align:right;font-weight:700;color:#101820;">${bd.hoursUsed} hours</td>
                        </tr>
                        <tr style="border-bottom:1px solid #d6cfc2;">
                            <td style="padding:12px 18px;color:#5e6773;font-weight:600;">Billing Units</td>
                            <td style="padding:12px 18px;text-align:right;font-weight:700;color:#101820;">${bd.units} unit${bd.units !== 1 ? "s" : ""} x ${bd.hoursUsed > 0 ? RENTAL_CONFIG.computeHoursPerUnit : ""} hours</td>
                        </tr>
                        <tr style="border-bottom:1px solid #d6cfc2;">
                            <td style="padding:12px 18px;color:#5e6773;font-weight:600;">Rate</td>
                            <td style="padding:12px 18px;text-align:right;font-weight:700;color:#101820;">INR ${bd.ratePerUnit} / ${RENTAL_CONFIG.computeHoursPerUnit} hours</td>
                        </tr>
                        <tr>
                            <td style="padding:14px 18px;font-size:16px;font-weight:800;color:#101820;">Total Due</td>
                            <td style="padding:14px 18px;text-align:right;font-size:18px;font-weight:900;color:#b45309;">INR ${bd.totalINR.toLocaleString("en-IN")}</td>
                        </tr>
                    </table>
                </div>

                ${bd.totalINR > 0 ? `
                <div style="margin-top:22px;text-align:center;">
                    <a href="${safePaymentUrl}" style="display:inline-block;background:#2457ff;color:#ffffff;text-decoration:none;border:2px solid #101820;border-radius:12px;padding:14px 32px;font-size:16px;font-weight:800;box-shadow:4px 4px 0 #101820;">Pay INR ${bd.totalINR.toLocaleString("en-IN")} Now</a>
                    <p style="margin:12px 0 0;font-size:12px;color:#5e6773;">Secure payment powered by Razorpay</p>
                </div>
                <p style="margin:16px 0 0;font-size:13px;line-height:1.7;color:#5e6773;">If the button doesn't work, paste this into your browser:<br /><span style="word-break:break-all;">${safePaymentUrl}</span></p>
                ` : `
                <div style="margin-top:22px;padding:14px 18px;background:#ecfdf5;border:2px solid #10b981;border-radius:12px;">
                    <p style="margin:0;font-size:14px;font-weight:700;color:#047857;">No compute usage was recorded. You have no additional charges.</p>
                </div>
                `}

                <p style="margin:22px 0 0;font-size:13px;line-height:1.7;color:#5e6773;">Questions about this bill? <a href="https://devsoftwareai.live/dev/contact" style="color:#2457ff;">Contact our team</a>.</p>
            </div>
        </div>
    `;
}

/**
 * Email sent when the user pays the usage bill.
 */
export function renderRentalBillPaidHtml({ name, rentalId, hoursUsed, totalPaid }) {
    const safeName = escapeHtml(name || "there");
    const safeRentalId = escapeHtml(rentalId || "");
    const safeTotal = escapeHtml(`INR ${Number(totalPaid || 0).toLocaleString("en-IN")}`);

    return `
        <div style="margin:0;padding:32px;background:#f5f2ea;font-family:Segoe UI,Arial,sans-serif;color:#101820;">
            <div style="max-width:640px;margin:0 auto;background:#fffaf0;border:2px solid #101820;border-radius:18px;padding:32px;box-shadow:8px 8px 0 #101820;">
                <p style="margin:0 0 12px;color:#2457ff;font-size:12px;text-transform:uppercase;font-weight:800;">DEV Infinity Cloud</p>

                <div style="display:inline-block;background:#ecfdf5;border:2px solid #10b981;border-radius:8px;padding:6px 14px;margin-bottom:18px;">
                    <span style="color:#047857;font-size:12px;font-weight:800;letter-spacing:0.08em;">BILL PAID SUCCESSFULLY</span>
                </div>

                <h1 style="margin:0 0 14px;font-size:26px;line-height:1.25;color:#101820;">Rental Bill Payment Confirmed</h1>

                <p style="margin:0 0 22px;font-size:15px;line-height:1.7;color:#46515f;">Hi ${safeName}, we received your payment for cloud rental <strong>${safeRentalId}</strong>. Your account is fully settled.</p>

                <div style="border:2px solid #101820;border-radius:14px;overflow:hidden;">
                    <div style="padding:14px 18px;background:#ebe5d9;border-bottom:2px solid #101820;">
                        <p style="margin:0;font-size:13px;font-weight:800;color:#101820;">Payment Receipt</p>
                    </div>
                    <table style="width:100%;border-collapse:collapse;font-size:14px;">
                        <tr style="border-bottom:1px solid #d6cfc2;">
                            <td style="padding:12px 18px;color:#5e6773;font-weight:600;">Rental ID</td>
                            <td style="padding:12px 18px;text-align:right;font-weight:700;color:#101820;">${safeRentalId}</td>
                        </tr>
                        <tr style="border-bottom:1px solid #d6cfc2;">
                            <td style="padding:12px 18px;color:#5e6773;font-weight:600;">Compute Hours Used</td>
                            <td style="padding:12px 18px;text-align:right;font-weight:700;color:#101820;">${hoursUsed || 0} hours</td>
                        </tr>
                        <tr>
                            <td style="padding:12px 18px;color:#5e6773;font-weight:600;">Amount Paid</td>
                            <td style="padding:12px 18px;text-align:right;font-weight:900;color:#047857;font-size:16px;">${safeTotal}</td>
                        </tr>
                    </table>
                </div>

                <p style="margin:22px 0 0;font-size:13px;line-height:1.7;color:#5e6773;">Thank you for using DEV Infinity Cloud. You can rent again anytime from the <a href="https://devsoftwareai.live/dev/cloud" style="color:#2457ff;">cloud page</a>.</p>
            </div>
        </div>
    `;
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
        subject: `Your DEV Infinity Cloud usage bill — INR ${bd.totalINR.toLocaleString("en-IN")}`,
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
        subject: "DEV Infinity Cloud — Rental bill payment confirmed",
        text: `Hi ${name},\n\nPayment of INR ${totalPaid} received for rental ${rentalId}.\n\nCompute hours used: ${hoursUsed || 0}\nAmount paid: INR ${totalPaid}\n\nYour account is fully settled. Thank you!`,
        html: renderRentalBillPaidHtml({ name, rentalId, hoursUsed, totalPaid }),
    });
}

import { sendNewsletterMail } from "./newsletter";
import { RENTAL_CONFIG, getBillBreakdown } from "./rental-plans";
import { renderRentalActivatedHtml, renderRentalBillHtml, renderRentalBillPaidHtml } from "./rental-email-templates.mjs";
export { renderRentalActivatedHtml, renderRentalBillHtml, renderRentalBillPaidHtml } from "./rental-email-templates.mjs";

/**
 * Send the rental activation email.
 */
export async function sendRentalActivatedEmail({ to, name, rentalId, days, expiresAt }) {
    return sendNewsletterMail({
        to,
        subject: `Your DEV Infinity Cloud rental is now active (${days} days)`,
        text: `Hi ${name},\n\nYour ${days}-day cloud compute rental is now active (ID: ${rentalId}).\n\nAccess expires at: ${expiresAt ? new Date(expiresAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) : "N/A"}.\n\nUpfront fee: INR ${RENTAL_CONFIG.upfrontFeeINR}\nUsage billing: INR ${RENTAL_CONFIG.hourlyRateINR} per actual compute hour. INR ${RENTAL_CONFIG.computeRateINR} per ${RENTAL_CONFIG.computeHoursPerUnit} hours is a reference rate only; usage is not rounded up to a 20-hour block.\n\nYou will receive a detailed usage bill with a DEV Infinity payment portal link after your rental period ends.`,
        html: renderRentalActivatedHtml({ name, rentalId, days, expiresAt }),
    });
}

/**
 * Send the usage bill email with the DEV Infinity payment portal link.
 */
export async function sendRentalBillEmail({ to, name, rentalId, days, hoursUsed, billBreakdown, paymentUrl }) {
    const bd = billBreakdown || getBillBreakdown(hoursUsed || 0);
    return sendNewsletterMail({
        to,
        subject: `Your DEV Infinity Cloud usage bill \u2014 \u20B9${bd.totalINR.toLocaleString("en-IN")}`,
        text: `Hi ${name},\n\nYour ${days}-day cloud rental (ID: ${rentalId}) has ended.\n\nCompute hours used: ${bd.hoursUsed}\nReference rate: INR ${bd.baseRateINR ?? RENTAL_CONFIG.computeRateINR} per ${bd.baseHours ?? RENTAL_CONFIG.computeHoursPerUnit} hours (not a billing slab)\nActual usage rate: INR ${bd.hourlyRateINR ?? RENTAL_CONFIG.hourlyRateINR} per hour\nTotal due: INR ${bd.totalINR.toLocaleString("en-IN", { maximumFractionDigits: 2 })}\n\nPay securely here: ${paymentUrl}`,
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

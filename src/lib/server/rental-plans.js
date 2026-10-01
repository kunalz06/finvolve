/**
 * Rental (pay-as-you-go) configuration for DEV Infinity Cloud.
 * Users rent compute for a selected duration, pay a small upfront fee,
 * and are billed proportionally for actual compute-hours after usage.
 */

export const RENTAL_CONFIG = {
    /** One-time upfront fee before usage begins (INR) */
    upfrontFeeINR: 1,

    /** Reference price equivalent to 20 compute-hours (INR); not a billing slab */
    computeRateINR: 200,

    /** Number of compute-hours represented by the reference price */
    computeHoursPerUnit: 20,

    /** Effective prorated hourly price (INR) */
    hourlyRateINR: 10,

    /** Predefined rental duration options */
    timeOptions: [
        { days: 1, label: "1 Day", popular: false },
        { days: 3, label: "3 Days", popular: false },
        { days: 7, label: "7 Days", popular: true },
        { days: 15, label: "15 Days", popular: false },
        { days: 30, label: "30 Days", popular: false },
    ],
};

/**
 * Calculate the usage bill based on actual hours consumed.
 *
 * Pricing is proportional: ₹200 / 20 hours = ₹10 per hour.
 * The final INR amount is rounded to the nearest paisa so fractional
 * compute-hours remain billable without forcing customers into 20-hour slabs.
 */
export function calculateRentalBill(hoursUsed) {
    const hours = Number(hoursUsed);
    if (!Number.isFinite(hours) || hours <= 0) return 0;

    const hourlyRate =
        RENTAL_CONFIG.hourlyRateINR ||
        RENTAL_CONFIG.computeRateINR / RENTAL_CONFIG.computeHoursPerUnit;

    return Math.round(hours * hourlyRate * 100) / 100;
}

/**
 * Get a human-readable bill breakdown.
 */
export function getBillBreakdown(hoursUsed) {
    const hours = Number(hoursUsed);
    const normalizedHours = Number.isFinite(hours) && hours > 0 ? hours : 0;
    const hourlyRate =
        RENTAL_CONFIG.hourlyRateINR ||
        RENTAL_CONFIG.computeRateINR / RENTAL_CONFIG.computeHoursPerUnit;
    const totalINR = calculateRentalBill(normalizedHours);

    return {
        hoursUsed: normalizedHours,
        billingModel: "prorated",
        baseHours: RENTAL_CONFIG.computeHoursPerUnit,
        baseRateINR: RENTAL_CONFIG.computeRateINR,
        hourlyRateINR: hourlyRate,
        // Retained for backward compatibility with existing stored bill objects.
        units: normalizedHours / RENTAL_CONFIG.computeHoursPerUnit,
        ratePerUnit: RENTAL_CONFIG.computeRateINR,
        totalINR,
    };
}

/**
 * Decide whether a billed rental needs a fresh emailed portal link.
 * The link is only relevant when money is due. Missing, malformed, or
 * expired links are rotated before a bill email is sent again.
 */
export function shouldRefreshRentalPaymentLink({
    billAmountINR,
    paymentUrl,
    expiresAt,
    nowMs = Date.now(),
}) {
    const amount = Number(billAmountINR);
    if (!Number.isFinite(amount) || amount <= 0) return false;
    if (!paymentUrl) return true;

    let expiresAtMs = Number.NaN;
    if (typeof expiresAt?.toMillis === "function") {
        expiresAtMs = Number(expiresAt.toMillis());
    } else if (typeof expiresAt?.getTime === "function") {
        expiresAtMs = Number(expiresAt.getTime());
    } else if (typeof expiresAt === "number") {
        expiresAtMs = expiresAt;
    } else if (typeof expiresAt === "string") {
        expiresAtMs = Date.parse(expiresAt);
    }

    const comparisonNow = Number(nowMs);
    return (
        !Number.isFinite(expiresAtMs) ||
        !Number.isFinite(comparisonNow) ||
        expiresAtMs <= comparisonNow
    );
}

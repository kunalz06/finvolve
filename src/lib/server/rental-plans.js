/**
 * Rental (pay-as-you-go) configuration for DEV Infinity Cloud.
 * Users rent compute for a selected duration, pay a small upfront fee,
 * and are billed per compute-hours after usage.
 */

export const RENTAL_CONFIG = {
    /** One-time upfront fee before usage begins (INR) */
    upfrontFeeINR: 1,

    /** Cost per billing unit of compute (INR) */
    computeRateINR: 200,

    /** Number of compute-hours in one billing unit */
    computeHoursPerUnit: 20,

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
 * Calculate the usage bill based on hours consumed.
 * Billed in slabs of `computeHoursPerUnit` hours.
 * Partial slabs are rounded up.
 */
export function calculateRentalBill(hoursUsed) {
    if (!Number.isFinite(hoursUsed) || hoursUsed <= 0) return 0;
    const units = Math.ceil(hoursUsed / RENTAL_CONFIG.computeHoursPerUnit);
    return units * RENTAL_CONFIG.computeRateINR;
}

/**
 * Get a human-readable bill breakdown string.
 */
export function getBillBreakdown(hoursUsed) {
    const units = Math.ceil(hoursUsed / RENTAL_CONFIG.computeHoursPerUnit);
    return {
        hoursUsed,
        units,
        ratePerUnit: RENTAL_CONFIG.computeRateINR,
        totalINR: units * RENTAL_CONFIG.computeRateINR,
    };
}

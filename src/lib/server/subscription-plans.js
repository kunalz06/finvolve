/**
 * Subscription plan definitions for DEV Infinity Cloud.
 * Each tier defines monthly recurring price, one-time setup fee,
 * compute hours, and AI model API access.
 */

export const SUBSCRIPTION_TIERS = {
  base: {
    id: "base",
    name: "Starter",
    monthlyAmountINR: 200,
    setupFeeINR: 100,
    billingPeriodDays: 15,
    description: "DEV Infinity Cloud — Starter Plan",
    computeHours: {
      total: 300,
      perHalf: 150,
      restricted: true, // 150 for first half, 150 for second half
    },
    apiAccess: {
      freeLLMs: true,
      gpt: false,
      gptHours: 0,
      gemini: false,
      geminiHours: 0,
      claude: false,
      claudeHours: 0,
    },
    features: [
      "300 hours compute engine (split monthly)",
      "Free LLM API access",
      "Community support",
      "Basic monitoring dashboard",
      "Email support",
    ],
    highlight: false,
    color: "var(--primary)",
  },
  medium: {
    id: "medium",
    name: "Pro",
    monthlyAmountINR: 12900,
    setupFeeINR: 1000,
    description: "DEV Infinity Cloud — Pro Plan",
    computeHours: {
      total: 600,
      perHalf: 600,
      restricted: false,
    },
    apiAccess: {
      freeLLMs: true,
      gpt: true,
      gptHours: 250,
      gemini: true,
      geminiHours: 450,
      claude: false,
      claudeHours: 0,
    },
    features: [
      "600 hours compute engine (unrestricted)",
      "ChatGPT API — 250 hours",
      "Google Gemini API — 450 hours",
      "Free LLM API access",
      "Priority email & chat support",
      "Advanced monitoring dashboard",
    ],
    highlight: true,
    color: "var(--accent)",
  },
  highest: {
    id: "highest",
    name: "Enterprise",
    monthlyAmountINR: 17900,
    setupFeeINR: 1200,
    description: "DEV Infinity Cloud — Enterprise Plan",
    computeHours: {
      total: 1000,
      perHalf: 1000,
      restricted: false,
      dedicatedGPU: true,
    },
    apiAccess: {
      freeLLMs: true,
      gpt: true,
      gptHours: 250,
      gemini: true,
      geminiHours: 450,
      claude: true,
      claudeHours: 0, // unlimited in enterprise
    },
    features: [
      "1000 hours dedicated compute engine",
      "Dedicated GPU access",
      "MATLAB & premium software suite",
      "ChatGPT API — 250 hours",
      "Google Gemini API — 450 hours",
      "Claude Models API access",
      "Free LLM API access",
      "Dedicated account manager",
      "24/7 priority support",
      "Custom SLA",
    ],
    highlight: false,
    color: "var(--accent-cool)",
  },
};

export const VALID_TIERS = Object.keys(SUBSCRIPTION_TIERS);

export const SUBSCRIPTION_TOTAL_CYCLES = 12; // 12-month subscription

export function getPlan(tier) {
  return SUBSCRIPTION_TIERS[tier] || null;
}

export function getPlanAmountPaise(tier) {
  const plan = getPlan(tier);
  return plan ? plan.monthlyAmountINR * 100 : 0;
}

export function getSetupFeePaise(tier) {
  const plan = getPlan(tier);
  return plan ? plan.setupFeeINR * 100 : 0;
}

/**
 * Structured action detection for the DEV Infinity assistant.
 * Read-only navigation may run immediately. Record-creating actions are always
 * returned as pending confirmations and executed by the server action route.
 */

const NAV_TARGETS = [
  {
    href: "/dev/cloud/dashboard#manage-subscription",
    label: "Manage subscription",
    terms: ["cloud dashboard", "subscription dashboard", "manage subscription", "my subscription"],
  },
  {
    href: "/dev/cloud/dashboard#usage",
    label: "Cloud usage",
    terms: ["compute usage", "api usage", "usage dashboard", "my usage", "usage limits"],
  },
  {
    href: "/dev/cloud#plans",
    label: "Cloud plans",
    terms: ["cloud plans", "subscription plans", "cloud pricing", "pricing plans", "compare plans"],
  },
  {
    href: "/dev/cloud#rent-services",
    label: "Cloud Rent",
    terms: ["rent services", "cloud rental", "rent compute", "rental"],
  },
  {
    href: "/dev/cloud#cloud-faq",
    label: "Cloud FAQ",
    terms: ["cloud faq", "cloud questions", "cloud help"],
  },
  {
    href: "/dev/request#project-wizard",
    label: "Project request",
    terms: ["project request", "request form", "project form", "project wizard", "quote"],
  },
  {
    href: "/dev/contact#contact-form",
    label: "Contact form",
    terms: ["contact form", "contact page", "contact"],
  },
  {
    href: "/dev/terms#subscriptions",
    label: "Cloud subscription terms",
    terms: ["subscription terms", "cloud terms", "cloud subscription terms"],
  },
  {
    href: "/dev/terms#rent-services",
    label: "Cloud Rent terms",
    terms: ["rental terms", "rent terms"],
  },
  {
    href: "/dev/terms#payments",
    label: "Payment terms",
    terms: ["payment terms", "billing terms"],
  },
  { href: "/dev/services", label: "Services", terms: ["services", "service page", "what you build"] },
  { href: "/dev/cloud", label: "Cloud", terms: ["cloud"] },
  { href: "/dev/quick-start", label: "Quick Start", terms: ["quick start"] },
  { href: "/dev/about", label: "About", terms: ["about us", "about", "team"] },
  { href: "/dev/payments", label: "Payments", terms: ["payment page", "payments"] },
  { href: "/dev/terms", label: "Terms", terms: ["terms of service", "terms"] },
  { href: "/dev/privacy-policy", label: "Privacy policy", terms: ["privacy policy", "privacy"] },
];

const NAV_VERBS = /\b(open|go to|take me to|navigate to|show me|visit|bring me to|view|jump to|scroll to)\b/i;
const SEND_VERBS = /\b(send|submit|share|forward|deliver|file|create|message|email)\b/i;
const TEAM_TERMS = /\b(team|support|sales|dev infinity|developer|developers)\b/i;
const PROJECT_TERMS = /\b(project request|project brief|project details|proposal|quote request|project inquiry)\b/i;

function includesTerm(text, term) {
  return text === term || text.includes(term);
}

function bestNavigationTarget(normalized) {
  const matches = [];

  for (const entry of NAV_TARGETS) {
    for (const term of entry.terms) {
      if (includesTerm(normalized, term)) {
        matches.push({ entry, score: term.length });
      }
    }
  }

  matches.sort((a, b) => b.score - a.score);
  return matches[0]?.entry || null;
}

export function detectNavigationCommand(text) {
  const normalized = String(text || "").trim().toLowerCase();
  if (!NAV_VERBS.test(normalized)) return null;

  const target = bestNavigationTarget(normalized);
  if (!target) return null;

  return {
    type: "navigate",
    label: target.label,
    href: target.href,
    requiresConfirmation: false,
  };
}

export function detectSubscriptionHelpCommand(text) {
  const normalized = String(text || "").trim().toLowerCase();
  const isCloudContext = /\b(cloud|subscription|plan|compute|api|billing|renewal|usage)\b/.test(normalized);
  if (!isCloudContext) return null;

  const cases = [
    {
      mode: "manage",
      pattern: /\b(manage|open|view)\b.*\b(subscription|cloud account|cloud dashboard)\b|\b(subscription|cloud account)\b.*\b(manage|settings)\b/,
      href: "/dev/cloud/dashboard#manage-subscription",
      label: "Manage subscription",
      text: "I’ll take you to **Manage Subscription**. Load your Cloud account there to see the actions available for its current state.",
    },
    {
      mode: "cancel",
      pattern: /\b(cancel|end|stop)\b.*\b(subscription|plan|cloud)\b|\b(subscription|plan)\b.*\bcancel\b/,
      href: "/dev/cloud/dashboard#manage-subscription",
      label: "Cancel subscription",
      text: "I’ll take you to **Manage Subscription**. Load your Cloud account there, review the current status, then use **Cancel** so the account checks happen in the dashboard.",
    },
    {
      mode: "pause",
      pattern: /\bpause\b.*\b(subscription|plan|cloud)\b|\b(subscription|plan)\b.*\bpause\b/,
      href: "/dev/cloud/dashboard#manage-subscription",
      label: "Pause subscription",
      text: "I’ll open **Manage Subscription**. After you load your Cloud account, use **Pause** to pause the active subscription safely.",
    },
    {
      mode: "resume",
      pattern: /\b(resume|unpause|restart)\b.*\b(subscription|plan|cloud)\b|\b(subscription|plan)\b.*\b(resume|unpause|restart)\b/,
      href: "/dev/cloud/dashboard#manage-subscription",
      label: "Resume subscription",
      text: "I’ll open **Manage Subscription**. Load your Cloud account and use **Resume** if the subscription is currently paused.",
    },
    {
      mode: "change_plan",
      pattern: /\b(change|switch|upgrade|downgrade)\b.*\b(plan|tier|subscription)\b|\b(plan|tier)\b.*\b(change|switch|upgrade|downgrade)\b/,
      href: "/dev/cloud/dashboard#manage-subscription",
      label: "Change Cloud plan",
      text: "I’ll take you to **Manage Subscription**. Load your account and choose **Change Plan** to see the tiers available for your current subscription.",
    },
    {
      mode: "usage",
      pattern: /\b(usage|used|remaining|left|quota|limit|compute hours?|api usage|tokens?)\b/,
      href: "/dev/cloud/dashboard#usage",
      label: "Cloud usage",
      text: "I’ll take you to your **Cloud usage** area, where compute and API usage are shown after you load the subscription.",
    },
    {
      mode: "plans",
      pattern: /\b(compare|pricing|price|cost|plans?|tiers?|subscribe|subscription options?)\b/,
      href: "/dev/cloud#plans",
      label: "Cloud plans",
      text: "I’ll open the **Cloud plans** section so you can compare pricing, compute allowances, and API access side by side.",
    },
  ];

  const matched = cases.find((entry) => entry.pattern.test(normalized));
  if (!matched) return null;

  return {
    type: "subscription_help",
    requiresConfirmation: false,
    ...matched,
  };
}

export function detectWriteActionCommand(text, memory = {}) {
  const normalized = String(text || "").trim().toLowerCase();
  if (!SEND_VERBS.test(normalized)) return null;

  if (PROJECT_TERMS.test(normalized)) {
    return buildProjectAction(memory);
  }

  if (TEAM_TERMS.test(normalized) || /\b(message|note|email)\b/i.test(normalized)) {
    return buildContactAction(memory);
  }

  return null;
}

export function buildContactAction(memory = {}) {
  const missing = [];
  if (!memory.name) missing.push("name");
  if (!memory.email) missing.push("email");
  if (!memory.contactMessage) missing.push("message");

  if (missing.length) {
    return {
      type: "contact_message",
      requiresConfirmation: true,
      ready: false,
      missing,
    };
  }

  return {
    type: "contact_message",
    title: "Send this message",
    description: "DEV Infinity will receive this as a contact message. Review the details before sending.",
    confirmLabel: "Send message",
    requiresConfirmation: true,
    ready: true,
    payload: {
      name: memory.name,
      email: memory.email,
      message: memory.contactMessage,
    },
    summary: [
      { label: "Name", value: memory.name },
      { label: "Reply email", value: memory.email },
      { label: "Message", value: memory.contactMessage },
    ],
  };
}

export function buildProjectAction(memory = {}) {
  const missing = [];
  if (!memory.name) missing.push("name");
  if (!memory.email) missing.push("email");
  if (!memory.projectType) missing.push("project type");
  if (!memory.timeline) missing.push("timeline");
  if (!memory.budget) missing.push("budget");
  if (!memory.projectDescription) missing.push("project description");

  if (missing.length) {
    return {
      type: "project_request",
      requiresConfirmation: true,
      ready: false,
      missing,
    };
  }

  return {
    type: "project_request",
    title: "Submit this project brief",
    description: "This creates a project request for the DEV Infinity team. Review the brief before submitting.",
    confirmLabel: "Submit request",
    requiresConfirmation: true,
    ready: true,
    payload: {
      name: memory.name,
      email: memory.email,
      projectType: memory.projectType,
      timeline: memory.timeline,
      budget: memory.budget,
      description: memory.projectDescription,
    },
    summary: [
      { label: "Name", value: memory.name },
      { label: "Reply email", value: memory.email },
      { label: "Project", value: memory.projectType },
      { label: "Timeline", value: memory.timeline },
      { label: "Budget", value: memory.budget },
      { label: "Brief", value: memory.projectDescription },
    ],
  };
}

export function actionMissingPrompt(action) {
  const field = action?.missing?.[0];
  if (!field) return null;

  const projectPrompts = {
    name: "What name should I put on the project request?",
    email: "What email should the team use to reply?",
    "project type": "What are you building — a web platform, mobile app, AI solution, or something else?",
    timeline: "What timeline are you aiming for?",
    budget: "What budget range should I attach to the request?",
    "project description": "What should the product do? A concise brief is enough.",
  };

  const contactPrompts = {
    name: "What name should I attach to the message?",
    email: "What email should the team reply to?",
    message: "What would you like me to send to the team?",
  };

  const prompt = action.type === "project_request"
    ? projectPrompts[field]
    : contactPrompts[field];

  return prompt || "What detail should I add before I continue?";
}

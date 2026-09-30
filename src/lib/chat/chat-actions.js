/**
 * Structured action detection for the DEV Infinity assistant.
 * Read-only navigation may run immediately. Record-creating actions are always
 * returned as pending confirmations and executed by the server action route.
 */

const NAV_TARGETS = [
  { href: "/dev/services", label: "Services", terms: ["services", "service page", "what you build"] },
  { href: "/dev/cloud", label: "Cloud plans", terms: ["cloud", "cloud plans", "plans", "subscriptions", "rental"] },
  { href: "/dev/cloud/dashboard", label: "Cloud dashboard", terms: ["cloud dashboard", "dashboard"] },
  { href: "/dev/request", label: "Project request", terms: ["project request", "request form", "project form", "quote"] },
  { href: "/dev/quick-start", label: "Quick Start", terms: ["quick start"] },
  { href: "/dev/contact", label: "Contact", terms: ["contact", "contact page"] },
  { href: "/dev/about", label: "About", terms: ["about", "about us", "team"] },
  { href: "/dev/payments", label: "Payments", terms: ["payments", "payment page"] },
  { href: "/dev/terms", label: "Terms", terms: ["terms", "terms of service"] },
  { href: "/dev/privacy-policy", label: "Privacy policy", terms: ["privacy", "privacy policy"] },
];

const NAV_VERBS = /\b(open|go to|take me to|navigate to|show me the|visit|bring me to|view)\b/i;
const SEND_VERBS = /\b(send|submit|share|forward|deliver)\b/i;
const TEAM_TERMS = /\b(team|support|sales|dev infinity|developer|developers)\b/i;
const PROJECT_TERMS = /\b(project request|project brief|project details|proposal|quote request)\b/i;

function includesTerm(text, term) {
  return text === term || text.includes(term);
}

export function detectNavigationCommand(text) {
  const normalized = String(text || "").trim().toLowerCase();
  if (!NAV_VERBS.test(normalized)) return null;

  const target = NAV_TARGETS.find((entry) => entry.terms.some((term) => includesTerm(normalized, term)));
  if (!target) return null;

  return {
    type: "navigate",
    label: target.label,
    href: target.href,
    requiresConfirmation: false,
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
    title: "Send message to DEV Infinity",
    description: "This creates a contact message for the team. Nothing is sent until you confirm.",
    requiresConfirmation: true,
    ready: true,
    payload: {
      name: memory.name,
      email: memory.email,
      message: memory.contactMessage,
    },
    summary: [
      { label: "Name", value: memory.name },
      { label: "Email", value: memory.email },
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
    title: "Submit project request",
    description: "This creates a project request for the DEV Infinity team and may send an acknowledgement email.",
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
      { label: "Email", value: memory.email },
      { label: "Project", value: memory.projectType },
      { label: "Timeline", value: memory.timeline },
      { label: "Budget", value: memory.budget },
      { label: "Brief", value: memory.projectDescription },
    ],
  };
}

export function actionMissingPrompt(action) {
  if (!action?.missing?.length) return null;
  const readable = action.missing.join(", ");
  if (action.type === "project_request") {
    return `I can submit that project request for you. I still need: **${readable}**. You can provide those details naturally in one message or over a few messages.`;
  }
  return `I can send that message to the team. I still need: **${readable}**. You can give me those details naturally.`;
}

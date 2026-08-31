/**
 * DEV∞ Chatbot — Main Engine v2
 * Orchestrates: ML inference → keyword match → knowledge lookup → action flows → context tracking
 */

import { predict, loadModel } from "./chat-inference";
import {
  KNOWLEDGE,
  QUICK_REPLY_ROUTES,
  FALLBACK_RESPONSES,
  KEYWORD_INTENTS,
  HUMAN_HANDOFF_THRESHOLD,
  getText,
} from "./chat-knowledge";

// ── State machine for multi-turn flows ───────────────────────────

const FLOW_STATES = {
  IDLE: "idle",
  COLLECT_MSG_NAME: "collect_msg_name",
  COLLECT_MSG_EMAIL: "collect_msg_email",
  COLLECT_MSG_BODY: "collect_msg_body",
  COLLECT_PROJECT_TYPE: "collect_project_type",
  COLLECT_TIMELINE: "collect_timeline",
  COLLECT_BUDGET: "collect_budget",
};

// ── Entity extraction (regex-based hybrid) ───────────────────────

function extractEntities(text) {
  const entities = {};
  const lower = text.toLowerCase();

  // Project type
  const typePatterns = [
    { pattern: /\b(web\s*(?:app|site|platform|application|portal|page)|website|frontend|next\.?js|react|landing\s*page)/i, value: "Web Platform" },
    { pattern: /\b(mobile|android|ios|iphone|ipad|app\s*(?:dev)?|react\s*native|flutter|phone|smartphone)/i, value: "Mobile App" },
    { pattern: /\b(ai|artificial\s*intelligence|machine\s*learning|ml|nlp|computer\s*vision|chatbot|deep\s*learning|llm|gpt|claude|gemini)/i, value: "AI Solution" },
    { pattern: /\b(custom\s*(?:software|solution|app)|saas|crm|erp|dashboard|automation|internal\s*tool|enterprise\s*software)/i, value: "Custom Software" },
  ];
  for (const { pattern, value } of typePatterns) {
    if (pattern.test(text)) {
      entities.projectType = value;
      break;
    }
  }

  // Timeline
  const timelinePatterns = [
    { pattern: /\b(1|one)\s*(?:week|wk)/i, value: "1-2 weeks" },
    { pattern: /\b(2|two)\s*(?:week|wk)/i, value: "2-4 weeks" },
    { pattern: /\b(3|three)\s*(?:week|wk)/i, value: "2-4 weeks" },
    { pattern: /\b(4|four)\s*(?:week|wk)/i, value: "4-8 weeks" },
    { pattern: /\b([5-8]|five|six|seven|eight)\s*(?:week|wk)s?/i, value: "4-8 weeks" },
    { pattern: /\b(1[0-2]|ten|eleven|twelve|1\s*month|a\s*month)\s*(?:week|wk)?s?/i, value: "8-12 weeks" },
    { pattern: /\b(1[3-9]|2[0-4]|two\s*to\s*four\s*month|2\s*to\s*4\s*month|couple\s*of\s*month)s?/i, value: "12-16 weeks" },
    { pattern: /\b(6\s*month|six\s*month|half\s*year|24\s*week)/i, value: "16-24 weeks" },
    { pattern: /\b(urgent|asap|rush|immediate)/i, value: "1-2 weeks" },
  ];
  for (const { pattern, value } of timelinePatterns) {
    if (pattern.test(text)) {
      entities.timeline = value;
      break;
    }
  }

  // Budget
  const budgetPatterns = [
    { pattern: /\b(?:₹|rs\.?|inr\s*)\s*([\d,]+)\s*(?:k|thousand)/i, value: () => `<₹5,000 (MVP)` },
    { pattern: /\bless\s*than\s*(?:₹|rs\.?|inr)\s*5[,.]?0?00/i, value: () => `<₹5,000 (MVP)` },
    { pattern: /\b(?:₹|rs\.?|inr\s*)\s*([\d,]+)\s*(?:k|thousand)/i, value: (m) => { const num = parseInt(m[1].replace(",", "")); if (num >= 5 && num <= 20) return `₹5,000-₹20,000 (Full Build)`; if (num > 20 && num <= 50) return `₹20,000-₹50,000 (Enterprise)`; if (num > 50) return `₹50,000+ (Complex)`; return `₹5,000-₹20,000 (Full Build)`; } },
    { pattern: /\b(?:₹|rs\.?|inr\s*)\s*([\d,]+)(?!\s*k)(?!\s*lakh)/i, value: (m) => { const num = parseInt(m[1].replace(",", "")); if (num < 5000) return `<₹5,000 (MVP)`; if (num <= 20000) return `₹5,000-₹20,000 (Full Build)`; if (num <= 50000) return `₹20,000-₹50,000 (Enterprise)`; return `₹50,000+ (Complex)`; } },
    { pattern: /\b(₹?\s*[\d,]+\s*lakh)/i, value: () => `₹50,000+ (Complex)` },
    { pattern: /\b(low\s*budget|cheap|affordable|minimum|small)/i, value: () => `<₹5,000 (MVP)` },
    { pattern: /\b(medium\s*budget|moderate|reasonable|decent)/i, value: () => `₹5,000-₹20,000 (Full Build)` },
    { pattern: /\b(high\s*budget|premium|enterprise|large\s*project|complex)/i, value: () => `₹50,000+ (Complex)` },
  ];
  for (const { pattern, value } of budgetPatterns) {
    const match = text.match(pattern);
    if (match) {
      entities.budget = typeof value === "function" ? value(match) : value;
      break;
    }
  }

  return entities;
}

// ── Keyword matching for intents not in the ML model ──────────

function matchKeywords(text) {
  const lower = text.toLowerCase();
  for (const [intent, keywords] of Object.entries(KEYWORD_INTENTS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        return intent;
      }
    }
  }
  return null;
}

// ── Main Engine ──────────────────────────────────────────────────

export class ChatEngine {
  constructor() {
    this.model = null;
    this.modelReady = false;
    this.history = [];
    this.flowState = FLOW_STATES.IDLE;
    this.flowData = {};
    this.fallbackCount = 0;
    this.lastTopic = null;
  }

  async init() {
    if (this.modelReady) return;
    this.model = await loadModel();
    this.modelReady = !!this.model;
  }

  /**
   * Process a user message and return a bot response
   */
  async processMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return this.fallback();

    // If in a multi-turn flow, handle flow state first
    if (this.flowState !== FLOW_STATES.IDLE) {
      return this.handleFlowInput(trimmed);
    }

    // 1. ML inference
    let intent = null;
    if (this.modelReady) {
      intent = predict(trimmed, this.model);
    }

    // 2. High confidence ML → serve knowledge response
    if (intent && intent.confidence >= 0.5) {
      return this.serveIntent(intent.tag, trimmed, intent.confidence);
    }

    // 3. Medium confidence ML → try anyway
    if (intent && intent.confidence >= 0.3) {
      const entry = KNOWLEDGE[intent.tag];
      if (entry) {
        return this.serveIntent(intent.tag, trimmed, intent.confidence);
      }
    }

    // 4. Keyword matching (for intents not in ML model)
    const kwIntent = matchKeywords(trimmed);
    if (kwIntent && KNOWLEDGE[kwIntent]) {
      return this.serveIntent(kwIntent, trimmed, 0.6);
    }

    // 5. Context-aware follow-ups
    const contextResult = this.handleContext(trimmed);
    if (contextResult) return contextResult;

    // 6. Entity-rich project request in free text
    const entities = extractEntities(trimmed);
    if (entities.projectType) {
      this.flowData = { ...this.flowData, ...entities };
      this.history.push({ role: "user", text: trimmed, entities });
      return this.handleProjectEntityExtraction(entities);
    }

    // 7. Fallback with human handoff check
    this.fallbackCount++;
    this.history.push({ role: "user", text: trimmed, intent: "unknown" });

    // Human handoff after consecutive fallbacks
    if (this.fallbackCount >= HUMAN_HANDOFF_THRESHOLD) {
      this.fallbackCount = 0;
      const entry = KNOWLEDGE.human_handoff;
      return {
        text: getText(entry),
        quickReplies: entry.quickReplies || [],
        cards: entry.cards || null,
        links: entry.links || null,
        confidence: 0,
        action: "human_handoff",
      };
    }

    return this.fallback();
  }

  /**
   * Serve a matched intent response
   */
  serveIntent(tag, userText, confidence) {
    this.lastTopic = tag;
    this.fallbackCount = 0;
    this.history.push({ role: "user", text: userText, intent: tag });

    const entry = KNOWLEDGE[tag];
    if (!entry) return this.fallback();

    return {
      text: getText(entry),
      quickReplies: entry.quickReplies || [],
      cards: entry.cards || null,
      links: entry.links || null,
      action: entry.action || null,
      confidence,
    };
  }

  /**
   * Handle entity extraction for project requests
   */
  handleProjectEntityExtraction(entities) {
    const type = entities.projectType;
    let response = `A **${type}** project — great choice! `;

    if (entities.timeline) {
      response += `I see you're looking at a **${entities.timeline}** timeline. `;
      if (entities.budget) {
        response += `And a budget around **${entities.budget}**. That gives me a good picture!\n\nWant me to take you to the full project request form where you can share more details?`;
        this.flowState = FLOW_STATES.IDLE;
        return { text: response, quickReplies: ["Yes, take me there", "I want to add more"], action: "suggest_project_form" };
      }
      response += "Do you have a budget range in mind?";
      return { text: response, quickReplies: ["<₹5,000 (MVP)", "₹5k-₹20k (Full Build)", "₹20k-₹50k (Enterprise)", "₹50,000+ (Complex)"] };
    }

    response += "What's your preferred timeline?";
    return { text: response, quickReplies: ["1-2 weeks", "2-4 weeks", "4-8 weeks", "8-12 weeks", "16-24 weeks"] };
  }

  /**
   * Handle quick reply button presses
   */
  handleQuickReply(label) {
    const route = QUICK_REPLY_ROUTES[label];
    if (!route) {
      return this.processMessage(label);
    }

    if (route.link) {
      return { text: `Taking you to **${label}**...`, quickReplies: [], link: route.link, action: "navigate" };
    }

    if (route.override) {
      this.history.push({ role: "user", text: label, intent: "quick_reply" });
      const qr = KNOWLEDGE[route.intent]?.quickReplies || [];
      const cards = KNOWLEDGE[route.intent]?.cards || null;
      const links = KNOWLEDGE[route.intent]?.links || null;
      return { text: route.override, quickReplies: qr, cards, links };
    }

    if (route.action) {
      return this.handleAction(route.action, route.value);
    }

    if (route.intent) {
      const entry = KNOWLEDGE[route.intent];
      if (entry) {
        this.history.push({ role: "user", text: label, intent: route.intent });
        return { text: getText(entry), quickReplies: entry.quickReplies, cards: entry.cards || null, links: entry.links || null, action: entry.action || null };
      }
    }

    return this.fallback();
  }

  /**
   * Handle actions triggered by intents or quick replies
   */
  handleAction(action, value) {
    switch (action) {
      case "start_message_flow":
        this.flowState = FLOW_STATES.COLLECT_MSG_NAME;
        this.flowData = {};
        return {
          text: "Sure! Let me collect a few details so the team gets back to you.\n\n**What's your name?**",
          quickReplies: [],
          action: "flow_active",
        };

      case "set_project_type":
        this.flowState = FLOW_STATES.COLLECT_TIMELINE;
        this.flowData.projectType = value;
        return {
          text: `A **${value}** project — great choice!\n\nWhat's your preferred timeline?`,
          quickReplies: ["1-2 weeks", "2-4 weeks", "4-8 weeks", "8-12 weeks", "16-24 weeks"],
          action: "flow_active",
        };

      case "suggest_project_form":
        return {
          text: "Let me take you to the project request form where you can share all the details.",
          quickReplies: [],
          link: "/dev/request",
          action: "navigate",
        };

      case "start_project_flow":
        this.flowState = FLOW_STATES.COLLECT_PROJECT_TYPE;
        this.flowData = {};
        return {
          text: "I'll walk you through a quick brief.\n\n**What type of project are you looking to build?**",
          quickReplies: ["Web Platform", "Mobile App", "Custom Software", "AI Solution"],
          action: "flow_active",
        };

      default:
        return this.fallback();
    }
  }

  /**
   * Handle multi-turn flow input based on current state
   */
  handleFlowInput(text) {
    switch (this.flowState) {
      case FLOW_STATES.COLLECT_MSG_NAME:
        this.flowData.name = text;
        this.flowState = FLOW_STATES.COLLECT_MSG_EMAIL;
        return {
          text: `Thanks, **${text}**! What's your email address?`,
          quickReplies: [],
          action: "flow_active",
        };

      case FLOW_STATES.COLLECT_MSG_EMAIL: {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(text)) {
          return {
            text: "That doesn't look like a valid email. Could you try again?",
            quickReplies: [],
            action: "flow_active",
          };
        }
        this.flowData.email = text;
        this.flowState = FLOW_STATES.COLLECT_MSG_BODY;
        return {
          text: "Got it. What would you like to tell the team?",
          quickReplies: [],
          action: "flow_active",
        };
      }

      case FLOW_STATES.COLLECT_MSG_BODY:
        this.flowData.message = text;
        this.flowState = FLOW_STATES.IDLE;
        this.history.push({ role: "user", text, intent: "contact_message" });
        const msgData = { ...this.flowData };
        this.flowData = {};
        return {
          text: "Your message has been sent! The team will get back to you within **24 hours** at the email you provided.\n\nAnything else I can help with?",
          quickReplies: ["Cloud Plans", "Our Services", "That's all"],
          action: "message_sent",
          actionData: msgData,
        };

      case FLOW_STATES.COLLECT_PROJECT_TYPE: {
        this.flowData.projectType = text;
        this.flowState = FLOW_STATES.COLLECT_TIMELINE;
        return {
          text: `A **${text}** — great choice! What's your preferred timeline?`,
          quickReplies: ["1-2 weeks", "2-4 weeks", "4-8 weeks", "8-12 weeks", "16-24 weeks"],
          action: "flow_active",
        };
      }

      case FLOW_STATES.COLLECT_TIMELINE:
        this.flowData.timeline = text;
        this.flowState = FLOW_STATES.COLLECT_BUDGET;
        return {
          text: `**${text}** — noted. And what's your budget range?`,
          quickReplies: ["<₹5,000 (MVP)", "₹5k-₹20k (Full Build)", "₹20k-₹50k (Enterprise)", "₹50,000+ (Complex)"],
          action: "flow_active",
        };

      case FLOW_STATES.COLLECT_BUDGET:
        this.flowData.budget = text;
        this.flowState = FLOW_STATES.IDLE;
        this.history.push({ role: "user", text, intent: "project_request" });
        const projectData = { ...this.flowData };
        this.flowData = {};
        return {
          text: `Here's your project brief:\n\n• **Type:** ${projectData.projectType}\n• **Timeline:** ${projectData.timeline}\n• **Budget:** ${projectData.budget}\n\nWant me to take you to the full project request form to add more details and submit?`,
          quickReplies: ["Yes, take me there", "Contact Us Instead"],
          action: "project_brief_complete",
          actionData: projectData,
        };

      default:
        this.flowState = FLOW_STATES.IDLE;
        return this.processMessage(text);
    }
  }

  /**
   * Handle context-aware follow-ups
   */
  handleContext(text) {
    const lower = text.toLowerCase();

    if (/^(tell me more|more details?|more info|elaborate|tell me about that|can you elaborate)/.test(lower)) {
      if (this.lastTopic) {
        const entry = KNOWLEDGE[this.lastTopic];
        if (entry) {
          this.history.push({ role: "user", text, intent: this.lastTopic });
          return { text: getText(entry), quickReplies: entry.quickReplies || [], links: entry.links || null, cards: entry.cards || null };
        }
      }
    }

    if (/^(yes|yeah|yep|sure|ok|okay|yup|please|let's go|lets go)/.test(lower)) {
      const last = this.history[this.history.length - 1];
      if (last?.intent === "project_request") {
        return {
          text: "Let me take you to the project request form.",
          quickReplies: [],
          link: "/dev/request",
          action: "navigate",
        };
      }
    }

    if (/^(no|nope|nah|contact us instead|talk to someone|human|real person)/.test(lower)) {
      const entry = KNOWLEDGE.human_handoff;
      return {
        text: getText(entry),
        quickReplies: entry.quickReplies || [],
        cards: entry.cards || null,
        link: "/dev/contact",
        action: "navigate",
      };
    }

    return null;
  }

  /**
   * Fallback response with rotating messages
   */
  fallback() {
    const idx = Math.min(this.fallbackCount - 1, FALLBACK_RESPONSES.length - 1);
    const fb = FALLBACK_RESPONSES[idx];
    return {
      text: fb.texts ? fb.texts[0] : (fb.text || ""),
      quickReplies: fb.quickReplies || [],
      confidence: 0,
    };
  }

  cancelFlow() {
    this.flowState = FLOW_STATES.IDLE;
    this.flowData = {};
  }

  get isInFlow() {
    return this.flowState !== FLOW_STATES.IDLE;
  }
}

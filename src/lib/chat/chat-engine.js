/**
 * DEV Infinity Chatbot — Context-aware engine
 * Hybrid ML + keyword inference + durable conversation memory + safe actions.
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
import {
  detectNavigationCommand,
  detectWriteActionCommand,
  buildContactAction,
  buildProjectAction,
  actionMissingPrompt,
} from "./chat-actions";

const FLOW_STATES = {
  IDLE: "idle",
  COLLECT_MSG_NAME: "collect_msg_name",
  COLLECT_MSG_EMAIL: "collect_msg_email",
  COLLECT_MSG_BODY: "collect_msg_body",
  COLLECT_PROJECT_TYPE: "collect_project_type",
  COLLECT_TIMELINE: "collect_timeline",
  COLLECT_BUDGET: "collect_budget",
  COLLECT_PROJECT_DESCRIPTION: "collect_project_description",
  COLLECT_PROJECT_NAME: "collect_project_name",
  COLLECT_PROJECT_EMAIL: "collect_project_email",
};

const CANCEL_RE = /^(cancel|stop|never mind|nevermind|forget it|exit|quit)$/i;

function extractEntities(text) {
  const entities = {};
  const value = String(text || "").trim();

  const typePatterns = [
    { pattern: /\b(web\s*(?:app|site|platform|application|portal|page)|website|frontend|next\.?js|react|landing\s*page)/i, value: "Web Platform" },
    { pattern: /\b(mobile|android|ios|iphone|ipad|react\s*native|flutter|mobile\s*app)/i, value: "Mobile App" },
    { pattern: /\b(ai|artificial\s*intelligence|machine\s*learning|\bml\b|nlp|computer\s*vision|chatbot|deep\s*learning|llm|gpt|claude|gemini)/i, value: "AI Solution" },
    { pattern: /\b(custom\s*(?:software|solution|app)|saas|crm|erp|dashboard|automation|internal\s*tool|enterprise\s*software)/i, value: "Custom Software" },
  ];
  for (const item of typePatterns) {
    if (item.pattern.test(value)) {
      entities.projectType = item.value;
      break;
    }
  }

  const timelinePatterns = [
    { pattern: /\b(1|one)\s*(?:week|wk)s?\b/i, value: "1-2 weeks" },
    { pattern: /\b(2|two|3|three)\s*(?:week|wk)s?\b/i, value: "2-4 weeks" },
    { pattern: /\b(4|four|5|five|6|six|7|seven|8|eight)\s*(?:week|wk)s?\b/i, value: "4-8 weeks" },
    { pattern: /\b(9|nine|10|ten|11|eleven|12|twelve)\s*(?:week|wk)s?\b/i, value: "8-12 weeks" },
    { pattern: /\b(1|one)\s*month\b/i, value: "4-8 weeks" },
    { pattern: /\b(2|two|3|three)\s*months?\b/i, value: "8-12 weeks" },
    { pattern: /\b(4|four|5|five|6|six)\s*months?\b/i, value: "16-24 weeks" },
    { pattern: /\b(urgent|asap|rush|immediate)\b/i, value: "1-2 weeks" },
  ];
  for (const item of timelinePatterns) {
    if (item.pattern.test(value)) {
      entities.timeline = item.value;
      break;
    }
  }

  const budgetMatch = value.match(/(?:₹|rs\.?|inr)\s*([\d,.]+)\s*(k|thousand|lakh)?/i);
  if (budgetMatch) {
    let amount = Number(String(budgetMatch[1]).replace(/,/g, ""));
    const unit = (budgetMatch[2] || "").toLowerCase();
    if (unit === "k" || unit === "thousand") amount *= 1000;
    if (unit === "lakh") amount *= 100000;
    if (Number.isFinite(amount)) {
      if (amount < 5000) entities.budget = "<₹5,000 (MVP)";
      else if (amount <= 20000) entities.budget = "₹5,000-₹20,000 (Full Build)";
      else if (amount <= 50000) entities.budget = "₹20,000-₹50,000 (Enterprise)";
      else entities.budget = "₹50,000+ (Complex)";
    }
  } else if (/\b(low\s*budget|cheap|affordable|minimum|small budget)\b/i.test(value)) {
    entities.budget = "<₹5,000 (MVP)";
  } else if (/\b(medium\s*budget|moderate|reasonable|decent budget)\b/i.test(value)) {
    entities.budget = "₹5,000-₹20,000 (Full Build)";
  } else if (/\b(high\s*budget|premium|large\s*project|complex budget)\b/i.test(value)) {
    entities.budget = "₹50,000+ (Complex)";
  }

  const emailMatch = value.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  if (emailMatch) entities.email = emailMatch[0].toLowerCase();

  const namePatterns = [
    /\bmy name is\s+([a-z][a-z .'-]{1,60})/i,
    /\bi am\s+([a-z][a-z .'-]{1,60})(?:[,.;]|$)/i,
    /\bi'm\s+([a-z][a-z .'-]{1,60})(?:[,.;]|$)/i,
    /\bname\s*[:=-]\s*([a-z][a-z .'-]{1,60})/i,
  ];
  for (const pattern of namePatterns) {
    const match = value.match(pattern);
    if (match) {
      entities.name = match[1].trim().replace(/\s+/g, " ");
      break;
    }
  }

  const contactMessageMatch = value.match(/(?:message|note|tell (?:the )?team|send (?:this|a message))\s*(?:is|:|-)?\s+(.{8,})$/i);
  if (contactMessageMatch) entities.contactMessage = contactMessageMatch[1].trim();

  const descriptionSignals = /\b(build|need|want|project|platform|app|website|software|system|dashboard|automation|integrat|develop|create)\b/i;
  if (value.length >= 24 && descriptionSignals.test(value)) {
    entities.projectDescription = value;
  }

  return entities;
}

function matchKeywords(text) {
  const lower = text.toLowerCase();
  for (const [intent, keywords] of Object.entries(KEYWORD_INTENTS)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) return intent;
    }
  }
  return null;
}

function contextTopicFromText(text) {
  const lower = text.toLowerCase();
  if (/\bstarter\b/.test(lower)) return "cloud_starter";
  if (/\bpro plan\b|\bpro\b/.test(lower)) return "cloud_pro";
  if (/\benterprise\b/.test(lower)) return "cloud_enterprise";
  if (/\brental|rent\b/.test(lower)) return "cloud_rental";
  if (/\bmobile\b/.test(lower)) return "service_mobile";
  if (/\bai\b|machine learning|chatbot/.test(lower)) return "service_ai";
  if (/\bweb\b|website|web app/.test(lower)) return "service_web";
  return null;
}

export class ChatEngine {
  constructor() {
    this.model = null;
    this.modelReady = false;
    this.history = [];
    this.flowState = FLOW_STATES.IDLE;
    this.flowData = {};
    this.fallbackCount = 0;
    this.lastTopic = null;
    this.requestedAction = null;
    this.memory = {
      name: null,
      email: null,
      projectType: null,
      timeline: null,
      budget: null,
      projectDescription: null,
      contactMessage: null,
      lastTopic: null,
      lastAction: null,
    };
  }

  async init() {
    if (this.modelReady) return;
    this.model = await loadModel();
    this.modelReady = !!this.model;
  }

  mergeMemoryFromText(text) {
    const entities = extractEntities(text);
    this.memory = { ...this.memory, ...entities };
    return entities;
  }

  getContextSnapshot() {
    return {
      memory: { ...this.memory },
      lastTopic: this.lastTopic,
      fallbackCount: this.fallbackCount,
    };
  }

  restoreContext(snapshot) {
    if (!snapshot || typeof snapshot !== "object") return;
    if (snapshot.memory && typeof snapshot.memory === "object") {
      this.memory = { ...this.memory, ...snapshot.memory };
    }
    if (typeof snapshot.lastTopic === "string") {
      this.lastTopic = snapshot.lastTopic;
      this.memory.lastTopic = snapshot.lastTopic;
    }
    if (Number.isFinite(snapshot.fallbackCount)) {
      this.fallbackCount = Math.max(0, Math.min(snapshot.fallbackCount, 2));
    }
    this.flowState = FLOW_STATES.IDLE;
    this.flowData = {};
    this.requestedAction = null;
  }

  markActionCompleted(type, result = null) {
    this.memory.lastAction = { type, result, completedAt: Date.now() };
    this.requestedAction = null;
  }

  clearRequestedAction() {
    this.requestedAction = null;
  }

  async processMessage(text) {
    const trimmed = String(text || "").trim();
    if (!trimmed) return this.fallback();

    if (CANCEL_RE.test(trimmed)) {
      if (this.flowState !== FLOW_STATES.IDLE || this.requestedAction) {
        this.cancelFlow();
        this.requestedAction = null;
        return {
          text: "Cancelled. I won’t perform that action. What would you like to do instead?",
          quickReplies: ["Our Services", "Cloud Plans", "Contact Us"],
          confidence: 1,
        };
      }
    }

    const entities = this.mergeMemoryFromText(trimmed);

    if (this.flowState !== FLOW_STATES.IDLE) {
      return this.handleFlowInput(trimmed);
    }

    const navigation = detectNavigationCommand(trimmed);
    if (navigation) {
      this.memory.lastAction = { type: "navigate", href: navigation.href };
      this.history.push({ role: "user", text: trimmed, intent: "navigation" });
      return {
        text: `Opening **${navigation.label}**.`,
        quickReplies: [],
        link: navigation.href,
        action: "navigate",
        confidence: 1,
      };
    }

    const writeAction = detectWriteActionCommand(trimmed, this.memory);
    if (writeAction) {
      this.requestedAction = writeAction.type;
      return this.responseForWriteAction(writeAction);
    }

    if (this.requestedAction && Object.keys(entities).length > 0) {
      const action = this.requestedAction === "project_request"
        ? buildProjectAction(this.memory)
        : buildContactAction(this.memory);
      return this.responseForWriteAction(action);
    }

    const directQuickReply = QUICK_REPLY_ROUTES[trimmed];
    if (directQuickReply) {
      return this.handleQuickReply(trimmed);
    }

    const contextResult = this.handleContext(trimmed);
    if (contextResult) return contextResult;

    let intent = null;
    if (this.modelReady) intent = predict(trimmed, this.model);

    if (intent && intent.confidence >= 0.5) {
      return this.serveIntent(intent.tag, trimmed, intent.confidence);
    }

    if (intent && intent.confidence >= 0.3 && KNOWLEDGE[intent.tag]) {
      return this.serveIntent(intent.tag, trimmed, intent.confidence);
    }

    const keywordIntent = matchKeywords(trimmed);
    if (keywordIntent && KNOWLEDGE[keywordIntent]) {
      return this.serveIntent(keywordIntent, trimmed, 0.6);
    }

    if (entities.projectType) {
      this.flowData = { ...this.flowData, ...this.memory };
      this.history.push({ role: "user", text: trimmed, entities });
      return this.handleProjectEntityExtraction();
    }

    this.fallbackCount += 1;
    this.history.push({ role: "user", text: trimmed, intent: "unknown" });

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

  responseForWriteAction(action) {
    if (!action?.ready) {
      this.requestedAction = action?.type || this.requestedAction;
      return {
        text: actionMissingPrompt(action) || "I need a little more information before I can do that.",
        quickReplies: [],
        confidence: 1,
        action: "collect_action_details",
      };
    }

    this.requestedAction = null;
    return {
      text: "I have enough information. Review the action below before I do anything.",
      quickReplies: [],
      confidence: 1,
      action: "confirm_action",
      pendingAction: action,
    };
  }

  serveIntent(tag, userText, confidence) {
    this.lastTopic = tag;
    this.memory.lastTopic = tag;
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

  handleProjectEntityExtraction() {
    if (!this.memory.timeline) {
      this.flowState = FLOW_STATES.COLLECT_TIMELINE;
      return {
        text: `I’ve got **${this.memory.projectType}**. What timeline are you aiming for?`,
        quickReplies: ["1-2 weeks", "2-4 weeks", "4-8 weeks", "8-12 weeks", "16-24 weeks"],
        action: "flow_active",
      };
    }

    if (!this.memory.budget) {
      this.flowState = FLOW_STATES.COLLECT_BUDGET;
      return {
        text: `I’ve noted **${this.memory.projectType}** with a **${this.memory.timeline}** timeline. What budget range should I use?`,
        quickReplies: ["<₹5,000 (MVP)", "₹5k-₹20k (Full Build)", "₹20k-₹50k (Enterprise)", "₹50,000+ (Complex)"],
        action: "flow_active",
      };
    }

    if (!this.memory.projectDescription) {
      this.flowState = FLOW_STATES.COLLECT_PROJECT_DESCRIPTION;
      return {
        text: "Great. Give me a short description of what you want the product to do.",
        quickReplies: [],
        action: "flow_active",
      };
    }

    return this.continueProjectSubmissionFlow();
  }

  handleQuickReply(label) {
    const route = QUICK_REPLY_ROUTES[label];
    if (!route) return this.processMessage(label);

    if (route.link) {
      return {
        text: `Opening **${label}**.`,
        quickReplies: [],
        link: route.link,
        action: "navigate",
        confidence: 1,
      };
    }

    if (route.override) {
      this.history.push({ role: "user", text: label, intent: "quick_reply" });
      const knowledge = KNOWLEDGE[route.intent];
      return {
        text: route.override,
        quickReplies: knowledge?.quickReplies || [],
        cards: knowledge?.cards || null,
        links: knowledge?.links || null,
        confidence: 1,
      };
    }

    if (route.action) return this.handleAction(route.action, route.value);

    if (route.intent) {
      const entry = KNOWLEDGE[route.intent];
      if (entry) {
        this.lastTopic = route.intent;
        this.memory.lastTopic = route.intent;
        this.history.push({ role: "user", text: label, intent: route.intent });
        return {
          text: getText(entry),
          quickReplies: entry.quickReplies || [],
          cards: entry.cards || null,
          links: entry.links || null,
          action: entry.action || null,
          confidence: 1,
        };
      }
    }

    return this.fallback();
  }

  handleAction(action, value) {
    switch (action) {
      case "start_message_flow":
        this.flowState = this.memory.name
          ? (this.memory.email ? FLOW_STATES.COLLECT_MSG_BODY : FLOW_STATES.COLLECT_MSG_EMAIL)
          : FLOW_STATES.COLLECT_MSG_NAME;
        this.flowData = {};
        if (!this.memory.name) {
          return { text: "I can send a message to the team. **What’s your name?**", quickReplies: [], action: "flow_active" };
        }
        if (!this.memory.email) {
          return { text: `I remember your name as **${this.memory.name}**. What email should the team reply to?`, quickReplies: [], action: "flow_active" };
        }
        return { text: "What would you like me to send to the team?", quickReplies: [], action: "flow_active" };

      case "set_project_type":
        this.memory.projectType = value;
        this.flowData.projectType = value;
        return this.handleProjectEntityExtraction();

      case "suggest_project_form":
        return {
          text: "Opening the project request form with the details we have.",
          quickReplies: [],
          link: "/dev/request",
          action: "navigate",
        };

      case "start_project_flow":
        return this.startProjectFlow();

      default:
        return this.fallback();
    }
  }

  startProjectFlow() {
    if (!this.memory.projectType) {
      this.flowState = FLOW_STATES.COLLECT_PROJECT_TYPE;
      return {
        text: "I can build a project brief with you. **What type of project are you planning?**",
        quickReplies: ["Web Platform", "Mobile App", "Custom Software", "AI Solution"],
        action: "flow_active",
      };
    }
    return this.handleProjectEntityExtraction();
  }

  continueProjectSubmissionFlow() {
    if (!this.memory.name) {
      this.flowState = FLOW_STATES.COLLECT_PROJECT_NAME;
      return {
        text: "I have the project details. What name should I put on the request?",
        quickReplies: [],
        action: "flow_active",
      };
    }

    if (!this.memory.email) {
      this.flowState = FLOW_STATES.COLLECT_PROJECT_EMAIL;
      return {
        text: `Thanks, **${this.memory.name}**. What email should the team use to reply?`,
        quickReplies: [],
        action: "flow_active",
      };
    }

    this.flowState = FLOW_STATES.IDLE;
    return this.responseForWriteAction(buildProjectAction(this.memory));
  }

  handleFlowInput(text) {
    if (CANCEL_RE.test(text)) {
      this.cancelFlow();
      return {
        text: "Cancelled. I kept the details you already shared in case you want to continue later.",
        quickReplies: ["Our Services", "Cloud Plans", "Contact Us"],
        confidence: 1,
      };
    }

    const entities = this.mergeMemoryFromText(text);

    switch (this.flowState) {
      case FLOW_STATES.COLLECT_MSG_NAME:
        this.memory.name = entities.name || text.trim();
        this.flowState = this.memory.email ? FLOW_STATES.COLLECT_MSG_BODY : FLOW_STATES.COLLECT_MSG_EMAIL;
        return this.memory.email
          ? { text: "What message should I send to the team?", quickReplies: [], action: "flow_active" }
          : { text: `Thanks, **${this.memory.name}**. What email should the team reply to?`, quickReplies: [], action: "flow_active" };

      case FLOW_STATES.COLLECT_MSG_EMAIL: {
        if (!entities.email) {
          return { text: "That doesn’t look like a valid email address. Please try again.", quickReplies: [], action: "flow_active" };
        }
        this.memory.email = entities.email;
        this.flowState = FLOW_STATES.COLLECT_MSG_BODY;
        return { text: "Got it. What would you like me to send to the team?", quickReplies: [], action: "flow_active" };
      }

      case FLOW_STATES.COLLECT_MSG_BODY:
        this.memory.contactMessage = text.trim();
        this.flowState = FLOW_STATES.IDLE;
        return this.responseForWriteAction(buildContactAction(this.memory));

      case FLOW_STATES.COLLECT_PROJECT_TYPE:
        this.memory.projectType = entities.projectType || text.trim();
        return this.handleProjectEntityExtraction();

      case FLOW_STATES.COLLECT_TIMELINE:
        this.memory.timeline = entities.timeline || text.trim();
        this.flowState = FLOW_STATES.COLLECT_BUDGET;
        return {
          text: `Timeline noted as **${this.memory.timeline}**. What budget range should I use?`,
          quickReplies: ["<₹5,000 (MVP)", "₹5k-₹20k (Full Build)", "₹20k-₹50k (Enterprise)", "₹50,000+ (Complex)"],
          action: "flow_active",
        };

      case FLOW_STATES.COLLECT_BUDGET:
        this.memory.budget = entities.budget || text.trim();
        this.flowState = FLOW_STATES.COLLECT_PROJECT_DESCRIPTION;
        return { text: "What should this product do? A short project description is enough.", quickReplies: [], action: "flow_active" };

      case FLOW_STATES.COLLECT_PROJECT_DESCRIPTION:
        this.memory.projectDescription = text.trim();
        return this.continueProjectSubmissionFlow();

      case FLOW_STATES.COLLECT_PROJECT_NAME:
        this.memory.name = entities.name || text.trim();
        if (this.memory.email) return this.continueProjectSubmissionFlow();
        this.flowState = FLOW_STATES.COLLECT_PROJECT_EMAIL;
        return { text: `Thanks, **${this.memory.name}**. What email should the team use to reply?`, quickReplies: [], action: "flow_active" };

      case FLOW_STATES.COLLECT_PROJECT_EMAIL:
        if (!entities.email) {
          return { text: "That doesn’t look like a valid email address. Please try again.", quickReplies: [], action: "flow_active" };
        }
        this.memory.email = entities.email;
        return this.continueProjectSubmissionFlow();

      default:
        this.flowState = FLOW_STATES.IDLE;
        return this.processMessage(text);
    }
  }

  handleContext(text) {
    const lower = text.toLowerCase();

    if (/^(tell me more|more details?|more info|elaborate|tell me about that|can you elaborate|what about that)/.test(lower)) {
      if (this.lastTopic && KNOWLEDGE[this.lastTopic]) {
        this.history.push({ role: "user", text, intent: this.lastTopic });
        const entry = KNOWLEDGE[this.lastTopic];
        return {
          text: getText(entry),
          quickReplies: entry.quickReplies || [],
          links: entry.links || null,
          cards: entry.cards || null,
          confidence: 0.8,
        };
      }
    }

    if (/^(what about|how about|and what about|and the|compare that with)/.test(lower)) {
      const topic = contextTopicFromText(lower);
      if (topic && KNOWLEDGE[topic]) return this.serveIntent(topic, text, 0.85);
    }

    if (/^(yes|yeah|yep|sure|ok|okay|yup|please|let's go|lets go)/.test(lower)) {
      if (this.lastTopic === "project_request") return this.startProjectFlow();
    }

    if (/^(no|nope|nah|contact us instead|talk to someone|human|real person)/.test(lower)) {
      const entry = KNOWLEDGE.human_handoff;
      return {
        text: getText(entry),
        quickReplies: entry.quickReplies || [],
        cards: entry.cards || null,
        confidence: 0.9,
      };
    }

    if (/\bwhat did i tell you|what do you remember|my details\b/.test(lower)) {
      const known = [
        this.memory.name && `Name: **${this.memory.name}**`,
        this.memory.email && `Email: **${this.memory.email}**`,
        this.memory.projectType && `Project: **${this.memory.projectType}**`,
        this.memory.timeline && `Timeline: **${this.memory.timeline}**`,
        this.memory.budget && `Budget: **${this.memory.budget}**`,
      ].filter(Boolean);
      return {
        text: known.length
          ? `Here’s what I remember from this conversation:\n\n• ${known.join("\n• ")}`
          : "I don’t have any project or contact details from you yet.",
        quickReplies: ["Start a Project", "Send a Message"],
        confidence: 1,
      };
    }

    return null;
  }

  fallback() {
    const index = Math.max(0, Math.min(this.fallbackCount - 1, FALLBACK_RESPONSES.length - 1));
    const fallback = FALLBACK_RESPONSES[index] || FALLBACK_RESPONSES[0];
    return {
      text: getText(fallback),
      quickReplies: fallback?.quickReplies || [],
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

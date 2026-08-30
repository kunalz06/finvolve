/**
 * DEV∞ Chatbot — Knowledge Base
 * All responses mapped to intent tags from the ML classifier.
 * Each entry has: text (supports \n for line breaks), quickReplies, and optional actions.
 */

export const KNOWLEDGE = {
  // ── Greetings & Social ──────────────────────────────────────────

  greeting: {
    text: "Hey there! I'm DEV∞, your assistant at DEV Infinity. I can help you with:\n\n• Our services & capabilities\n• Cloud plans, pricing & rentals\n• Starting a new project\n• Getting in touch with the team\n\nWhat would you like to know?",
    quickReplies: ["Our Services", "Cloud Plans", "Start a Project", "Contact Us"],
  },

  farewell: {
    text: "Glad I could help! If you need anything else later, I'll be right here. Have a great day!",
    quickReplies: [],
  },

  thanks: {
    text: "You're welcome! Anything else you'd like to know about our services or cloud platform?",
    quickReplies: ["Cloud Plans", "Our Services", "That's all"],
  },

  // ── Services ───────────────────────────────────────────────────

  service_web: {
    text: "We build modern web applications using React & Next.js. Here's what we cover:\n\n• **Progressive Web Apps** — fast, installable, offline-capable\n• **E-commerce Platforms** — payments, inventory, analytics\n• **Real-time Apps** — live dashboards, collaboration tools\n• **API Integration** — connect any third-party service\n• **Landing Pages** — high-conversion, brand-aligned\n\nAll our web apps are responsive, SEO-optimized, and built for scale.",
    quickReplies: ["Mobile Apps", "AI Solutions", "Start a Project"],
  },

  service_mobile: {
    text: "We develop native and cross-platform mobile apps:\n\n• **iOS & Android** — native performance\n• **React Native** — one codebase, both platforms\n• **Flutter** — beautiful, natively compiled apps\n• **App Store Optimization** — visibility & downloads\n• **Push Notifications & Analytics** — engagement tracking\n\nWe handle the full lifecycle from design to App Store/Play Store deployment.",
    quickReplies: ["Web Development", "Start a Project", "Get a Quote"],
  },

  service_ai: {
    text: "Our AI solutions team builds intelligent systems:\n\n• **Machine Learning Models** — custom trained for your data\n• **NLP** — text analysis, chatbots, sentiment analysis\n• **Computer Vision** — image recognition, object detection\n• **Predictive Analytics** — forecasting, recommendations\n• **AI Assistants** — custom chatbots and automation\n\nWe also offer AI model access through our DEV∞ Cloud platform (GPT-4o, Gemini, Claude, Llama).",
    quickReplies: ["Cloud AI Access", "Start a Project", "Our Services"],
  },

  service_saas: {
    text: "We architect and build full SaaS platforms:\n\n• **Multi-tenant Architecture** — isolated data per tenant\n• **Subscription Management** — billing cycles, plan tiers\n• **Auth & RBAC** — secure role-based access control\n• **Cloud Infrastructure** — scalable, auto-provisioning\n• **Auto Scaling** — handles traffic spikes automatically\n\nWe've built production SaaS products end-to-end.",
    quickReplies: ["Start a Project", "Custom Software", "Contact Us"],
  },

  service_custom: {
    text: "Our custom software solutions include:\n\n• **Process Automation** — eliminate repetitive work\n• **Internal Dashboards** — real-time business metrics\n• **Legacy Modernization** — upgrade old systems\n• **System Integrations** — connect your tools together\n• **Custom CRM/ERP** — tailored to your workflows\n\nEvery solution is built from scratch for your specific needs.",
    quickReplies: ["Start a Project", "Database & Backend", "Get a Quote"],
  },

  service_database: {
    text: "We handle the full backend and data layer:\n\n• **Database Design** — relational, NoSQL, or hybrid\n• **REST & GraphQL APIs** — fast, documented, versioned\n• **Microservices** — decoupled, independently deployable\n• **Real-time Data** — WebSockets, live sync\n• **Cloud DB Management** — backups, optimization, scaling\n\nWe choose the right database for your use case — PostgreSQL, MongoDB, Firebase, or others.",
    quickReplies: ["Start a Project", "Security & Compliance", "Our Services"],
  },

  service_security: {
    text: "Security is baked into every project we build:\n\n• **Security Audits** — identify vulnerabilities\n• **OWASP Compliance** — follow industry standards\n• **Data Encryption** — at rest and in transit\n• **Access Control** — auth, RBAC, least privilege\n• **GDPR & HIPAA** — regulatory compliance\n\nWe don't treat security as an afterthought — it's part of our architecture from day one.",
    quickReplies: ["Start a Project", "Contact Us", "Our Services"],
  },

  service_uiux: {
    text: "Our design process covers the full UX spectrum:\n\n• **User Research** — understand your audience\n• **Wireframes & Prototypes** — test before building\n• **Design Systems** — consistent, scalable components\n• **Responsive Design** — works on every screen size\n• **Developer Handoff** — pixel-perfect implementation\n\nWe design interfaces that are both beautiful and functional.",
    quickReplies: ["Start a Project", "Web Development", "Mobile Apps"],
  },

  // ── Cloud Plans ────────────────────────────────────────────────

  cloud_plans: {
    text: "DEV∞ Cloud gives you compute power + AI model access. We have 3 subscription tiers:\n\n• **Starter** — ₹200 / 15 days (300 compute hrs)\n• **Pro** — ₹12,900 / month (600 hrs + AI models)\n• **Enterprise** — ₹17,900 / month (1000 hrs + dedicated GPU + Claude)\n\nAll plans include open-source LLM access (Llama 3.3 70B). Pro and above get GPT-4o, Gemini, and more.",
    quickReplies: ["Starter Details", "Pro Plan", "Enterprise", "Rent Instead"],
  },

  cloud_pricing: {
    text: "Here's a quick pricing overview:\n\n**Subscriptions:**\n• Starter — ₹200/15 days + ₹100 setup\n• Pro — ₹12,900/month + ₹1,000 setup\n• Enterprise — ₹17,900/month + ₹1,200 setup\n\n**Rentals (pay-per-use):**\n• ₹1 upfront (non-refundable)\n• ₹200 per 20 hours of compute\n• Durations: 1, 3, 7, 15, or 30 days\n\n**Quick Start (priority service):**\n• ₹99 one-time — response under 48 hours",
    quickReplies: ["View Cloud Plans", "Rent Cloud", "Start a Project"],
  },

  cloud_starter: {
    text: "**Starter Plan** — ₹200 / 15 days + ₹100 one-time setup\n\n• 300 compute hours (split 150 + 150 per half-cycle)\n• Standard Cloud VM engine\n• Open-source LLM access (Llama 3.3 70B)\n• Basic metrics dashboard\n• Standard email support\n• 12 billing cycles (each 15 days)\n\nGreat for trying out the platform or light workloads. No OpenAI/Gemini access at this tier.",
    quickReplies: ["Upgrade to Pro", "Rent Instead", "Start a Project"],
  },

  cloud_pro: {
    text: "**Pro Plan** — ₹12,900 / month + ₹1,000 one-time setup\n\n• 600 unrestricted compute hours / month\n• High-Throughput Node engine\n• **OpenAI GPT-4o & o1** — 250 hrs quota\n• **Google Gemini 2.0 Flash & 1.5 Pro** — 450 hrs quota\n• Open-source LLMs (Llama 3.3 70B)\n• Advanced telemetry dashboard\n• Priority chat & email support\n\nOur most popular plan — best value for developers and teams.",
    quickReplies: ["Enterprise Plan", "Subscribe Now", "Compare All Plans"],
  },

  cloud_enterprise: {
    text: "**Enterprise Plan** — ₹17,900 / month + ₹1,200 one-time setup\n\n• 1,000 dedicated compute hours / month\n• Bare-Metal / Dedicated engine\n• **OpenAI GPT** — 250 hrs quota\n• **Google Gemini** — 450 hrs quota\n• **Anthropic Claude 3.5 Sonnet & Opus** — Full Enterprise Access\n• Open-source LLMs + **Dedicated NVIDIA GPU** acceleration\n• MATLAB Suite included\n• Enterprise telemetry dashboard\n• 24/7 Priority SLA + Lead Engineer support\n\nThe full powerhouse for demanding workloads.",
    quickReplies: ["Subscribe Now", "Pro Plan", "Contact Sales"],
  },

  cloud_rental: {
    text: "**Cloud Rent** — Pay only for what you use\n\n• **₹1 upfront** (non-refundable) to activate\n• **₹200 per 20 hours** of compute time\n• Slab billing: partial slabs rounded up\n• Choose duration: 1, 3, 7, 15, or 30 days\n• Bill + Razorpay payment link emailed after rental ends\n• **One active rental per email** at a time\n\nPerfect for short-term projects, testing, or burst compute needs.",
    quickReplies: ["Rent Now", "Cloud Subscriptions", "Contact Us"],
  },

  // ── Cloud FAQ ──────────────────────────────────────────────────

  cloud_faq_compute: {
    text: "**Compute hours** represent your dedicated execution runtime on our cloud infrastructure.\n\n• **Starter:** 300 hours split into two 150-hour halves per 15-day billing cycle\n• **Pro & Enterprise:** Unrestricted monthly pools that reset every 30 days\n\nYour usage is tracked in real-time on your cloud dashboard. Unused hours don't roll over.",
    quickReplies: ["Pause Subscription", "AI Model Access", "View Plans"],
  },

  cloud_faq_pause: {
    text: "**Yes, you can pause and resume your subscription at any time** through the Cloud Dashboard.\n\n• Pausing freezes your runtime counter and billing\n• Your configuration and data are preserved\n• Resume reactivates everything where you left off\n\nNo penalty for pausing — you only pay for active periods.",
    quickReplies: ["Upgrade Plan", "Cloud Plans", "Contact Support"],
  },

  cloud_faq_ai: {
    text: "**AI Model API access** works through a unified API gateway:\n\n• Active subscription gives you API gateway keys in your dashboard\n• Connect to GPT-4o, Gemini, Claude, Llama — all through one endpoint\n• No need for separate provider accounts or API keys\n\n**Model availability by plan:**\n• **Starter:** Llama 3.3 70B only\n• **Pro:** GPT-4o/o1 (250 hrs) + Gemini Flash/Pro (450 hrs) + Llama\n• **Enterprise:** Everything in Pro + Claude 3.5 Sonnet/Opus + Dedicated GPU",
    quickReplies: ["Pro Plan", "Enterprise Plan", "Cloud Plans"],
  },

  cloud_faq_setup: {
    text: "The **one-time setup fee** covers your initial infrastructure provisioning:\n\n• Dedicated compute namespace isolation\n• Secure credential generation\n• VPC container configuration\n• Allocated rate-limit quotas\n\nThis is charged once when you first subscribe. Plan changes don't require a new setup fee.",
    quickReplies: ["Cloud Plans", "Contact Us"],
  },

  cloud_faq_upgrade: {
    text: "You can **upgrade or downgrade your plan anytime** from the Cloud Dashboard.\n\n• Changes are scheduled for your next renewal\n• **Starter:** changes take effect at the 15-day renewal\n• **Pro/Enterprise:** changes take effect at the monthly renewal\n• No penalty or extra fees for switching\n\nThe new pricing applies from the next billing cycle.",
    quickReplies: ["View Plans", "Cloud Dashboard", "Contact Us"],
  },

  // ── Quick Start ────────────────────────────────────────────────

  quick_start: {
    text: "**Quick Start** is our priority service for ₹99 (non-refundable):\n\n• Response within **48 hours**\n• Direct engineer communication\n• Priority queue — jump ahead of standard requests\n• Available for Web, Android, and Custom Software projects\n\nIt's the fastest way to get your project started with us.",
    quickReplies: ["Start Quick Start", "Start a Project", "Cloud Plans"],
  },

  // ── Company ────────────────────────────────────────────────────

  about_company: {
    text: "**DEV Infinity** is a modern engineering agency — we call ourselves \"Software Builders.\"\n\n**Our mission:** To fuel businesses with high-performance technology. We push for sharper execution and better product clarity.\n\n**By the numbers:**\n• 50+ projects delivered\n• 98% client satisfaction\n• 24/7 support available\n\nWe build web apps, payment flows, dashboards, and automations for teams that need momentum — without the generic agency fog.",
    quickReplies: ["Our Services", "Portfolio", "Start a Project"],
  },

  portfolio: {
    text: "Here are some projects we've delivered:\n\n• **FinTech Dashboard** — Next.js, WebSocket, PostgreSQL\n• **HealthVote (Mobile App)** — React Native, Node.js, MongoDB\n• **Nexus CRM (SaaS)** — Vue.js, Python, TensorFlow\n• **EduLearn Platform** — Next.js, AWS, Redis\n• **LogiTrack (Enterprise)** — React, GraphQL, Kubernetes\n• **CryptoWallet (Web3)** — React, Web3.js, Solidity\n\nEach project was built end-to-end by our team.",
    quickReplies: ["Start a Project", "Our Services", "Contact Us"],
  },

  // ── Contact & Messaging ────────────────────────────────────────

  contact: {
    text: "I can help you reach the team right here! I can collect your message and make sure it gets to the right person.\n\n**Or reach out directly:**\n• Email: mitraricky06@gmail.com\n• Phone: +91 99079 58859\n• Response time: within 24 hours\n\nWant me to take a message for you?",
    quickReplies: ["Send a Message", "Start a Project", "Cloud Plans"],
  },

  project_request: {
    text: "Great to hear you're interested in working with us! I can walk you through it quickly.\n\nWhat type of project are you looking to build?",
    quickReplies: ["Web Platform", "Mobile App", "Custom Software", "AI Solution"],
    action: "start_project_flow",
  },

  // ── Legal ──────────────────────────────────────────────────────

  terms: {
    text: "Our Terms of Service cover:\n\n• Services (software dev + cloud)\n• Quick Start & payment terms\n• Cloud subscription & rental terms\n• Billing, cancellation, and acceptable use\n• Intellectual property ownership\n• Limitation of liability\n\nYou can read the full terms on our website.",
    quickReplies: ["Read Full Terms", "Privacy Policy", "Contact Us"],
    links: { "Read Full Terms": "/dev/terms" },
  },

  privacy: {
    text: "Our Privacy Policy covers how we collect, use, and protect your personal data. We follow industry-standard practices for data security and comply with applicable regulations.\n\nYou can read the complete policy on our website.",
    quickReplies: ["Read Privacy Policy", "Terms of Service", "Contact Us"],
    links: { "Read Privacy Policy": "/dev/privacy-policy", "Terms of Service": "/dev/terms" },
  },

  // ── Navigation ─────────────────────────────────────────────────

  navigation: {
    text: "I can help you find what you're looking for! Where would you like to go?",
    quickReplies: ["Services", "Cloud Plans", "About Us", "Contact"],
  },
};

// ── Quick reply routing map ─────────────────────────────────────

export const QUICK_REPLY_ROUTES = {
  "Our Services": { intent: "service_web", override: "Here's an overview of all our services:\n\n• **Web App Development** — React, Next.js, PWA, E-commerce\n• **Mobile App Development** — iOS, Android, React Native, Flutter\n• **AI Solutions** — ML, NLP, Computer Vision, Predictive Analytics\n• **Custom SaaS** — Multi-tenant, subscriptions, auto-scaling\n• **Custom Software** — Automation, dashboards, legacy modernization\n• **Database & Backend** — REST/GraphQL APIs, microservices\n• **Security & Compliance** — Audits, OWASP, encryption, GDPR\n• **UI/UX Design** — Research, prototypes, design systems\n\nWant details on any specific service?" },
  "Cloud Plans": { intent: "cloud_plans" },
  "Starter Details": { intent: "cloud_starter" },
  "Pro Plan": { intent: "cloud_pro" },
  "Enterprise": { intent: "cloud_enterprise" },
  "Enterprise Plan": { intent: "cloud_enterprise" },
  "Rent Instead": { intent: "cloud_rental" },
  "Rent Now": { intent: "cloud_rental" },
  "Rent Cloud": { intent: "cloud_rental" },
  "Cloud Subscriptions": { intent: "cloud_plans" },
  "View Cloud Plans": { intent: "cloud_plans" },
  "View Plans": { intent: "cloud_plans" },
  "Compare All Plans": { intent: "cloud_pricing" },
  "Subscribe Now": { link: "/dev/cloud" },
  "Contact Sales": { link: "/dev/contact" },
  "Contact Support": { link: "/dev/contact" },
  "Contact Us": { link: "/dev/contact" },
  "Start a Project": { intent: "project_request" },
  "Start Quick Start": { link: "/dev/quick-start" },
  "Get a Quote": { link: "/dev/request" },
  "Send a Message": { action: "start_message_flow" },
  "Cloud Dashboard": { link: "/dev/cloud/dashboard" },
  "Read Full Terms": { link: "/dev/terms" },
  "Privacy Policy": { link: "/dev/privacy-policy" },
  "Read Privacy Policy": { link: "/dev/privacy-policy" },
  "Terms of Service": { link: "/dev/terms" },
  "About Us": { link: "/dev/about" },
  "Portfolio": { intent: "portfolio" },
  "Services": { link: "/dev/services" },
  "Upgrade to Pro": { intent: "cloud_pro" },
  "AI Model Access": { intent: "cloud_faq_ai" },
  "Cloud AI Access": { intent: "cloud_faq_ai" },
  "Pause Subscription": { intent: "cloud_faq_pause" },
  "Upgrade Plan": { intent: "cloud_faq_upgrade" },
  "That's all": { intent: "farewell" },
  "Web Platform": { action: "set_project_type", value: "Web Platform" },
  "Mobile App": { action: "set_project_type", value: "Mobile App" },
  "Custom Software": { action: "set_project_type", value: "Custom Software" },
  "AI Solution": { action: "set_project_type", value: "AI Solution" },
  "Web Development": { intent: "service_web" },
  "Mobile Apps": { intent: "service_mobile" },
  "AI Solutions": { intent: "service_ai" },
  "Custom Software": { action: "set_project_type", value: "Custom Software" },
  "Database & Backend": { intent: "service_database" },
  "Security & Compliance": { intent: "service_security" },
};

// ── Fallback responses (when confidence is low) ─────────────────

export const FALLBACK_RESPONSES = [
  {
    text: "I'm not sure I understood that. Here are some things I can help with:",
    quickReplies: ["Our Services", "Cloud Plans", "Start a Project", "Contact Us"],
  },
  {
    text: "I didn't quite catch that. Could you rephrase it? Or pick a topic:",
    quickReplies: ["Cloud Pricing", "Our Portfolio", "Send a Message"],
  },
  {
    text: "Hmm, that's outside my knowledge. But I can connect you with the team!",
    quickReplies: ["Contact Us", "Start a Project", "Cloud Plans"],
  },
];

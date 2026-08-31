/**
 * DEV∞ Chatbot — Knowledge Base v2
 * Supports: text variance (texts[]), link cards, rich responses.
 * Each entry: { texts (array, picked randomly), quickReplies, cards?, links? }
 */

// Helper: pick random from array
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getText(entry) {
  if (!entry) return "";
  if (entry.texts) return pick(entry.texts);
  if (entry.text) return entry.text;
  return "";
}

export const KNOWLEDGE = {
  // ── Greetings & Social ──────────────────────────────────────────

  greeting: {
    texts: [
      "Hey there! I'm DEV∞, your assistant at DEV Infinity. I can help you with:\n\n• Our services & capabilities\n• Cloud plans, pricing & rentals\n• Starting a new project\n• Getting in touch with the team\n\nWhat would you like to know?",
      "Hi! Welcome to DEV Infinity. I'm here to help you explore our services, cloud platform, or kick off a project. What interests you?",
      "Hello! I'm DEV∞ — your guide to everything DEV Infinity. Ask me about our services, pricing, or let's get your project started!",
    ],
    quickReplies: ["Our Services", "Cloud Plans", "Start a Project", "Contact Us"],
  },

  farewell: {
    texts: [
      "Glad I could help! If you need anything else later, I'll be right here. Have a great day!",
      "See you around! Feel free to come back anytime you have questions. Good luck with your project!",
      "Take care! I'm always here if you need help with anything. Have an amazing day!",
    ],
    quickReplies: [],
  },

  thanks: {
    texts: [
      "You're welcome! Anything else you'd like to know about our services or cloud platform?",
      "Happy to help! Let me know if you have any other questions.",
      "No problem at all! What else can I help you with?",
    ],
    quickReplies: ["Cloud Plans", "Our Services", "That's all"],
  },

  // ── Services ───────────────────────────────────────────────────

  service_web: {
    texts: [
      "We build modern web applications using React & Next.js. Here's what we cover:\n\n• **Progressive Web Apps** — fast, installable, offline-capable\n• **E-commerce Platforms** — payments, inventory, analytics\n• **Real-time Apps** — live dashboards, collaboration tools\n• **API Integration** — connect any third-party service\n• **Landing Pages** — high-conversion, brand-aligned\n\nAll our web apps are responsive, SEO-optimized, and built for scale.",
    ],
    quickReplies: ["Mobile Apps", "AI Solutions", "Start a Project"],
  },

  service_mobile: {
    texts: [
      "We develop native and cross-platform mobile apps:\n\n• **iOS & Android** — native performance\n• **React Native** — one codebase, both platforms\n• **Flutter** — beautiful, natively compiled apps\n• **App Store Optimization** — visibility & downloads\n• **Push Notifications & Analytics** — engagement tracking\n\nWe handle the full lifecycle from design to App Store/Play Store deployment.",
    ],
    quickReplies: ["Web Development", "Start a Project", "Get a Quote"],
  },

  service_ai: {
    texts: [
      "Our AI solutions team builds intelligent systems:\n\n• **Machine Learning Models** — custom trained for your data\n• **NLP** — text analysis, chatbots, sentiment analysis\n• **Computer Vision** — image recognition, object detection\n• **Predictive Analytics** — forecasting, recommendations\n• **AI Assistants** — custom chatbots and automation\n\nWe also offer AI model access through our DEV∞ Cloud platform (GPT-4o, Gemini, Claude, Llama).",
    ],
    quickReplies: ["Cloud AI Access", "Start a Project", "Our Services"],
  },

  service_saas: {
    texts: [
      "We architect and build full SaaS platforms:\n\n• **Multi-tenant Architecture** — isolated data per tenant\n• **Subscription Management** — billing cycles, plan tiers\n• **Auth & RBAC** — secure role-based access control\n• **Cloud Infrastructure** — scalable, auto-provisioning\n• **Auto Scaling** — handles traffic spikes automatically\n\nWe've built production SaaS products end-to-end.",
    ],
    quickReplies: ["Start a Project", "Custom Software", "Contact Us"],
  },

  service_custom: {
    texts: [
      "Our custom software solutions include:\n\n• **Process Automation** — eliminate repetitive work\n• **Internal Dashboards** — real-time business metrics\n• **Legacy Modernization** — upgrade old systems\n• **System Integrations** — connect your tools together\n• **Custom CRM/ERP** — tailored to your workflows\n\nEvery solution is built from scratch for your specific needs.",
    ],
    quickReplies: ["Start a Project", "Database & Backend", "Get a Quote"],
  },

  service_database: {
    texts: [
      "We handle the full backend and data layer:\n\n• **Database Design** — relational, NoSQL, or hybrid\n• **REST & GraphQL APIs** — fast, documented, versioned\n• **Microservices** — decoupled, independently deployable\n• **Real-time Data** — WebSockets, live sync\n• **Cloud DB Management** — backups, optimization, scaling\n\nWe choose the right database for your use case — PostgreSQL, MongoDB, Firebase, or others.",
    ],
    quickReplies: ["Start a Project", "Security & Compliance", "Our Services"],
  },

  service_security: {
    texts: [
      "Security is baked into every project we build:\n\n• **Security Audits** — identify vulnerabilities\n• **OWASP Compliance** — follow industry standards\n• **Data Encryption** — at rest and in transit\n• **Access Control** — auth, RBAC, least privilege\n• **GDPR & HIPAA** — regulatory compliance\n\nWe don't treat security as an afterthought — it's part of our architecture from day one.",
    ],
    quickReplies: ["Start a Project", "Contact Us", "Our Services"],
  },

  service_uiux: {
    texts: [
      "Our design process covers the full UX spectrum:\n\n• **User Research** — understand your audience\n• **Wireframes & Prototypes** — test before building\n• **Design Systems** — consistent, scalable components\n• **Responsive Design** — works on every screen size\n• **Developer Handoff** — pixel-perfect implementation\n\nWe design interfaces that are both beautiful and functional.",
    ],
    quickReplies: ["Start a Project", "Web Development", "Mobile Apps"],
  },

  // ── NEW: Process & Methodology ───────────────────────────────────

  process: {
    texts: [
      "Our development process follows a structured but flexible approach:\n\n• **1. Discovery** — understand your goals, users, and constraints\n• **2. Planning** — architecture, tech stack, milestones, and timeline\n• **3. Design** — wireframes, UI/UX, and prototype validation\n• **4. Development** — agile sprints with regular demos\n• **5. Testing** — QA, performance, security, and UAT\n• **6. Launch & Support** — deployment, monitoring, and iterations\n\nWe keep you in the loop at every stage.",
    ],
    quickReplies: ["Start a Project", "Our Team", "Pricing"],
  },

  tech_stack: {
    texts: [
      "We pick the right tools for each project. Here's our core stack:\n\n• **Frontend:** React, Next.js, Vue.js, Tailwind CSS, Framer Motion\n• **Mobile:** React Native, Flutter, Swift, Kotlin\n• **Backend:** Node.js, Python, Go, Java\n• **Database:** PostgreSQL, MongoDB, Firebase, Redis\n• **Cloud:** AWS, Vercel, Netlify, Docker, Kubernetes\n• **AI/ML:** TensorFlow, PyTorch, OpenAI, LangChain\n\nWe're not locked into one stack — we choose what fits your project best.",
    ],
    quickReplies: ["Start a Project", "Our Services", "Cloud Plans"],
  },

  team: {
    texts: [
      "DEV Infinity is a lean, focused engineering team. We don't believe in bloated agencies.\n\n• **Core Engineers** — full-stack developers who own projects end-to-end\n• **Design Lead** — ensures every pixel has purpose\n• **Project Coordinator** — keeps things on track and you informed\n• **On-demand Specialists** — DevOps, AI/ML, security brought in when needed\n\nYou work directly with the people building your product — no account manager middlemen.",
    ],
    quickReplies: ["Our Portfolio", "Start a Project", "Contact Us"],
  },

  pricing: {
    texts: [
      "Our pricing is project-based and transparent:\n\n• **MVP/Prototype** — under ₹5,000 (quick validation)\n• **Full Production Build** — ₹5,000 - ₹20,000 (complete product)\n• **Enterprise Scale** — ₹20,000 - ₹50,000 (complex systems)\n• **Custom Ecosystem** — ₹50,000+ (multi-product platforms)\n\nEvery project gets a detailed quote upfront. No hidden fees, no surprises.\n\nWe also offer **Quick Start** for ₹99 — priority response within 48 hours.",
    ],
    quickReplies: ["Start a Project", "Quick Start", "Get a Quote"],
    cards: [
      { title: "Start a Project", desc: "Get a detailed quote for your idea", link: "/dev/request", cta: "Get Started" },
      { title: "Quick Start", desc: "Priority service — response under 48 hours", link: "/dev/quick-start", cta: "₹99 One-time" },
    ],
  },

  timeline_delivery: {
    texts: [
      "Delivery timelines depend on project scope:\n\n• **1-2 weeks** — MVPs, landing pages, small fixes\n• **2-4 weeks** — Full production apps, standard features\n• **4-8 weeks** — Complex apps with integrations\n• **8-12 weeks** — Enterprise platforms, SaaS products\n• **16+ weeks** — Multi-product ecosystems\n\nWe give you a realistic timeline upfront and stick to it. Rush delivery is available for urgent projects.",
    ],
    quickReplies: ["Start a Project", "Our Process", "Contact Us"],
  },

  testimonials: {
    texts: [
      "Here's what our clients say about working with us:\n\n• *"They delivered our fintech dashboard in record time. The real-time features are flawless."* — FinTech Startup\n\n• *"The mobile app exceeded our expectations. Smooth performance on both iOS and Android."* — HealthVote Team\n\n• *"DEV Infinity built our entire SaaS platform from scratch. It scales beautifully."* — Nexus CRM\n\n• *"Quick turnaround, clean code, and they actually listen to feedback."* — EduLearn\n\n**98% client satisfaction** across 50+ projects.",
    ],
    quickReplies: ["Our Portfolio", "Start a Project", "Contact Us"],
  },

  refund_cancellation: {
    texts: [
      "Here's our policy on refunds and cancellations:\n\n• **Quick Start (₹99)** — Non-refundable once we begin processing\n• **Cloud Subscriptions** — Cancel anytime from your dashboard. You keep access until the current billing period ends. No partial refunds.\n• **Cloud Rentals** — Non-refundable upfront fee (₹1). You're billed only for compute hours used.\n• **Project Work** — We work in milestones. Each milestone is paid upon completion and approval.\n\nFor any concerns, reach out to us directly and we'll work it out.",
    ],
    quickReplies: ["Cloud Plans", "Contact Us", "Quick Start"],
  },

  competitors: {
    texts: [
      "What makes DEV Infinity different from typical agencies:\n\n• **No middlemen** — you talk directly to the engineers building your product\n• **Fixed pricing** — detailed quotes upfront, no hourly billing surprises\n• **Real technology** — we build production-grade systems, not WordPress templates\n• **Speed** — most projects start within 24-48 hours\n• **Own your code** — full source code ownership transferred to you\n• **Post-launch support** — we don't disappear after delivery\n\nWe're software builders, not slide-makers.",
    ],
    quickReplies: ["Our Services", "Our Portfolio", "Start a Project"],
  },

  location_office: {
    texts: [
      "DEV Infinity operates as a distributed team, which keeps our costs low and our talent global.\n\n• **Reach us anytime** via email or phone\n• **Email:** mitraricky06@gmail.com\n• **Phone:** +91 99079 58859\n• **Response time:** within 24 hours\n\nWe serve clients across India and internationally.",
    ],
    quickReplies: ["Contact Us", "Start a Project", "Our Services"],
  },

  comparison_react_nextjs: {
    texts: [
      "Great question! Here's when to use each:\n\n• **React** — Best for SPAs (Single Page Apps), interactive dashboards, and when you need full client-side control. Think: internal tools, admin panels.\n\n• **Next.js** — Best for public-facing websites, SEO-critical pages, e-commerce, and when you need server-side rendering. Think: marketing sites, blogs, SaaS landing pages.\n\n**Our recommendation:** For most business products, we use **Next.js** because it gives you React + SSR + routing + API routes in one framework.\n\nWant to discuss what's right for your specific project?",
    ],
    quickReplies: ["Start a Project", "Our Tech Stack", "Contact Us"],
  },

  react_vs_flutter: {
    texts: [
      "Here's a quick comparison for mobile development:\n\n• **React Native** — JavaScript/TypeScript ecosystem, huge community, share code with web app, great for teams that already use React.\n\n• **Flutter** — Dart language, beautiful custom UI out of the box, excellent performance, single codebase for mobile + web + desktop.\n\n**Our take:** If you have a React web app, React Native is faster to ship. If you want the most polished, custom mobile UI, Flutter is excellent. Both deliver production-quality apps.\n\nWe can help you pick the right one for your project.",
    ],
    quickReplies: ["Start a Project", "Mobile Apps", "Contact Us"],
  },

  // ── Cloud Plans ────────────────────────────────────────────────

  cloud_plans: {
    texts: [
      "DEV∞ Cloud gives you compute power + AI model access. We have 3 subscription tiers:\n\n• **Starter** — ₹200 / 15 days (300 compute hrs)\n• **Pro** — ₹12,900 / month (600 hrs + AI models)\n• **Enterprise** — ₹17,900 / month (1000 hrs + dedicated GPU + Claude)\n\nAll plans include open-source LLM access (Llama 3.3 70B). Pro and above get GPT-4o, Gemini, and more.",
    ],
    quickReplies: ["Starter Details", "Pro Plan", "Enterprise", "Rent Instead"],
    cards: [
      { title: "Starter", desc: "₹200/15 days — 300 hrs compute", link: "/dev/cloud#starter", cta: "View" },
      { title: "Pro", desc: "₹12,900/mo — 600 hrs + AI models", link: "/dev/cloud#pro", cta: "View" },
      { title: "Enterprise", desc: "₹17,900/mo — 1000 hrs + GPU", link: "/dev/cloud#enterprise", cta: "View" },
    ],
  },

  cloud_pricing: {
    texts: [
      "Here's a quick pricing overview:\n\n**Subscriptions:**\n• Starter — ₹200/15 days + ₹100 setup\n• Pro — ₹12,900/month + ₹1,000 setup\n• Enterprise — ₹17,900/month + ₹1,200 setup\n\n**Rentals (pay-per-use):**\n• ₹1 upfront (non-refundable)\n• ₹200 per 20 hours of compute\n• Durations: 1, 3, 7, 15, or 30 days\n\n**Quick Start (priority service):**\n• ₹99 one-time — response under 48 hours",
    ],
    quickReplies: ["View Cloud Plans", "Rent Cloud", "Start a Project"],
  },

  cloud_starter: {
    texts: [
      "**Starter Plan** — ₹200 / 15 days + ₹100 one-time setup\n\n• 300 compute hours (split 150 + 150 per half-cycle)\n• Standard Cloud VM engine\n• Open-source LLM access (Llama 3.3 70B)\n• Basic metrics dashboard\n• Standard email support\n• 12 billing cycles (each 15 days)\n\nGreat for trying out the platform or light workloads. No OpenAI/Gemini access at this tier.",
    ],
    quickReplies: ["Upgrade to Pro", "Rent Instead", "Start a Project"],
    cards: [
      { title: "Get Starter Plan", desc: "₹200/15 days — perfect for trying out", link: "/dev/cloud", cta: "Subscribe" },
    ],
  },

  cloud_pro: {
    texts: [
      "**Pro Plan** — ₹12,900 / month + ₹1,000 one-time setup\n\n• 600 unrestricted compute hours / month\n• High-Throughput Node engine\n• **OpenAI GPT-4o & o1** — 250 hrs quota\n• **Google Gemini 2.0 Flash & 1.5 Pro** — 450 hrs quota\n• Open-source LLMs (Llama 3.3 70B)\n• Advanced telemetry dashboard\n• Priority chat & email support\n\nOur most popular plan — best value for developers and teams.",
    ],
    quickReplies: ["Enterprise Plan", "Subscribe Now", "Compare All Plans"],
    cards: [
      { title: "Get Pro Plan", desc: "₹12,900/mo — best value for teams", link: "/dev/cloud", cta: "Subscribe" },
    ],
  },

  cloud_enterprise: {
    texts: [
      "**Enterprise Plan** — ₹17,900 / month + ₹1,200 one-time setup\n\n• 1,000 dedicated compute hours / month\n• Bare-Metal / Dedicated engine\n• **OpenAI GPT** — 250 hrs quota\n• **Google Gemini** — 450 hrs quota\n• **Anthropic Claude 3.5 Sonnet & Opus** — Full Enterprise Access\n• Open-source LLMs + **Dedicated NVIDIA GPU** acceleration\n• MATLAB Suite included\n• Enterprise telemetry dashboard\n• 24/7 Priority SLA + Lead Engineer support\n\nThe full powerhouse for demanding workloads.",
    ],
    quickReplies: ["Subscribe Now", "Pro Plan", "Contact Sales"],
    cards: [
      { title: "Get Enterprise", desc: "₹17,900/mo — full powerhouse", link: "/dev/cloud", cta: "Subscribe" },
      { title: "Contact Sales", desc: "Need a custom enterprise setup?", link: "/dev/contact", cta: "Talk to Us" },
    ],
  },

  cloud_rental: {
    texts: [
      "**Cloud Rent** — Pay only for what you use\n\n• **₹1 upfront** (non-refundable) to activate\n• **₹200 per 20 hours** of compute time\n• Slab billing: partial slabs rounded up\n• Choose duration: 1, 3, 7, 15, or 30 days\n• Bill + Razorpay payment link emailed after rental ends\n• **One active rental per email** at a time\n\nPerfect for short-term projects, testing, or burst compute needs.",
    ],
    quickReplies: ["Rent Now", "Cloud Subscriptions", "Contact Us"],
    cards: [
      { title: "Rent Cloud", desc: "Pay-per-use compute starting at ₹1", link: "/dev/cloud", cta: "Rent Now" },
    ],
  },

  cloud_compare: {
    texts: [
      "Here's a side-by-side comparison:\n\n| Feature | Starter | Pro | Enterprise |\n|---|---|---|---|\n| Compute | 300 hrs/15d | 600 hrs/mo | 1000 hrs/mo |\n| Engine | Standard VM | High-Throughput | Bare-Metal/GPU |\n| Llama 3.3 | ✅ | ✅ | ✅ |\n| GPT-4o/o1 | ❌ | 250 hrs | 250 hrs |\n| Gemini | ❌ | 450 hrs | 450 hrs |\n| Claude | ❌ | ❌ | ✅ Full |\n| Setup Fee | ₹100 | ₹1,000 | ₹1,200 |\n\n**Bottom line:** Starter for trying out, Pro for serious development, Enterprise for AI-heavy workloads.",
    ],
    quickReplies: ["Subscribe Now", "Rent Instead", "Contact Sales"],
  },

  // ── Cloud FAQ ──────────────────────────────────────────────────

  cloud_faq_compute: {
    texts: [
      "**Compute hours** represent your dedicated execution runtime on our cloud infrastructure.\n\n• **Starter:** 300 hours split into two 150-hour halves per 15-day billing cycle\n• **Pro & Enterprise:** Unrestricted monthly pools that reset every 30 days\n\nYour usage is tracked in real-time on your cloud dashboard. Unused hours don't roll over.",
    ],
    quickReplies: ["Pause Subscription", "AI Model Access", "View Plans"],
  },

  cloud_faq_pause: {
    texts: [
      "**Yes, you can pause and resume your subscription at any time** through the Cloud Dashboard.\n\n• Pausing freezes your runtime counter and billing\n• Your configuration and data are preserved\n• Resume reactivates everything where you left off\n\nNo penalty for pausing — you only pay for active periods.",
    ],
    quickReplies: ["Upgrade Plan", "Cloud Plans", "Contact Support"],
  },

  cloud_faq_ai: {
    texts: [
      "**AI Model API access** works through a unified API gateway:\n\n• Active subscription gives you API gateway keys in your dashboard\n• Connect to GPT-4o, Gemini, Claude, Llama — all through one endpoint\n• No need for separate provider accounts or API keys\n\n**Model availability by plan:**\n• **Starter:** Llama 3.3 70B only\n• **Pro:** GPT-4o/o1 (250 hrs) + Gemini Flash/Pro (450 hrs) + Llama\n• **Enterprise:** Everything in Pro + Claude 3.5 Sonnet/Opus + Dedicated GPU",
    ],
    quickReplies: ["Pro Plan", "Enterprise Plan", "Cloud Plans"],
  },

  cloud_faq_setup: {
    texts: [
      "The **one-time setup fee** covers your initial infrastructure provisioning:\n\n• Dedicated compute namespace isolation\n• Secure credential generation\n• VPC container configuration\n• Allocated rate-limit quotas\n\nThis is charged once when you first subscribe. Plan changes don't require a new setup fee.",
    ],
    quickReplies: ["Cloud Plans", "Contact Us"],
  },

  cloud_faq_upgrade: {
    texts: [
      "You can **upgrade or downgrade your plan anytime** from the Cloud Dashboard.\n\n• Changes are scheduled for your next renewal\n• **Starter:** changes take effect at the 15-day renewal\n• **Pro/Enterprise:** changes take effect at the monthly renewal\n• No penalty or extra fees for switching\n\nThe new pricing applies from the next billing cycle.",
    ],
    quickReplies: ["View Plans", "Cloud Dashboard", "Contact Us"],
  },

  // ── Quick Start ────────────────────────────────────────────────

  quick_start: {
    texts: [
      "**Quick Start** is our priority service for ₹99 (non-refundable):\n\n• Response within **48 hours**\n• Direct engineer communication\n• Priority queue — jump ahead of standard requests\n• Available for Web, Android, and Custom Software projects\n\nIt's the fastest way to get your project started with us.",
    ],
    quickReplies: ["Start Quick Start", "Start a Project", "Cloud Plans"],
    cards: [
      { title: "Quick Start", desc: "₹99 one-time — priority response under 48 hours", link: "/dev/quick-start", cta: "Get Started" },
    ],
  },

  // ── Company ────────────────────────────────────────────────────

  about_company: {
    texts: [
      "**DEV Infinity** is a modern engineering agency — we call ourselves \"Software Builders.\"\n\n**Our mission:** To fuel businesses with high-performance technology. We push for sharper execution and better product clarity.\n\n**By the numbers:**\n• 50+ projects delivered\n• 98% client satisfaction\n• 24/7 support available\n\nWe build web apps, payment flows, dashboards, and automations for teams that need momentum — without the generic agency fog.",
    ],
    quickReplies: ["Our Services", "Portfolio", "Start a Project"],
  },

  portfolio: {
    texts: [
      "Here are some projects we've delivered:\n\n• **FinTech Dashboard** — Next.js, WebSocket, PostgreSQL\n• **HealthVote (Mobile App)** — React Native, Node.js, MongoDB\n• **Nexus CRM (SaaS)** — Vue.js, Python, TensorFlow\n• **EduLearn Platform** — Next.js, AWS, Redis\n• **LogiTrack (Enterprise)** — React, GraphQL, Kubernetes\n• **CryptoWallet (Web3)** — React, Web3.js, Solidity\n\nEach project was built end-to-end by our team.",
    ],
    quickReplies: ["Start a Project", "Our Services", "Contact Us"],
  },

  // ── Contact & Messaging ────────────────────────────────────────

  contact: {
    texts: [
      "I can help you reach the team right here! I can collect your message and make sure it gets to the right person.\n\n**Or reach out directly:**\n• Email: mitraricky06@gmail.com\n• Phone: +91 99079 58859\n• Response time: within 24 hours\n\nWant me to take a message for you?",
    ],
    quickReplies: ["Send a Message", "Start a Project", "Cloud Plans"],
  },

  project_request: {
    texts: [
      "Great to hear you're interested in working with us! I can walk you through it quickly.\n\nWhat type of project are you looking to build?",
    ],
    quickReplies: ["Web Platform", "Mobile App", "Custom Software", "AI Solution"],
    action: "start_project_flow",
  },

  whatsapp: {
    texts: [
      "You can reach us directly on WhatsApp for a quick conversation:\n\n• **Phone/WhatsApp:** +91 99079 58859\n• We typically respond within an hour during business hours\n\nOr I can collect your details here and have the team reach out to you.",
    ],
    quickReplies: ["Send a Message", "Start a Project", "Our Services"],
    cards: [
      { title: "Chat on WhatsApp", desc: "Message us directly for a quick response", link: "https://wa.me/919907958859?text=Hi%20DEV%20Infinity%2C%20I%27d%20like%20to%20discuss%20a%20project", cta: "Open WhatsApp", external: true },
    ],
  },

  support_help: {
    texts: [
      "If you're experiencing an issue or need technical support:\n\n• **Email us** at mitraricky06@gmail.com with details\n• **Cloud Dashboard issues** — mention your registered email\n• **Payment issues** — include your order ID if you have one\n\nWe typically resolve support requests within 24 hours. For urgent cloud issues, Pro and Enterprise subscribers get priority support.",
    ],
    quickReplies: ["Cloud Dashboard", "Contact Us", "WhatsApp"],
  },

  // ── Legal ──────────────────────────────────────────────────────

  terms: {
    texts: [
      "Our Terms of Service cover:\n\n• Services (software dev + cloud)\n• Quick Start & payment terms\n• Cloud subscription & rental terms\n• Billing, cancellation, and acceptable use\n• Intellectual property ownership\n• Limitation of liability\n\nYou can read the full terms on our website.",
    ],
    quickReplies: ["Read Full Terms", "Privacy Policy", "Contact Us"],
    links: { "Read Full Terms": "/dev/terms" },
  },

  privacy: {
    texts: [
      "Our Privacy Policy covers how we collect, use, and protect your personal data. We follow industry-standard practices for data security and comply with applicable regulations.\n\nYou can read the complete policy on our website.",
    ],
    quickReplies: ["Read Privacy Policy", "Terms of Service", "Contact Us"],
    links: { "Read Privacy Policy": "/dev/privacy-policy", "Terms of Service": "/dev/terms" },
  },

  // ── Navigation ─────────────────────────────────────────────────

  navigation: {
    texts: [
      "I can help you find what you're looking for! Where would you like to go?",
    ],
    quickReplies: ["Services", "Cloud Plans", "About Us", "Contact"],
  },

  // ── Human handoff ──────────────────────────────────────────────

  human_handoff: {
    texts: [
      "I'd like to connect you with our team for a more personal conversation.\n\nYou can:\n• **Email** us at mitraricky06@gmail.com\n• **WhatsApp** us at +91 99079 58859\n• **Fill the contact form** on our website\n\nWe typically respond within a few hours during business time.",
    ],
    quickReplies: ["Send a Message", "WhatsApp", "Contact Page"],
    cards: [
      { title: "WhatsApp", desc: "Quick chat with our team", link: "https://wa.me/919907958859?text=Hi%2C%20I%20was%20chatting%20with%20your%20bot%20and%20would%20like%20to%20speak%20to%20someone", cta: "Open", external: true },
      { title: "Contact Form", desc: "Send a detailed message", link: "/dev/contact", cta: "Open" },
    ],
  },
};

// ── Keyword → intent mapping (for intents not in ML model) ──────

export const KEYWORD_INTENTS = {
  process: ["process", "methodology", "how do you work", "approach", "workflow", "agile", "sprint", "development process", "how do you build", "steps"],
  tech_stack: ["tech stack", "technologies", "what technologies", "what tech", "frameworks", "tools you use", "what do you use", "language", "programming", "react vs", "next.js vs", "flutter vs"],
  team: ["team", "who builds", "who works", "developers", "engineers", "how many people", "team size", "who will work", "your team"],
  pricing: ["pricing", "how much", "cost", "rates", "charge", "price", "quote", "estimation", "budget", "expensive", "affordable", "cheap"],
  timeline_delivery: ["timeline", "how long", "delivery time", "turnaround", "how fast", "when will it", "deadline", "delivery", "ship", "duration", "estimated time"],
  testimonials: ["testimonial", "review", "feedback", "what clients say", "reputation", "past clients", "customer review", "rating", "satisfaction"],
  refund_cancellation: ["refund", "cancellation", "cancel", "money back", "return policy", "cancel subscription", "cancel plan", "cancel rental"],
  competitors: ["why you", "compared to", "vs other", "difference from", "better than", "unique", "what makes you", "why choose", "advantage"],
  location_office: ["location", "office", "where are you", "based in", "address", "city", "where is dev", "headquarters"],
  comparison_react_nextjs: ["react vs next", "nextjs vs react", "difference react next", "when to use next", "when to use react", "next.js or react"],
  react_vs_flutter: ["react native vs flutter", "flutter vs react", "which is better react native or flutter", "rn vs flutter", "mobile framework"],
  whatsapp: ["whatsapp", "whats app", "chat on whatsapp", "message on whatsapp", "direct chat", "talk to someone"],
  support_help: ["support", "help", "issue", "problem", "bug", "not working", "error", "technical support", "troubleshoot", "cloud issue"],
  cloud_compare: ["compare", "comparison", "difference between plans", "which plan", "plan comparison", "all plans", "vs plan"],
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
  "Compare All Plans": { intent: "cloud_compare" },
  "Compare Plans": { intent: "cloud_compare" },
  "Subscribe Now": { link: "/dev/cloud" },
  "Contact Sales": { link: "/dev/contact" },
  "Contact Support": { link: "/dev/contact" },
  "Contact Us": { link: "/dev/contact" },
  "Contact Page": { link: "/dev/contact" },
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
  "Database & Backend": { intent: "service_database" },
  "Security & Compliance": { intent: "service_security" },
  // New routes
   "Our Process": { intent: "process" },
  "Our Team": { intent: "team" },
  "Our Portfolio": { intent: "portfolio" },
  "Testimonials": { intent: "testimonials" },
  "Pricing": { intent: "pricing" },
  "Quick Start": { intent: "quick_start" },
  "WhatsApp": { intent: "whatsapp" },
  "Talk to Human": { intent: "human_handoff" },
  "Connect to Team": { intent: "human_handoff" },
};

// ── Fallback responses (when confidence is low) ─────────────────

export const FALLBACK_RESPONSES = [
  {
    texts: ["I'm not sure I understood that. Here are some things I can help with:"],
    quickReplies: ["Our Services", "Cloud Plans", "Start a Project", "Contact Us"],
  },
  {
    texts: ["I didn't quite catch that. Could you rephrase it? Or pick a topic:"],
    quickReplies: ["Cloud Pricing", "Our Portfolio", "Send a Message"],
  },
  {
    texts: ["Hmm, that's outside my current knowledge. But I can connect you with the team!"],
    quickReplies: ["Talk to Human", "Contact Us", "Cloud Plans"],
  },
];

// Human handoff threshold
export const HUMAN_HANDOFF_THRESHOLD = 2;

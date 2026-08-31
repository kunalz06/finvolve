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
      `Here's what our clients say about working with us:\n\n• *"They delivered our fintech dashboard in record time. The real-time features are flawless."* — FinTech Startup\n\n• *"The mobile app exceeded our expectations. Smooth performance on both iOS and Android."* — HealthVote Team\n\n• *"DEV Infinity built our entire SaaS platform from scratch. It scales beautifully."* — Nexus CRM\n\n• *"Quick turnaround, clean code, and they actually listen to feedback."* — EduLearn\n\n**98% client satisfaction** across 50+ projects.`,
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

  // ── Additional Services ───────────────────────────────────────

  service_ecommerce: {
    texts: [
      "We build complete e-commerce solutions tailored to your business:\n\n• **Storefront:** Custom product catalogs, search, filters, wishlists\n• **Checkout & Payments:** Razorpay, Stripe, UPI, net banking integration\n• **Inventory:** Real-time stock management, low-stock alerts\n• **Admin Panel:** Order management, analytics, customer insights\n• **Performance:** Sub-2s page loads, CDN-optimized assets\n\nWe have built e-commerce platforms for retail, D2C brands, and service businesses.",
      "Our e-commerce development covers everything from storefront to checkout:\n\n• Custom storefronts with Next.js for SEO-optimized product pages\n• Secure payment integration (Razorpay, Stripe, UPI)\n• Real-time inventory tracking and order management\n• Admin dashboards with sales analytics\n• Mobile-responsive design that converts\n\nWe build on modern stacks: Next.js + Node.js + PostgreSQL, optimized for speed.",
      "Looking for an online store? We build end-to-end e-commerce platforms:\n\n• **Frontend:** Next.js or React with server-side rendering\n• **Backend:** Node.js or Python with REST/GraphQL APIs\n• **Database:** PostgreSQL for products/orders, Redis for sessions\n• **Payments:** Razorpay, Stripe, UPI, net banking\n• **Admin:** Full-featured dashboard for managing products, orders, and customers\n\nWant to discuss your e-commerce project?",
    ],
    quickReplies: ["Start a Project", "Pricing", "Our Portfolio"],
  },

  service_api: {
    texts: [
      "API development is one of our core strengths. We build:\n\n• **REST APIs** — Clean, documented, versioned endpoints with OpenAPI specs\n• **GraphQL APIs** — Flexible queries for complex data requirements\n• **WebSocket APIs** — Real-time bidirectional communication\n• **Third-party integrations** — Payment gateways, CRMs, email services, analytics\n• **API gateways** — Rate limiting, auth, caching, monitoring\n\nEvery API we ship comes with documentation, error handling, and authentication built in.",
      "Need APIs? We design and build robust API solutions:\n\n• RESTful and GraphQL APIs with full documentation\n• Authentication (JWT, OAuth 2.0, API keys)\n• Rate limiting, caching, and request validation\n• Database design and optimization for API performance\n• Third-party service integrations\n\nWhether you need a public API or internal microservices, we have got you covered.",
    ],
    quickReplies: ["Start a Project", "Our Tech Stack", "Contact Us"],
  },

  service_devops: {
    texts: [
      "We handle DevOps and deployment as part of our delivery:\n\n• **CI/CD pipelines** — Automated testing and deployment with GitHub Actions\n• **Containerization** — Docker for consistent environments\n• **Cloud hosting** — Vercel, AWS, GCP, or your preferred provider\n• **Domain & SSL** — HTTPS setup, custom domains\n• **Monitoring** — Uptime checks, error tracking, performance metrics\n• **Backups** — Automated database backups with point-in-time recovery\n\nYou get a production-ready deployment on day one.",
      "DevOps is baked into every project we deliver:\n\n• Automated CI/CD with GitHub Actions or similar\n• Docker containerization for consistent deployments\n• Production and staging environments\n• SSL, domain configuration, and CDN setup\n• Monitoring and alerting for uptime\n\nWe handle the infrastructure so you can focus on your business.",
    ],
    quickReplies: ["Start a Project", "Our Process", "Cloud Plans"],
  },

  service_maintenance: {
    texts: [
      "Post-launch support is included with every project we deliver. Here is what you get:\n\n• **30-day free bug fixes** after delivery for any issues found\n• **Performance monitoring** — We set up error tracking and alerting\n• **Knowledge transfer** — Documentation, code walkthroughs\n• **Optional retainer** — Ongoing monthly support for feature additions\n\nIf something breaks within the first month, we fix it free of charge.",
      "We do not disappear after delivery. Our support model:\n\n• **30-day warranty** — Free bug fixes for any post-launch issues\n• **Documentation** — Full project docs, deployment guides, API references\n• **Code handover** — Clean, commented code you own 100%\n• **Ongoing support** — Available on retainer for continued maintenance\n\nMost of our clients continue working with us long after the initial delivery.",
    ],
    quickReplies: ["Start a Project", "Pricing", "Contact Us"],
  },

  service_dashboard: {
    texts: [
      "Dashboards and admin panels are one of our specialties. We build:\n\n• **Analytics dashboards** — Real-time charts, KPIs, data visualization\n• **Admin panels** — Content management, user management, settings\n• **Financial dashboards** — Revenue tracking, expense reports, forecasts\n• **Real-time updates** — WebSocket-powered live data feeds\n\nWe use charting libraries like ECharts, Recharts, or D3.js depending on complexity.",
      "We create powerful, real-time dashboards:\n\n• Real-time data visualization with ECharts or Recharts\n• Responsive layouts that work on desktop and tablet\n• Role-based access control for different user types\n• Export to CSV/PDF functionality\n• Custom filters, date ranges, and drill-down views\n\nWhether it is internal tools or client-facing analytics, we deliver polished dashboards.",
    ],
    quickReplies: ["Start a Project", "Our Portfolio", "Contact Us"],
  },

  service_automation: {
    texts: [
      "Automation is where we deliver the most ROI for clients. We build:\n\n• **Workflow automation** — Automate repetitive business processes\n• **Email automation** — Triggered campaigns, drip sequences, notifications\n• **Data pipelines** — ETL, data sync between systems, scheduled reports\n• **Document automation** — Invoice generation, report creation, compliance docs\n\nAutomation typically pays for itself within the first 2-3 months.",
      "Looking to automate workflows? Here is what we can do:\n\n• Identify repetitive processes in your business\n• Design automated workflows with proper error handling\n• Integrate with your existing tools (email, CRM, spreadsheets)\n• Build dashboards to monitor automation performance\n\nTell us what you want to automate and we will suggest the best approach.",
    ],
    quickReplies: ["Start a Project", "Pricing", "Contact Us"],
  },

  service_web3: {
    texts: [
      "Yes, we work with Web3 and blockchain technologies:\n\n• **Smart contracts** — Solidity development, testing, deployment\n• **DApps** — Decentralized applications with Web3.js/Ethers.js\n• **Token creation** — ERC-20, ERC-721 token standards\n• **Wallet integration** — MetaMask, WalletConnect, Coinbase Wallet\n• **NFT platforms** — Minting, marketplace, metadata management\n\nWe have built crypto wallets and DeFi interfaces for clients.",
      "We have experience building decentralized applications:\n\n• Smart contracts in Solidity with full test coverage\n• React/Next.js frontends with Web3 wallet integration\n• NFT marketplaces and token-gated content\n• DeFi dashboards with real-time blockchain data\n\nWe can help you go from concept to deployed contract.",
    ],
    quickReplies: ["Start a Project", "Our Portfolio", "Contact Us"],
  },

  payment_methods: {
    texts: [
      "We accept multiple payment methods:\n\n**For project work:**\n• UPI (GPay, PhonePe, Paytm)\n• Bank transfer (NEFT/IMPS)\n• Razorpay payment links\n• International: PayPal, Wise\n\n**For cloud subscriptions:**\n• Razorpay (credit/debit cards, UPI, net banking)\n• Automated recurring billing\n\nWe send payment links via email for easy checkout.",
      "Here is how you can pay for our services:\n\n• **UPI** — Google Pay, PhonePe, Paytm, or any UPI app\n• **Bank Transfer** — NEFT/IMPS to our account\n• **Razorpay** — Credit card, debit card, net banking via payment link\n• **International** — PayPal or Wise transfer\n\nFor cloud subscriptions, billing is handled automatically through Razorpay.",
    ],
    quickReplies: ["Start a Project", "Get a Quote", "Cloud Plans"],
  },

  revisions: {
    texts: [
      "Our revision policy is straightforward:\n\n• **Per milestone:** Up to 2 rounds of revisions included\n• **Scope changes:** If the change is outside the original brief, we provide a revised estimate\n• **Bug fixes:** Always free, even after delivery (30-day warranty)\n• **Design revisions:** We iterate on designs before development starts\n\nWe believe in getting it right rather than counting revision rounds.",
      "We want you to be happy with the result. Here is how revisions work:\n\n• 2 rounds of revisions per milestone are included in the price\n• Minor tweaks and bug fixes are always free\n• Major scope changes may need a revised estimate\n• We share progress regularly so there are no surprises\n\nMost projects need very few revisions because we align on requirements upfront.",
    ],
    quickReplies: ["Start a Project", "Contact Us", "Pricing"],
  },

  communication: {
    texts: [
      "Communication is a big part of why clients stick with us:\n\n• **Direct access** — You talk to the engineers building your product, not account managers\n• **Updates** — Progress updates every 2-3 days via your preferred channel\n• **Channels** — WhatsApp, email, Google Meet, or Slack\n• **Transparency** — Real-time progress tracking, no black boxes\n• **Response time** — We reply within a few hours during business hours\n\nNo middlemen, no runaround. Direct communication throughout.",
      "You will never be in the dark during your project. Here is how we stay in touch:\n\n• Progress updates every 2-3 days\n• Direct WhatsApp chat with your engineer\n• Video calls for demos and reviews\n• Shared project board for task tracking\n\nWe over-communicate rather than under-communicate.",
    ],
    quickReplies: ["Start a Project", "Our Process", "Contact Us"],
  },

  deployment_hosting: {
    texts: [
      "We handle deployment as part of every project delivery:\n\n• **Hosting setup** — Vercel, AWS, GCP, or your preferred provider\n• **Domain & DNS** — Configure your domain, SSL certificates, CDN\n• **CI/CD** — Automated deployments on every code push\n• **Environments** — Separate staging and production setups\n• **Monitoring** — Error tracking, uptime monitoring, performance alerts\n\nYour project goes live production-ready, not just code-complete.",
      "Deployment and hosting are included. Here is our approach:\n\n• We set up the production environment as part of delivery\n• SSL, domain, and CDN configuration included\n• Automated CI/CD pipeline for future updates\n• Staging environment for testing before production\n\nHosting costs (AWS, Vercel, etc.) are typically $5-20/month depending on traffic.",
    ],
    quickReplies: ["Start a Project", "Cloud Plans", "Our Process"],
  },

  scalability: {
    texts: [
      "Scalability is designed into our architecture from day one:\n\n• **Database** — Indexed queries, connection pooling, read replicas when needed\n• **Caching** — Redis for sessions, API responses, and frequently accessed data\n• **CDN** — Static assets served from edge locations globally\n• **Horizontal scaling** — Stateless architecture that can add more instances\n• **Load testing** — We test with projected traffic before launch\n\nWhether you have 100 users or 100,000, the architecture supports it.",
      "We build systems that grow with your business:\n\n• Modular architecture that allows adding features without rewrites\n• Database optimization for high read/write throughput\n• Caching layers (Redis, CDN) for fast response times\n• Microservices-ready design for complex systems\n\nWe plan for 10x growth from the start so you are not rebuilding in 6 months.",
    ],
    quickReplies: ["Start a Project", "Our Tech Stack", "Contact Us"],
  },

  uptime_sla: {
    texts: [
      "Our uptime and reliability commitment:\n\n• **99.9% uptime target** for all production deployments\n• **Automated monitoring** with instant alerts for downtime\n• **30-minute response time** for critical issues (business hours)\n• **Regular backups** — Daily automated database backups\n• **Incident post-mortems** — Every issue gets a root cause analysis\n\nCloud platform uptime depends on the underlying infrastructure provider.",
      "Here is what we guarantee for uptime and reliability:\n\n• 99.9% uptime target for production applications\n• Automated health checks and error alerting\n• Daily database backups with point-in-time recovery\n• Proactive monitoring, not just reactive fixes\n\nWe set up monitoring before launch so we catch issues before you do.",
    ],
    quickReplies: ["Cloud Plans", "Contact Sales", "Start a Project"],
  },

  industries: {
    texts: [
      "We work across a wide range of industries:\n\n• **Fintech** — Payment flows, dashboards, trading platforms\n• **Healthcare** — Patient portals, appointment systems, HealthVote app\n• **Education** — Learning platforms, assessment tools (EduLearn)\n• **E-commerce** — Online stores, marketplaces, D2C brands\n• **SaaS** — Multi-tenant platforms, subscription systems (Nexus CRM)\n• **Logistics** — Tracking systems, fleet management (LogiTrack)\n• **Real Estate** — Property listings, CRM, booking systems\n\nOur tech is industry-agnostic. We adapt to your domain.",
      "Our experience spans multiple sectors:\n\n• Fintech (dashboards, payment integrations)\n• Healthcare (mobile apps, patient management)\n• Education (online learning platforms)\n• SaaS (CRM, multi-tenant platforms)\n• E-commerce (marketplaces, D2C stores)\n• Logistics (tracking, fleet management)\n\nEach industry has unique requirements and we tailor our approach accordingly.",
    ],
    quickReplies: ["Start a Project", "Our Portfolio", "Contact Us"],
  },

  discounts: {
    texts: [
      "We offer a few ways to get the best value:\n\n• **Quick Start** — Priority service for a one-time fee, ideal for small projects\n• **Bundle pricing** — Get a discount when you combine web + mobile development\n• **Long-term projects** — Larger projects get better per-feature pricing\n• **Referral bonus** — Refer a client and both of you get a discount\n• **Repeat clients** — Returning clients get priority rates\n\nContact us with your project details and we will give you the best quote we can.",
      "Here is how you can get the most competitive pricing:\n\n• Start with Quick Start to get priority onboarding\n• Bundle multiple services (web + mobile + backend) for better rates\n• Long-term engagements get discounted monthly rates\n• Referral program: refer a client and both get 10% off\n\nThe best way to get an accurate price is to tell us about your project.",
    ],
    quickReplies: ["Start a Project", "Get a Quote", "Quick Start"],
  },

  internship: {
    texts: [
      "We are always open to hearing from talented people. Here is how to connect:\n\n• **Email your resume** to mitraricky06@gmail.com\n• **Share your work** — GitHub, portfolio, or any projects you have built\n• **Mention what excites you** — Web, mobile, AI, cloud, or all of the above\n• **We look for:** Strong fundamentals, curiosity, and willingness to learn\n\nWe offer hands-on experience with real client projects, not just tutorials.",
      "Interested in joining DEV Infinity? Here is what you should know:\n\n• We are a small, focused team that works on real products\n• You will get hands-on experience with modern tech stacks\n• Remote-friendly with flexible hours\n• Send your resume and portfolio to mitraricky06@gmail.com\n\nWe value skills and curiosity over degrees.",
    ],
    quickReplies: ["Contact Us", "Start a Project", "About Us"],
  },

  partnerships: {
    texts: [
      "We are open to partnerships and collaborations. Here is how we work with partners:\n\n• **Agency partnerships** — White-label development for design agencies\n• **Tech partnerships** — Joint solutions with complementary tech providers\n• **Referral partnerships** — Earn commissions for referring clients\n• **Open source collaboration** — Co-building tools and libraries\n\nIf you have a partnership idea, email us at mitraricky06@gmail.com.",
      "Looking to partner with us? Here is what that could look like:\n\n• White-label development: We build, you brand and deliver\n• Referral program: Earn a commission for every referred client\n• Co-development: Joint projects where we handle the tech\n\nReach out at mitraricky06@gmail.com to discuss.",
    ],
    quickReplies: ["Contact Us", "Start a Project", "About Us"],
  },

  open_source: {
    texts: [
      "We believe in and contribute to open source:\n\n• We use open-source tools extensively (React, Next.js, PostgreSQL, Redis)\n• We contribute back to the community when possible\n• Our cloud platform provides access to open-source LLMs (Llama 3.3 70B)\n• We prefer open-source solutions over proprietary ones when quality is comparable\n\nOpen source keeps costs low for our clients while delivering enterprise-grade quality.",
      "Open source is part of our DNA:\n\n• Our entire tech stack is built on open-source tools\n• We leverage Llama 3.3 and other open-source models on our cloud platform\n• When possible, we recommend open-source solutions to keep your costs down\n\nWe believe in building on the shoulders of giants.",
    ],
    quickReplies: ["Our Services", "Our Tech Stack", "Contact Us"],
  },

  free_consultation: {
    texts: [
      "We offer a free initial consultation for every project. Here is how it works:\n\n1. You tell us about your idea or requirement\n2. We assess feasibility, suggest a tech stack, and outline an approach\n3. You get a rough timeline and budget estimate\n4. No obligation — take the consultation and decide at your pace\n\nThe fastest way is through our project request form.",
      "Yes! Every project starts with a free consultation:\n\n• Share your idea via the project request form or chat\n• We respond with a feasibility assessment and tech recommendation\n• You get a timeline and budget estimate\n• Zero obligation — decide when you are ready\n\nOr skip the queue with Quick Start for priority response within 48 hours.",
    ],
    quickReplies: ["Start a Project", "Get a Quote", "Quick Start"],
    cards: [
      {"title": "Start a Project", "desc": "Free consultation included", "link": "/dev/request", "cta": "Get Started"},
      {"title": "Quick Start", "desc": "Priority service", "link": "/dev/quick-start", "cta": "View"},
    ],
  },

  source_code: {
    texts: [
      "Yes, you own the source code. Here is our policy:\n\n• **Full ownership** — Source code is 100% yours upon delivery and payment\n• **No lock-in** — You can host it anywhere, modify it freely\n• **Documentation** — We provide code docs and deployment guides\n• **Repository access** — GitHub/GitLab repo transferred to you\n• **No licensing fees** — No recurring fees for using your own code\n\nWe build it for you, you own it. Simple as that.",
      "Full source code ownership is part of every project:\n\n• You get the complete source code repository\n• Full rights to modify, redistribute, and resell\n• We transfer the GitHub/GitLab repo to your account\n• No vendor lock-in or licensing restrictions\n\nThis is non-negotiable — you own what you pay for.",
    ],
    quickReplies: ["Start a Project", "Our Process", "Contact Us"],
  },

  nda: {
    texts: [
      "We take confidentiality seriously:\n\n• **NDA available** — We can sign an NDA before project discussions begin\n• **Secure communication** — All project details shared via secure channels\n• **No portfolio sharing** — We do not share your project details publicly without permission\n• **Data protection** — All project files and credentials are handled securely\n\nJust ask and we will send over our standard NDA for review.",
      "NDA and IP protection is standard practice for us:\n\n• We sign NDAs before diving into project details\n• Your intellectual property remains yours throughout and after the project\n• We do not share or publish your project without explicit permission\n• All communications and files are kept confidential\n\nRequest an NDA via email at mitraricky06@gmail.com.",
    ],
    quickReplies: ["Start a Project", "Contact Us", "Our Process"],
  },

  gdpr_compliance: {
    texts: [
      "Data compliance is built into our development process:\n\n• **Data encryption** — At rest (AES-256) and in transit (TLS 1.3)\n• **Access control** — Role-based permissions, minimum-privilege principle\n• **Data minimization** — We only collect what is necessary\n• **Consent management** — Cookie consent, privacy policy integration\n• **Audit trails** — Logging for sensitive operations\n\nWe follow OWASP guidelines for web application security.",
      "We take data protection seriously:\n\n• All data encrypted in transit (HTTPS/TLS) and at rest\n• Role-based access control for all applications\n• Regular security audits and vulnerability scanning\n• GDPR-compliant data handling practices\n• Privacy policy and cookie consent built into every project\n\nSecurity is not an afterthought — it is part of our development checklist.",
    ],
    quickReplies: ["Start a Project", "Security & Compliance", "Contact Us"],
  },

  cloud_faq_data: {
    texts: [
      "Data handling and storage on DEV Cloud:\n\n• **Session data** — Isolated per user, cleared on session end\n• **API usage** — Logged for quota tracking and abuse prevention\n• **No data selling** — We never sell or share your data\n• **Data retention** — You can request data deletion at any time\n• **Encryption** — All data encrypted in transit and at rest\n\nYour code and data on our cloud remain private and secure.",
      "Here is how we handle your data on the cloud platform:\n\n• Each user gets isolated compute resources\n• API requests are logged for quota management only\n• No data is shared with third parties\n• You can request full data deletion via email\n\nPrivacy and security are foundational to our cloud platform.",
    ],
    quickReplies: ["Cloud Plans", "Security & Compliance", "Contact Support"],
  },

  cloud_faq_regions: {
    texts: [
      "Our cloud infrastructure is currently hosted in India:\n\n• Data centers in India for low-latency access\n• Ideal for Indian businesses and users\n• All data stored and processed within India\n• Compliant with Indian data localization requirements\n\nWe plan to expand to additional regions based on demand.",
      "DEV Cloud runs on Indian data centers:\n\n• Hosted in India for the best latency for Indian users\n• Data residency within India (compliant with local regulations)\n• Low-latency API responses for AI model inference\n\nCurrently available in India. We are evaluating expansion to other regions.",
    ],
    quickReplies: ["Cloud Plans", "Contact Sales", "Start a Project"],
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
  service_ecommerce: ["ecommerce", "e-commerce", "online store", "online shop", "shopping cart", "product catalog", "online shopping", "sell online", "storefront", "marketplace"],
  service_api: ["api", "rest api", "graphql", "api development", "api integration", "endpoint", "backend api", "microservice"],
  service_devops: ["devops", "deployment", "hosting", "ci/cd", "cicd", "docker", "kubernetes", "aws", "cloud hosting", "deploy"],
  service_maintenance: ["maintenance", "support", "after launch", "post launch", "warranty", "bug fix", "ongoing support", "retainer"],
  service_dashboard: ["dashboard", "admin panel", "analytics", "report", "data visualization", "chart", "kpi", "admin"],
  service_automation: ["automation", "automate", "workflow", "bot", "script", "scheduled", "cron", "batch process", "repetitive"],
  service_web3: ["web3", "blockchain", "crypto", "smart contract", "nft", "defi", "solidity", "decentralized", "token", "dapp"],
  payment_methods: ["payment method", "how to pay", "pay you", "payment option", "upi", "razorpay", "stripe", "paypal"],
  revisions: ["revision", "changes after", "modify later", "edit after delivery", "change request", "iterate"],
  communication: ["communication", "how do you communicate", "updates", "progress", "stay in touch", "contact during project", "reporting"],
  deployment_hosting: ["where hosted", "hosting included", "server", "domain", "ssl", "cdn", "go live", "launch"],
  scalability: ["scalability", "scale", "performance", "traffic", "load", "speed", "optimize", "slow", "handle users"],
  uptime_sla: ["uptime", "sla", "reliability", "downtime", "guarantee", "backup", "disaster recovery"],
  industries: ["industry", "industries", "sector", "domain", "vertical", "what industries", "which industries"],
  discounts: ["discount", "offer", "coupon", "deal", "cheaper", "reduce price", "negotiate", "bulk pricing"],
  internship: ["internship", "intern", "job", "career", "hiring", "join", "work with you", "vacancy", "opening"],
  partnerships: ["partner", "partnership", "collaborate", "collaboration", "joint venture", "white label", "referral program"],
  open_source: ["open source", "oss", "contribute", "community", "free software"],
  free_consultation: ["free consultation", "free call", "free quote", "no obligation", "just looking", "exploring", "not sure yet"],
  source_code: ["source code", "code ownership", "own the code", "code rights", "ip ownership", "intellectual property", "who owns"],
  nda: ["nda", "non disclosure", "confidentiality", "confidential", "secrecy", "privacy agreement", "ip protection"],
  gdpr_compliance: ["gdpr", "compliance", "data protection", "privacy law", "security audit", "owasp", "hipaa"],
  cloud_faq_data: ["cloud data", "data storage", "data privacy", "where is my data", "data retention", "data security", "cloud privacy"],
  cloud_faq_regions: ["region", "data center", "location of server", "where hosted", "server location", "india server", "data residency"],
};

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
  // Additional service routes
  "E-Commerce": { intent: "service_ecommerce" },
  "API Development": { intent: "service_api" },
  "DevOps & Deploy": { intent: "service_devops" },
  "Maintenance & Support": { intent: "service_maintenance" },
  "Dashboards": { intent: "service_dashboard" },
  "Automation": { intent: "service_automation" },
  "Web3 / Blockchain": { intent: "service_web3" },
  // Business routes
  "Payment Methods": { intent: "payment_methods" },
  "Free Consultation": { intent: "free_consultation" },
  "Industries We Serve": { intent: "industries" },
  // Cloud FAQ routes
  "Cloud Data & Privacy": { intent: "cloud_faq_data" },
  "Cloud Regions": { intent: "cloud_faq_regions" },
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

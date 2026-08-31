"""Add 24 new intents to chat-knowledge.js with properly escaped strings."""

import re

NEW_INTENTS = [
    ("service_ecommerce", [
        "We build complete e-commerce solutions tailored to your business:\n\n• **Storefront:** Custom product catalogs, search, filters, wishlists\n• **Checkout & Payments:** Razorpay, Stripe, UPI, net banking integration\n• **Inventory:** Real-time stock management, low-stock alerts\n• **Admin Panel:** Order management, analytics, customer insights\n• **Performance:** Sub-2s page loads, CDN-optimized assets\n\nWe have built e-commerce platforms for retail, D2C brands, and service businesses.",
        "Our e-commerce development covers everything from storefront to checkout:\n\n• Custom storefronts with Next.js for SEO-optimized product pages\n• Secure payment integration (Razorpay, Stripe, UPI)\n• Real-time inventory tracking and order management\n• Admin dashboards with sales analytics\n• Mobile-responsive design that converts\n\nWe build on modern stacks: Next.js + Node.js + PostgreSQL, optimized for speed.",
        "Looking for an online store? We build end-to-end e-commerce platforms:\n\n• **Frontend:** Next.js or React with server-side rendering\n• **Backend:** Node.js or Python with REST/GraphQL APIs\n• **Database:** PostgreSQL for products/orders, Redis for sessions\n• **Payments:** Razorpay, Stripe, UPI, net banking\n• **Admin:** Full-featured dashboard for managing products, orders, and customers\n\nWant to discuss your e-commerce project?",
    ], ["Start a Project", "Pricing", "Our Portfolio"]),

    ("service_api", [
        "API development is one of our core strengths. We build:\n\n• **REST APIs** — Clean, documented, versioned endpoints with OpenAPI specs\n• **GraphQL APIs** — Flexible queries for complex data requirements\n• **WebSocket APIs** — Real-time bidirectional communication\n• **Third-party integrations** — Payment gateways, CRMs, email services, analytics\n• **API gateways** — Rate limiting, auth, caching, monitoring\n\nEvery API we ship comes with documentation, error handling, and authentication built in.",
        "Need APIs? We design and build robust API solutions:\n\n• RESTful and GraphQL APIs with full documentation\n• Authentication (JWT, OAuth 2.0, API keys)\n• Rate limiting, caching, and request validation\n• Database design and optimization for API performance\n• Third-party service integrations\n\nWhether you need a public API or internal microservices, we have got you covered.",
    ], ["Start a Project", "Our Tech Stack", "Contact Us"]),

    ("service_devops", [
        "We handle DevOps and deployment as part of our delivery:\n\n• **CI/CD pipelines** — Automated testing and deployment with GitHub Actions\n• **Containerization** — Docker for consistent environments\n• **Cloud hosting** — Vercel, AWS, GCP, or your preferred provider\n• **Domain & SSL** — HTTPS setup, custom domains\n• **Monitoring** — Uptime checks, error tracking, performance metrics\n• **Backups** — Automated database backups with point-in-time recovery\n\nYou get a production-ready deployment on day one.",
        "DevOps is baked into every project we deliver:\n\n• Automated CI/CD with GitHub Actions or similar\n• Docker containerization for consistent deployments\n• Production and staging environments\n• SSL, domain configuration, and CDN setup\n• Monitoring and alerting for uptime\n\nWe handle the infrastructure so you can focus on your business.",
    ], ["Start a Project", "Our Process", "Cloud Plans"]),

    ("service_maintenance", [
        "Post-launch support is included with every project we deliver. Here is what you get:\n\n• **30-day free bug fixes** after delivery for any issues found\n• **Performance monitoring** — We set up error tracking and alerting\n• **Knowledge transfer** — Documentation, code walkthroughs\n• **Optional retainer** — Ongoing monthly support for feature additions\n\nIf something breaks within the first month, we fix it free of charge.",
        "We do not disappear after delivery. Our support model:\n\n• **30-day warranty** — Free bug fixes for any post-launch issues\n• **Documentation** — Full project docs, deployment guides, API references\n• **Code handover** — Clean, commented code you own 100%\n• **Ongoing support** — Available on retainer for continued maintenance\n\nMost of our clients continue working with us long after the initial delivery.",
    ], ["Start a Project", "Pricing", "Contact Us"]),

    ("service_dashboard", [
        "Dashboards and admin panels are one of our specialties. We build:\n\n• **Analytics dashboards** — Real-time charts, KPIs, data visualization\n• **Admin panels** — Content management, user management, settings\n• **Financial dashboards** — Revenue tracking, expense reports, forecasts\n• **Real-time updates** — WebSocket-powered live data feeds\n\nWe use charting libraries like ECharts, Recharts, or D3.js depending on complexity.",
        "We create powerful, real-time dashboards:\n\n• Real-time data visualization with ECharts or Recharts\n• Responsive layouts that work on desktop and tablet\n• Role-based access control for different user types\n• Export to CSV/PDF functionality\n• Custom filters, date ranges, and drill-down views\n\nWhether it is internal tools or client-facing analytics, we deliver polished dashboards.",
    ], ["Start a Project", "Our Portfolio", "Contact Us"]),

    ("service_automation", [
        "Automation is where we deliver the most ROI for clients. We build:\n\n• **Workflow automation** — Automate repetitive business processes\n• **Email automation** — Triggered campaigns, drip sequences, notifications\n• **Data pipelines** — ETL, data sync between systems, scheduled reports\n• **Document automation** — Invoice generation, report creation, compliance docs\n\nAutomation typically pays for itself within the first 2-3 months.",
        "Looking to automate workflows? Here is what we can do:\n\n• Identify repetitive processes in your business\n• Design automated workflows with proper error handling\n• Integrate with your existing tools (email, CRM, spreadsheets)\n• Build dashboards to monitor automation performance\n\nTell us what you want to automate and we will suggest the best approach.",
    ], ["Start a Project", "Pricing", "Contact Us"]),

    ("service_web3", [
        "Yes, we work with Web3 and blockchain technologies:\n\n• **Smart contracts** — Solidity development, testing, deployment\n• **DApps** — Decentralized applications with Web3.js/Ethers.js\n• **Token creation** — ERC-20, ERC-721 token standards\n• **Wallet integration** — MetaMask, WalletConnect, Coinbase Wallet\n• **NFT platforms** — Minting, marketplace, metadata management\n\nWe have built crypto wallets and DeFi interfaces for clients.",
        "We have experience building decentralized applications:\n\n• Smart contracts in Solidity with full test coverage\n• React/Next.js frontends with Web3 wallet integration\n• NFT marketplaces and token-gated content\n• DeFi dashboards with real-time blockchain data\n\nWe can help you go from concept to deployed contract.",
    ], ["Start a Project", "Our Portfolio", "Contact Us"]),

    ("payment_methods", [
        "We accept multiple payment methods:\n\n**For project work:**\n• UPI (GPay, PhonePe, Paytm)\n• Bank transfer (NEFT/IMPS)\n• Razorpay payment links\n• International: PayPal, Wise\n\n**For cloud subscriptions:**\n• Razorpay (credit/debit cards, UPI, net banking)\n• Automated recurring billing\n\nWe send payment links via email for easy checkout.",
        "Here is how you can pay for our services:\n\n• **UPI** — Google Pay, PhonePe, Paytm, or any UPI app\n• **Bank Transfer** — NEFT/IMPS to our account\n• **Razorpay** — Credit card, debit card, net banking via payment link\n• **International** — PayPal or Wise transfer\n\nFor cloud subscriptions, billing is handled automatically through Razorpay.",
    ], ["Start a Project", "Get a Quote", "Cloud Plans"]),

    ("revisions", [
        "Our revision policy is straightforward:\n\n• **Per milestone:** Up to 2 rounds of revisions included\n• **Scope changes:** If the change is outside the original brief, we provide a revised estimate\n• **Bug fixes:** Always free, even after delivery (30-day warranty)\n• **Design revisions:** We iterate on designs before development starts\n\nWe believe in getting it right rather than counting revision rounds.",
        "We want you to be happy with the result. Here is how revisions work:\n\n• 2 rounds of revisions per milestone are included in the price\n• Minor tweaks and bug fixes are always free\n• Major scope changes may need a revised estimate\n• We share progress regularly so there are no surprises\n\nMost projects need very few revisions because we align on requirements upfront.",
    ], ["Start a Project", "Contact Us", "Pricing"]),

    ("communication", [
        "Communication is a big part of why clients stick with us:\n\n• **Direct access** — You talk to the engineers building your product, not account managers\n• **Updates** — Progress updates every 2-3 days via your preferred channel\n• **Channels** — WhatsApp, email, Google Meet, or Slack\n• **Transparency** — Real-time progress tracking, no black boxes\n• **Response time** — We reply within a few hours during business hours\n\nNo middlemen, no runaround. Direct communication throughout.",
        "You will never be in the dark during your project. Here is how we stay in touch:\n\n• Progress updates every 2-3 days\n• Direct WhatsApp chat with your engineer\n• Video calls for demos and reviews\n• Shared project board for task tracking\n\nWe over-communicate rather than under-communicate.",
    ], ["Start a Project", "Our Process", "Contact Us"]),

    ("deployment_hosting", [
        "We handle deployment as part of every project delivery:\n\n• **Hosting setup** — Vercel, AWS, GCP, or your preferred provider\n• **Domain & DNS** — Configure your domain, SSL certificates, CDN\n• **CI/CD** — Automated deployments on every code push\n• **Environments** — Separate staging and production setups\n• **Monitoring** — Error tracking, uptime monitoring, performance alerts\n\nYour project goes live production-ready, not just code-complete.",
        "Deployment and hosting are included. Here is our approach:\n\n• We set up the production environment as part of delivery\n• SSL, domain, and CDN configuration included\n• Automated CI/CD pipeline for future updates\n• Staging environment for testing before production\n\nHosting costs (AWS, Vercel, etc.) are typically $5-20/month depending on traffic.",
    ], ["Start a Project", "Cloud Plans", "Our Process"]),

    ("scalability", [
        "Scalability is designed into our architecture from day one:\n\n• **Database** — Indexed queries, connection pooling, read replicas when needed\n• **Caching** — Redis for sessions, API responses, and frequently accessed data\n• **CDN** — Static assets served from edge locations globally\n• **Horizontal scaling** — Stateless architecture that can add more instances\n• **Load testing** — We test with projected traffic before launch\n\nWhether you have 100 users or 100,000, the architecture supports it.",
        "We build systems that grow with your business:\n\n• Modular architecture that allows adding features without rewrites\n• Database optimization for high read/write throughput\n• Caching layers (Redis, CDN) for fast response times\n• Microservices-ready design for complex systems\n\nWe plan for 10x growth from the start so you are not rebuilding in 6 months.",
    ], ["Start a Project", "Our Tech Stack", "Contact Us"]),

    ("uptime_sla", [
        "Our uptime and reliability commitment:\n\n• **99.9% uptime target** for all production deployments\n• **Automated monitoring** with instant alerts for downtime\n• **30-minute response time** for critical issues (business hours)\n• **Regular backups** — Daily automated database backups\n• **Incident post-mortems** — Every issue gets a root cause analysis\n\nCloud platform uptime depends on the underlying infrastructure provider.",
        "Here is what we guarantee for uptime and reliability:\n\n• 99.9% uptime target for production applications\n• Automated health checks and error alerting\n• Daily database backups with point-in-time recovery\n• Proactive monitoring, not just reactive fixes\n\nWe set up monitoring before launch so we catch issues before you do.",
    ], ["Cloud Plans", "Contact Sales", "Start a Project"]),

    ("industries", [
        "We work across a wide range of industries:\n\n• **Fintech** — Payment flows, dashboards, trading platforms\n• **Healthcare** — Patient portals, appointment systems, HealthVote app\n• **Education** — Learning platforms, assessment tools (EduLearn)\n• **E-commerce** — Online stores, marketplaces, D2C brands\n• **SaaS** — Multi-tenant platforms, subscription systems (Nexus CRM)\n• **Logistics** — Tracking systems, fleet management (LogiTrack)\n• **Real Estate** — Property listings, CRM, booking systems\n\nOur tech is industry-agnostic. We adapt to your domain.",
        "Our experience spans multiple sectors:\n\n• Fintech (dashboards, payment integrations)\n• Healthcare (mobile apps, patient management)\n• Education (online learning platforms)\n• SaaS (CRM, multi-tenant platforms)\n• E-commerce (marketplaces, D2C stores)\n• Logistics (tracking, fleet management)\n\nEach industry has unique requirements and we tailor our approach accordingly.",
    ], ["Start a Project", "Our Portfolio", "Contact Us"]),

    ("discounts", [
        "We offer a few ways to get the best value:\n\n• **Quick Start** — Priority service for a one-time fee, ideal for small projects\n• **Bundle pricing** — Get a discount when you combine web + mobile development\n• **Long-term projects** — Larger projects get better per-feature pricing\n• **Referral bonus** — Refer a client and both of you get a discount\n• **Repeat clients** — Returning clients get priority rates\n\nContact us with your project details and we will give you the best quote we can.",
        "Here is how you can get the most competitive pricing:\n\n• Start with Quick Start to get priority onboarding\n• Bundle multiple services (web + mobile + backend) for better rates\n• Long-term engagements get discounted monthly rates\n• Referral program: refer a client and both get 10% off\n\nThe best way to get an accurate price is to tell us about your project.",
    ], ["Start a Project", "Get a Quote", "Quick Start"]),

    ("internship", [
        "We are always open to hearing from talented people. Here is how to connect:\n\n• **Email your resume** to mitraricky06@gmail.com\n• **Share your work** — GitHub, portfolio, or any projects you have built\n• **Mention what excites you** — Web, mobile, AI, cloud, or all of the above\n• **We look for:** Strong fundamentals, curiosity, and willingness to learn\n\nWe offer hands-on experience with real client projects, not just tutorials.",
        "Interested in joining DEV Infinity? Here is what you should know:\n\n• We are a small, focused team that works on real products\n• You will get hands-on experience with modern tech stacks\n• Remote-friendly with flexible hours\n• Send your resume and portfolio to mitraricky06@gmail.com\n\nWe value skills and curiosity over degrees.",
    ], ["Contact Us", "Start a Project", "About Us"]),

    ("partnerships", [
        "We are open to partnerships and collaborations. Here is how we work with partners:\n\n• **Agency partnerships** — White-label development for design agencies\n• **Tech partnerships** — Joint solutions with complementary tech providers\n• **Referral partnerships** — Earn commissions for referring clients\n• **Open source collaboration** — Co-building tools and libraries\n\nIf you have a partnership idea, email us at mitraricky06@gmail.com.",
        "Looking to partner with us? Here is what that could look like:\n\n• White-label development: We build, you brand and deliver\n• Referral program: Earn a commission for every referred client\n• Co-development: Joint projects where we handle the tech\n\nReach out at mitraricky06@gmail.com to discuss.",
    ], ["Contact Us", "Start a Project", "About Us"]),

    ("open_source", [
        "We believe in and contribute to open source:\n\n• We use open-source tools extensively (React, Next.js, PostgreSQL, Redis)\n• We contribute back to the community when possible\n• Our cloud platform provides access to open-source LLMs (Llama 3.3 70B)\n• We prefer open-source solutions over proprietary ones when quality is comparable\n\nOpen source keeps costs low for our clients while delivering enterprise-grade quality.",
        "Open source is part of our DNA:\n\n• Our entire tech stack is built on open-source tools\n• We leverage Llama 3.3 and other open-source models on our cloud platform\n• When possible, we recommend open-source solutions to keep your costs down\n\nWe believe in building on the shoulders of giants.",
    ], ["Our Services", "Our Tech Stack", "Contact Us"]),

    ("free_consultation", [
        "We offer a free initial consultation for every project. Here is how it works:\n\n1. You tell us about your idea or requirement\n2. We assess feasibility, suggest a tech stack, and outline an approach\n3. You get a rough timeline and budget estimate\n4. No obligation — take the consultation and decide at your pace\n\nThe fastest way is through our project request form.",
        "Yes! Every project starts with a free consultation:\n\n• Share your idea via the project request form or chat\n• We respond with a feasibility assessment and tech recommendation\n• You get a timeline and budget estimate\n• Zero obligation — decide when you are ready\n\nOr skip the queue with Quick Start for priority response within 48 hours.",
    ], ["Start a Project", "Get a Quote", "Quick Start"], [
        {"title": "Start a Project", "desc": "Free consultation included", "link": "/dev/request", "cta": "Get Started"},
        {"title": "Quick Start", "desc": "Priority service", "link": "/dev/quick-start", "cta": "View"},
    ]),

    ("source_code", [
        "Yes, you own the source code. Here is our policy:\n\n• **Full ownership** — Source code is 100% yours upon delivery and payment\n• **No lock-in** — You can host it anywhere, modify it freely\n• **Documentation** — We provide code docs and deployment guides\n• **Repository access** — GitHub/GitLab repo transferred to you\n• **No licensing fees** — No recurring fees for using your own code\n\nWe build it for you, you own it. Simple as that.",
        "Full source code ownership is part of every project:\n\n• You get the complete source code repository\n• Full rights to modify, redistribute, and resell\n• We transfer the GitHub/GitLab repo to your account\n• No vendor lock-in or licensing restrictions\n\nThis is non-negotiable — you own what you pay for.",
    ], ["Start a Project", "Our Process", "Contact Us"]),

    ("nda", [
        "We take confidentiality seriously:\n\n• **NDA available** — We can sign an NDA before project discussions begin\n• **Secure communication** — All project details shared via secure channels\n• **No portfolio sharing** — We do not share your project details publicly without permission\n• **Data protection** — All project files and credentials are handled securely\n\nJust ask and we will send over our standard NDA for review.",
        "NDA and IP protection is standard practice for us:\n\n• We sign NDAs before diving into project details\n• Your intellectual property remains yours throughout and after the project\n• We do not share or publish your project without explicit permission\n• All communications and files are kept confidential\n\nRequest an NDA via email at mitraricky06@gmail.com.",
    ], ["Start a Project", "Contact Us", "Our Process"]),

    ("gdpr_compliance", [
        "Data compliance is built into our development process:\n\n• **Data encryption** — At rest (AES-256) and in transit (TLS 1.3)\n• **Access control** — Role-based permissions, minimum-privilege principle\n• **Data minimization** — We only collect what is necessary\n• **Consent management** — Cookie consent, privacy policy integration\n• **Audit trails** — Logging for sensitive operations\n\nWe follow OWASP guidelines for web application security.",
        "We take data protection seriously:\n\n• All data encrypted in transit (HTTPS/TLS) and at rest\n• Role-based access control for all applications\n• Regular security audits and vulnerability scanning\n• GDPR-compliant data handling practices\n• Privacy policy and cookie consent built into every project\n\nSecurity is not an afterthought — it is part of our development checklist.",
    ], ["Start a Project", "Security & Compliance", "Contact Us"]),

    ("cloud_faq_data", [
        "Data handling and storage on DEV Cloud:\n\n• **Session data** — Isolated per user, cleared on session end\n• **API usage** — Logged for quota tracking and abuse prevention\n• **No data selling** — We never sell or share your data\n• **Data retention** — You can request data deletion at any time\n• **Encryption** — All data encrypted in transit and at rest\n\nYour code and data on our cloud remain private and secure.",
        "Here is how we handle your data on the cloud platform:\n\n• Each user gets isolated compute resources\n• API requests are logged for quota management only\n• No data is shared with third parties\n• You can request full data deletion via email\n\nPrivacy and security are foundational to our cloud platform.",
    ], ["Cloud Plans", "Security & Compliance", "Contact Support"]),

    ("cloud_faq_regions", [
        "Our cloud infrastructure is currently hosted in India:\n\n• Data centers in India for low-latency access\n• Ideal for Indian businesses and users\n• All data stored and processed within India\n• Compliant with Indian data localization requirements\n\nWe plan to expand to additional regions based on demand.",
        "DEV Cloud runs on Indian data centers:\n\n• Hosted in India for the best latency for Indian users\n• Data residency within India (compliant with local regulations)\n• Low-latency API responses for AI model inference\n\nCurrently available in India. We are evaluating expansion to other regions.",
    ], ["Cloud Plans", "Contact Sales", "Start a Project"]),
]

NEW_KEYWORDS = {
    "service_ecommerce": ["ecommerce", "e-commerce", "online store", "online shop", "shopping cart", "product catalog", "sell online", "storefront", "marketplace"],
    "service_api": ["api", "rest api", "graphql", "api development", "api integration", "endpoint", "backend api", "microservice"],
    "service_devops": ["devops", "ci/cd", "cicd", "docker", "kubernetes", "cloud hosting", "deploy"],
    "service_maintenance": ["maintenance", "after launch", "post launch", "warranty", "bug fix", "ongoing support", "retainer"],
    "service_dashboard": ["dashboard", "admin panel", "analytics", "data visualization", "chart", "kpi", "report"],
    "service_automation": ["automation", "automate", "workflow", "bot", "scheduled", "cron", "batch process", "repetitive"],
    "service_web3": ["web3", "blockchain", "crypto", "smart contract", "nft", "defi", "solidity", "decentralized", "token", "dapp"],
    "payment_methods": ["payment method", "how to pay", "pay you", "payment option", "upi", "razorpay", "stripe", "paypal"],
    "revisions": ["revision", "changes after", "modify later", "edit after delivery", "change request", "iterate"],
    "communication": ["how do you communicate", "progress update", "stay in touch", "contact during project", "reporting"],
    "deployment_hosting": ["where hosted", "hosting included", "domain", "ssl", "cdn", "go live", "launch"],
    "scalability": ["scalability", "scale", "performance", "traffic", "load", "speed", "optimize", "slow", "handle users"],
    "uptime_sla": ["uptime", "sla", "reliability", "downtime", "guarantee", "backup", "disaster recovery"],
    "industries": ["industry", "industries", "sector", "domain", "vertical", "what industries"],
    "discounts": ["discount", "offer", "coupon", "deal", "cheaper", "reduce price", "negotiate", "bulk pricing"],
    "internship": ["internship", "intern", "job", "career", "hiring", "join", "vacancy", "opening"],
    "partnerships": ["partner", "partnership", "collaborate", "collaboration", "joint venture", "white label", "referral program"],
    "open_source": ["open source", "oss", "contribute", "community"],
    "free_consultation": ["free consultation", "free call", "free quote", "no obligation", "just looking", "exploring"],
    "source_code": ["source code", "code ownership", "own the code", "code rights", "ip ownership", "intellectual property"],
    "nda": ["nda", "non disclosure", "confidentiality", "confidential", "secrecy", "privacy agreement", "ip protection"],
    "gdpr_compliance": ["gdpr", "compliance", "data protection", "privacy law", "security audit", "owasp"],
    "cloud_faq_data": ["cloud data", "data storage", "data privacy", "where is my data", "data retention", "data security"],
    "cloud_faq_regions": ["region", "data center", "location of server", "server location", "india server", "data residency"],
}

NEW_ROUTES = {
    "E-Commerce": "service_ecommerce",
    "API Development": "service_api",
    "DevOps & Deploy": "service_devops",
    "Maintenance": "service_maintenance",
    "Dashboards": "service_dashboard",
    "Automation": "service_automation",
    "Web3 / Blockchain": "service_web3",
    "Payment Methods": "payment_methods",
    "Free Consultation": "free_consultation",
    "Industries We Serve": "industries",
    "Cloud Data & Privacy": "cloud_faq_data",
    "Cloud Regions": "cloud_faq_regions",
}


def js_str(s):
    """Escape a string for use in JS double-quoted string."""
    return s.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')


def build_intent_block(name, texts, quick_replies, cards=None):
    """Build a JS intent object block."""
    lines = [f'  {name}: {{']
    lines.append('    texts: [')
    for t in texts:
        lines.append(f'      "{js_str(t)}",')
    lines.append('    ],')
    lines.append(f'    quickReplies: {json.dumps(quick_replies)},')
    if cards:
        lines.append('    cards: [')
        for c in cards:
            lines.append(f'      {json.dumps(c)},')
        lines.append('    ],')
    lines.append('  },')
    return '\n'.join(lines)


import json

with open('src/lib/chat/chat-knowledge.js', 'r') as f:
    content = f.read()

# 1. Build new intent blocks
blocks = ['\n  // ── Additional Services ───────────────────────────────────────\n']
for name, texts, qrs, *rest in NEW_INTENTS:
    cards = rest[0] if rest else None
    blocks.append(build_intent_block(name, texts, qrs, cards))
    blocks.append('')

# 2. Insert before the closing }; of KNOWLEDGE
# Find '};' right before '// ── Keyword' comment
insert_marker = '};\n\n// ── Keyword'
if insert_marker in content:
    new_section = '\n'.join(blocks)
    content = content.replace(insert_marker, new_section + '\n};\n\n// ── Keyword', 1)
    print('Step 1: Inserted new intents')
else:
    print('ERROR: Could not find KNOWLEDGE closing marker')
    exit(1)

# 3. Add new keyword mappings
# Insert after the last existing keyword entry (cloud_compare)
keyword_insert = '  cloud_compare: ["compare", "comparison", "difference between plans", "which plan", "plan comparison", "all plans", "vs plan"],'
new_kw_lines = ''
for intent, keywords in NEW_KEYWORDS.items():
    new_kw_lines += f'  {intent}: {json.dumps(keywords)},\n'

if keyword_insert in content:
    content = content.replace(keyword_insert, keyword_insert + '\n' + new_kw_lines, 1)
    print('Step 2: Added keyword mappings')
else:
    print('ERROR: Could not find keyword insert point')

# 4. Add new quick reply routes
route_insert = '  "Connect to Team": { intent: "human_handoff" },\n};'
new_route_lines = ''
for label, intent in NEW_ROUTES.items():
    new_route_lines += f'  "{label}": {{ intent: "{intent}" }},\n'

if route_insert in content:
    content = content.replace(route_insert, '  "Connect to Team": { intent: "human_handoff" },\n' + new_route_lines + '};', 1)
    print('Step 3: Added quick reply routes')
else:
    print('ERROR: Could not find route insert point')

with open('src/lib/chat/chat-knowledge.js', 'w') as f:
    f.write(content)

print('Done!')

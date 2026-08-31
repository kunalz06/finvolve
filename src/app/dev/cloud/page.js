"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CalendarDays,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Cloud,
  Cpu,
  Flame,
  Gauge,
  HelpCircle,
  IndianRupee,
  Layers,
  Loader2,
  Minus,
  RefreshCw,
  Server,
  Shield,
  ShieldCheck,
  Sparkles,
  Terminal,
  Timer,
  Users,
  Zap,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { SUBSCRIPTION_TIERS } from "@/lib/server/subscription-plans";
import { RENTAL_CONFIG } from "@/lib/server/rental-plans";
import { apiUrl } from "@/lib/api";

const tierOrder = ["base", "medium", "highest"];

const tierIcons = {
  base: Cpu,
  medium: Bot,
  highest: Cloud,
};

const tierBadges = {
  base: { label: "Starter", color: "bg-[var(--primary)]", text: "!text-white" },
  medium: { label: "Most Popular", color: "bg-[var(--accent)]", text: "!text-white" },
  highest: { label: "Enterprise", color: "bg-[var(--accent-cool)]", text: "!text-slate-950" },
};

const comparisonFeatures = [
  {
    name: "Compute Allocation",
    desc: "Dedicated CPU runtime per billing cycle",
    base: "300 Hours / 15 days (Split)",
    medium: "600 Hours (Unrestricted)",
    highest: "1,000 Hours (Dedicated)",
  },
  {
    name: "Compute Engine Architecture",
    desc: "Virtual instance runtime & container hosting",
    base: "Standard Cloud VM",
    medium: "High-Throughput Node",
    highest: "Bare-Metal / Dedicated Node",
  },
  {
    name: "OpenAI ChatGPT API",
    desc: "GPT-4o & GPT-4 Turbo inference access",
    base: false,
    medium: "250 Hours Quota",
    highest: "250 Hours Quota",
  },
  {
    name: "Google Gemini API",
    desc: "Gemini 2.0 & 1.5 Pro multimodal endpoints",
    base: false,
    medium: "450 Hours Quota",
    highest: "450 Hours Quota",
  },
  {
    name: "Anthropic Claude Models",
    desc: "Claude 3.5 Sonnet & Claude 3 Opus API access",
    base: false,
    medium: false,
    highest: "Full Enterprise Access",
  },
  {
    name: "Open-Source LLMs",
    desc: "Direct endpoints for Llama 3.3, Mistral, DeepSeek",
    base: true,
    medium: true,
    highest: true,
  },
  {
    name: "Dedicated GPU Acceleration",
    desc: "NVIDIA Tensor Core GPUs for training & inference",
    base: false,
    medium: false,
    highest: "Dedicated GPU Cluster",
  },
  {
    name: "MATLAB & Engineering Tools",
    desc: "Pre-installed simulation & computing toolsets",
    base: false,
    medium: false,
    highest: "Full Software Suite",
  },
  {
    name: "Real-Time Usage Dashboard",
    desc: "Live compute hours & API token burn metrics",
    base: "Basic Metrics",
    medium: "Advanced Telemetry",
    highest: "Enterprise Telemetry",
  },
  {
    name: "Support & SLA",
    desc: "Technical issue resolution & engineer assistance",
    base: "Standard Email Support",
    medium: "Priority Chat & Email",
    highest: "24/7 Priority SLA & Lead Engineer",
  },
];

const faqs = [
  {
    q: "How are compute hours allocated and tracked?",
    a: "Compute hours represent dedicated execution runtime for your workloads and scripts. Your usage resets at the start of each billing cycle automatically. The Starter plan bills every 15 days with 300 hours split across the period (150h first half / 150h second half), while Pro and Enterprise tiers provide unrestricted monthly pools that reset every 30 days.",
  },
  {
    q: "Can I pause or resume my subscription at any time?",
    a: "Yes! You have full self-service control from your personal Cloud Dashboard. Pausing freezes your runtime counter, stops future monthly recurring charges, and preserves your configuration so you can resume whenever you are ready.",
  },
  {
    q: "How does AI Model API access work?",
    a: "Once your subscription is active, you receive API gateway keys and endpoints directly in your Cloud Dashboard. You can connect your apps to ChatGPT (GPT-4o), Google Gemini, Claude, and open-source models through our unified developer gateway without creating separate provider accounts.",
  },
  {
    q: "What does the one-time setup fee cover?",
    a: "The one-time setup fee covers dedicated compute namespace isolation, secure credential generation, VPC container configuration, and allocated rate-limit quotas on our API infrastructure.",
  },
  {
    q: "How do plan upgrades and downgrades work?",
    a: "You can transition between tiers anytime from your dashboard. Upgrades or plan switches are scheduled for your upcoming renewal date so your current plan benefits continue without disruption. For the Starter plan, changes take effect at the next 15-day renewal; for Pro and Enterprise, at the next monthly renewal.",
  },
];

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CloudPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [showComparison, setShowComparison] = useState(true);
  const [rentalForm, setRentalForm] = useState({ name: "", email: "", phone: "", days: 7 });
  const [rentalTermsAccepted, setRentalTermsAccepted] = useState(false);
  const [rentalLoading, setRentalLoading] = useState(false);
  const [rentalResult, setRentalResult] = useState(null);
  const [rentalError, setRentalError] = useState("");
  const [rentalUserDetails, setRentalUserDetails] = useState({ name: "", email: "", phone: "" });

  const handleRentalSubmit = async (e) => {
    e.preventDefault();
    if (!rentalTermsAccepted) {
      setRentalError("Please accept the Terms & Conditions to proceed.");
      return;
    }
    setRentalLoading(true);
    setRentalResult(null);
    setRentalError("");
    try {
      const res = await fetch(apiUrl("/dev/api/rental/create"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rentalForm),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Rental creation failed.");
      setRentalResult(json);
      setRentalUserDetails({ name: rentalForm.name, email: rentalForm.email, phone: rentalForm.phone });
      setRentalForm({ name: "", email: "", phone: "", days: 7 });
    } catch (err) {
      setRentalError(err.message);
    } finally {
      setRentalLoading(false);
    }
  };

  const handleRentalPay = async () => {
    if (!rentalResult) return;
    setRentalError("");

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setRentalError("Failed to load payment gateway. Please check your internet connection and try again.");
      return;
    }

    const options = {
      key: rentalResult.checkoutKey,
      amount: rentalResult.upfrontFee * 100,
      currency: rentalResult.currency,
      name: "DEV Infinity",
      description: "Cloud Rental — " + rentalResult.days + " Days",
      order_id: rentalResult.orderId,
      handler: async function (response) {
        try {
          const verifyRes = await fetch(apiUrl("/dev/api/rental/verify"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              rentalId: rentalResult.rentalId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyJson = await verifyRes.json();
          if (verifyRes.ok) {
            setRentalResult({ ...rentalResult, status: "active" });
          } else {
            setRentalError(verifyJson.error || "Payment verification failed.");
          }
        } catch (err) {
          setRentalError("Verification failed. Contact support with your rental ID: " + rentalResult.rentalId);
        }
      },
      prefill: { name: rentalUserDetails.name, email: rentalUserDetails.email, contact: rentalUserDetails.phone },
      theme: { color: "#2457ff" },
    };
    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response) {
      setRentalError(response?.error?.description || "Payment failed. Please try again.");
    });
    rzp.open();
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 sm:py-8 md:py-12">
      <div className="container space-y-8 sm:space-y-10 md:space-y-12 lg:space-y-16">
        {/* Hero Section */}
        <section className="glass-surface-strong relative overflow-hidden rounded-2xl px-4 py-8 sm:px-6 sm:py-10 md:px-10 md:py-14 lg:px-12 lg:py-16">
          <div className="relative z-10 max-w-4xl space-y-4 sm:space-y-6">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="glass-chip-strong inline-flex items-center gap-2 rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-black uppercase tracking-wider text-primary">
                <Cloud size={16} className="text-primary sm:hidden" />
                <Cloud size={18} className="hidden sm:text-primary sm:block" />
                <span>DEV♾️ Cloud Infrastructure</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black leading-[1.1] sm:leading-[1.08] text-[var(--heading)] md:text-5xl lg:text-6xl xl:text-7xl">
              High-Performance <br className="hidden sm:inline" />
              <span className="glass-text-gradient">Compute & AI Models</span> on Demand
            </h1>

            <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-[var(--foreground)] font-medium md:text-lg lg:text-xl">
              Deploy instantly to high-capacity compute engines and unified frontier LLM APIs (GPT-4o, Gemini, Claude). Zero infrastructure overhead, transparent pricing, and self-service control.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <Button href="#plans" variant="primary" size="large" className="touch-target">
                View Pricing Plans <ArrowRight size={16} className="sm:hidden" />
                <ArrowRight size={18} className="hidden sm:block" />
              </Button>
              <Button href="/dev/cloud/dashboard" variant="secondary" size="large" className="touch-target">
                <Zap size={16} className="sm:hidden" /> <Zap size={18} className="hidden sm:block" /> Open Cloud Dashboard
              </Button>
            </div>

            {/* Live Feature Badges */}
            <div className="grid grid-cols-2 gap-3 pt-6 border-t-2 border-[var(--border-soft)] sm:grid-cols-4">
              {[
                { icon: Zap, label: "Instant Provisioning", sub: "< 60s Activation" },
                { icon: ShieldCheck, label: "Dedicated Security", sub: "Isolated Containers" },
                { icon: Gauge, label: "99.9% Uptime", sub: "Enterprise Reliability" },
                { icon: RefreshCw, label: "Flexible Lifecycle", sub: "Pause & Resume Anytime" },
              ].map((badge, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="glass-icon-plate flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl">
                    <badge.icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-[var(--heading)]">{badge.label}</p>
                    <p className="text-[11px] font-semibold text-[var(--muted)]">{badge.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Capability Highlights Grid */}
        <section className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Cpu,
              tag: "COMPUTE ENGINES",
              title: "Up to 1,000 hrs/mo",
              desc: "Fast, isolated virtual engines for heavy processing, background microservices, and intensive automation.",
              color: "bg-[var(--primary)]",
            },
            {
              icon: Bot,
              tag: "FRONTIER AI ACCESS",
              title: "Unified LLM APIs",
              desc: "Direct integration with OpenAI GPT, Google Gemini, and Claude models without managing separate accounts.",
              color: "bg-[var(--accent)]",
            },
            {
              icon: Shield,
              tag: "ENTERPRISE POWER",
              title: "Dedicated GPUs & MATLAB",
              desc: "NVIDIA Tensor Core GPU access paired with MATLAB and engineering suites for complex mathematical modeling.",
              color: "bg-[var(--accent-cool)]",
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card hover={true} className="h-full space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[var(--border)] ${feature.color} shadow-[var(--shadow-soft)]`}>
                    <feature.icon className="text-white" size={24} />
                  </div>
                  <span className="font-code-brand text-xs font-black uppercase tracking-wider text-[var(--muted)]">
                    {feature.tag}
                  </span>
                </div>
                <h3 className="text-xl font-black text-[var(--heading)]">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--foreground)] font-medium">{feature.desc}</p>
              </Card>
            </motion.div>
          ))}
        </section>

        {/* Pricing Cards Section */}
        <section id="plans" className="space-y-8 scroll-mt-24">
          <div className="text-center space-y-3">
            <div className="glass-chip-strong inline-flex items-center gap-2 rounded-xl px-4 py-1.5 text-xs font-black uppercase tracking-wider text-primary">
              <Sparkles size={14} />
              <span>Transparent Subscription Plans</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--heading)] md:text-4xl lg:text-5xl">
              Choose Your Compute Capacity
            </h2>
            <p className="mx-auto max-w-2xl text-sm sm:text-base text-[var(--foreground)] font-medium md:text-lg">
              Simple monthly billing with included setup fee. Enjoy 12 months of predictable, high-performance compute and AI access.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
            {tierOrder.map((tierKey, index) => {
              const plan = SUBSCRIPTION_TIERS[tierKey];
              const Icon = tierIcons[tierKey];
              const badge = tierBadges[tierKey];
              const isHighlighted = plan.highlight;

              return (
                <motion.div
                  key={tierKey}
                  initial={false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.1 }}
                  className="flex"
                >
                  <Card
                    hover={!isHighlighted}
                    className={
                      "relative flex w-full flex-col justify-between p-7 md:p-9 " +
                      (isHighlighted
                        ? "glass-surface-strong border-2 !border-[var(--accent)] shadow-[8px_8px_0_var(--accent)] md:-translate-y-2"
                        : "glass-surface")
                    }
                  >
                    {/* Highlight Ribbon */}
                    {isHighlighted && (
                      <div className="absolute -top-3.5 right-6 rounded-full border-2 border-[var(--border)] bg-[var(--accent)] px-3.5 py-1 text-[11px] font-black uppercase tracking-wider !text-white shadow-[var(--shadow-soft)]">
                        ★ MOST POPULAR
                      </div>
                    )}

                    <div>
                      {/* Header */}
                      <div className="mb-6 flex items-center gap-3.5">
                        <div
                          className={`flex h-13 w-13 items-center justify-center rounded-xl border-2 border-[var(--border)] ${badge.color} shadow-[var(--shadow-soft)]`}
                        >
                          <Icon className={badge.text} size={24} />
                        </div>
                        <div>
                          <span className="font-code-brand text-xs font-black uppercase tracking-wider text-[var(--muted)]">
                            {plan.name} Tier
                          </span>
                          <h3 className="text-2xl font-black text-[var(--heading)]">{plan.name}</h3>
                        </div>
                      </div>

                      {/* Limited Time Offer for Starter */}
                      {plan.originalMonthlyAmountINR && plan.offerEndDate && new Date(plan.offerEndDate) >= new Date() && (
                        <div className="mb-5 rounded-xl border-2 border-amber-500 bg-amber-50 dark:bg-amber-950/40 p-3.5 text-center shadow-sm">
                          <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-amber-900 dark:text-amber-300">
                            <Flame size={14} className="text-amber-600 dark:text-amber-400" />
                            <span>Limited Promotional Launch</span>
                          </div>
                          <p className="mt-1.5 text-xs font-bold text-amber-950 dark:text-amber-100">
                            Original: <span className="line-through decoration-amber-600 font-semibold">₹{plan.originalMonthlyAmountINR.toLocaleString("en-IN")}/mo + ₹{plan.originalSetupFeeINR.toLocaleString("en-IN")} setup</span>
                          </p>
                          <p className="mt-1 text-[11px] font-black text-amber-800 dark:text-amber-300">Valid until 24 September 2026</p>
                        </div>
                      )}

                      {/* Pricing Display */}
                      <div className="mb-6 rounded-xl border-2 border-[var(--border-soft)] bg-[var(--surface-muted)] p-4">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm font-black text-[var(--muted)]">INR</span>
                          <span className="text-4xl font-black tracking-tight text-[var(--heading)] md:text-5xl">
                            ₹{plan.monthlyAmountINR.toLocaleString("en-IN")}
                          </span>
                          <span className="text-sm font-bold text-[var(--muted)]">{plan.billingPeriodDays ? "/ " + plan.billingPeriodDays + " days" : "/ month"}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between border-t border-[var(--border-soft)] pt-2 text-xs font-bold text-[var(--foreground)]">
                          <span>One-time Setup Fee</span>
                          <span className="font-black text-[var(--heading)]">₹{plan.setupFeeINR.toLocaleString("en-IN")}</span>
                        </div>
                      </div>

                      {/* Compute Allocation Pill */}
                      <div className="mb-6 flex items-center gap-2 rounded-lg border-2 border-primary/30 bg-primary/10 px-3.5 py-2.5 text-xs font-black text-primary">
                        <Clock size={16} />
                        <span>{plan.computeHours.total} Compute Hours Included / {plan.billingPeriodDays ? plan.billingPeriodDays + " Days" : "Month"}</span>
                      </div>

                      {/* Features List */}
                      <div className="space-y-3 mb-8">
                        <p className="font-code-brand text-xs font-black uppercase tracking-wider text-[var(--muted)]">
                          Included Capabilities
                        </p>
                        <ul className="space-y-2.5">
                          {plan.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-2.5 text-sm text-[var(--foreground)] font-medium">
                              <CheckCircle size={16} className="mt-0.5 flex-shrink-0 text-primary" />
                              <span className="leading-snug">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 border-t-2 border-[var(--border-soft)]">
                      <Button
                        href={`/dev/cloud/checkout?tier=${tierKey}`}
                        variant={isHighlighted ? "primary" : "secondary"}
                        size="large"
                        className="w-full justify-between"
                      >
                        <span>Subscribe to {plan.name}</span>
                        <ArrowRight size={18} />
                      </Button>
                      <p className="mt-2 text-center text-[11px] font-semibold text-[var(--muted)]">
                        Secure Razorpay Checkout • Cancel or Pause Anytime
                      </p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Feature Comparison Matrix */}
        <section className="glass-surface-strong rounded-2xl p-6 md:p-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[var(--border-soft)] pb-6">
            <div>
              <div className="glass-chip-strong mb-2 inline-flex items-center gap-2 rounded-xl px-3.5 py-1 text-xs font-black uppercase text-primary">
                <Layers size={14} />
                <span>Detailed Comparison</span>
              </div>
              <h3 className="text-2xl font-black text-[var(--heading)] md:text-3xl">
                Compare Plan Specifications
              </h3>
            </div>
            <Button
              onClick={() => setShowComparison(!showComparison)}
              aria-expanded={showComparison}
              aria-controls="comparison-table"
              variant="secondary"
              size="small"
              className="text-xs font-black uppercase"
            >
              <span>{showComparison ? "Collapse Table" : "Expand Table"}</span>
              {showComparison ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </div>

          {showComparison && (
            <div id="comparison-table" className="relative overflow-x-auto -mx-4 px-4 sm:px-0">
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[var(--surface-strong)] to-transparent pointer-events-none z-10 sm:hidden" aria-hidden="true" />
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-[var(--border)]">
                    <th className="py-4 pr-6 text-sm font-black uppercase tracking-wider text-[var(--muted)] w-2/5">
                      Feature / Resource
                    </th>
                    <th className="py-4 px-4 text-sm font-black text-[var(--heading)] text-center w-1/5">
                      Starter
                    </th>
                    <th className="py-4 px-4 text-sm font-black text-[var(--accent)] text-center w-1/5 bg-[var(--surface-muted)] rounded-t-lg">
                      Pro
                    </th>
                    <th className="py-4 px-4 text-sm font-black text-[var(--heading)] text-center w-1/5">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-soft)]">
                  {comparisonFeatures.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[var(--surface-muted)] transition-colors">
                      <td className="py-4 pr-6">
                        <p className="font-black text-[var(--heading)] text-sm">{item.name}</p>
                        <p className="text-xs text-[var(--muted)] font-medium">{item.desc}</p>
                      </td>
                      <td className="py-4 px-4 text-center text-xs font-bold text-[var(--foreground)]">
                        {typeof item.base === "boolean" ? (
                          item.base ? (
                            <span role="img" aria-label="Included"><CheckCircle size={18} className="mx-auto text-primary" /></span>
                          ) : (
                            <span role="img" aria-label="Not included"><Minus size={18} className="mx-auto text-slate-400" /></span>
                          )
                        ) : (
                          item.base
                        )}
                      </td>
                      <td className="py-4 px-4 text-center text-xs font-black text-[var(--heading)] bg-[var(--surface-muted)]">
                        {typeof item.medium === "boolean" ? (
                          item.medium ? (
                            <span role="img" aria-label="Included"><CheckCircle size={18} className="mx-auto text-[var(--accent)]" /></span>
                          ) : (
                            <span role="img" aria-label="Not included"><Minus size={18} className="mx-auto text-slate-400" /></span>
                          )
                        ) : (
                          item.medium
                        )}
                      </td>
                      <td className="py-4 px-4 text-center text-xs font-black text-[var(--heading)]">
                        {typeof item.highest === "boolean" ? (
                          item.highest ? (
                            <span role="img" aria-label="Included"><CheckCircle size={18} className="mx-auto text-emerald-600" /></span>
                          ) : (
                            <span role="img" aria-label="Not included"><Minus size={18} className="mx-auto text-slate-400" /></span>
                          )
                        ) : (
                          item.highest
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-[var(--border)] font-bold">
                    <td className="py-5 pr-6 text-sm text-[var(--heading)] font-black">Action</td>
                    <td className="py-5 px-4 text-center">
                      <Button href="/dev/cloud/checkout?tier=base" variant="secondary" size="small">
                        Select Starter
                      </Button>
                    </td>
                    <td className="py-5 px-4 text-center bg-[var(--surface-muted)] rounded-b-lg">
                      <Button href="/dev/cloud/checkout?tier=medium" variant="primary" size="small">
                        Select Pro
                      </Button>
                    </td>
                    <td className="py-5 px-4 text-center">
                      <Button href="/dev/cloud/checkout?tier=highest" variant="secondary" size="small">
                        Select Enterprise
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* AI Models & Ecosystem Showcase */}
        <section className="glass-surface-strong rounded-2xl p-6 md:p-10 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="font-code-brand text-xs font-black uppercase tracking-wider text-primary">
              Pre-Configured Integrations
            </span>
            <h3 className="text-2xl font-black text-[var(--heading)] md:text-3xl">
              Supported AI Models & Ecosystem
            </h3>
            <p className="text-sm text-[var(--foreground)] font-medium">
              Connect your application to top-tier LLMs and accelerators through our unified developer gateway.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 pt-4">
            {[
              { name: "OpenAI GPT", sub: "GPT-4o & o1", tag: "Pro & Enterprise" },
              { name: "Google Gemini", sub: "2.0 Flash & 1.5 Pro", tag: "Pro & Enterprise" },
              { name: "Anthropic Claude", sub: "3.5 Sonnet & Opus", tag: "Enterprise" },
              { name: "Meta Llama", sub: "Llama 3.3 70B", tag: "All Plans" },
              { name: "NVIDIA Tensor", sub: "GPU Acceleration", tag: "Enterprise" },
              { name: "MATLAB Suite", sub: "Math & Simulation", tag: "Enterprise" },
            ].map((model, i) => (
              <div
                key={i}
                className="glass-surface rounded-xl p-4 text-center space-y-1.5 hover:-translate-y-1 transition-all"
              >
                <p className="font-black text-sm text-[var(--heading)]">{model.name}</p>
                <p className="text-xs text-[var(--muted)] font-semibold">{model.sub}</p>
                <span className="inline-block rounded-md bg-[var(--surface-muted)] px-2 py-0.5 text-[10px] font-extrabold text-[var(--foreground)]">
                  {model.tag}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Rent Services Section */}
        <section className="glass-surface-strong rounded-2xl p-6 md:p-10 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="glass-chip-strong inline-flex items-center gap-2 rounded-xl px-4 py-1.5 text-xs font-black uppercase text-primary">
              <Server size={14} />
              <span>RENT SERVICES</span>
            </div>
            <h2 className="text-3xl font-black text-[var(--heading)] md:text-4xl">
              Rent Cloud Compute On-Demand
            </h2>
            <p className="text-sm text-[var(--foreground)] font-medium">
              No subscription needed. Pick a duration, pay a small upfront fee, and only pay for the compute hours you actually use.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
            <div className="glass-surface rounded-xl p-5 space-y-3 text-center">
              <div className="glass-icon-plate mx-auto flex h-12 w-12 items-center justify-center rounded-xl">
                <IndianRupee size={22} className="text-primary" />
              </div>
              <p className="font-code-brand text-xs font-black uppercase text-[var(--muted)]">Upfront Fee</p>
              <p className="text-2xl font-black text-[var(--heading)]">₹{RENTAL_CONFIG.upfrontFeeINR}</p>
              <p className="text-xs text-[var(--muted)] font-medium">One-time before usage</p>
            </div>
            <div className="glass-surface rounded-xl p-5 space-y-3 text-center">
              <div className="glass-icon-plate mx-auto flex h-12 w-12 items-center justify-center rounded-xl">
                <Timer size={22} className="text-primary" />
              </div>
              <p className="font-code-brand text-xs font-black uppercase text-[var(--muted)]">Usage Rate</p>
              <p className="text-2xl font-black text-[var(--heading)]">₹{RENTAL_CONFIG.computeRateINR}</p>
              <p className="text-xs text-[var(--muted)] font-medium">Per {RENTAL_CONFIG.computeHoursPerUnit} hours of compute</p>
            </div>
            <div className="glass-surface rounded-xl p-5 space-y-3 text-center">
              <div className="glass-icon-plate mx-auto flex h-12 w-12 items-center justify-center rounded-xl">
                <CalendarDays size={22} className="text-primary" />
              </div>
              <p className="font-code-brand text-xs font-black uppercase text-[var(--muted)]">Billing</p>
              <p className="text-2xl font-black text-[var(--heading)]">Post-Use</p>
              <p className="text-xs text-[var(--muted)] font-medium">Bill + payment link emailed</p>
            </div>
          </div>

          {/* Rental Form */}
          <div className="max-w-lg mx-auto glass-surface rounded-2xl p-6 md:p-8 space-y-5">
            {rentalResult && rentalResult.status === "active" ? (
              <div className="space-y-5 py-2">
                {/* Success Header */}
                <div className="text-center space-y-3">
                  <div className="glass-icon-plate relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-emerald-400 bg-emerald-50">
                    <CheckCircle size={30} className="text-emerald-600" />
                    <div className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 border-2 border-[var(--surface-strong)]">
                      <Sparkles size={12} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="glass-chip-strong inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Live &amp; Provisioned</span>
                    </div>
                    <h4 className="text-2xl font-black text-[var(--heading)] mt-2">Rental Activated!</h4>
                    <p className="text-sm text-[var(--foreground)] font-medium mt-1">
                      Your {rentalResult.days}-day compute rental is now live and ready to use.
                    </p>
                  </div>
                </div>

                {/* Summary Card */}
                <div className="rounded-2xl border-2 border-[var(--border)] overflow-hidden">
                  <div className="px-4 py-3 bg-[var(--surface-muted)] border-b-2 border-[var(--border)]">
                    <p className="text-xs font-black uppercase tracking-wider text-[var(--muted)]">Rental Summary</p>
                  </div>
                  <div className="divide-y divide-[var(--border-soft)]">
                    <div className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-2.5 text-sm text-[var(--muted)] font-semibold">
                        <span className="font-code-brand text-xs">ID</span>
                      </div>
                      <span className="text-sm font-bold text-[var(--heading)] font-mono">{rentalResult.rentalId}</span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-2.5 text-sm text-[var(--muted)] font-semibold">
                        <Clock size={14} /> Duration
                      </div>
                      <span className="text-sm font-bold text-[var(--heading)]">{rentalResult.days} Days</span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-2.5 text-sm text-[var(--muted)] font-semibold">
                        <IndianRupee size={14} /> Upfront Fee
                      </div>
                      <span className="text-sm font-bold text-emerald-600">₹{RENTAL_CONFIG.upfrontFeeINR} Paid</span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-2.5 text-sm text-[var(--muted)] font-semibold">
                        <Timer size={14} /> Usage Rate
                      </div>
                      <span className="text-sm font-bold text-[var(--heading)]">₹{RENTAL_CONFIG.computeRateINR} / {RENTAL_CONFIG.computeHoursPerUnit}hrs</span>
                    </div>
                  </div>
                </div>

                {/* Info Box */}
                <div className="rounded-xl border-2 border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3">
                  <p className="text-xs text-[var(--foreground)] font-medium leading-relaxed">
                    A confirmation email has been sent. After your rental period ends, your actual compute usage will be calculated and a bill with a Razorpay payment link will be emailed to you.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 pt-1">
                  <Button
                    onClick={() => setRentalResult(null)}
                    variant="secondary"
                    size="large"
                    className="w-full justify-center gap-2"
                  >
                    <RefreshCw size={16} /> Rent Another
                  </Button>
                  <Button href="/dev/contact" variant="ghost" size="small" className="w-full justify-center">
                    <Shield size={14} /> Need Help? Contact Support
                  </Button>
                </div>
              </div>
            ) : rentalResult && !rentalResult.status ? (
              <div className="text-center space-y-4 py-4">
                <p className="text-sm text-[var(--foreground)] font-medium">Pay the upfront fee to activate your rental.</p>
                <Button onClick={handleRentalPay} variant="primary" size="large" className="w-full justify-center gap-2">
                  <IndianRupee size={18} /> Pay ₹{rentalResult.upfrontFee} Upfront Fee
                </Button>
                <p className="font-code-brand text-xs text-[var(--muted)]">Rental ID: {rentalResult.rentalId}</p>
              </div>
            ) : (
              <form onSubmit={handleRentalSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[var(--muted)] mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={rentalForm.name}
                    onChange={(e) => setRentalForm({ ...rentalForm, name: e.target.value })}
                    className="w-full rounded-xl border-2 border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm font-semibold text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
                    placeholder="Your full name"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[var(--muted)] mb-1.5">Email</label>
                    <input
                      type="email"
                      required
                      value={rentalForm.email}
                      onChange={(e) => setRentalForm({ ...rentalForm, email: e.target.value })}
                      className="w-full rounded-xl border-2 border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm font-semibold text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
                      placeholder="you@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[var(--muted)] mb-1.5">Phone</label>
                    <input
                      type="tel"
                      required
                      value={rentalForm.phone}
                      onChange={(e) => setRentalForm({ ...rentalForm, phone: e.target.value })}
                      className="w-full rounded-xl border-2 border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm font-semibold text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[var(--muted)] mb-2">Rental Duration</label>
                  <div className="grid grid-cols-5 gap-2">
                    {RENTAL_CONFIG.timeOptions.map((opt) => (
                      <Button
                        key={opt.days}
                        type="button"
                        aria-label={"Select " + opt.days + " day rental duration"}
                        aria-pressed={rentalForm.days === opt.days}
                        onClick={() => setRentalForm({ ...rentalForm, days: opt.days })}
                        variant={rentalForm.days === opt.days ? "primary" : "secondary"}
                        size="small"
                        className="text-xs font-black"
                      >
                        {opt.days}D
                      </Button>
                    ))}
                  </div>
                  {rentalForm.days === 7 && (
                    <p className="mt-1.5 text-[11px] font-bold text-[var(--accent)]">Most popular choice</p>
                  )}
                </div>

                {rentalError && (
                  <div className="rounded-xl border-2 border-red-400 bg-red-50 dark:bg-red-950/30 p-3 text-xs font-bold text-red-800 dark:text-red-300">
                    {rentalError}
                  </div>
                )}

                <label className="flex items-start gap-3 cursor-pointer rounded-xl border-2 border-[var(--border)] bg-[var(--surface-muted)] p-4 transition-colors hover:border-[var(--primary)]">
                  <input
                    type="checkbox"
                    checked={rentalTermsAccepted}
                    onChange={(e) => { setRentalTermsAccepted(e.target.checked); if (e.target.checked) setRentalError(""); }}
                    className="mt-0.5 h-4 w-4 flex-shrink-0 accent-[var(--primary)]"
                  />
                  <span className="text-sm leading-relaxed text-[var(--foreground)]">
                    I have read and agree to the <Link href="/dev/terms" target="_blank" className="font-bold text-primary underline underline-offset-2 hover:no-underline">Terms &amp; Conditions</Link>, including the Rent Services billing terms and acceptable use policy.
                  </span>
                </label>

                <Button
                  type="submit"
                  variant="primary"
                  size="large"
                  disabled={rentalLoading || !rentalTermsAccepted}
                  className="w-full justify-center gap-2"
                >
                  {rentalLoading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
                  {rentalLoading ? "Creating Rental..." : "Rent for " + rentalForm.days + " Days — ₹" + RENTAL_CONFIG.upfrontFeeINR + " Upfront"}
                </Button>
                <p className="text-center text-[11px] font-semibold text-[var(--muted)]">
                  Secure Razorpay Checkout • Bill emailed after usage • No hidden charges
                </p>
              </form>
            )}
          </div>
        </section>

        {/* How It Works */}
        <section className="glass-surface-strong rounded-2xl px-6 py-10 md:px-12 md:py-14 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-code-brand text-xs font-black uppercase tracking-wider text-primary">
                Deployment Workflow
              </span>
              <h2 className="text-2xl font-black text-[var(--heading)] md:text-4xl">
                How to Get Started in 3 Steps
              </h2>
            </div>
          </div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                step: "01",
                title: "Select Your Plan",
                desc: "Choose the tier that matches your compute runtimes and AI model requirements. View exact quotas upfront.",
              },
              {
                step: "02",
                title: "Activate via Razorpay",
                desc: "Complete one-time setup and activate monthly billing via secure card, UPI, or NetBanking. Instant confirmation.",
              },
              {
                step: "03",
                title: "Access Dashboard & APIs",
                desc: "Manage instances, view real-time telemetry, integrate API gateways, or pause/resume your subscription anytime.",
              },
            ].map((item) => (
              <div key={item.step} className="glass-surface rounded-xl p-6 space-y-3">
                <div className="glass-chip-strong inline-flex h-10 w-10 items-center justify-center rounded-xl font-code-brand text-sm font-black text-primary">
                  {item.step}
                </div>
                <h4 className="text-lg font-black text-[var(--heading)]">{item.title}</h4>
                <p className="text-sm leading-relaxed text-[var(--foreground)] font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Frequently Asked Questions Section */}
        <section className="glass-surface-strong rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 space-y-6 sm:space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="glass-chip-strong inline-flex items-center gap-2 rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-black uppercase text-primary">
              <HelpCircle size={14} className="sm:hidden" />
              <HelpCircle size={15} className="hidden sm:block" />
              <span>Frequently Asked Questions</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[var(--heading)] md:text-4xl">
              Got Questions About Cloud Services?
            </h3>
            <p className="text-sm sm:text-base text-[var(--foreground)] font-medium">
              Everything you need to know about compute hours, API keys, pause options, and billing cycles.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface-strong)] shadow-[var(--shadow-soft)] overflow-hidden transition-all duration-200"
                >
                  <Button
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    aria-controls={"faq-answer-" + index}
                    style={{ fontFamily: 'inherit' }}
                    variant="ghost"
                    className="w-full flex items-center justify-between p-3 sm:p-4 md:p-5 text-left gap-3 sm:gap-4 border-0 bg-transparent shadow-none hover:!bg-[var(--surface-muted)] !font-normal"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3.5">
                      <span className="flex-shrink-0 font-code-brand text-xs font-black px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border-2 border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)]">
                        Q{index + 1}
                      </span>
                      <span className="text-sm sm:text-base md:text-lg font-black text-[var(--heading)] leading-snug">
                        {faq.q}
                      </span>
                    </div>
                    <div
                      className={`flex h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 items-center justify-center rounded-full border-2 border-[var(--border)] transition-all ${
                        isOpen
                          ? "bg-[var(--primary)] text-white shadow-[2px_2px_0_var(--border)]"
                          : "bg-[var(--surface-muted)] text-[var(--foreground)]"
                      }`}
                    >
                      <ChevronDown
                        size={16}
                        className={`sm:hidden transition-transform duration-200 ${isOpen ? "rotate-180 text-white" : ""}`}
                      />
                      <ChevronDown
                        size={18}
                        className={`hidden sm:block transition-transform duration-200 ${isOpen ? "rotate-180 text-white" : ""}`}
                      />
                    </div>
                  </Button>

                  <div
                    id={"faq-answer-" + index}
                    role="region"
                    className={
                      "grid transition-[grid-template-rows] duration-300 ease-in-out border-t-2 border-[var(--border-soft)] " +
                      (isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")
                    }
                  >
                    <div className="overflow-hidden bg-[var(--surface)]">
                      <div className="p-3 sm:p-4 md:p-5 text-[var(--foreground)] text-sm sm:text-base leading-relaxed font-semibold">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Dashboard & Inquiry CTA */}
        <section className="glass-surface-strong rounded-2xl px-6 py-10 text-center md:px-12 md:py-14 space-y-6">
          <div className="glass-icon-plate mx-auto flex h-14 w-14 items-center justify-center rounded-2xl">
            <Terminal size={24} className="text-primary" />
          </div>
          <div className="max-w-xl mx-auto space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-[var(--heading)] md:text-3xl">
              Already Have an Active Subscription?
            </h3>
            <p className="text-sm md:text-base text-[var(--foreground)] font-medium">
              Lookup your account by email to inspect real-time compute usage, view active API credentials, change plans, or pause your service.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Button href="/dev/cloud/dashboard" variant="primary" size="large" className="touch-target">
              <Zap size={16} className="sm:hidden" /><Zap size={18} className="hidden sm:block" /> Go to Cloud Dashboard
            </Button>
            <Button href="/dev/contact" variant="secondary" size="large" className="touch-target">
              <Users size={16} className="sm:hidden" /><Users size={18} className="hidden sm:block" /> Contact Enterprise Sales
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

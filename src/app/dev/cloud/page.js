"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CheckCircle,
  ChevronDown,
  Cloud,
  Cpu,
  HelpCircle,
  Shield,
  Zap,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { SUBSCRIPTION_TIERS } from "@/lib/server/subscription-plans";

const tierOrder = ["base", "medium", "highest"];

const tierIcons = {
  base: Cpu,
  medium: Bot,
  highest: Cloud,
};

const tierBadges = {
  base: { label: "Starter", color: "bg-[var(--primary)]" },
  medium: { label: "Most Popular", color: "bg-[var(--accent)]" },
  highest: { label: "Enterprise", color: "bg-[var(--accent-cool)]" },
};

const faqs = [
  {
    q: "How are compute hours allocated and tracked?",
    a: "Compute hours represent dedicated execution runtime for your workloads and scripts. Each billing cycle runs for 30 days and resets your usage metrics automatically. On the Starter plan, hours are split evenly across the month (150h first half / 150h second half), while Pro and Enterprise tiers provide unrestricted monthly pools.",
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
    a: "You can transition between tiers anytime from your dashboard. Upgrades or plan switches are scheduled for your upcoming monthly renewal date so your current plan benefits continue without disruption.",
  },
];

export default function CloudPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="container space-y-12 md:space-y-16">
        {/* Hero Section */}
        <section className="glass-surface-strong rounded-2xl px-8 py-12 text-left md:px-12">
          <div className="glass-chip-strong mb-6 inline-flex items-center gap-2 rounded-xl px-4 py-2">
            <Cloud size={16} className="text-primary" />
            <span className="text-sm font-bold uppercase text-primary">Cloud Services</span>
          </div>

          <h1 className="mb-6 max-w-4xl text-4xl font-black text-slate-950 md:text-5xl lg:text-6xl">
            Rent AI Models &{" "}
            <span className="glass-text-gradient">Compute Power</span>
          </h1>

          <p className="max-w-3xl text-lg text-slate-700 leading-relaxed mb-8">
            Access powerful AI model APIs (GPT-4o, Gemini, Claude), dedicated compute engines, and GPU resources on a transparent subscription basis. Start building without heavy upfront infrastructure investment.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button href="#plans" variant="primary" size="large">
              Choose a Plan <ArrowRight size={16} />
            </Button>
            <Button href="/dev/cloud/dashboard" variant="secondary" size="large">
              <Zap size={16} /> Go to Dashboard
            </Button>
          </div>
        </section>

        {/* Stats Row */}
        <section className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Cpu, label: "Compute Hours", value: "Up to 1,000 hrs/mo", desc: "Dedicated engine power" },
            { icon: Bot, label: "AI Models", value: "GPT, Gemini, Claude", desc: "Unified premium LLM API access" },
            { icon: Shield, label: "Enterprise Grade", value: "Dedicated GPUs", desc: "MATLAB & premium tools" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card hover={false} className="text-center h-full flex flex-col justify-center py-8">
                <stat.icon className="mx-auto mb-3 text-primary" size={32} />
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{stat.label}</p>
                <p className="mt-1 text-xl font-black text-slate-950">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-700 font-medium">{stat.desc}</p>
              </Card>
            </motion.div>
          ))}
        </section>

        {/* Pricing Cards */}
        <section id="plans" className="scroll-mt-24">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-black text-slate-950 md:text-5xl">Choose Your Plan</h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-700 font-medium">
              All plans include a one-time setup fee. Subscriptions are billed monthly and run for 12 months.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 items-stretch">
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
                  className={isHighlighted ? "md:-mt-4 md:mb-[-16px] flex" : "flex"}
                >
                  <Card
                    hover={!isHighlighted}
                    className={
                      "relative flex w-full flex-col justify-between p-8 " +
                      (isHighlighted
                        ? "glass-surface-strong border-2 !border-[var(--accent)] shadow-[var(--shadow)] md:scale-105"
                        : "glass-surface")
                    }
                  >
                    {/* Top Header */}
                    <div>
                      <div className="mb-6 flex items-center gap-3">
                        <div
                          className={`flex h-13 w-13 items-center justify-center rounded-xl border-2 border-[var(--border)] ${badge.color} shadow-[var(--shadow-soft)]`}
                        >
                          <Icon className="text-white" size={24} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-slate-950">{plan.name}</h3>
                          {isHighlighted && (
                            <span className="inline-block rounded-md bg-[var(--accent)] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
                              {badge.label}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Limited Promotional Offer Banner for Starter */}
                      {plan.originalMonthlyAmountINR && plan.offerEndDate && new Date(plan.offerEndDate) >= new Date() && (
                        <div className="mb-5 rounded-xl border-2 border-amber-400 bg-amber-50 px-3.5 py-3 text-center">
                          <p className="text-[11px] font-black uppercase tracking-widest text-amber-800">Limited Promotional Offer</p>
                          <p className="mt-1 text-xs font-bold text-amber-950">
                            Original: <span className="line-through decoration-amber-500 font-semibold">₹{plan.originalMonthlyAmountINR.toLocaleString("en-IN")}/mo + ₹{plan.originalSetupFeeINR.toLocaleString("en-IN")} setup</span>
                          </p>
                          <p className="mt-1 text-[11px] font-bold text-amber-800">Offer valid till 24 September 2026</p>
                        </div>
                      )}

                      {/* Pricing */}
                      <div className="mb-6">
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm font-bold text-slate-600">INR</span>
                          <span className="text-4xl font-black text-slate-950 md:text-5xl">
                            ₹{plan.monthlyAmountINR.toLocaleString("en-IN")}
                          </span>
                          <span className="text-sm font-semibold text-slate-600">/ month</span>
                        </div>
                        <p className="mt-1.5 text-sm text-slate-700 font-semibold">
                          + one-time setup fee of ₹{plan.setupFeeINR.toLocaleString("en-IN")}
                        </p>
                      </div>

                      {/* Features */}
                      <ul className="mb-8 space-y-3">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-800 font-medium">
                            <CheckCircle size={16} className="mt-0.5 flex-shrink-0 text-primary" />
                            <span className="leading-snug">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <div>
                      <Button
                        href={`/dev/cloud/checkout?tier=${tierKey}`}
                        variant={isHighlighted ? "primary" : "secondary"}
                        size="large"
                        className="w-full font-bold"
                      >
                        Subscribe <ArrowRight size={16} />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* How It Works */}
        <section className="glass-surface-strong rounded-2xl px-8 py-12 text-left md:px-12">
          <h2 className="mb-8 text-2xl font-black text-slate-950 md:text-3xl">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Choose a Plan",
                desc: "Pick the tier that matches your compute and AI API needs. Each plan comes with a transparent set of resources and quotas.",
              },
              {
                step: "02",
                title: "Setup Payment",
                desc: "Complete a one-time setup fee and activate your monthly subscription via Razorpay secure checkout. Instant activation.",
              },
              {
                step: "03",
                title: "Start Building",
                desc: "Access your compute engine, connect to AI model APIs, and monitor usage in real-time from your personal dashboard.",
              },
            ].map((item) => (
              <div key={item.step} className="space-y-3">
                <div className="glass-chip-strong inline-flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black text-primary">
                  {item.step}
                </div>
                <h4 className="text-lg font-bold text-slate-950">{item.title}</h4>
                <p className="text-sm leading-relaxed text-slate-700 font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Frequently Asked Questions Accordion */}
        <section className="glass-surface-strong rounded-2xl px-8 py-12 md:px-12 space-y-8">
          <div>
            <div className="glass-chip-strong mb-4 inline-flex items-center gap-2 rounded-xl px-4 py-1.5 text-xs font-bold uppercase text-primary">
              <HelpCircle size={15} />
              <span>Got Questions?</span>
            </div>
            <h2 className="text-3xl font-black text-slate-950 md:text-4xl">Frequently Asked Questions</h2>
            <p className="mt-2 text-slate-700 font-medium">
              Everything you need to know about DEV Infinity compute hours, API access, and billing.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border-2 border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-[var(--shadow-soft)] transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-5 md:p-6 text-left gap-4 hover:bg-[var(--surface-muted)] transition-colors"
                  >
                    <span className="text-base md:text-lg font-black text-slate-950">{faq.q}</span>
                    <ChevronDown
                      size={20}
                      className={`text-slate-900 flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-5 pb-5 md:px-6 md:pb-6 text-slate-700 text-sm md:text-base leading-relaxed border-t border-[var(--border-soft)] pt-4 bg-[var(--surface-strong)]"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* Dashboard Link Callout */}
        <section className="glass-surface-strong rounded-2xl px-8 py-10 text-center md:px-12 space-y-4">
          <h3 className="text-2xl font-black text-slate-950 md:text-3xl">Already Subscribed?</h3>
          <p className="mx-auto max-w-xl text-slate-700 font-medium text-base">
            Check your subscription status, view compute usage, and manage your AI API access from your personal dashboard.
          </p>
          <div className="pt-2">
            <Button href="/dev/cloud/dashboard" variant="secondary" size="large">
              <Zap size={16} /> Go to Dashboard
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

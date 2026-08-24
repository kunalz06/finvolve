"use client";

import { motion } from "framer-motion";
import {
    ArrowRight,
    CheckCircle,
    Cpu,
    Cloud,
    Bot,
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

export default function CloudPage() {
    return (
        <div className="min-h-screen px-6 py-12">
            <div className="container space-y-10">
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
                    <p className="max-w-3xl text-lg text-slate-600">
                        Access powerful AI model APIs, dedicated compute engines, and GPU
                        resources on a subscription basis. Start building without heavy
                        upfront infrastructure investment.
                    </p>
                </section>

                {/* Stats Row */}
                <section className="grid gap-4 md:grid-cols-3">
                    {[
                        { icon: Cpu, label: "Compute Hours", value: "Up to 1,000 hrs/mo", desc: "Dedicated engine power" },
                        { icon: Bot, label: "AI Models", value: "GPT, Gemini, Claude", desc: "Premium LLM API access" },
                        { icon: Shield, label: "Enterprise Grade", value: "Dedicated GPUs", desc: "MATLAB & premium tools" },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={false}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                        >
                            <Card hover={false} className="text-center">
                                <stat.icon className="mx-auto mb-3 text-primary" size={28} />
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{stat.label}</p>
                                <p className="mt-1 text-lg font-bold text-slate-950">{stat.value}</p>
                                <p className="mt-1 text-sm text-slate-500">{stat.desc}</p>
                            </Card>
                        </motion.div>
                    ))}
                </section>

                {/* Pricing Cards */}
                <section>
                    <div className="mb-8 text-center">
                        <h2 className="mb-3 text-3xl font-bold text-slate-950 md:text-4xl">Choose Your Plan</h2>
                        <p className="mx-auto max-w-2xl text-lg text-slate-600">
                            All plans include a one-time setup fee. Subscriptions are billed monthly and run for 12 months.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
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
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className={isHighlighted ? "md:-mt-4 md:mb-[-16px]" : ""}
                                >
                                    <Card
                                        hover={!isHighlighted}
                                        className={`relative flex h-full flex-col ${
                                            isHighlighted
                                                ? "glass-surface-strong border-2 !border-[var(--accent)] md:scale-105"
                                                : ""
                                        }`}
                                    >
                                        {/* Badge */}
                                        <div className="mb-6 flex items-center gap-3">
                                            <div
                                                className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[var(--border)] ${badge.color} shadow-[var(--shadow-soft)]`}
                                            >
                                                <Icon className="text-white" size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-950">{plan.name}</h3>
                                                {isHighlighted && (
                                                    <span className="inline-block rounded-md bg-[var(--accent)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                                                        {badge.label}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Pricing */}
                                        <div className="mb-6">
                                            {plan.originalMonthlyAmountINR && plan.offerEndDate && new Date(plan.offerEndDate) >= new Date() && (
                                                <div className="mb-3 rounded-xl border border-amber-300 bg-amber-50/90 px-3 py-2 text-center">
                                                    <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Limited Offer</p>
                                                    <p className="mt-0.5 text-[13px] text-amber-800">
                                                        Original: <span className="line-through">INR {plan.originalMonthlyAmountINR.toLocaleString("en-IN")}/mo + INR {plan.originalSetupFeeINR.toLocaleString("en-IN")} setup</span>
                                                    </p>
                                                    <p className="mt-1 text-xs font-semibold text-amber-700">Offer valid till {new Date(plan.offerEndDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                                                </div>
                                            )}
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-sm font-medium text-slate-500">INR</span>
                                                <span className="text-4xl font-black text-slate-950">
                                                    {plan.monthlyAmountINR.toLocaleString("en-IN")}
                                                </span>
                                                <span className="text-sm text-slate-500">/month</span>
                                            </div>
                                            <p className="mt-1 text-sm text-slate-500">
                                                + one-time setup fee of INR {plan.setupFeeINR.toLocaleString("en-IN")}
                                            </p>
                                        </div>

                                        {/* Features */}
                                        <ul className="mb-8 flex-1 space-y-3">
                                            {plan.features.map((feature) => (
                                                <li key={feature} className="flex items-start gap-2 text-sm text-slate-600">
                                                    <CheckCircle size={16} className="mt-0.5 flex-shrink-0 text-primary" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>

                                        {/* CTA */}
                                        <Button
                                            href={`/dev/cloud/checkout?tier=${tierKey}`}
                                            variant={isHighlighted ? "primary" : "secondary"}
                                            size="large"
                                            className="w-full"
                                        >
                                            Subscribe <ArrowRight size={16} />
                                        </Button>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* Dashboard Link */}
                <section className="glass-surface-strong rounded-2xl px-8 py-10 text-center md:px-12">
                    <h3 className="mb-3 text-2xl font-bold text-slate-950">Already Subscribed?</h3>
                    <p className="mx-auto mb-6 max-w-xl text-slate-600">
                        Check your subscription status, view compute usage, and manage your AI API access from your personal dashboard.
                    </p>
                    <Button href="/dev/cloud/dashboard" variant="secondary" size="large">
                        <Zap size={16} /> Go to Dashboard
                    </Button>
                </section>

                {/* How It Works */}
                <section className="glass-surface-strong rounded-2xl px-8 py-12 text-left md:px-12">
                    <h2 className="mb-8 text-2xl font-bold text-slate-950">How It Works</h2>
                    <div className="grid gap-8 md:grid-cols-3">
                        {[
                            {
                                step: "01",
                                title: "Choose a Plan",
                                desc: "Pick the tier that matches your compute and AI API needs. Each plan comes with a clear set of resources and access levels.",
                            },
                            {
                                step: "02",
                                title: "Setup Payment",
                                desc: "Complete a one-time setup fee and activate your monthly subscription via Razorpay secure checkout. Your billing starts immediately.",
                            },
                            {
                                step: "03",
                                title: "Start Building",
                                desc: "Access your compute engine, connect to AI model APIs, and start building. Track usage from your dashboard.",
                            },
                        ].map((item) => (
                            <div key={item.step}>
                                <div className="glass-chip-strong mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black text-primary">
                                    {item.step}
                                </div>
                                <h4 className="mb-2 text-lg font-bold text-slate-950">{item.title}</h4>
                                <p className="text-sm leading-relaxed text-slate-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

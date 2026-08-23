"use client";

import { useState } from "react";
import Link from "next/link";
import {
    AlertCircle,
    CheckCircle,
    ChevronLeft,
    Cpu,
    Bot,
    Loader2,
    Search,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { apiUrl } from "@/lib/api";
import { SUBSCRIPTION_TIERS } from "@/lib/server/subscription-plans";

const statusColors = {
    active: "text-emerald-600 bg-emerald-50/85 border-emerald-200",
    created: "text-amber-600 bg-amber-50/85 border-amber-200",
    paused: "text-amber-600 bg-amber-50/85 border-amber-200",
    cancelled: "text-red-600 bg-red-50/85 border-red-200",
    completed: "text-slate-600 bg-slate-50/85 border-slate-200",
    halted: "text-red-600 bg-red-50/85 border-red-200",
};

const statusLabels = {
    active: "Active",
    created: "Pending Activation",
    paused: "Paused",
    cancelled: "Cancelled",
    completed: "Completed",
    halted: "Halted",
};

export default function DashboardPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [subscription, setSubscription] = useState(null);
    const [error, setError] = useState("");

    const handleLookup = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;

        setLoading(true);
        setError("");
        setSubscription(null);

        try {
            const res = await fetch(
                apiUrl(`/dev/api/subscription/status?email=${encodeURIComponent(email.trim())}`),
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Unable to fetch subscription.");

            if (!data.found) {
                setError("No active subscription found for this email address.");
            } else {
                setSubscription(data);
            }
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const planConfig = subscription ? SUBSCRIPTION_TIERS[subscription.tier] : null;

    return (
        <div className="min-h-screen px-6 py-12">
            <div className="container">
                <Link href="/dev/cloud" className="mb-8 inline-flex items-center text-sm font-medium text-slate-500 transition-colors hover:text-primary">
                    <ChevronLeft size={16} className="mr-1" />
                    Back to Cloud Plans
                </Link>

                <div className="mx-auto max-w-5xl">
                    <div className="mb-12 text-center">
                        <div className="glass-chip-strong mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2">
                            <Cpu size={16} className="text-primary" />
                            <span className="text-sm font-medium text-primary">DASHBOARD</span>
                        </div>
                        <h1 className="mb-2 text-3xl font-bold text-slate-950 md:text-4xl">Subscription Dashboard</h1>
                        <p className="text-lg text-slate-600">Look up your subscription and track usage.</p>
                    </div>

                    {/* Lookup Form */}
                    <Card hover={false} className="glass-surface-strong mb-8">
                        <form onSubmit={handleLookup} className="flex flex-col gap-4 sm:flex-row sm:items-end">
                            <div className="flex-1">
                                <label htmlFor="dash-email" className="mb-2 block text-sm font-medium text-slate-700">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="dash-email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="Enter the email used during subscription"
                                    className="w-full rounded-[22px] px-4 py-3 text-slate-900"
                                />
                            </div>
                            <Button type="submit" variant="primary" size="large" disabled={loading}>
                                {loading ? (
                                    <><Loader2 size={18} className="animate-spin" /> Looking up...</>
                                ) : (
                                    <><Search size={16} /> Look Up</>
                                )}
                            </Button>
                        </form>
                    </Card>

                    {error && (
                        <div className="mb-8 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50/85 p-4 text-amber-700">
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Subscription Details */}
                    {subscription && planConfig && (
                        <div className="space-y-8">
                            {/* Status Bar */}
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-950">
                                        {planConfig.name} Plan
                                    </h2>
                                    <p className="text-sm text-slate-500">ID: {subscription.subscriptionId}</p>
                                </div>
                                <span
                                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold ${
                                        statusColors[subscription.status] || "text-slate-600 bg-slate-50/85 border-slate-200"
                                    }`}
                                >
                                    {subscription.status === "active" && <CheckCircle size={16} />}
                                    {statusLabels[subscription.status] || subscription.status}
                                </span>
                            </div>

                            <div className="grid gap-8 md:grid-cols-2">
                                {/* Billing Info */}
                                <Card hover={false} className="glass-surface-strong">
                                    <h3 className="mb-6 text-lg font-bold text-slate-950">Billing Details</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Monthly Amount</span>
                                            <span className="font-bold text-slate-950">
                                                INR {subscription.monthlyAmount?.toLocaleString("en-IN")}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Setup Fee</span>
                                            <span className="font-bold text-slate-950">
                                                INR {subscription.setupFee?.toLocaleString("en-IN")}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Cycles Completed</span>
                                            <span className="font-bold text-slate-950">
                                                {subscription.cycleCount || 0} / 12
                                            </span>
                                        </div>
                                        {subscription.currentPeriodStart && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-slate-600">Current Period</span>
                                                <span className="text-right text-sm font-medium text-slate-950">
                                                    {new Date(subscription.currentPeriodStart).toLocaleDateString("en-IN", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                    {subscription.currentPeriodEnd && (
                                                        <span className="text-slate-500">
                                                            {" "}— {" "}
                                                            {new Date(subscription.currentPeriodEnd).toLocaleDateString("en-IN", {
                                                                day: "numeric",
                                                                month: "short",
                                                                year: "numeric",
                                                            })}
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </Card>

                                {/* Compute Usage */}
                                <Card hover={false} className="glass-surface-strong">
                                    <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-slate-950">
                                        <Cpu size={20} className="text-primary" /> Compute Usage
                                    </h3>
                                    {subscription.computeUsage ? (
                                        <div className="space-y-4">
                                            <UsageBar
                                                label="Total Compute"
                                                used={subscription.computeUsage.usedThisPeriod || 0}
                                                total={subscription.computeUsage.totalAllowed || planConfig.computeHours.total}
                                                unit="hrs"
                                            />
                                            {planConfig.computeHours.restricted && (
                                                <>
                                                    <UsageBar
                                                        label="First Half (1st–15th)"
                                                        used={subscription.computeUsage.firstHalfUsed || 0}
                                                        total={planConfig.computeHours.perHalf}
                                                        unit="hrs"
                                                    />
                                                    <UsageBar
                                                        label="Second Half (16th–end)"
                                                        used={subscription.computeUsage.secondHalfUsed || 0}
                                                        total={planConfig.computeHours.perHalf}
                                                        unit="hrs"
                                                    />
                                                </>
                                            )}
                                            {planConfig.computeHours.dedicatedGPU && (
                                                <div className="mt-4 flex items-center gap-2 rounded-xl bg-[var(--primary-soft)] p-3">
                                                    <CheckCircle size={16} className="text-primary" />
                                                    <span className="text-xs font-medium text-slate-700">Dedicated GPU Access Enabled</span>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-500">Usage data will appear after activation.</p>
                                    )}
                                </Card>

                                {/* API Usage */}
                                <Card hover={false} className="glass-surface-strong md:col-span-2">
                                    <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-slate-950">
                                        <Bot size={20} className="text-primary" /> AI Model API Access
                                    </h3>
                                    {subscription.apiUsage ? (
                                        <div className="grid gap-6 md:grid-cols-3">
                                            <ApiUsageCard
                                                name="ChatGPT"
                                                used={subscription.apiUsage.gpt?.used || 0}
                                                allowed={subscription.apiUsage.gpt?.allowed || 0}
                                                active={planConfig.apiAccess.gpt}
                                            />
                                            <ApiUsageCard
                                                name="Google Gemini"
                                                used={subscription.apiUsage.gemini?.used || 0}
                                                allowed={subscription.apiUsage.gemini?.allowed || 0}
                                                active={planConfig.apiAccess.gemini}
                                            />
                                            <ApiUsageCard
                                                name="Claude"
                                                used={subscription.apiUsage.claude?.used || 0}
                                                allowed={subscription.apiUsage.claude?.allowed || 0}
                                                active={planConfig.apiAccess.claude}
                                                unlimited={planConfig.apiAccess.claude && planConfig.apiAccess.claudeHours === 0}
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-500">API usage data will appear after activation.</p>
                                    )}
                                </Card>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap justify-center gap-4">
                                <Button href="/dev/cloud" variant="secondary">Change Plan</Button>
                                <Button href="/dev/contact" variant="outline">Contact Support</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function UsageBar({ label, used, total, unit }) {
    const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0;
    const barColor = pct > 90 ? "bg-red-500" : pct > 70 ? "bg-amber-500" : "bg-[var(--primary)]";

    return (
        <div>
            <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-slate-600">{label}</span>
                <span className="font-bold text-slate-950">
                    {used} / {total} {unit}
                </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--surface-muted)]">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

function ApiUsageCard({ name, used, allowed, active, unlimited }) {
    if (!active) {
        return (
            <div className="rounded-xl border-2 border-[var(--border-soft)] p-4 text-center opacity-50">
                <p className="text-sm font-bold text-slate-500">{name}</p>
                <p className="mt-1 text-xs text-slate-400">Not included in your plan</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border-2 border-[var(--border)] bg-[var(--surface-strong)] p-4">
            <p className="text-sm font-bold text-slate-950">{name}</p>
            {unlimited ? (
                <p className="mt-1 text-xs font-medium text-emerald-600">Unlimited Access</p>
            ) : (
                <>
                    <p className="mt-1 text-xs text-slate-500">{used} / {allowed} hours used</p>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--surface-muted)]">
                        <div
                            className="h-full rounded-full bg-[var(--primary)] transition-all duration-500"
                            style={{ width: `${allowed > 0 ? Math.min((used / allowed) * 100, 100) : 0}%` }}
                        />
                    </div>
                </>
            )}
        </div>
    );
}

"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    AlertCircle,
    CheckCircle,
    ChevronLeft,
    CreditCard,
    Info,
    Loader2,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { apiUrl } from "@/lib/api";
import { SUBSCRIPTION_TIERS, VALID_TIERS } from "@/lib/server/subscription-plans";

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

function CheckoutContent() {
    const searchParams = useSearchParams();
    const tier = useMemo(() => searchParams.get("tier") || "", [searchParams]);
    const plan = SUBSCRIPTION_TIERS[tier];

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });
    const [status, setStatus] = useState("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [subscriptionId, setSubscriptionId] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!tier || !VALID_TIERS.includes(tier)) {
            setErrorMessage("Invalid plan selected.");
            return;
        }

        setStatus("processing");
        setErrorMessage("");

        try {
            const loaded = await loadRazorpayScript();
            if (!loaded) throw new Error("Failed to load Razorpay checkout. Are you online?");

            const res = await fetch(apiUrl("/dev/api/subscription/create"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tier, ...formData }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Unable to create subscription.");

            setSubscriptionId(data.subscriptionId);

            const options = {
                key: data.checkoutKey,
                subscription_id: data.subscriptionId,
                name: "DEV Infinity Cloud",
                description: `${data.planName} — Monthly Subscription`,
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone,
                },
                theme: { color: "#2457ff" },
                handler: function () {
                    // Razorpay closes automatically on subscription success.
                    setStatus("success");
                },
                modal: {
                    ondismiss: function () {
                        if (status !== "success") {
                            setStatus("idle");
                        }
                    },
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.on("payment.failed", (response) => {
                setErrorMessage(response?.error?.description || "Payment failed. Please try again.");
                setStatus("error");
            });
            razorpay.open();
        } catch (error) {
            console.error("Subscription checkout error:", error);
            setStatus("error");
            setErrorMessage(error.message || "Something went wrong. Please try again.");
        }
    };

    if (!plan) {
        return (
            <div className="min-h-screen px-6 py-12">
                <div className="container max-w-2xl text-center">
                    <Card hover={false} className="glass-surface-strong">
                        <AlertCircle className="mx-auto mb-4 text-amber-500" size={40} />
                        <h2 className="mb-3 text-2xl font-bold text-slate-950">Invalid Plan</h2>
                        <p className="mb-6 text-slate-600">The plan you selected does not exist. Please choose a valid plan.</p>
                        <Button href="/dev/cloud" variant="primary">View Plans</Button>
                    </Card>
                </div>
            </div>
        );
    }

    if (status === "success") {
        return (
            <div className="min-h-screen px-6 py-12">
                <div className="container max-w-2xl">
                    <Card hover={false} className="glass-surface-strong text-center">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100/90">
                            <CheckCircle className="text-emerald-600" size={40} />
                        </div>
                        <h2 className="mb-4 text-2xl font-bold text-slate-950">Subscription Activated!</h2>
                        <p className="mb-2 text-slate-600">
                            Your <strong>{plan.name}</strong> subscription is now active.
                        </p>
                        <p className="mb-8 text-sm text-slate-500">
                            First charge: INR {(plan.monthlyAmountINR + plan.setupFeeINR).toLocaleString("en-IN")} (includes setup fee).
                            You can access your dashboard to track usage.
                            {subscriptionId && (
                                <span className="block mt-2 text-xs text-slate-400">
                                    Subscription ID: {subscriptionId}
                                </span>
                            )}
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button href="/dev/cloud/dashboard" variant="primary">Go to Dashboard</Button>
                            <Button href="/dev/cloud" variant="secondary">Back to Plans</Button>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-6 py-12">
            <div className="container">
                <Link href="/dev/cloud" className="mb-8 inline-flex items-center text-sm font-medium text-slate-500 transition-colors hover:text-primary">
                    <ChevronLeft size={16} className="mr-1" />
                    Back to Plans
                </Link>

                <div className="mx-auto max-w-5xl">
                    <div className="mb-12 text-center">
                        <div className="glass-chip-strong mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2">
                            <CreditCard size={16} className="text-primary" />
                            <span className="text-sm font-medium text-primary">CHECKOUT</span>
                        </div>
                        <h1 className="mb-2 text-3xl font-bold text-slate-950 md:text-4xl">
                            Subscribe to {plan.name}
                        </h1>
                        <p className="text-lg text-slate-600">Complete your details to activate the subscription.</p>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Form */}
                        <div className="lg:col-span-2">
                            <Card hover={false} className="glass-surface-strong">
                                <h2 className="mb-6 text-xl font-bold text-slate-950">Your Details</h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Your Name"
                                            className="w-full rounded-[22px] px-4 py-3 text-slate-900"
                                        />
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div>
                                            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">Email Address</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                placeholder="your@email.com"
                                                className="w-full rounded-[22px] px-4 py-3 text-slate-900"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-700">Phone Number</label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                                placeholder="+91..."
                                                className="w-full rounded-[22px] px-4 py-3 text-slate-900"
                                            />
                                        </div>
                                    </div>

                                    {status === "error" && (
                                        <div className="flex items-center gap-3 rounded-[22px] border border-red-200 bg-red-50/85 p-4 text-red-700">
                                            <AlertCircle size={20} />
                                            <span>{errorMessage}</span>
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="large"
                                        className="w-full"
                                        disabled={status === "processing"}
                                    >
                                        {status === "processing" ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" /> Creating Subscription...
                                            </>
                                        ) : (
                                            <>
                                                Pay & Subscribe <CreditCard size={18} />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </Card>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <Card hover={false} className="glass-surface sticky top-24">
                                <h3 className="mb-6 text-lg font-bold text-slate-950">Order Summary</h3>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Plan</span>
                                        <span className="font-bold text-slate-950">{plan.name}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Monthly Fee</span>
                                        <span className="font-bold text-slate-950">INR {plan.monthlyAmountINR.toLocaleString("en-IN")}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Setup Fee (one-time)</span>
                                        <span className="font-bold text-slate-950">INR {plan.setupFeeINR.toLocaleString("en-IN")}</span>
                                    </div>

                                    <div className="border-t-2 border-[var(--border-soft)] pt-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold text-slate-700">First Charge</span>
                                            <span className="text-xl font-black text-slate-950">
                                                INR {(plan.monthlyAmountINR + plan.setupFeeINR).toLocaleString("en-IN")}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-xs text-slate-500">Includes first month + setup fee</p>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-3">
                                    <h4 className="text-sm font-bold text-slate-950">What You Get</h4>
                                    <ul className="space-y-2">
                                        {plan.features.slice(0, 4).map((f) => (
                                            <li key={f} className="flex items-start gap-2 text-xs text-slate-600">
                                                <CheckCircle size={14} className="mt-0.5 flex-shrink-0 text-primary" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-6 flex items-start gap-2 rounded-xl bg-[var(--primary-soft)] p-3">
                                    <Info size={16} className="mt-0.5 flex-shrink-0 text-primary" />
                                    <p className="text-xs text-slate-600">
                                        Subscription auto-renews monthly for 12 cycles. You can cancel anytime from your Razorpay dashboard.
                                    </p>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen px-6 py-12">
                    <div className="container max-w-2xl">
                        <Card hover={false} className="glass-surface-strong p-8 text-center">
                            <Loader2 className="mx-auto mb-4 animate-spin text-primary" size={28} />
                            <p className="text-sm text-slate-600">Loading checkout...</p>
                        </Card>
                    </div>
                </div>
            }
        >
            <CheckoutContent />
        </Suspense>
    );
}

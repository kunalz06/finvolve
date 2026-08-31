"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle, ChevronLeft, CreditCard, Loader2, Zap } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { apiUrl } from "@/lib/api";

export default function QuickStartPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "Web Development",
    description: "",
  });
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentAndSubmit = async (e) => {
    e.preventDefault();
    setStatus("processing");
    setErrorMessage("");

    const loadRazorpayScript = () => new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

    try {
      const res = await loadRazorpayScript();
      if (!res) throw new Error("Razorpay SDK failed to load. Are you online?");

      const orderRes = await fetch(apiUrl("/dev/api/create-order"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "quick_start", amount: 99 }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok || orderData.error) {
        throw new Error(orderData.error || "Unable to create quick-start order.");
      }

      const options = {
        key: orderData.checkoutKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "DEV Infinity",
        description: "Quick Start Project Fee",
        order_id: orderData.id,
        handler: async (response) => {
          try {
            const verifyRes = await fetch(apiUrl("/dev/api/verify-payment"), {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                source: "quick_start",
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                quickStartData: formData,
              }),
            });
            const verifyJson = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyJson.error || "Payment verification failed.");

            setStatus("success");
            setFormData({ name: "", email: "", phone: "", projectType: "Web Development", description: "" });
          } catch (err) {
            console.error("Error verifying quick-start payment:", err);
            setStatus("error");
            setErrorMessage(err.message || "Payment successful but verification failed. Please contact support.");
          }
        },
        prefill: { name: formData.name, email: formData.email, contact: formData.phone },
        theme: { color: "#8B5CF6" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      paymentObject.on("payment.failed", (response) => {
        setStatus("error");
        setErrorMessage(response.error.description);
      });
    } catch (error) {
      console.error("Error processing quick start:", error);
      setStatus("error");
      setErrorMessage(error.message || "Payment processing failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="container">
        <Link href="/dev" className="mb-8 inline-flex items-center text-sm font-medium text-slate-500 transition-colors hover:text-primary">
          <ChevronLeft size={16} className="mr-1" />
          Back to Home
        </Link>

        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <div className="glass-chip-strong mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2">
              <Zap size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">PREMIUM SERVICE</span>
            </div>
            <h1 className="mb-4 text-3xl font-bold text-slate-950 md:text-4xl">Quick Start Project</h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">Skip the queue and get priority support with expedited planning.</p>
          </div>

          {status === "success" ? (
            <Card hover={false} className="glass-surface-strong mx-auto max-w-lg text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15">
                <CheckCircle className="text-emerald-500" size={40} />
              </div>
              <h2 className="mb-4 text-2xl font-bold text-slate-950">You&apos;re All Set!</h2>
              <p className="mb-8 text-slate-600">
                Payment confirmed. Your project has been flagged as <strong>Priority</strong>. We will be in touch within 24 hours to begin the engineering phase.
              </p>
              <Button href="/dev" variant="primary">Return Home</Button>
            </Card>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card hover={false} className="glass-surface-strong">
                  <h2 className="mb-6 text-xl font-bold text-slate-950">Project Details</h2>
                  <form onSubmit={handlePaymentAndSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
                      <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Your Name" className="w-full rounded-[22px] px-4 py-3 text-slate-900" />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">Email Address</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="your@email.com" className="w-full rounded-[22px] px-4 py-3 text-slate-900" />
                      </div>
                      <div>
                        <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-700">Phone Number</label>
                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+91..." className="w-full rounded-[22px] px-4 py-3 text-slate-900" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="projectType" className="mb-2 block text-sm font-medium text-slate-700">Project Type</label>
                      <select id="projectType" name="projectType" value={formData.projectType} onChange={handleChange} className="w-full rounded-[22px] px-4 py-3 text-slate-900 [&>option]:bg-white">
                        <option value="Web Development">Web Development</option>
                        <option value="Android App">Android App</option>
                        <option value="Custom Software">Custom Software</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="description" className="mb-2 block text-sm font-medium text-slate-700">Project Description</label>
                      <textarea id="description" name="description" value={formData.description} onChange={handleChange} required placeholder="Describe your project requirements..." rows={4} className="w-full resize-none rounded-[22px] px-4 py-3 text-slate-900" />
                    </div>

                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="terms" required className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                      <label htmlFor="terms" className="text-sm text-slate-600">
                        I agree to the <Link href="/dev/terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Terms of Service</Link>
                      </label>
                    </div>

                    {status === "error" && (
                      <div className="flex items-center gap-3 rounded-[22px] border border-red-500/40 bg-red-500/10 p-4 text-red-400">
                        <AlertCircle size={20} />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <Button type="submit" variant="primary" size="large" className="w-full" disabled={status === "processing"}>
                      {status === "processing" ? (
                        <>
                          <Loader2 size={18} className="animate-spin" /> Processing...
                        </>
                      ) : (
                        <>
                          Pay and Launch <CreditCard size={18} />
                        </>
                      )}
                    </Button>
                  </form>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <Card hover={false} className="glass-surface sticky top-24">
                  <h3 className="mb-6 text-lg font-bold text-slate-950">Priority Benefits</h3>
                  <ul className="space-y-4">
                    {[
                      ["Under 48 Hours", "Immediate response time."],
                      ["Direct Communication", "Talk directly with engineers."],
                      ["Priority Queue", "Skip the waiting line."],
                    ].map(([title, copy]) => (
                      <li key={title} className="flex items-start gap-3">
                        <CheckCircle size={20} className="mt-0.5 flex-shrink-0 text-primary" />
                        <div>
                          <strong className="block text-slate-950">{title}</strong>
                          <span className="text-sm text-slate-500">{copy}</span>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 border-t border-white/45 pt-8 text-center">
                    <span className="text-sm uppercase tracking-[0.24em] text-slate-500">Entry Fee</span>
                    <div className="mt-2 text-4xl font-bold text-slate-950">INR 99</div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

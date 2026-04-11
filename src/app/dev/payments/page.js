"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle, CreditCard, Loader2, Lock } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

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

function PaymentPortalContent() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const loadSession = async () => {
      if (!token) {
        setError("Missing payment token. Please use the payment link sent by DEV♾️.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      try {
        const response = await fetch("/dev/api/payment-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.error || "Unable to load payment session.");
        if (!cancelled) setSession(json);
      } catch (sessionError) {
        if (!cancelled) setError(sessionError.message || "Unable to load payment details.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadSession();
    return () => { cancelled = true; };
  }, [token]);

  const handlePayment = async () => {
    if (!session) return;
    setProcessing(true);
    setError("");

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Failed to load Razorpay checkout.");

      const orderResponse = await fetch("/dev/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "payment_portal", amount: Number(session.amount), paymentRequestId: session.id, token }),
      });
      const order = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(order.error || "Failed to create payment order.");

      const options = {
        key: order.checkoutKey,
        amount: order.amount,
        currency: order.currency,
        name: "DEV Infinity Services",
        description: "Client payment",
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyResponse = await fetch("/dev/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                source: "payment_portal",
                paymentRequestId: session.id,
                token,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyJson = await verifyResponse.json();
            if (!verifyResponse.ok) throw new Error(verifyJson.error || "Payment verification failed.");
            setSession((prev) => ({ ...prev, status: "paid" }));
          } catch (verifyError) {
            setError(verifyError.message || "Payment captured but verification failed.");
          } finally {
            setProcessing(false);
          }
        },
        prefill: { name: session.clientName || "", email: session.clientEmail || "" },
        theme: { color: "#8B5CF6" },
        modal: { ondismiss: () => setProcessing(false) },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (failure) => {
        setError(failure?.error?.description || "Payment failed.");
        setProcessing(false);
      });
      razorpay.open();
    } catch (paymentError) {
      setError(paymentError.message || "Payment initialization failed.");
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="container max-w-md">
        {loading ? (
          <Card hover={false} className="glass-surface-strong p-8 text-center">
            <Loader2 className="mx-auto mb-4 animate-spin text-primary" size={28} />
            <p className="text-sm text-slate-600">Loading secure payment session...</p>
          </Card>
        ) : (
          <Card hover={false} className="glass-surface-strong p-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="glass-icon-plate flex h-16 w-16 items-center justify-center rounded-full">
                <Lock className="text-primary" size={28} />
              </div>
            </div>

            <h2 className="mb-2 text-2xl font-bold text-slate-950">Secure Payment Portal</h2>
            {session && <p className="mb-6 text-slate-500">{session.clientName ? `Hello, ${session.clientName}` : "Payment Request"}</p>}

            {error && (
              <div className="mb-6 flex items-center gap-2 rounded-[22px] border border-red-200 bg-red-50/85 p-3 text-sm text-red-700">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {session ? (
              <>
                <div className="glass-chip-strong mb-8 rounded-[24px] p-6">
                  <p className="mb-1 text-sm uppercase tracking-[0.24em] text-slate-500">Amount Due</p>
                  <div className="text-4xl font-bold text-slate-950">INR {Number(session.amount).toLocaleString()}</div>
                </div>

                {session.status === "paid" ? (
                  <div className="flex items-center justify-center gap-2 rounded-[22px] border border-emerald-200 bg-emerald-50/85 p-4 font-semibold text-emerald-700">
                    <CheckCircle size={20} /> Payment Complete
                  </div>
                ) : (
                  <Button onClick={handlePayment} variant="primary" size="large" className="w-full" disabled={processing}>
                    {processing ? (
                      <>
                        <Loader2 className="animate-spin" size={18} /> Processing...
                      </>
                    ) : (
                      <>
                        Pay Now <CreditCard size={18} />
                      </>
                    )}
                  </Button>
                )}
              </>
            ) : (
              <div className="text-sm text-slate-500">This payment link is invalid or expired.</div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

export default function PaymentPortal() {
  return (
    <Suspense fallback={<div className="min-h-screen px-6 py-12"><div className="container max-w-md"><Card hover={false} className="glass-surface-strong p-8 text-center"><Loader2 className="mx-auto mb-4 animate-spin text-primary" size={28} /><p className="text-sm text-slate-600">Loading secure payment session...</p></Card></div></div>}>
      <PaymentPortalContent />
    </Suspense>
  );
}

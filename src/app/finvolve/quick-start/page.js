"use client";

import { useState } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Zap, CreditCard, CheckCircle, AlertCircle, Loader2, ChevronLeft } from 'lucide-react';
import RaceCard from '@/components/ui/RaceCard';
import RaceButton from '@/components/ui/RaceButton';

export default function QuickStartPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        projectType: 'Web Development',
        description: ''
    });
    const [status, setStatus] = useState('idle'); // idle, processing, success, error
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePaymentAndSubmit = async (e) => {
        e.preventDefault();
        setStatus('processing');
        setErrorMessage('');

        console.log("Client Debug: NEXT_PUBLIC_RAZORPAY_KEY_ID =", process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);

        const loadRazorpayScript = () => {
            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.onload = () => resolve(true);
                script.onerror = () => resolve(false);
                document.body.appendChild(script);
            });
        };

        try {
            const res = await loadRazorpayScript();

            if (!res) {
                throw new Error('Razorpay SDK failed to load. Are you online?');
            }

            // Create Order
            const orderRes = await fetch('/finvolve/api/create-order', { method: 'POST' });
            const orderData = await orderRes.json();

            if (orderData.error) {
                throw new Error(orderData.error);
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Finvolve",
                description: "Quick Start Project Fee",
                order_id: orderData.id,
                handler: async function (response) {
                    // Payment Success
                    try {
                        if (!db) {
                            throw new Error("Firebase is not initialized.");
                        }

                        await addDoc(collection(db, "requests"), {
                            ...formData,
                            createdAt: serverTimestamp(),
                            status: 'paid_priority',
                            isQuickStart: true,
                            paymentId: response.razorpay_payment_id,
                            orderId: response.razorpay_order_id,
                            signature: response.razorpay_signature
                        });

                        setStatus('success');
                        setFormData({
                            name: '',
                            email: '',
                            phone: '',
                            projectType: 'Web Development',
                            description: ''
                        });
                    } catch (err) {
                        console.error("Error saving to firebase after payment:", err);
                        setStatus('error');
                        setErrorMessage("Payment successful but failed to save request. Please contact support.");
                    }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone,
                },
                theme: {
                    color: "#FF1801",
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

            // Reset status if user closes modal without paying
            paymentObject.on('payment.failed', function (response) {
                setStatus('error');
                setErrorMessage(response.error.description);
            });

        } catch (error) {
            console.error("Error processing quick start: ", error);
            setStatus('error');
            setErrorMessage(error.message || "Payment processing failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-20 container mx-auto px-6">
            <Link href="/finvolve" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors group font-mono uppercase text-xs tracking-widest">
                <ChevronLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                Abort Start Sequence
            </Link>

            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-accent/30 bg-accent/10 mb-4 skew-x-[-12deg]">
                        <Zap size={14} className="text-accent skew-x-[12deg]" />
                        <span className="text-accent font-mono text-xs uppercase tracking-widest skew-x-[12deg]">Premium Service</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-heading italic uppercase text-white mb-4">
                        Quick Start Project
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Skip the pit lane and join the race immediately.
                        Includes priority support and expedited planning.
                    </p>
                </div>

                {status === 'success' ? (
                    <RaceCard className="p-12 text-center border-green-500/30">
                        <CheckCircle size={64} className="mx-auto text-green-500 mb-6" />
                        <h2 className="text-3xl font-bold font-heading italic uppercase text-white mb-4">You're on the Grid!</h2>
                        <p className="text-gray-300 text-lg mb-8 max-w-lg mx-auto">
                            Payment confirmed. Your project has been flagged as <strong>Priority</strong>.
                            I will be in touch within 24 hours to begin the engineering phase.
                        </p>
                        <RaceButton href="/finvolve" variant="primary">
                            Return to Paddock
                        </RaceButton>
                    </RaceCard>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                            <RaceCard className="p-8">
                                <h2 className="text-2xl font-bold font-heading italic uppercase text-white mb-6">Project Telemetry</h2>
                                <form onSubmit={handlePaymentAndSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Driver Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Your Name"
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="email" className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Comms Channel (Email)</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                placeholder="your@email.com"
                                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Direct Line (Phone)</label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                                placeholder="+91..."
                                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="projectType" className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Class / Category</label>
                                        <select
                                            id="projectType"
                                            name="projectType"
                                            value={formData.projectType}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors [&>option]:bg-gray-900"
                                        >
                                            <option value="Web Development">Web Development</option>
                                            <option value="Android App">Android App</option>
                                            <option value="Custom Software">Custom Software</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="description" className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Mission Briefing</label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            required
                                            placeholder="Describe your project requirements..."
                                            rows={4}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                                        />
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" id="terms" required className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary" />
                                        <label htmlFor="terms" className="text-sm text-gray-400">
                                            I agree to the <Link href="/finvolve/terms" className="text-primary hover:underline">Race Regulations</Link>
                                        </label>
                                    </div>

                                    {status === 'error' && (
                                        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
                                            <AlertCircle size={20} />
                                            <span>{errorMessage}</span>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="w-full group relative overflow-hidden bg-primary text-white font-bold font-heading italic uppercase py-4 rounded-lg skew-x-[-12deg] hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={status === 'processing'}
                                    >
                                        <div className="skew-x-[12deg] flex items-center justify-center gap-2">
                                            {status === 'processing' ? (
                                                <>
                                                    <Loader2 size={20} className="animate-spin" /> Igniting Engine...
                                                </>
                                            ) : (
                                                <>
                                                    Pay & Launch <CreditCard size={20} />
                                                </>
                                            )}
                                        </div>
                                    </button>
                                </form>
                            </RaceCard>
                        </div>

                        <div className="md:col-span-1">
                            <RaceCard className="p-6 sticky top-24 border-accent/20">
                                <h3 className="text-xl font-bold font-heading italic uppercase text-white mb-6">Pit Box Benefits</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <CheckCircle size={20} className="text-accent flex-shrink-0 mt-1" />
                                        <div>
                                            <strong className="text-white block font-heading italic">Under 48 Hours</strong>
                                            <span className="text-sm text-gray-400">Immediate boost off the line.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle size={20} className="text-accent flex-shrink-0 mt-1" />
                                        <div>
                                            <strong className="text-white block font-heading italic">Direct Comms</strong>
                                            <span className="text-sm text-gray-400">Radio check with the lead engineer.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle size={20} className="text-accent flex-shrink-0 mt-1" />
                                        <div>
                                            <strong className="text-white block font-heading italic">Pole Position</strong>
                                            <span className="text-sm text-gray-400">Skip the qualifying queue.</span>
                                        </div>
                                    </li>
                                </ul>

                                <div className="mt-8 pt-8 border-t border-white/10 text-center">
                                    <span className="text-gray-400 font-mono text-xs uppercase tracking-widest">Entry Fee</span>
                                    <div className="text-4xl font-bold font-heading italic text-white mt-2">₹99</div>
                                </div>
                            </RaceCard>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

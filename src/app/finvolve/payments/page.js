"use client";

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Lock, User, Key, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import GradientButton from '@/components/ui/GradientButton';

export default function PaymentPortal() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [paymentData, setPaymentData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const q = query(
                collection(db, "payment_requests"),
                where("username", "==", credentials.username),
                where("password", "==", credentials.password)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const docData = querySnapshot.docs[0];
                setPaymentData({ id: docData.id, ...docData.data() });
                setIsLoggedIn(true);
            } else {
                setError('Invalid username or password');
            }
        } catch (err) {
            console.error("Login error:", err);
            setError('System error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        setLoading(true);
        try {
            // 1. Create Razorpay Order
            const response = await fetch('/finvolve/api/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: paymentData.amount })
            });
            const order = await response.json();

            if (order.error) throw new Error(order.error);

            // 2. Open Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: "INR",
                name: "Finvolve Services",
                description: `Payment for Order #${order.id}`,
                order_id: order.id,
                handler: async function (response) {
                    // 3. On Success: Update Firestore
                    await updateDoc(doc(db, "payment_requests", paymentData.id), {
                        status: 'paid',
                        razorpayPaymentId: response.razorpay_payment_id,
                        paidAt: new Date().toISOString()
                    });
                    setPaymentData(prev => ({ ...prev, status: 'paid' }));
                },
                theme: { color: "#3b82f6" },
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (err) {
            console.error("Payment error:", err);
            setError('Payment initialization failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
            <div className="deep-space-bg" />

            <div className="container px-4 max-w-md">
                {!isLoggedIn ? (
                    <GlassCard className="p-8 border-primary/20">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold font-heading mb-2">Secure Payment Portal</h1>
                            <p className="text-gray-400 text-sm">Please login with your provided credentials.</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={credentials.username}
                                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary focus:outline-none transition-colors"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary focus:outline-none transition-colors"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="text-red-400 text-sm flex items-center gap-2 bg-red-500/10 p-3 rounded-lg">
                                    <AlertCircle size={16} /> {error}
                                </div>
                            )}

                            <GradientButton type="submit" className="w-full" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin mx-auto" /> : "Access Portal"}
                            </GradientButton>
                        </form>
                    </GlassCard>
                ) : (
                    <GlassCard className="p-8 border-primary/20 text-center">
                        <div className="mb-6 flex justify-center">
                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                                <Lock className="text-primary" size={32} />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold mb-2">Payment Details</h2>
                        <p className="text-gray-400 mb-8">Hello, <span className="text-white font-bold">{credentials.username}</span></p>

                        <div className="bg-white/5 rounded-xl p-6 mb-8 border border-white/10">
                            <p className="text-sm text-gray-400 uppercase tracking-widest mb-1">Total Amount Due</p>
                            <div className="text-4xl font-bold text-white">₹{paymentData.amount}</div>
                        </div>

                        {paymentData.status === 'paid' ? (
                            <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl flex items-center justify-center gap-2 text-green-400 font-bold">
                                <CheckCircle /> Payment Complete
                            </div>
                        ) : (
                            <GradientButton onClick={handlePayment} className="w-full text-lg py-4" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin mx-auto" /> : `Pay ₹${paymentData.amount} Now`}
                            </GradientButton>
                        )}

                        <button
                            onClick={() => setIsLoggedIn(false)}
                            className="mt-6 text-sm text-gray-500 hover:text-white transition-colors"
                        >
                            Sign Out
                        </button>
                    </GlassCard>
                )}
            </div>

            {/* Razorpay Script */}
            <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        </div>
    );
}

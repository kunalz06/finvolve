"use client";

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Lock, User, Key, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

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
      // Load Razorpay script dynamically
      const loadRazorpayScript = () => {
        return new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load payment gateway');
      }

      const response = await fetch('/finvolve/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: paymentData.amount })
      });
      const order = await response.json();

      if (order.error) throw new Error(order.error);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Finvolve Services",
        description: `Payment for Order #${order.id}`,
        order_id: order.id,
        handler: async function (response) {
          await updateDoc(doc(db, "payment_requests", paymentData.id), {
            status: 'paid',
            razorpayPaymentId: response.razorpay_payment_id,
            paidAt: new Date().toISOString()
          });
          setPaymentData(prev => ({ ...prev, status: 'paid' }));
        },
        theme: { color: "#8B5CF6" },
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
    <div className="min-h-screen py-20 bg-gray-50 flex items-center justify-center">
      <div className="container px-6 max-w-md">
        {!isLoggedIn ? (
          <Card hover={false} className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <Lock className="text-primary" size={28} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Secure Payment Portal</h1>
              <p className="text-gray-500 text-sm">Please login with your provided credentials.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Username"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-gray-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  required
                />
              </div>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-gray-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  required
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm flex items-center gap-2 bg-red-50 p-3 rounded-xl border border-red-200">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" size={18} /> : "Access Portal"}
              </Button>
            </form>
          </Card>
        ) : (
          <Card hover={false} className="p-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                <Lock className="text-primary" size={28} />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Details</h2>
            <p className="text-gray-500 mb-8">Hello, <span className="font-semibold text-gray-900">{credentials.username}</span></p>

            <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Total Amount Due</p>
              <div className="text-4xl font-bold text-gray-900">₹{paymentData.amount}</div>
            </div>

            {paymentData.status === 'paid' ? (
              <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-center justify-center gap-2 text-green-600 font-semibold">
                <CheckCircle size={20} /> Payment Complete
              </div>
            ) : (
              <Button 
                onClick={handlePayment} 
                variant="primary" 
                size="large" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : `Pay ₹${paymentData.amount} Now`}
              </Button>
            )}

            <button
              onClick={() => setIsLoggedIn(false)}
              className="mt-6 text-sm text-gray-500 hover:text-primary transition-colors"
            >
              Sign Out
            </button>
          </Card>
        )}
      </div>
    </div>
  );
}

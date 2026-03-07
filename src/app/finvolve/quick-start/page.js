"use client";

import { useState } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Zap, CreditCard, CheckCircle, AlertCircle, Loader2, ChevronLeft, ArrowRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function QuickStartPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'Web Development',
    description: ''
  });
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentAndSubmit = async (e) => {
    e.preventDefault();
    setStatus('processing');
    setErrorMessage('');

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
          color: "#8B5CF6",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

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
    <div className="min-h-screen py-20 bg-white">
      <div className="container mx-auto px-6">
        <Link 
          href="/finvolve" 
          className="inline-flex items-center text-gray-500 hover:text-primary mb-8 transition-colors text-sm font-medium"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Home
        </Link>

        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 mb-6">
              <Zap size={16} className="text-primary" />
              <span className="text-primary font-medium text-sm">PREMIUM SERVICE</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Quick Start Project
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Skip the queue and get priority support with expedited planning.
            </p>
          </div>

          {status === 'success' ? (
            <Card hover={false} className="max-w-lg mx-auto text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-green-600" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">You&apos;re All Set!</h2>
              <p className="text-gray-600 mb-8">
                Payment confirmed. Your project has been flagged as <strong>Priority</strong>.
                We will be in touch within 24 hours to begin the engineering phase.
              </p>
              <Button href="/finvolve" variant="primary">
                Return Home
              </Button>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2">
                <Card hover={false}>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Project Details</h2>
                  <form onSubmit={handlePaymentAndSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Your Name"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="your@email.com"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          placeholder="+91..."
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-2">
                        Project Type
                      </label>
                      <select
                        id="projectType"
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all [&>option]:bg-white"
                      >
                        <option value="Web Development">Web Development</option>
                        <option value="Android App">Android App</option>
                        <option value="Custom Software">Custom Software</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Project Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        placeholder="Describe your project requirements..."
                        rows={4}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        id="terms" 
                        required 
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" 
                      />
                      <label htmlFor="terms" className="text-sm text-gray-600">
                        I agree to the <Link href="/finvolve/terms" className="text-primary hover:underline">Terms of Service</Link>
                      </label>
                    </div>

                    {status === 'error' && (
                      <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                        <AlertCircle size={20} />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      size="large"
                      className="w-full"
                      disabled={status === 'processing'}
                    >
                      {status === 'processing' ? (
                        <>
                          <Loader2 size={18} className="animate-spin" /> Processing...
                        </>
                      ) : (
                        <>
                          Pay & Launch <CreditCard size={18} />
                        </>
                      )}
                    </Button>
                  </form>
                </Card>
              </div>

              {/* Benefits Sidebar */}
              <div className="lg:col-span-1">
                <Card hover={false} className="bg-gray-50 border-0 sticky top-24">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Priority Benefits</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gray-900 block">Under 48 Hours</strong>
                        <span className="text-sm text-gray-500">Immediate response time.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gray-900 block">Direct Communication</strong>
                        <span className="text-sm text-gray-500">Talk directly with engineers.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gray-900 block">Priority Queue</strong>
                        <span className="text-sm text-gray-500">Skip the waiting line.</span>
                      </div>
                    </li>
                  </ul>

                  <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                    <span className="text-gray-500 text-sm uppercase tracking-wider">Entry Fee</span>
                    <div className="text-4xl font-bold text-gray-900 mt-2">₹99</div>
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

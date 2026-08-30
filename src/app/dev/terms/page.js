"use client";

import { motion } from 'framer-motion';
import { FileText, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Card from '@/components/ui/Card';

export default function Terms() {
  return (
    <div className="min-h-screen px-6 py-12">
      <div className="container max-w-4xl">
        <Link 
          href="/dev"
          className="inline-flex items-center text-slate-500 hover:text-primary mb-8 transition-colors text-sm font-medium"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Home
        </Link>

        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card hover={false} className="p-8 md:p-12">
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
              <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center">
                <FileText className="text-primary" size={28} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-950">Terms of Service</h1>
                <p className="text-slate-500 text-sm mt-1">Last updated: {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div className="space-y-10 text-slate-600 leading-relaxed">
              <section>
                <h2 className="text-lg font-bold text-slate-950 mb-4">1. Introduction</h2>
                <p>
                  Welcome to DEV♾️. By accessing our website and using our services, you agree to be bound by these Terms and Conditions.
                  These terms apply to all visitors, users, and others who access or use the Service.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-950 mb-4">2. Services</h2>
                <p className="mb-4">
                  DEV♾️ provides software development services, including but not limited to web development, mobile app development,
                  and custom software solutions. We are dedicated to delivering high-quality, scalable, and secure digital products.
                </p>
                <p className="mb-4">
                  DEV♾️ also operates DEV Infinity Cloud, a platform that provides access to compute engine resources and AI model APIs (including ChatGPT, Google Gemini, and Claude models). Cloud services are available through both subscription plans and pay-per-use rentals, subject to plan-specific usage limits, availability, and the additional terms in Sections 3A and 3B below.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-950 mb-4">3. Quick Start & Payments</h2>
                <div className="bg-amber-50 border border-amber-200 p-6 mb-4 rounded-xl">
                  <p className="text-amber-800 mb-2">
                    The &quot;Quick Start&quot; option is a paid service for expedited project initiation.
                    Payments made for this service are non-refundable once the consultation or development process has commenced.
                  </p>
                  <p className="font-semibold text-amber-700 text-sm">
                    Refund Policy: No refunds after payment.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-950 mb-4">3A. Cloud Subscription Terms</h2>
                <div className="bg-blue-50 border border-blue-200 p-6 mb-4 rounded-xl">
                  <p className="text-blue-800 mb-2">
                    DEV Infinity Cloud subscriptions are billed via Razorpay and run for a 12-month cycle. The Starter plan is billed every 15 days, while Pro and Enterprise plans are billed monthly. By subscribing, you agree to the following terms:
                  </p>
                  <ul className="list-disc pl-6 mt-3 space-y-2 text-blue-900">
                    <li><strong>Usage Limits:</strong> Each plan has defined limits for compute engine hours and AI model API access. Usage resets at the start of each billing cycle. Exceeding limits may result in restricted access until the next cycle.</li>
                    <li><strong>Billing:</strong> Subscription fees (every 15 days for Starter, monthly for Pro and Enterprise) and the one-time setup fee are non-refundable. Your payment method will be charged automatically at each billing cycle until the subscription is cancelled or completed (12 cycles).</li>
                    <li><strong>Plan Changes:</strong> Tier upgrades or downgrades take effect at the start of the next billing cycle. Your current plan benefits continue until then. The new monthly rate applies from the next charge date.</li>
                    <li><strong>Pause & Resume:</strong> You may pause your subscription, which freezes billing and usage. Resuming reactivates your subscription. Paused time counts toward the 12-cycle subscription duration.</li>
                    <li><strong>Cancellation:</strong> You may cancel at any time. Your access continues until the end of the current billing period (15-day period for Starter, monthly for Pro and Enterprise). No partial-period refunds are provided.</li>
                    <li><strong>Acceptable Use:</strong> Cloud resources must not be used for any illegal activity, cryptocurrency mining, or resale of API access. We reserve the right to suspend or terminate access for violations.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-950 mb-4">3B. Cloud Rent Services Terms</h2>
                <div className="bg-emerald-50 border border-emerald-200 p-6 mb-4 rounded-xl">
                  <p className="text-emerald-800 mb-2">
                    DEV Infinity Cloud Rent Services allow you to rent cloud compute resources on a pay-per-use basis without committing to a subscription plan. By initiating a rental, you agree to the following terms:
                  </p>
                  <ul className="list-disc pl-6 mt-3 space-y-2 text-emerald-900">
                    <li><strong>Upfront Fee:</strong> A one-time upfront fee of INR 1 is charged before your rental period begins. This fee is non-refundable once the rental is activated.</li>
                    <li><strong>Usage Billing:</strong> Compute usage is billed at INR 200 per 20 hours of compute. Usage is measured in slabs of 20 hours, and partial slabs are rounded up. The usage bill is generated after your rental period ends.</li>
                    <li><strong>Payment Link:</strong> If compute usage is recorded, a detailed bill along with a Razorpay payment link will be sent to your registered email address. You must pay the bill using the provided payment link.</li>
                    <li><strong>Rental Duration:</strong> You select a rental duration (1, 3, 7, 15, or 30 days) at the time of signup. The rental expires automatically at the end of the chosen period. Only one active rental is permitted per email address at a time.</li>
                    <li><strong>No Subscription:</strong> Rent Services do not create a recurring subscription. Each rental is a standalone, one-time engagement with separate upfront and usage payments.</li>
                    <li><strong>Usage Tracking:</strong> Compute hours consumed during the rental period are tracked by our system. The final bill is based on actual hours used, not the maximum available during the rental period.</li>
                    <li><strong>Acceptable Use:</strong> The same acceptable use restrictions that apply to subscriptions (Section 3A) also apply to rentals. Cloud resources must not be used for any illegal activity, cryptocurrency mining, or resale of API access.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-950 mb-4">4. Intellectual Property</h2>
                <p>
                  Unless otherwise agreed upon in writing, all intellectual property rights for the software developed will be
                  transferred to the client upon full payment. DEV♾️ retains the right to showcase the work in our portfolio
                  unless a non-disclosure agreement (NDA) is signed.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-950 mb-4">5. Limitation of Liability</h2>
                <p>
                  DEV♾️ shall not be liable for any indirect, incidental, special, consequential, or punitive damages,
                  including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from
                  your use of our services.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-950 mb-4">6. Contact Us</h2>
                <p>
                  If you have any questions about these Terms, please contact us at <a href="mailto:mitraricky06@gmail.com" className="text-primary hover:underline">mitraricky06@gmail.com</a>.
                </p>
              </section>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}


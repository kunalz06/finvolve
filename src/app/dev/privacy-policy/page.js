"use client";

import { motion } from 'framer-motion';
import { Shield, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Card from '@/components/ui/Card';

export default function PrivacyPolicy() {
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
                <Shield className="text-primary" size={28} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-950">Privacy Policy</h1>
                <p className="text-slate-500 text-sm mt-1">Last updated: {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div className="space-y-10 text-slate-600 leading-relaxed">
              <section>
                <h2 className="text-lg font-bold text-slate-950 mb-4">1. Information We Collect</h2>
                <p className="mb-4">
                  We collect information you provide directly when you use the &quot;Start a Project&quot; form or &quot;Quick Start&quot; service. This includes:
                </p>
                <ul className="list-disc pl-6 space-y-2 marker:text-primary">
                  <li><strong className="text-slate-950">Personal Information:</strong> Name, email address, and phone number.</li>
                  <li><strong className="text-slate-950">Project Details:</strong> Project type and project description/requirements.</li>
                  <li><strong className="text-slate-950">Payment Information:</strong> Transaction details for the &quot;Quick Start&quot; service. Note that we do not store your credit card or bank account details; payments are processed by our third-party payment processor, Razorpay.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-950 mb-4">2. How We Use Your Information</h2>
                <p className="mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 space-y-2 marker:text-primary">
                  <li>Provide, maintain, and improve our software development services.</li>
                  <li>Process transactions and send you related information, including confirmations and invoices.</li>
                  <li>Communicate with you about your project requirements, updates, and support.</li>
                  <li>Respond to your comments, questions, and requests.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-950 mb-4">3. Sharing of Information</h2>
                <p className="mb-4">
                  We do not share your personal information with third parties except in the following cases:
                </p>
                <ul className="list-disc pl-6 space-y-2 marker:text-primary">
                  <li><strong className="text-slate-950">Service Providers:</strong> We may share information with third-party vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.</li>
                  <li><strong className="text-slate-950">Legal Compliance:</strong> We may disclose information if we believe disclosure is in accordance with, or required by, any applicable law or legal process.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-950 mb-4">4. Security</h2>
                <p>
                  We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction. We use secure cloud infrastructure (Firebase) to store your project requests.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-950 mb-4">5. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at <a href="mailto:mitraricky06@gmail.com" className="text-primary hover:underline">mitraricky06@gmail.com</a>.
                </p>
              </section>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}


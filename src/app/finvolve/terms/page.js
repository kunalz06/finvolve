"use client";

import { motion } from 'framer-motion';
import { FileText, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Card from '@/components/ui/Card';

export default function Terms() {
  return (
    <div className="min-h-screen py-20 bg-white">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link 
          href="/finvolve" 
          className="inline-flex items-center text-gray-500 hover:text-primary mb-8 transition-colors text-sm font-medium"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card hover={false} className="p-8 md:p-12">
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
              <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center">
                <FileText className="text-primary" size={28} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Terms of Service</h1>
                <p className="text-gray-500 text-sm mt-1">Last updated: {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div className="space-y-10 text-gray-600 leading-relaxed">
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4">1. Introduction</h2>
                <p>
                  Welcome to Finvolve. By accessing our website and using our services, you agree to be bound by these Terms and Conditions.
                  These terms apply to all visitors, users, and others who access or use the Service.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4">2. Services</h2>
                <p>
                  Finvolve provides software development services, including but not limited to web development, mobile app development,
                  and custom software solutions. We are dedicated to delivering high-quality, scalable, and secure digital products.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4">3. Quick Start & Payments</h2>
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
                <h2 className="text-lg font-bold text-gray-900 mb-4">4. Intellectual Property</h2>
                <p>
                  Unless otherwise agreed upon in writing, all intellectual property rights for the software developed will be
                  transferred to the client upon full payment. Finvolve retains the right to showcase the work in our portfolio
                  unless a non-disclosure agreement (NDA) is signed.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4">5. Limitation of Liability</h2>
                <p>
                  Finvolve shall not be liable for any indirect, incidental, special, consequential, or punitive damages,
                  including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from
                  your use of our services.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4">6. Contact Us</h2>
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

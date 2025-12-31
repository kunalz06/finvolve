"use client";

import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import GlassCard from '@/components/ui/GlassCard';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen pt-24 pb-20 relative">
            <div className="container mx-auto px-6 relative z-10 max-w-4xl">

                <Link href="/finvolve" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors group">
                    <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <GlassCard className="p-8 md:p-12 border-primary/20">
                        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
                            <div className="bg-primary/20 p-3 rounded-xl text-primary">
                                <Shield size={32} />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold font-heading text-white">Privacy Policy</h1>
                                <p className="text-gray-400 mt-1">Last updated: {new Date().toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="space-y-12 text-gray-300 leading-relaxed">
                            <section>
                                <h2 className="text-xl font-bold text-white mb-4">1. Information We Collect</h2>
                                <p className="mb-4">
                                    We collect information you provide directly to us when you use our "Start a Project" form or "Quick Start" service. This includes:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 marker:text-primary">
                                    <li><strong className="text-white">Personal Information:</strong> Name, email address, and phone number.</li>
                                    <li><strong className="text-white">Project Details:</strong> Project type (e.g., Web Development, Android App) and project description/requirements.</li>
                                    <li><strong className="text-white">Payment Information:</strong> Transaction details for the "Quick Start" service. Note that we do not store your credit card or bank account details; payments are processed by our third-party payment processor, Razorpay.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-white mb-4">2. How We Use Your Information</h2>
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
                                <h2 className="text-xl font-bold text-white mb-4">3. Sharing of Information</h2>
                                <p className="mb-4">
                                    We do not share your personal information with third parties except in the following cases:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 marker:text-primary">
                                    <li><strong className="text-white">Service Providers:</strong> We may share information with third-party vendors, consultants, and other service providers who need access to such information to carry out work on our behalf (e.g., Razorpay for payment processing, Firebase for data storage).</li>
                                    <li><strong className="text-white">Legal Compliance:</strong> We may disclose information if we believe disclosure is in accordance with, or required by, any applicable law or legal process.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-white mb-4">4. Security</h2>
                                <p>
                                    We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction. We use secure cloud infrastructure (Firebase) to store your project requests.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-white mb-4">5. Contact Us</h2>
                                <p>
                                    If you have any questions about this Privacy Policy, please contact us at <a href="mailto:mitraricky06@gmail.com" className="text-primary hover:underline">mitraricky06@gmail.com</a>.
                                </p>
                            </section>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        </div>
    );
}

"use client";

import { motion } from 'framer-motion';
import { FileText, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import RaceCard from '@/components/ui/RaceCard';

export default function Terms() {
    return (
        <div className="min-h-screen pt-24 pb-20 relative">
            <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-4xl">

                <Link href="/finvolve" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors group font-mono uppercase text-xs tracking-widest">
                    <ChevronLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Return to Pit Lane
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <RaceCard className="p-8 md:p-12 border-primary/20">
                        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
                            <div className="bg-primary/20 p-3 rounded-xl text-primary skew-x-[-12deg]">
                                <FileText size={32} className="skew-x-[12deg]" />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold font-heading italic uppercase text-white">Race Regulations</h1>
                                <p className="text-gray-400 mt-1 font-mono text-xs uppercase tracking-widest">Last updated: {new Date().toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="space-y-12 text-gray-300 leading-relaxed">
                            <section>
                                <h2 className="text-xl font-bold font-heading italic uppercase text-white mb-4">1. Introduction</h2>
                                <p>
                                    Welcome to Finvolve. By accessing my website and using my services, you agree to be bound by these Terms and Conditions.
                                    These terms apply to all visitors, users, and others who access or use the Service.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold font-heading italic uppercase text-white mb-4">2. Services</h2>
                                <p>
                                    Finvolve provides software development services, including but not limited to web development, mobile app development,
                                    and custom software solutions. I am dedicated to delivering high-quality, scalable, and secure digital products.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold font-heading italic uppercase text-white mb-4">3. Quick Start & Payments</h2>
                                <div className="bg-amber-500/5 border border-amber-500/20 p-6 mb-4 rounded-lg skew-x-[-6deg]">
                                    <div className="skew-x-[6deg]">
                                        <p className="text-amber-200/90 mb-2">
                                            The "Quick Start" option is a paid service for expedited project initiation.
                                            Payments made for this service are non-refundable once the consultation or development process has commenced.
                                        </p>
                                        <p className="font-bold text-amber-500 text-sm font-mono uppercase tracking-wider">
                                            Refund Policy: No refunds after payment.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold font-heading italic uppercase text-white mb-4">4. Intellectual Property</h2>
                                <p>
                                    Unless otherwise agreed upon in writing, all intellectual property rights for the software developed will be
                                    transferred to the client upon full payment. Finvolve retains the right to showcase the work in our portfolio
                                    unless a non-disclosure agreement (NDA) is signed.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold font-heading italic uppercase text-white mb-4">5. Limitation of Liability</h2>
                                <p>
                                    Finvolve shall not be liable for any indirect, incidental, special, consequential, or punitive damages,
                                    including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from
                                    your use of our services.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold font-heading italic uppercase text-white mb-4">6. Contact Us</h2>
                                <p>
                                    If you have any questions about these Terms, please contact us at <a href="mailto:mitraricky06@gmail.com" className="text-primary hover:underline">mitraricky06@gmail.com</a>.
                                </p>
                            </section>
                        </div>
                    </RaceCard>
                </motion.div>
            </div>
        </div>
    );
}

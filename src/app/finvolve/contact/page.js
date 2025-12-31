"use client";

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import GradientButton from '@/components/ui/GradientButton';

export default function Contact() {
    return (
        <div className="min-h-screen pt-24 pb-20 relative overflow-hidden">
            {/* Background elements managed by layout/global css, but ensuring container is safe */}
            <div className="container mx-auto px-4 md:px-6 relative z-10">

                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-3xl md:text-5xl font-bold font-heading mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
                            Get in Touch
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Have a project in mind? We'd love to hear from you.
                            Let's build something amazing together.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="space-y-6"
                        >
                            <GlassCard className="p-8 h-full border-primary/10 hover:border-primary/30 transition-colors group">
                                <div className="flex flex-col gap-8 h-full justify-center">
                                    {/* Email */}
                                    <a href="mailto:mitraricky06@gmail.com" className="flex items-start gap-4 group/item hover:bg-white/5 p-4 rounded-xl transition-all">
                                        <div className="bg-primary/20 p-3 rounded-lg text-primary group-hover/item:scale-110 transition-transform">
                                            <Mail size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-1">Email Us</h3>
                                            <p className="text-gray-400 group-hover/item:text-primary transition-colors">mitraricky06@gmail.com</p>
                                        </div>
                                    </a>

                                    {/* Phone */}
                                    <a href="tel:+919907958859" className="flex items-start gap-4 group/item hover:bg-white/5 p-4 rounded-xl transition-all">
                                        <div className="bg-purple-500/20 p-3 rounded-lg text-purple-400 group-hover/item:scale-110 transition-transform">
                                            <Phone size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-1">Call Us</h3>
                                            <p className="text-gray-400 group-hover/item:text-purple-400 transition-colors">+91 99079 58859</p>
                                        </div>
                                    </a>

                                    {/* Location */}
                                    <div className="flex items-start gap-4 p-4">
                                        <div className="bg-pink-500/20 p-3 rounded-lg text-pink-400">
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-1">Location</h3>
                                            <p className="text-gray-400">India</p>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>

                        {/* CTA / Alternative */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <GlassCard className="p-8 h-full border-primary/10 flex flex-col justify-center text-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full -mr-16 -mt-16 pointer-events-none" />

                                <h3 className="text-2xl font-bold font-heading mb-4">Ready to Start?</h3>
                                <p className="text-gray-400 mb-8 leading-relaxed">
                                    Skip the email queue and jump straight into building your project with our interactive wizard.
                                </p>

                                <div className="space-y-4">
                                    <GradientButton href="/finvolve/request" className="w-full justify-center py-4 text-lg">
                                        Start Project <ArrowRight className="ml-2" size={20} />
                                    </GradientButton>

                                    <p className="text-sm text-gray-500">
                                        Or check out our <a href="/finvolve/quick-start" className="text-primary hover:underline">Quick Start</a> options.
                                    </p>
                                </div>
                            </GlassCard>
                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    );
}

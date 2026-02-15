"use client";

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ChevronRight, Rocket } from 'lucide-react';
import RaceCard from '@/components/ui/RaceCard';
import RaceButton from '@/components/ui/RaceButton';

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
                        <h1 className="text-3xl md:text-5xl font-bold font-heading italic uppercase mb-6 text-white">
                            Initialize <span className="text-primary">Communication</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed border-b-2 border-primary/20 pb-4 inline-block">
                            Have a project in mind? Use the direct line below.
                            Let's maximize your velocity.
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
                            <RaceCard className="h-full border-primary/10 hover:border-primary/50 transition-colors group">
                                <div className="flex flex-col gap-8 h-full justify-center">
                                    {/* Email */}
                                    <a href="mailto:mitraricky06@gmail.com" className="flex items-start gap-4 group/item hover:bg-white/5 p-4 rounded-xl transition-all skew-x-[-6deg]">
                                        <div className="bg-primary/20 p-3 rounded-lg text-primary group-hover/item:scale-110 transition-transform skew-x-[6deg]">
                                            <Mail size={24} />
                                        </div>
                                        <div className="skew-x-[6deg]">
                                            <h3 className="text-lg font-bold font-heading italic uppercase text-white mb-1">Email Relay</h3>
                                            <p className="text-gray-400 group-hover/item:text-primary transition-colors font-mono">mitraricky06@gmail.com</p>
                                        </div>
                                    </a>

                                    {/* Phone */}
                                    <a href="tel:+919907958859" className="flex items-start gap-4 group/item hover:bg-white/5 p-4 rounded-xl transition-all skew-x-[-6deg]">
                                        <div className="bg-primary/20 p-3 rounded-lg text-primary group-hover/item:scale-110 transition-transform skew-x-[6deg]">
                                            <Phone size={24} />
                                        </div>
                                        <div className="skew-x-[6deg]">
                                            <h3 className="text-lg font-bold font-heading italic uppercase text-white mb-1">Direct Line</h3>
                                            <p className="text-gray-400 group-hover/item:text-primary transition-colors font-mono">+91 99079 58859</p>
                                        </div>
                                    </a>

                                    {/* Location */}
                                    <div className="flex items-start gap-4 p-4 skew-x-[-6deg]">
                                        <div className="bg-gray-800 p-3 rounded-lg text-gray-400 skew-x-[6deg]">
                                            <MapPin size={24} />
                                        </div>
                                        <div className="skew-x-[6deg]">
                                            <h3 className="text-lg font-bold font-heading italic uppercase text-white mb-1">HQ Location</h3>
                                            <p className="text-gray-400 font-mono">India</p>
                                        </div>
                                    </div>
                                </div>
                            </RaceCard>
                        </motion.div>

                        {/* CTA / Alternative */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <RaceCard className="h-full border-primary/10 flex flex-col justify-center text-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full -mr-16 -mt-16 pointer-events-none" />

                                <h3 className="text-2xl font-bold font-heading italic uppercase mb-4">Jump the Start?</h3>
                                <p className="text-gray-400 mb-8 leading-relaxed">
                                    Skip the warm-up lap and engage launch control with our interactive wizard.
                                </p>

                                <div className="space-y-4">
                                    <RaceButton href="/finvolve/request" variant="primary" className="w-full justify-center py-4 text-lg">
                                        Launch Project <Rocket className="ml-2" size={20} />
                                    </RaceButton>

                                    <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mt-4">
                                        Or engage <a href="/finvolve/quick-start" className="text-primary hover:underline">Quick Start</a> mode.
                                    </p>
                                </div>
                            </RaceCard>
                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    );
}

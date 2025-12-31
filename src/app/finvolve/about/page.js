"use client";

import { motion } from 'framer-motion';
import { Code, Smartphone, Database, PenTool, Zap, Users, Target, Rocket } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
    initial: {},
    animate: { transition: { staggerChildren: 0.15 } }
};

export default function About() {
    return (
        <div className="min-h-screen pt-24 pb-20 overflow-hidden">
            {/* Background Gradients */}
            <div className="deep-space-bg" />

            <div className="container mx-auto px-6 relative z-10">

                {/* Header Section */}
                <motion.div
                    className="text-center mb-20"
                    initial="initial"
                    animate="animate"
                    variants={staggerContainer}
                >
                    <motion.h1
                        className="text-5xl md:text-7xl font-bold font-heading mb-6 tracking-tight"
                        variants={fadeInUp}
                    >
                        About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">Finvolve</span>
                    </motion.h1>
                    <motion.p
                        className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
                        variants={fadeInUp}
                    >
                        We are architects of the digital future. A team of passionate developers, designers, and strategists dedicated to building software that matters.
                    </motion.p>
                </motion.div>

                {/* Mission Section */}
                <section className="mb-24">
                    <motion.div
                        className="grid md:grid-cols-2 gap-12 items-center"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold font-heading flex items-center gap-3">
                                <Target className="text-primary" /> Our Mission
                            </h2>
                            <p className="text-lg text-gray-300 leading-relaxed">
                                At Finvolve, our mission is to empower businesses with independent, cutting-edge technology.
                                We don't just follow trends; we set them.
                            </p>
                            <p className="text-lg text-gray-400 leading-relaxed">
                                Whether it's a mobile app to reach your customers on the go, or a robust web platform to manage your operations, we have the expertise to deliver solutions that are scalable, secure, and stunning.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl rounded-full" />
                            <GlassCard className="relative p-8 border-primary/30">
                                <div className="grid grid-cols-2 gap-4">
                                    <Stat number="50+" label="Projects Delivered" />
                                    <Stat number="98%" label="Client Satisfaction" />
                                    <Stat number="24/7" label="Support" />
                                    <Stat number="∞" label="Possibilities" />
                                </div>
                            </GlassCard>
                        </div>
                    </motion.div>
                </section>

                {/* Tech Stack Section */}
                <section className="mb-24">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold font-heading mb-4">Our Tech Ecosystem</h2>
                        <p className="text-gray-400">We use the best tools to build the best products.</p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        <TechCard
                            icon={Code}
                            title="Frontend"
                            skills={["React.js", "Next.js", "TailwindCSS", "Framer Motion"]}
                            color="text-primary"
                            bg="bg-primary/10 border-primary/20"
                        />
                        <TechCard
                            icon={Smartphone}
                            title="Mobile"
                            skills={["Kotlin (Android)", "React Native", "Flutter", "iOS Swift"]}
                            color="text-secondary"
                            bg="bg-secondary/10 border-secondary/20"
                        />
                        <TechCard
                            icon={Database}
                            title="Backend"
                            skills={["Node.js", "Firebase", "PostgreSQL", "Supabase"]}
                            color="text-accent"
                            bg="bg-accent/10 border-accent/20"
                        />
                        <TechCard
                            icon={PenTool}
                            title="Design"
                            skills={["Figma", "UI/UX", "Prototyping", "Design Systems"]}
                            color="text-pink-400"
                            bg="bg-pink-500/10 border-pink-500/20"
                        />
                    </motion.div>
                </section>

                {/* Values Section */}
                <section>
                    <motion.div
                        className="grid md:grid-cols-3 gap-8"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <ValueItem
                            icon={Zap}
                            title="Speed & Efficiency"
                            desc="We build fast, and we build things that run fast. Optimization is at our core."
                        />
                        <ValueItem
                            icon={Users}
                            title="User Centric"
                            desc="We design with the end-user in mind, ensuring intuitive and engaging experiences."
                        />
                        <ValueItem
                            icon={Rocket}
                            title="Innovation"
                            desc="We constantly explore new technologies to keep your business ahead of the curve."
                        />
                    </motion.div>
                </section>

            </div>
        </div>
    );
}

function Stat({ number, label }) {
    return (
        <div className="text-center p-4">
            <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 mb-1">{number}</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">{label}</div>
        </div>
    );
}

function TechCard({ icon: Icon, title, skills, color, bg }) {
    return (
        <motion.div variants={fadeInUp} className="h-full">
            <div className={`h-full p-6 rounded-2xl border backdrop-blur-md ${bg} hover:border-white/20 transition-all duration-300 hover:scale-105`}>
                <div className={`w-12 h-12 rounded-lg ${bg} flex items-center justify-center mb-4`}>
                    <Icon className={color} size={24} />
                </div>
                <h3 className="text-xl font-bold mb-4">{title}</h3>
                <ul className="space-y-2">
                    {skills.map((skill, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-400 text-sm">
                            <div className={`w-1.5 h-1.5 rounded-full ${color.replace('text-', 'bg-')}`} />
                            {skill}
                        </li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
}

function ValueItem({ icon: Icon, title, desc }) {
    return (
        <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                <Icon className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-gray-400 leading-relaxed">
                {desc}
            </p>
        </div>
    );
}

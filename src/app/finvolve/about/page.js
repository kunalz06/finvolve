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

                {/* Hero Section */}
                <section className="mb-24 flex flex-col md:flex-row items-center gap-12 lg:gap-20">
                    <motion.div
                        className="flex-1 text-center md:text-left"
                        initial="initial"
                        animate="animate"
                        variants={staggerContainer}
                    >
                        <motion.h1
                            className="text-5xl md:text-7xl font-bold font-heading mb-6 tracking-tight leading-none"
                            variants={fadeInUp}
                        >
                            We Build <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                                The Future.
                            </span>
                        </motion.h1>
                        <motion.p
                            className="text-xl text-gray-400 max-w-xl mx-auto md:mx-0 leading-relaxed mb-8"
                            variants={fadeInUp}
                        >
                            Finvolve is a collective of visionary developers and designers. We don't just write code; we architect digital experiences that define brands.
                        </motion.p>
                    </motion.div>

                    {/* Layered Image Reveal */}
                    <motion.div
                        className="flex-1 w-full max-w-md relative"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden">
                            {/* The Image */}
                            <motion.img
                                src="/images/profile.jpg"
                                alt="Founder"
                                className="w-full h-full object-cover"
                                initial={{ scale: 1.2, filter: "grayscale(100%)" }}
                                animate={{ scale: 1, filter: "grayscale(0%)" }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                            />

                            {/* Layer 1: Dark Overlay Fade Out */}
                            <motion.div
                                className="absolute inset-0 bg-black/60"
                                initial={{ opacity: 1 }}
                                animate={{ opacity: 0 }}
                                transition={{ duration: 1.5, ease: "easeIn" }}
                            />

                            {/* Layer 2: Sliding Shutters (Subtle Look) */}
                            {[0, 1, 2, 3].map((i) => (
                                <motion.div
                                    key={i}
                                    className="absolute inset-0 bg-black z-10"
                                    style={{
                                        clipPath: `inset(0 0 ${i * 25}% 0)`, // Bottom clip
                                        top: `${i * 25}%`,
                                        height: '25%'
                                    }}
                                    initial={{ scaleX: 1 }}
                                    animate={{ scaleX: 0 }}
                                    transition={{ duration: 0.8, delay: 0.5 + (i * 0.1), ease: "circInOut" }}
                                />
                            ))}

                            {/* Layer 3: Border Flash */}
                            <motion.div
                                className="absolute inset-0 border border-white/20 z-20 rounded-2xl"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2 }}
                            />
                        </div>
                        {/* Decorative background element behind image */}
                        <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl -z-10 blur-xl opacity-50" />
                    </motion.div>
                </section>

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

                {/* Portfolio Section */}
                <section className="mb-24">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold font-heading mb-4">Selected Works</h2>
                        <p className="text-gray-400">A showcase of our capabilities.</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <PortfolioCard
                            title="FinTech Dashboard"
                            category="Web Application"
                            desc="Real-time analytics and transaction monitoring platform processing 10k+ events/sec."
                            gradient="from-blue-500/20 to-cyan-500/20"
                        />
                        <PortfolioCard
                            title="HealthVote"
                            category="Mobile App"
                            desc="HIPAA-compliant telemedicine app connecting patients with specialists instantly."
                            gradient="from-emerald-500/20 to-teal-500/20"
                        />
                        <PortfolioCard
                            title="Nexus CRM"
                            category="SaaS Platform"
                            desc="AI-powered customer relationship tool predicting churn and sales opportunities."
                            gradient="from-purple-500/20 to-pink-500/20"
                        />
                    </div>
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

function PortfolioCard({ title, category, desc, gradient }) {
    return (
        <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
            <GlassCard className="h-full group hover:border-white/30 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10 p-2">
                    <div className="text-xs font-mono text-gray-500 mb-2 uppercase tracking-widest">{category}</div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-white transition-colors">{title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                        {desc}
                    </p>
                    <div className="w-full h-[1px] bg-white/10 group-hover:bg-white/30 transition-colors mb-4" />
                    <div className="flex items-center text-sm font-semibold text-gray-400 group-hover:text-white transition-colors">
                        View Case Study <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                </div>
            </GlassCard>
        </motion.div>
    );
}

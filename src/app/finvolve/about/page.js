"use client";

import { motion } from 'framer-motion';
import { Code, Smartphone, Database, PenTool, Zap, Users, Target, Rocket } from 'lucide-react';
import { FaReact, FaNodeJs, FaAndroid, FaFigma, FaSwift, FaApple } from 'react-icons/fa';
import { SiNextdotjs, SiTailwindcss, SiFramer, SiFirebase, SiPostgresql, SiSupabase, SiKotlin, SiFlutter } from 'react-icons/si';
import RaceCard from '@/components/ui/RaceCard';

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
                            className="text-5xl md:text-7xl font-bold font-heading italic uppercase mb-6 tracking-tight leading-none"
                            variants={fadeInUp}
                        >
                            I Build <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                                Fast Machines.
                            </span>
                        </motion.h1>
                        <motion.p
                            className="text-xl text-gray-400 max-w-xl mx-auto md:mx-0 leading-relaxed mb-8 border-l-4 border-primary pl-6"
                            variants={fadeInUp}
                        >
                            Finvolve is the engineering pit crew for your digital product. I am a <span className="text-white font-semibold">Full Stack Engineer</span> obsessed with speed, precision, and reliability.
                        </motion.p>
                    </motion.div>

                    {/* Layered Image Reveal */}
                    <motion.div
                        className="flex-1 w-full max-w-md relative"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border-2 border-white/10 skew-x-[-6deg]">
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
                                className="absolute inset-0 border border-primary/50 z-20 rounded-2xl"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2 }}
                            />
                        </div>
                        {/* Decorative background element behind image */}
                        <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl -z-10 blur-xl opacity-30 skew-x-[-6deg]" />
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
                            <h2 className="text-3xl font-bold font-heading italic uppercase flex items-center gap-3">
                                <Target className="text-primary" /> My Mission
                            </h2>
                            <p className="text-lg text-gray-300 leading-relaxed">
                                At Finvolve, my mission is to fuel businesses with high-octane technology.
                                I don't just follow the racing line; I create new overtaking opportunities.
                            </p>
                            <p className="text-lg text-gray-400 leading-relaxed">
                                Whether it's a mobile app to keep you connected on the go, or a robust web platform to manage your operations, I have the engineering pedigree to deliver podium-worthy solutions.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent blur-3xl rounded-full" />
                            <RaceCard className="relative p-8 border-primary/30">
                                <div className="grid grid-cols-2 gap-8">
                                    <Stat number="50+" label="Chequered Flags" />
                                    <Stat number="98%" label="Reliability" />
                                    <Stat number="24/7" label="Pit Crew" />
                                    <Stat number="∞" label="Top Speed" />
                                </div>
                            </RaceCard>
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
                        <h2 className="text-3xl font-bold font-heading italic uppercase mb-4">Track Record</h2>
                        <p className="text-gray-400 font-mono tracking-widest uppercase text-sm">A showcase of previous wins.</p>
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
                        <h2 className="text-3xl font-bold font-heading italic uppercase mb-4">Under the Hood</h2>
                        <p className="text-gray-400 font-mono tracking-widest uppercase text-sm">Engine Components & Tools.</p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center"
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={staggerContainer}
                    >
                        <TechLogo icon={FaReact} name="React" color="text-cyan-400" />
                        <TechLogo icon={SiNextdotjs} name="Next.js" color="text-white" />
                        <TechLogo icon={SiTailwindcss} name="Tailwind" color="text-teal-400" />
                        <TechLogo icon={SiFramer} name="Framer" color="text-pink-500" />
                        <TechLogo icon={FaNodeJs} name="Node.js" color="text-green-500" />
                        <TechLogo icon={SiFirebase} name="Firebase" color="text-yellow-500" />
                        <TechLogo icon={SiPostgresql} name="PostgreSQL" color="text-blue-400" />
                        <TechLogo icon={SiSupabase} name="Supabase" color="text-emerald-500" />
                        <TechLogo icon={SiKotlin} name="Kotlin" color="text-purple-500" />
                        <TechLogo icon={SiFlutter} name="Flutter" color="text-cyan-500" />
                        <TechLogo icon={FaSwift} name="Swift" color="text-orange-500" />
                        <TechLogo icon={FaFigma} name="Figma" color="text-red-400" />
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
                            desc="I build fast, and I build things that run fast. Optimization is at my core."
                        />
                        <ValueItem
                            icon={Users}
                            title="User Centric"
                            desc="I design with the end-user in mind, ensuring intuitive and engaging experiences."
                        />
                        <ValueItem
                            icon={Rocket}
                            title="Innovation"
                            desc="I constantly explore new technologies to keep your business ahead of the curve."
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
            <div className="text-3xl font-bold font-heading italic text-white mb-1">{number}</div>
            <div className="text-xs font-mono text-gray-500 uppercase tracking-wider">{label}</div>
        </div>
    );
}

function ValueItem({ icon: Icon, title, desc }) {
    return (
        <div className="flex flex-col items-center text-center p-6 border border-white/5 rounded-2xl bg-white/5 backdrop-blur-sm skew-x-[-6deg]">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 border border-primary/20 text-primary skew-x-[6deg]">
                <Icon size={32} />
            </div>
            <h3 className="text-xl font-bold font-heading italic uppercase mb-3 skew-x-[6deg]">{title}</h3>
            <p className="text-gray-400 leading-relaxed skew-x-[6deg]">
                {desc}
            </p>
        </div>
    );
}

function TechLogo({ icon: Icon, name, color }) {
    return (
        <motion.div variants={fadeInUp} className="flex flex-col items-center gap-2 group">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all duration-300 skew-x-[-6deg]">
                <Icon className={`text-4xl ${color} group-hover:scale-110 transition-transform duration-300 skew-x-[6deg]`} />
            </div>
            <span className="text-gray-400 text-sm font-mono uppercase group-hover:text-primary transition-colors">{name}</span>
        </motion.div>
    );
}

function PortfolioCard({ title, category, desc, gradient }) {
    return (
        <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
            <RaceCard className="h-full">
                <div className="relative z-10">
                    <div className="text-xs font-mono text-primary mb-2 uppercase tracking-widest">{category}</div>
                    <h3 className="text-2xl font-bold font-heading italic uppercase mb-3 group-hover:text-white transition-colors">{title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                        {desc}
                    </p>
                    <div className="w-full h-[1px] bg-white/10 group-hover:bg-white/30 transition-colors mb-4" />
                    <div className="flex items-center text-sm font-bold font-heading italic uppercase text-gray-400 group-hover:text-primary transition-colors">
                        View Telemetry <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                </div>
            </RaceCard>
        </motion.div>
    );
}

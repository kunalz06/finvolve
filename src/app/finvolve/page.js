"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Smartphone, Globe, Zap, Cpu, Layers } from 'lucide-react';
import OrbitalAnimation from '@/components/landing/OrbitalAnimation';
import GlassCard from '@/components/ui/GlassCard';
import GradientButton from '@/components/ui/GradientButton';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  initial: {},
  animate: { transition: { staggerChildren: 0.15 } }
};

export default function Home() {
  return (
    <div className="min-h-screen pt-20 overflow-hidden">
      {/* Background Gradients */}
      <div className="deep-space-bg" />

      {/* Hero Section */}
      <section className="relative container mx-auto px-6 py-12 lg:py-20 flex flex-col lg:flex-row items-center gap-12 lg:min-h-[800px]">
        {/* Left Col: Copy */}
        <motion.div
          className="flex-1 text-center lg:text-left z-10"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.h1
            className="text-4xl md:text-5xl lg:text-7xl font-bold font-heading leading-tight mb-6 tracking-tight"
            variants={fadeInUp}
          >
            Build Software <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent animate-pulse-slow">
              That Defies Expectations.
            </span>
          </motion.h1>
          <motion.p
            className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            variants={fadeInUp}
          >
            We don't just write code. We build scalable, secure, and intuitive digital ecosystems designed for growth.
            Connect with a team that speaks your language.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            variants={fadeInUp}
          >
            <Link href="/finvolve/request">
              <GradientButton className="text-lg px-10 py-4 hover:scale-105 transition-transform duration-300">
                Start Project <ArrowRight className="inline-block ml-2 w-5 h-5" />
              </GradientButton>
            </Link>
            <Link href="/finvolve/about" className="text-gray-400 hover:text-white transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white">
              Explore Our Process
            </Link>
          </motion.div>

          {/* Tech Stack Ticker (Static for now) */}
          <motion.div
            className="mt-16 pt-8 border-t border-white/5 flex flex-wrap justify-center lg:justify-start gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500"
            variants={fadeInUp}
          >
            <span className="font-mono text-xs tracking-widest text-white/40 uppercase">Powering Next-Gen Apps With</span>
            {/* Add logos here if available, using text for now */}
          </motion.div>
        </motion.div>

        {/* Right Col: Orbit Animation */}
        <motion.div
          className="flex-1 w-full relative z-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <OrbitalAnimation />
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="container mx-auto px-6 py-24">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4">Engineering Excellence</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Our expertise spans across the entire digital spectrum, delivering high-fidelity solutions for complex problems.</p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <ServiceCard
            icon={Globe}
            color="text-primary"
            bgColor="bg-primary/20"
            title="Web Platforms"
            desc="Modern web applications built with Next.js and React. Server-side rendering, edge caching, and SEO-optimized architecture."
          />
          <ServiceCard
            icon={Smartphone}
            color="text-secondary"
            bgColor="bg-secondary/20"
            title="Mobile Ecosystems"
            desc="Native Android (Kotlin) and cross-platform solutions. Fluid animations, offline-first capabilities, and native hardware integration."
          />
          <ServiceCard
            icon={Code}
            color="text-accent"
            bgColor="bg-accent/20"
            title="Custom SAAS"
            desc="Tailored software solutions solving unique business logic. Scalable backend infrastructure suitable for high-concurrency needs."
          />
          <ServiceCard
            icon={Zap}
            color="text-gold"
            bgColor="bg-gold/20"
            title="Performance Tuning"
            desc="Core Web Vitals optimization. We ensure your applications load in milliseconds, not seconds."
          />
          <ServiceCard
            icon={Cpu}
            color="text-teal-400"
            bgColor="bg-teal-500/20"
            title="AI Integration"
            desc="Leverage LLMs and predictive models to add intelligence to your existing workflows."
          />
          <ServiceCard
            icon={Layers}
            color="text-indigo-400"
            bgColor="bg-indigo-500/20"
            title="System Architecture"
            desc="Robust microservices and serverless architectures designed for fault tolerance and scale."
          />
        </motion.div>
      </section>
    </div>
  );
}

function ServiceCard({ icon: Icon, color, bgColor, title, desc }) {
  return (
    <motion.div variants={fadeInUp}>
      <GlassCard className="group h-full hover:border-primary/50 transition-colors duration-300">
        <div className={`w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={color} size={24} />
        </div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          {desc}
        </p>
      </GlassCard>
    </motion.div>
  );
}

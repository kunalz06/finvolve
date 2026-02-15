"use client";

import { motion } from "framer-motion";
import { Code, Smartphone, Globe, ChevronRight, Zap, Trophy, Flag } from "lucide-react";
import RaceButton from "@/components/ui/RaceButton";
import RaceCard from "@/components/ui/RaceCard";
import OrbitalAnimation from "@/components/landing/OrbitalAnimation";
import CodeFireworks from "@/components/landing/CodeFireworks";

export default function Home() {
  return (
    <div className="flex flex-col gap-32 pb-20 overflow-x-hidden">
      {/* Hero Section - Pole Position */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20">
        <OrbitalAnimation />
        <CodeFireworks />

        <div className="max-w-[1400px] mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded bg-white/5 border border-white/10 skew-x-[-12deg]">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse skew-x-[12deg]" />
              <span className="text-primary font-mono text-xs tracking-[0.2em] uppercase skew-x-[12deg]">
                Live Telemetry Active
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold font-heading italic uppercase leading-[0.9] tracking-tighter">
              Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Fast.</span><br />
              Scale <span className="text-primary">Faster.</span>
            </h1>

            <p className="text-xl text-gray-300 max-w-lg leading-relaxed border-l-4 border-primary pl-6">
              High-performance digital engineering for brands that demand podium finishes.
              Web, Mobile, and SaaS solutions built for speed.
            </p>

            <div className="flex flex-wrap gap-6">
              <RaceButton href="/finvolve/request" variant="primary">
                Ignore Speed Limits
              </RaceButton>
              <RaceButton href="/finvolve/about" variant="secondary">
                View Specs
              </RaceButton>
            </div>
          </motion.div>
        </div>

        {/* Background Speed Blur */}
        <div className="absolute inset-0 z-0 opacity-30 select-none pointer-events-none">
          <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-primary/20 blur-[100px] rounded-full mix-blend-screen" />
          <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-accent/10 blur-[100px] rounded-full mix-blend-screen" />
        </div>
      </section>

      {/* Services Grid - "The Garage" */}
      <section className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold font-heading italic uppercase mb-2">
              Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">Performance</span>
            </h2>
            <p className="text-gray-400 font-mono tracking-widest text-sm uppercase">Sector 1: Capabilities</p>
          </div>
          <RaceButton href="/finvolve/telemetry" variant="secondary" className="hidden md:inline-flex">
            Full Telemetry <ChevronRight className="ml-2" size={16} />
          </RaceButton>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <RaceCard delay={0.1}>
            <Globe className="text-primary mb-6" size={48} />
            <h3 className="text-2xl font-bold font-heading italic uppercase mb-4">Web Development</h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              Next.js applications optimized for maximum velocity. SEO-ready, responsive, and built to handle high traffic loads without stalling.
            </p>
            <ul className="space-y-2 text-sm text-gray-500 font-mono">
              <li className="flex items-center gap-2"><Zap size={14} className="text-accent" /> Server-Side Rendering</li>
              <li className="flex items-center gap-2"><Zap size={14} className="text-accent" /> &lt; 100ms TTI</li>
            </ul>
          </RaceCard>

          <RaceCard delay={0.2}>
            <Smartphone className="text-primary mb-6" size={48} />
            <h3 className="text-2xl font-bold font-heading italic uppercase mb-4">Mobile Apps</h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              Native-grade React Native & Flutter applications. Smooth 60fps animations and intuitive UX that keeps users in the driver's seat.
            </p>
            <ul className="space-y-2 text-sm text-gray-500 font-mono">
              <li className="flex items-center gap-2"><Zap size={14} className="text-accent" /> Cross-Platform</li>
              <li className="flex items-center gap-2"><Zap size={14} className="text-accent" /> Offline First</li>
            </ul>
          </RaceCard>

          <RaceCard delay={0.3}>
            <Code className="text-primary mb-6" size={48} />
            <h3 className="text-2xl font-bold font-heading italic uppercase mb-4">SaaS Architecture</h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              Scalable backend systems driven by Firebase and Node.js. Secure, reliable, and ready to scale from pit lane to pole position.
            </p>
            <ul className="space-y-2 text-sm text-gray-500 font-mono">
              <li className="flex items-center gap-2"><Zap size={14} className="text-accent" /> Real-time DB</li>
              <li className="flex items-center gap-2"><Zap size={14} className="text-accent" /> Cloud Functions</li>
            </ul>
          </RaceCard>
        </div>
      </section>

      {/* CTA Section - The Finish Line */}
      <section className="container mx-auto px-6 mb-20">
        <div className="relative rounded-3xl overflow-hidden bg-primary/10 border border-primary/20 p-12 md:p-24 text-center group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-slide-fast" />

          <div className="relative z-10 space-y-8">
            <Trophy className="mx-auto text-accent mb-4" size={64} />
            <h2 className="text-5xl md:text-7xl font-bold font-heading italic uppercase tracking-tighter">
              Ready on the Grid?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Don't get lapped by the competition. Let's build something fast, furious, and future-proof.
            </p>
            <RaceButton href="/finvolve/request" variant="primary" className="text-lg px-10 py-4">
              Start Engine
            </RaceButton>
          </div>
        </div>
      </section>
    </div>
  );
}

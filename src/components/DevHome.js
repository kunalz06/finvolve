"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Cloud, Globe, Smartphone, Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import HomeEntranceAnimation from "@/components/animations/HomeEntranceAnimation";



export default function Home() {
  return (
    <div className="flex flex-col gap-8 sm:gap-10 pb-8 md:pb-12">
      <section className="page-section px-4 sm:px-6 py-6 md:px-0">
        <div className="container">
          <div className="grid min-h-[calc(100vh-120px)] sm:min-h-[calc(100vh-140px)] items-center gap-6 sm:gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <motion.div
              initial={false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="space-y-6 sm:space-y-8"
            >
              <div className="glass-chip-strong inline-flex items-center gap-2 rounded-xl px-3 py-1.5 sm:px-4 sm:py-2">
                <span className="font-code-brand text-xs sm:text-sm font-bold uppercase text-primary">Software Builders</span>
              </div>

              <h1 className="max-w-2xl text-4xl sm:text-5xl font-black leading-[1.05] sm:leading-[0.98] text-slate-950 md:text-6xl lg:text-7xl">
                Build fast. Scale faster.
              </h1>

              <p className="max-w-xl text-base sm:text-lg leading-relaxed text-slate-600">
                DEV Infinity designs and ships sturdy web apps, payment flows, dashboards, and automations for teams that need momentum without the generic agency fog.
              </p>

              <div className="flex flex-wrap gap-3 sm:gap-4">
                <Button href="/dev/request" variant="primary" size="large" className="touch-target">
                  Start Project
                </Button>
                <Button href="/dev/services" variant="secondary" size="large" className="touch-target">
                  View Services
                </Button>
              </div>
            </motion.div>

            <HomeEntranceAnimation className="rounded-2xl" />
          </div>
        </div>
      </section>

      <section className="page-section px-6 py-8 md:px-0">
        <div className="container">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="dev-section-title mb-12"
          >
            <p className="mb-3 font-code-brand text-sm font-bold uppercase text-primary">Build stack</p>
            <h2 className="mb-4 text-4xl font-black text-slate-950 md:text-5xl">Useful engineering, not template theater.</h2>
            <p className="text-lg text-slate-600">
              Clear systems, fast implementation, and interfaces that are pleasant to operate every day.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card delay={0.1}>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border-2 border-[var(--border)] bg-[var(--primary-soft)] shadow-[var(--shadow-soft)]">
                <Globe className="text-primary" size={28} />
              </div>
              <h3 className="mb-3 text-xl font-black text-slate-950">Web Development</h3>
              <p className="mb-6 leading-relaxed text-slate-600">Custom frontend and backend products optimized for everyday use.</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                  <Zap size={16} className="text-primary" />
                  React and Next.js experts
                </li>
                <li className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                  <Zap size={16} className="text-primary" />
                  Core Web Vitals optimization
                </li>
              </ul>
            </Card>

            <Card delay={0.2}>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border-2 border-[var(--border)] bg-[var(--surface-muted)] shadow-[var(--shadow-soft)]">
                <Smartphone className="text-primary" size={28} />
              </div>
              <h3 className="mb-3 text-xl font-black text-slate-950">Mobile Apps</h3>
              <p className="mb-6 leading-relaxed text-slate-600">Native and cross-platform experiences that move cleanly from idea to release.</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                  <Zap size={16} className="text-primary" />
                  iOS and Android development
                </li>
                <li className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                  <Zap size={16} className="text-primary" />
                  Smooth product interactions
                </li>
              </ul>
            </Card>

            <Card delay={0.3}>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border-2 border-[var(--border)] bg-[var(--surface-muted)] shadow-[var(--shadow-soft)]">
                <Cloud className="text-primary" size={28} />
              </div>
              <h3 className="mb-3 text-xl font-black text-slate-950">SaaS Architecture</h3>
              <p className="mb-6 leading-relaxed text-slate-600">Scalable infrastructure, payments, admin tools, and operational workflows.</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                  <Zap size={16} className="text-primary" />
                  Cloud systems
                </li>
                <li className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                  <Zap size={16} className="text-primary" />
                  Automation and dashboards
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      <section className="px-6 py-8 md:px-0">
        <div className="container">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="glass-surface-strong rounded-2xl p-10 md:p-14"
          >
            <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[var(--border)] bg-[var(--accent-cool)] text-white shadow-[var(--shadow-soft)]">
                  <CheckCircle size={24} />
                </div>
                <h2 className="text-4xl font-black text-slate-950 md:text-5xl">Ready on the grid?</h2>
                <p className="mt-4 max-w-2xl text-lg text-slate-600">
                  Bring the idea, messy context included. We will turn it into a product plan and a build path.
                </p>
              </div>
              <Button href="/dev/request" variant="primary" size="large" icon={ArrowRight}>
                Start Engine
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

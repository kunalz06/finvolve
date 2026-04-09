"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Cloud, Globe, Smartphone, Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function Home() {
  return (
    <div className="flex flex-col gap-10 pb-8 md:pb-12">
      <section className="page-section relative min-h-[88vh] overflow-hidden px-6 py-10 md:px-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,92,255,0.22),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(105,183,255,0.18),transparent_26%),radial-gradient(circle_at_24%_80%,rgba(82,215,183,0.12),transparent_18%),radial-gradient(circle_at_84%_72%,rgba(255,180,84,0.16),transparent_18%)]" />

        <div className="container relative z-10 py-10 md:py-16">
          <div className="glass-surface-strong glass-spectrum grid items-center gap-12 rounded-[36px] px-8 py-12 lg:grid-cols-2 lg:px-12">
            <motion.div
              initial={false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="glass-chip-strong inline-flex items-center gap-2 rounded-full px-4 py-2">
                <span className="text-sm font-medium uppercase tracking-[0.22em] text-primary">Software Builders</span>
              </div>

              <h1 className="text-5xl font-bold leading-tight text-slate-950 md:text-6xl lg:text-7xl">
                Build <span className="glass-text-gradient">Fast.</span>
                <br />
                Scale <span className="glass-text-gradient">Faster.</span>
              </h1>

              <p className="max-w-xl text-lg leading-relaxed text-slate-600">
                A modern engineering agency helping you ship high-quality products at lightning speed. Friendly, high-energy, and ready to scale your vision.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button href="/finvolve/request" variant="primary" size="large">
                  Start Project
                </Button>
                <Button href="/finvolve/services" variant="secondary" size="large">
                  View Services
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              className="relative"
            >
              <div className="relative mx-auto aspect-square w-full max-w-md">
                <div className="glass-chip absolute inset-0 rotate-3 rounded-[34px]" />
                <div className="absolute inset-0 flex items-center justify-center rounded-[34px] bg-[linear-gradient(145deg,rgba(124,92,255,0.94),rgba(105,183,255,0.72),rgba(82,215,183,0.7),rgba(255,180,84,0.58))] shadow-[0_32px_80px_rgba(103,88,255,0.28)]">
                  <div className="grid grid-cols-3 gap-8">
                    {[...Array(9)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.15, 1], opacity: [0.55, 1, 0.55] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.18 }}
                        className="text-lg font-semibold text-white"
                      >
                        +
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.div
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="glass-surface absolute -bottom-5 -left-5 flex items-center gap-3 rounded-[24px] p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100/90">
                    <CheckCircle className="text-emerald-600" size={20} />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Speed Increase</div>
                    <div className="text-xl font-bold text-slate-950">400% Faster</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="page-section px-6 py-6 md:px-0">
        <div className="container">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold text-slate-950 md:text-5xl">Our Expertise</h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              We specialize in cutting-edge technologies to bring your digital products to life with unmatched performance and scalability.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card delay={0.1}>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[20px] bg-[linear-gradient(145deg,rgba(124,92,255,0.18),rgba(105,183,255,0.14))]">
                <Globe className="text-primary" size={28} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-950">Web Development</h3>
              <p className="mb-6 leading-relaxed text-slate-600">
                Custom frontend and backend solutions optimized for high performance.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Zap size={16} className="text-primary" />
                  React and Next.js Experts
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Zap size={16} className="text-primary" />
                  Core Web Vitals Optimization
                </li>
              </ul>
            </Card>

            <Card delay={0.2}>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[20px] bg-[linear-gradient(145deg,rgba(105,183,255,0.18),rgba(82,215,183,0.14))]">
                <Smartphone className="text-primary" size={28} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-950">Mobile Apps</h3>
              <p className="mb-6 leading-relaxed text-slate-600">
                Native and cross-platform mobile experiences that users love.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Zap size={16} className="text-primary" />
                  iOS and Android Development
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Zap size={16} className="text-primary" />
                  Smooth fluid animations
                </li>
              </ul>
            </Card>

            <Card delay={0.3}>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[20px] bg-[linear-gradient(145deg,rgba(82,215,183,0.2),rgba(255,180,84,0.14))]">
                <Cloud className="text-primary" size={28} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-950">SaaS Architecture</h3>
              <p className="mb-6 leading-relaxed text-slate-600">
                Scalable cloud infrastructure designed for millions of users.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Zap size={16} className="text-primary" />
                  AWS and Azure solutions
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Zap size={16} className="text-primary" />
                  Microservices design
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      <section className="px-6 py-6 md:px-0">
        <div className="container">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-surface-strong glass-spectrum relative overflow-hidden rounded-[36px] p-12 text-center md:p-20"
          >
            <div className="absolute inset-0 opacity-50">
              <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-white blur-3xl" />
              <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
              <div className="absolute left-1/4 top-1/2 h-40 w-40 rounded-full bg-emerald-300/20 blur-3xl" />
            </div>

            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl font-bold text-slate-950 md:text-5xl">Ready on the Grid?</h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-600">
                Let&apos;s ignite your next project with our expert engineering team. We are ready to shift your development into high gear.
              </p>
              <Button href="/finvolve/request" variant="primary" size="large" icon={ArrowRight} className="mt-4">
                Start Engine
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

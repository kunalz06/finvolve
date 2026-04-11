"use client";

import { motion } from "framer-motion";
import { ExternalLink, Rocket, Target, Users, Zap } from "lucide-react";
import { FaFigma, FaNodeJs, FaReact, FaSwift } from "react-icons/fa";
import { SiFirebase, SiFlutter, SiKotlin, SiNextdotjs, SiPostgresql, SiSupabase, SiTailwindcss } from "react-icons/si";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function About() {
  return (
    <div className="min-h-screen px-6 py-12">
      <div className="container space-y-10">
        <section className="page-section">
          <div className="glass-surface-strong grid items-center gap-12 rounded-[36px] px-8 py-10 lg:grid-cols-2 lg:px-12">
            <motion.div initial={false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="glass-chip-strong mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2">
                <span className="text-sm font-medium uppercase tracking-[0.2em] text-primary">About Us</span>
              </div>
              <h1 className="mb-6 text-4xl font-bold leading-tight text-slate-950 md:text-5xl lg:text-6xl">
                We build <span className="glass-text-gradient">digital products</span> that scale with confidence.
              </h1>
              <p className="mb-8 max-w-xl text-lg leading-relaxed text-slate-600">
                DEV♾️ is a modern engineering agency obsessed with speed, precision, and reliability. We help businesses ship high-quality products quickly without sacrificing craft.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button href="/dev/contact" variant="primary" size="large">Get in Touch</Button>
                <Button href="/dev/services" variant="secondary" size="large">View Services</Button>
              </div>
            </motion.div>

            <motion.div initial={false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="relative mx-auto aspect-square max-w-md">
                <div className="glass-chip absolute inset-0 rotate-3 rounded-[34px]" />
                <div className="relative flex h-full items-center justify-center rounded-[34px] bg-[linear-gradient(145deg,rgba(124,92,255,0.92),rgba(105,183,255,0.72))] p-8 text-center text-white shadow-[0_28px_80px_rgba(103,88,255,0.28)]">
                  <div>
                    <div className="mb-2 text-7xl font-bold">50+</div>
                    <div className="text-lg text-white/80">Projects Delivered</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="grid items-center gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="glass-icon-plate flex h-12 w-12 items-center justify-center rounded-[18px]">
                <Target className="text-primary" size={24} />
              </div>
              <h2 className="text-3xl font-bold text-slate-950">Our Mission</h2>
            </div>
            <p className="text-lg leading-relaxed text-slate-600">
              At DEV♾️, our mission is to fuel businesses with high-performance technology. We do not just follow best practices, we push for sharper execution and better product clarity.
            </p>
            <p className="leading-relaxed text-slate-600">
              Whether it is a mobile app that keeps teams connected or a robust platform that runs operations, we bring the engineering depth to deliver reliable outcomes.
            </p>
          </div>

          <Card hover={false} className="glass-surface-strong">
            <div className="grid grid-cols-2 gap-6">
              <Stat number="50+" label="Projects Completed" />
              <Stat number="98%" label="Client Satisfaction" />
              <Stat number="24/7" label="Support Available" />
              <Stat number="Always" label="Scalability Mindset" />
            </div>
          </Card>
        </section>

        <section>
          <div className="mb-12 text-center">
            <div className="glass-chip-strong mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2">
              <span className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Portfolio</span>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-slate-950 md:text-4xl">Selected Work</h2>
            <p className="mx-auto max-w-2xl text-slate-600">A snapshot of the kinds of platforms, products, and systems we love building.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <PortfolioCard title="FinTech Dashboard" category="Web Application" desc="Real-time analytics and transaction monitoring platform processing 10k+ events per second with advanced visualization." tech={["Next.js", "WebSocket", "PostgreSQL"]} />
            <PortfolioCard title="HealthVote" category="Mobile App" desc="Telemedicine app connecting patients with specialists instantly, featuring video calls and prescription management." tech={["React Native", "Node.js", "MongoDB"]} />
            <PortfolioCard title="Nexus CRM" category="SaaS Platform" desc="AI-powered customer relationship tool predicting churn and sales opportunities with intelligent lead scoring." tech={["Vue.js", "Python", "TensorFlow"]} />
            <PortfolioCard title="EduLearn Platform" category="E-Learning" desc="Comprehensive learning platform with live classes, course creation tools, and progress tracking for 50k plus students." tech={["Next.js", "AWS", "Redis"]} />
            <PortfolioCard title="LogiTrack" category="Enterprise Software" desc="Supply chain solution with real-time GPS tracking, inventory management, and automated reporting." tech={["React", "GraphQL", "Kubernetes"]} />
            <PortfolioCard title="CryptoWallet" category="Web3 Application" desc="Secure multi-chain wallet with DeFi integration and hardened security flows." tech={["React", "Web3.js", "Solidity"]} />
          </div>
        </section>

        <section>
          <div className="mb-12 text-center">
            <div className="glass-chip-strong mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2">
              <span className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Tech Stack</span>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-slate-950 md:text-4xl">Technologies We Use</h2>
            <p className="mx-auto max-w-2xl text-slate-600">A modern stack chosen for maintainability, speed, and product momentum.</p>
          </div>

          <motion.div className="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-6" initial={false} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <TechLogo icon={FaReact} name="React" color="text-cyan-500" />
            <TechLogo icon={SiNextdotjs} name="Next.js" color="text-slate-950" />
            <TechLogo icon={SiTailwindcss} name="Tailwind" color="text-teal-500" />
            <TechLogo icon={FaNodeJs} name="Node.js" color="text-green-600" />
            <TechLogo icon={SiFirebase} name="Firebase" color="text-yellow-500" />
            <TechLogo icon={SiPostgresql} name="PostgreSQL" color="text-blue-600" />
            <TechLogo icon={SiSupabase} name="Supabase" color="text-emerald-500" />
            <TechLogo icon={SiKotlin} name="Kotlin" color="text-purple-600" />
            <TechLogo icon={SiFlutter} name="Flutter" color="text-cyan-600" />
            <TechLogo icon={FaSwift} name="Swift" color="text-orange-500" />
            <TechLogo icon={FaFigma} name="Figma" color="text-pink-500" />
            <TechLogo icon={SiFirebase} name="GCP" color="text-blue-500" />
          </motion.div>
        </section>

        <section>
          <div className="mb-12 text-center">
            <div className="glass-chip-strong mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2">
              <span className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Values</span>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-slate-950 md:text-4xl">What Drives Us</h2>
            <p className="mx-auto max-w-2xl text-slate-600">The principles shaping our pace, collaboration, and product decisions.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <ValueItem icon={Zap} title="Speed and Efficiency" desc="We build fast, and we build things that run fast. Optimization is part of the product, not an afterthought." />
            <ValueItem icon={Users} title="User Centric" desc="We design with the end-user in mind, ensuring intuitive experiences that solve real problems." />
            <ValueItem icon={Rocket} title="Innovation" desc="We keep exploring better tools and approaches so your business stays ahead of the curve." />
          </div>
        </section>

        <section className="glass-surface-strong rounded-[36px] px-8 py-12 text-center">
          <h2 className="mb-4 text-2xl font-bold text-slate-950 md:text-3xl">Ready to build something ambitious?</h2>
          <p className="mx-auto mb-8 max-w-xl text-slate-600">Let&apos;s discuss your goals and shape the right product path together.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/dev/request" variant="primary" size="large">Start a Project</Button>
            <Button href="/dev/contact" variant="secondary" size="large">Contact Us</Button>
          </div>
        </section>
      </div>
    </div>
  );
}

function Stat({ number, label }) {
  return (
    <div className="glass-chip-strong rounded-[24px] p-5 text-center">
      <div className="mb-1 text-3xl font-bold text-slate-950">{number}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}

function ValueItem({ icon: Icon, title, desc }) {
  return (
    <Card className="text-center">
      <div className="glass-icon-plate mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-[20px]">
        <Icon className="text-primary" size={28} />
      </div>
      <h3 className="mb-3 text-xl font-bold text-slate-950">{title}</h3>
      <p className="leading-relaxed text-slate-600">{desc}</p>
    </Card>
  );
}

function TechLogo({ icon: Icon, name, color }) {
  return (
    <div className="glass-surface flex cursor-pointer flex-col items-center gap-2 rounded-[24px] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/80">
      <Icon className={`text-3xl ${color}`} />
      <span className="text-center text-xs font-medium text-slate-500">{name}</span>
    </div>
  );
}

function PortfolioCard({ title, category, desc, tech }) {
  return (
    <Card className="group cursor-pointer">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">{category}</span>
        <ExternalLink size={16} className="text-slate-400 transition-colors group-hover:text-primary" />
      </div>
      <h3 className="mb-3 text-xl font-bold text-slate-950 transition-colors group-hover:text-primary">{title}</h3>
      <p className="mb-4 text-sm leading-relaxed text-slate-600">{desc}</p>
      <div className="flex flex-wrap gap-2">
        {tech.map((t) => (
          <span key={t} className="glass-chip rounded-full px-3 py-1 text-xs font-medium text-slate-600">
            {t}
          </span>
        ))}
      </div>
    </Card>
  );
}

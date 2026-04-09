"use client";

import { motion } from "framer-motion";
import { ArrowRight, Brain, CheckCircle, Cloud, Code, Database, Globe, Palette, Shield, Smartphone } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const services = [
  {
    id: "web-app",
    icon: Globe,
    title: "Web App Development",
    description: "Build responsive web products that scale from launch to enterprise usage.",
    features: ["React and Next.js Development", "Progressive Web Apps", "E-commerce Solutions", "Real-time Applications", "API Integration"],
    color: "from-purple-500 to-blue-500",
  },
  {
    id: "mobile-app",
    icon: Smartphone,
    title: "Mobile App Development",
    description: "Native and cross-platform experiences that feel polished, fast, and reliable.",
    features: ["iOS and Android Native Apps", "React Native", "Flutter Development", "App Store Optimization", "Analytics and Notifications"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "ai",
    icon: Brain,
    title: "AI Solutions",
    description: "Use applied AI to automate workflows, unlock insights, and add intelligence to products.",
    features: ["Machine Learning Models", "Natural Language Processing", "Computer Vision", "Predictive Analytics", "AI Assistants"],
    color: "from-cyan-500 to-teal-500",
  },
  {
    id: "saas",
    icon: Cloud,
    title: "Custom SaaS Development",
    description: "Build scalable multi-tenant platforms with durable architecture and security built in.",
    features: ["Multi-tenant Architecture", "Subscription Management", "User Authentication and RBAC", "Cloud Infrastructure", "Automated Scaling"],
    color: "from-teal-500 to-green-500",
  },
  {
    id: "custom-software",
    icon: Code,
    title: "Custom Software",
    description: "Tailored systems for internal tools, automation, and high-leverage business workflows.",
    features: ["Process Automation", "Internal Dashboards", "Legacy Modernization", "Third-party Integrations", "Custom CRM and ERP"],
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "database",
    icon: Database,
    title: "Database and Backend",
    description: "Robust backend systems designed for performance, maintainability, and clean data flows.",
    features: ["Database Design", "REST and GraphQL APIs", "Microservices Architecture", "Real-time Data Processing", "Cloud Database Management"],
    color: "from-emerald-500 to-yellow-500",
  },
  {
    id: "security",
    icon: Shield,
    title: "Security and Compliance",
    description: "Security-first delivery for applications that need stronger trust, privacy, and resilience.",
    features: ["Security Audits", "OWASP Alignment", "Data Encryption", "Access Control", "GDPR and HIPAA Readiness"],
    color: "from-yellow-500 to-orange-500",
  },
  {
    id: "design",
    icon: Palette,
    title: "UI and UX Design",
    description: "Interfaces shaped for clarity, conversion, and a product experience users actually enjoy.",
    features: ["User Research", "Wireframes and Prototypes", "Design Systems", "Responsive Design", "Design to Dev Handoff"],
    color: "from-orange-500 to-pink-500",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen px-6 py-12">
      <div className="container space-y-10">
        <section className="glass-surface-strong rounded-[36px] px-8 py-12 text-center md:px-12">
          <div className="glass-chip-strong mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2">
            <span className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Our Services</span>
          </div>
          <h1 className="mb-6 text-4xl font-bold text-slate-950 md:text-5xl lg:text-6xl">Solutions That <span className="glass-text-gradient">Scale</span></h1>
          <p className="mx-auto max-w-3xl text-lg text-slate-600">
            From concept to deployment, we provide end-to-end development services to bring your digital vision to life with better speed, structure, and reliability.
          </p>
        </section>

        <section className="grid gap-8 md:grid-cols-2">
          {services.map((service, index) => (
            <motion.div key={service.id} initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.05 }}>
              <Card className="group h-full">
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-br ${service.color} transition-transform duration-300 group-hover:scale-110`}>
                  <service.icon className="text-white" size={28} />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-950">{service.title}</h3>
                <p className="mb-6 leading-relaxed text-slate-600">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle size={16} className="flex-shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 border-t border-white/45 pt-6">
                  <Button href={`/finvolve/request?service=${service.id}`} variant="ghost" className="group/btn px-0 hover:bg-transparent">
                    Get Started
                    <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </section>

        <section className="glass-surface-strong relative overflow-hidden rounded-[36px] px-8 py-12 text-center md:px-12 md:py-16">
          <div className="absolute inset-0 opacity-45">
            <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-0 right-0 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
          </div>
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl font-bold text-slate-950 md:text-4xl">Not Sure Where to Start?</h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">We can help you shape the right build path, scope the work, and choose the best delivery approach for your product.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="/finvolve/contact" variant="secondary" size="large">Talk to an Expert</Button>
              <Button href="/finvolve/request" variant="primary" size="large">Start a Project</Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

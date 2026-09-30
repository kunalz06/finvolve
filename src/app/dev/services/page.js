"use client";

import { AnimatedDiv } from "@/components/ui/Animated";
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
    color: "bg-[var(--primary)]",
      },
  {
    id: "mobile-app",
    icon: Smartphone,
    title: "Mobile App Development",
    description: "Native and cross-platform experiences that feel polished, fast, and reliable.",
    features: ["iOS and Android Native Apps", "React Native", "Flutter Development", "App Store Optimization", "Analytics and Notifications"],
    color: "bg-[var(--accent-cool)]",
      },
  {
    id: "ai",
    icon: Brain,
    title: "AI Solutions",
    description: "Use applied AI to automate workflows, unlock insights, and add intelligence to products.",
    features: ["Machine Learning Models", "Natural Language Processing", "Computer Vision", "Predictive Analytics", "AI Assistants"],
    color: "bg-[var(--accent)]",
      },
  {
    id: "saas",
    icon: Cloud,
    title: "Custom SaaS Development",
    description: "Build scalable multi-tenant platforms with durable architecture and security built in.",
    features: ["Multi-tenant Architecture", "Subscription Management", "User Authentication and RBAC", "Cloud Infrastructure", "Automated Scaling"],
    color: "bg-[var(--accent-mint)]",
      },
  {
    id: "custom-software",
    icon: Code,
    title: "Custom Software",
    description: "Tailored systems for internal tools, automation, and high-leverage business workflows.",
    features: ["Process Automation", "Internal Dashboards", "Legacy Modernization", "Third-party Integrations", "Custom CRM and ERP"],
    color: "bg-[var(--primary)]",
      },
  {
    id: "database",
    icon: Database,
    title: "Database and Backend",
    description: "Robust backend systems designed for performance, maintainability, and clean data flows.",
    features: ["Database Design", "REST and GraphQL APIs", "Microservices Architecture", "Real-time Data Processing", "Cloud Database Management"],
    color: "bg-[var(--accent-cool)]",
      },
  {
    id: "security",
    icon: Shield,
    title: "Security and Compliance",
    description: "Security-first delivery for applications that need stronger trust, privacy, and resilience.",
    features: ["Security Audits", "OWASP Alignment", "Data Encryption", "Access Control", "GDPR and HIPAA Readiness"],
    color: "bg-[var(--accent-amber)]",
      },
  {
    id: "design",
    icon: Palette,
    title: "UI and UX Design",
    description: "Interfaces shaped for clarity, conversion, and a product experience users actually enjoy.",
    features: ["User Research", "Wireframes and Prototypes", "Design Systems", "Responsive Design", "Design to Dev Handoff"],
    color: "bg-[var(--accent-rose)]",
      },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 sm:py-12">
      <div className="container space-y-6 sm:space-y-8 lg:space-y-10">
        <section className="gradient-section glass-surface-strong relative overflow-hidden rounded-[28px] px-4 py-8 sm:px-6 sm:py-10 md:px-8 lg:px-12 text-left">
          <div className="spectrum-line absolute inset-x-0 top-0" />
          <div className="glass-chip-strong mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2">
            <span className="text-sm font-bold uppercase text-primary">Our Services</span>
          </div>
          <h1 className="mb-4 sm:mb-6 max-w-4xl text-3xl sm:text-4xl font-black text-[var(--heading)] md:text-5xl lg:text-6xl">Solutions That <span className="brand-gradient-text">Scale</span></h1>
          <p className="max-w-3xl text-base sm:text-lg text-[var(--muted)]">
            From concept to deployment, we provide end-to-end development services to bring your digital vision to life with better speed, structure, and reliability.
          </p>
        </section>

        <section className="grid gap-6 sm:gap-8 md:grid-cols-2">
          {services.map((service, index) => (
            <AnimatedDiv key={service.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.05 }}>
              <Card className="group flex h-full flex-col">
                <div className={`mb-4 sm:mb-6 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl border border-white/10 ${service.color} shadow-[var(--shadow-soft)] transition-transform duration-200 group-hover:-translate-y-0.5`}>
                  <service.icon className="text-white size-6 sm:size-7" />
                </div>
                <h3 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-[var(--heading)]">{service.title}</h3>
                <p className="mb-5 text-sm leading-6 text-[var(--muted)] sm:text-base">{service.description}</p>
                <ul className="flex-1 space-y-2.5">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm leading-5 text-[var(--muted-strong)]">
                      <CheckCircle size={14} className="flex-shrink-0 text-primary sm:size-4" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 border-t border-[var(--border-soft)] pt-5">
                  <Button href={`/dev/request?service=${service.id}`} variant="ghost" className="group/btn px-0 font-semibold text-[var(--primary)] hover:bg-transparent touch-target">
                    Get Started
                    <ArrowRight size={14} className="sm:size-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </Card>
            </AnimatedDiv>
          ))}
        </section>

        <section className="gradient-section glass-surface-strong relative overflow-hidden rounded-[28px] px-4 py-8 sm:px-6 sm:py-10 md:px-8 lg:px-12 text-center">
          <div className="spectrum-line absolute inset-x-0 top-0" />
          <div className="relative z-10 space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--heading)] md:text-4xl">Not Sure Where to Start?</h2>
            <p className="mx-auto max-w-2xl text-base sm:text-lg text-[var(--muted)]">We can help you shape the right build path, scope the work, and choose the best delivery approach for your product.</p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <Button href="/dev/contact" variant="secondary" size="large" className="touch-target">Talk to an Expert</Button>
              <Button href="/dev/request" variant="primary" size="large" className="touch-target">Start a Project</Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

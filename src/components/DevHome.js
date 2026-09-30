"use client";

import {
  ArrowRight,
  Check,
  Cloud,
  Code2,
  Gauge,
  Layers3,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const deliverySteps = [
  { label: "Product scope", copy: "Goals, constraints, and a build plan everyone can follow." },
  { label: "Engineering sprint", copy: "Focused implementation with clear checkpoints and working increments." },
  { label: "Launch & iterate", copy: "Ship, measure, improve, and keep the system easy to operate." },
];

const capabilities = [
  {
    icon: Code2,
    title: "Product engineering",
    copy: "Fast, maintainable web products and internal tools built around real workflows.",
    points: ["Next.js and React", "APIs and integrations"],
  },
  {
    icon: Workflow,
    title: "Automation systems",
    copy: "Remove repetitive work with connected processes, dashboards, and operational tooling.",
    points: ["Business workflows", "Admin and reporting"],
  },
  {
    icon: Cloud,
    title: "Cloud-ready delivery",
    copy: "Architecture, payments, data, and deployment foundations designed to scale cleanly.",
    points: ["Cloud infrastructure", "Payments and data"],
  },
];

export default function Home() {
  return (
    <div className="pb-10 md:pb-16">
      <section className="page-section px-4 pb-8 pt-5 sm:px-6 sm:pt-8 md:px-0 md:pb-14">
        <div className="container">
          <div className="grid items-center gap-8 lg:min-h-[680px] lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
            <div className="max-w-3xl">
              <div className="glass-chip-strong mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 sm:px-4 sm:py-2">
                <Sparkles size={15} className="text-primary" />
                <span className="font-code-brand text-[11px] font-bold uppercase tracking-[0.16em] text-primary sm:text-xs">
                  Product engineering for teams that need momentum
                </span>
              </div>

              <h1 className="max-w-3xl text-[clamp(2.7rem,7vw,5.7rem)] font-black leading-[0.98] tracking-[-0.045em] text-[var(--heading)]">
                Build the product.
                <span className="mt-2 block text-primary">Keep the momentum.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">
                DEV Infinity turns product ideas into dependable web apps, dashboards, payment flows, and automations—without the slow handoffs and generic agency process.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button href="/dev/request" variant="primary" size="large" className="w-full sm:w-auto">
                  Start a Project
                  <ArrowRight size={18} />
                </Button>
                <Button href="/dev/services" variant="secondary" size="large" className="w-full sm:w-auto">
                  Explore Services
                </Button>
              </div>

              <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
                {["Clear scope", "Working increments", "Launch-ready systems"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm font-semibold text-[var(--muted)]">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary-soft)] text-primary">
                      <Check size={14} strokeWidth={3} />
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-5 top-12 hidden h-28 w-28 rounded-full bg-[var(--primary)]/10 blur-3xl lg:block" />
              <div className="absolute -right-6 bottom-12 hidden h-36 w-36 rounded-full bg-[var(--accent-cool)]/10 blur-3xl lg:block" />

              <div className="glass-surface-strong relative overflow-hidden rounded-[28px] p-4 sm:p-5 md:p-6">
                <div className="mb-5 flex items-center justify-between gap-4 border-b border-[var(--border-soft)] pb-4">
                  <div>
                    <p className="font-code-brand text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                      Delivery board
                    </p>
                    <h2 className="mt-1 text-xl font-black text-[var(--heading)] sm:text-2xl">
                      From rough idea to working product
                    </h2>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-primary">
                    <Layers3 size={20} />
                  </span>
                </div>

                <div className="space-y-3">
                  {deliverySteps.map((step, index) => (
                    <div
                      key={step.label}
                      className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-muted)]/70 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--surface-strong)] text-xs font-black text-primary shadow-sm">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <h3 className="text-sm font-black text-[var(--heading)] sm:text-base">{step.label}</h3>
                          <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{step.copy}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
                  <MiniMetric icon={Gauge} label="Performance" />
                  <MiniMetric icon={ShieldCheck} label="Reliability" />
                  <MiniMetric icon={Workflow} label="Operations" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 md:px-0 md:py-14">
        <div className="container">
          <div className="mb-8 max-w-3xl md:mb-10">
            <p className="font-code-brand text-xs font-bold uppercase tracking-[0.18em] text-primary">What we build</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-[var(--heading)] sm:text-4xl md:text-5xl">
              Engineering that stays useful after launch.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              Product work should make the business easier to run. We focus on clear interfaces, sensible architecture, and systems your team can keep evolving.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {capabilities.map((capability) => (
              <Card key={capability.title} className="h-full">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-primary">
                  <capability.icon size={23} />
                </div>
                <h3 className="text-xl font-black text-[var(--heading)]">{capability.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)] sm:text-base">{capability.copy}</p>
                <div className="mt-6 space-y-2 border-t border-[var(--border-soft)] pt-5">
                  {capability.points.map((point) => (
                    <div key={point} className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                      <Check size={15} className="text-primary" />
                      {point}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 md:px-0 md:py-12">
        <div className="container">
          <div className="glass-surface-strong overflow-hidden rounded-[28px] p-6 sm:p-8 md:p-10 lg:p-12">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div className="max-w-3xl">
                <p className="font-code-brand text-xs font-bold uppercase tracking-[0.18em] text-primary">Have something to build?</p>
                <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-[var(--heading)] sm:text-4xl">
                  Bring the messy context. We’ll turn it into a build path.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">
                  Share the idea, constraints, existing stack, or even a half-finished brief. We’ll help shape the next practical step.
                </p>
              </div>
              <Button href="/dev/request" variant="primary" size="large" icon={ArrowRight} className="w-full lg:w-auto">
                Start the Brief
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function MiniMetric({ icon: Icon, label }) {
  return (
    <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--surface-strong)] p-3 text-center">
      <Icon size={17} className="mx-auto text-primary" />
      <span className="mt-2 block text-[10px] font-black uppercase tracking-[0.08em] text-[var(--muted)] sm:text-[11px]">
        {label}
      </span>
    </div>
  );
}

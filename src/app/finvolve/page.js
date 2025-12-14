import Link from 'next/link';
import { ArrowRight, Code, Smartphone, Globe, Zap, Cpu, Layers } from 'lucide-react';
import OrbitalAnimation from '@/components/landing/OrbitalAnimation';
import GlassCard from '@/components/ui/GlassCard';
import GradientButton from '@/components/ui/GradientButton';

export default function Home() {
  return (
    <div className="min-h-screen pt-20 overflow-hidden">
      {/* Background Gradients */}
      <div className="deep-space-bg" />

      {/* Hero Section */}
      <section className="relative container mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-12 lg:min-h-[800px]">
        {/* Left Col: Copy */}
        <div className="flex-1 text-center lg:text-left z-10">
          <h1 className="text-5xl lg:text-7xl font-bold font-heading leading-tight mb-6 tracking-tight">
            Build Software <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent animate-pulse-slow">
              That Defies Expectations.
            </span>
          </h1>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            We don't just write code. We build scalable, secure, and intuitive digital ecosystems designed for growth.
            Connect with a team that speaks your language.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link href="/finvolve/request">
              <GradientButton className="text-lg px-10 py-4">
                Start Project <ArrowRight className="inline-block ml-2 w-5 h-5" />
              </GradientButton>
            </Link>
            <Link href="/finvolve/about" className="text-gray-400 hover:text-white transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white">
              Explore Our Process
            </Link>
          </div>

          {/* Tech Stack Ticker (Static for now) */}
          <div className="mt-16 pt-8 border-t border-white/5 flex flex-wrap justify-center lg:justify-start gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="font-mono text-xs tracking-widest text-white/40 uppercase">Powering Next-Gen Apps With</span>
            {/* Add logos here if available, using text for now */}
          </div>
        </div>

        {/* Right Col: Orbit Animation */}
        <div className="flex-1 w-full relative z-0">
          <OrbitalAnimation />
        </div>
      </section>

      {/* Services Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4">Engineering Excellence</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Our expertise spans across the entire digital spectrum, delivering high-fidelity solutions for complex problems.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GlassCard className="group">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Globe className="text-primary" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Web Platforms</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Modern web applications built with <strong>Next.js</strong> and <strong>React</strong>.
              Server-side rendering, edge caching, and SEO-optimized architecture.
            </p>
          </GlassCard>

          <GlassCard className="group">
            <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Smartphone className="text-secondary" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Mobile Ecosystems</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Native Android (Kotlin) and cross-platform solutions.
              Fluid animations, offline-first capabilities, and native hardware integration.
            </p>
          </GlassCard>

          <GlassCard className="group">
            <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Code className="text-accent" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Custom SAAS</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Tailored software solutions solving unique business logic.
              Scalable backend infrastructure suitable for high-concurrency needs.
            </p>
          </GlassCard>

          <GlassCard className="group">
            <div className="w-12 h-12 rounded-lg bg-gold/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap className="text-gold" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Performance Tuning</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Core Web Vitals optimization. We ensure your applications load in milliseconds, not seconds.
            </p>
          </GlassCard>

          <GlassCard className="group">
            <div className="w-12 h-12 rounded-lg bg-teal-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Cpu className="text-teal-400" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">AI Integration</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Leverage LLMs and predictive models to add intelligence to your existing workflows.
            </p>
          </GlassCard>

          <GlassCard className="group">
            <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Layers className="text-indigo-400" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">System Architecture</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Robust microservices and serverless architectures designed for fault tolerance and scale.
            </p>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}

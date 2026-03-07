"use client";

import { motion } from 'framer-motion';
import { Target, Zap, Users, Rocket, CheckCircle, ExternalLink } from 'lucide-react';
import { FaReact, FaNodeJs, FaFigma, FaSwift } from 'react-icons/fa';
import { SiNextdotjs, SiTailwindcss, SiFirebase, SiPostgresql, SiSupabase, SiFlutter, SiKotlin } from 'react-icons/si';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function About() {
  return (
    <div className="min-h-screen py-20 bg-white">
      <div className="container mx-auto px-6">
        
        {/* Hero Section */}
        <section className="mb-24 flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 mb-6">
              <span className="text-primary font-medium text-sm">ABOUT US</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              We Build <span className="text-primary">Digital Products</span> That Scale
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Finvolve is a modern engineering agency obsessed with speed, precision, and reliability. We help businesses ship high-quality products at lightning speed with a friendly, high-energy approach.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href="/finvolve/contact" variant="primary" size="large">
                Get in Touch
              </Button>
              <Button href="/finvolve/services" variant="secondary" size="large">
                View Services
              </Button>
            </div>
          </motion.div>

          {/* Image/Visual */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-cyan-400/20 rounded-3xl transform rotate-3" />
              <div className="relative bg-gradient-to-br from-primary to-purple-600 rounded-3xl p-8 aspect-square flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-7xl font-bold mb-2">50+</div>
                  <div className="text-lg opacity-80">Projects Delivered</div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Mission Section */}
        <section className="mb-24">
          <motion.div
            className="grid lg:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Target className="text-primary" size={24} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                At Finvolve, our mission is to fuel businesses with high-performance technology. We don&apos;t just follow best practices — we create new standards for digital excellence.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Whether it&apos;s a mobile app to keep you connected on the go, or a robust web platform to manage your operations, we have the engineering expertise to deliver exceptional solutions.
              </p>
            </div>

            <Card hover={false} className="bg-gray-50 border-0">
              <div className="grid grid-cols-2 gap-8">
                <Stat number="50+" label="Projects Completed" />
                <Stat number="98%" label="Client Satisfaction" />
                <Stat number="24/7" label="Support Available" />
                <Stat number="∞" label="Scalability" />
              </div>
            </Card>
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 mb-6">
              <span className="text-primary font-medium text-sm">PORTFOLIO</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Work</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">A showcase of our previous work and success stories.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <PortfolioCard
              title="FinTech Dashboard"
              category="Web Application"
              desc="Real-time analytics and transaction monitoring platform processing 10k+ events/sec with advanced visualization and reporting tools."
              tech={["Next.js", "WebSocket", "PostgreSQL"]}
            />
            <PortfolioCard
              title="HealthVote"
              category="Mobile App"
              desc="HIPAA-compliant telemedicine app connecting patients with specialists instantly, featuring video calls and prescription management."
              tech={["React Native", "Node.js", "MongoDB"]}
            />
            <PortfolioCard
              title="Nexus CRM"
              category="SaaS Platform"
              desc="AI-powered customer relationship tool predicting churn and sales opportunities with intelligent lead scoring."
              tech={["Vue.js", "Python", "TensorFlow"]}
            />
            <PortfolioCard
              title="EduLearn Platform"
              category="E-Learning"
              desc="Comprehensive learning management system with live classes, course creation tools, and progress tracking for 50k+ students."
              tech={["Next.js", "AWS", "Redis"]}
            />
            <PortfolioCard
              title="LogiTrack"
              category="Enterprise Software"
              desc="Supply chain management solution with real-time GPS tracking, inventory management, and automated reporting."
              tech={["React", "GraphQL", "Kubernetes"]}
            />
            <PortfolioCard
              title="CryptoWallet"
              category="Web3 Application"
              desc="Secure cryptocurrency wallet with multi-chain support, DeFi integration, and advanced security features."
              tech={ ["React", "Web3.js", "Solidity"]}
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 mb-6">
              <span className="text-primary font-medium text-sm">TECH STACK</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Technologies We Use</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">The modern technologies powering our solutions.</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <TechLogo icon={FaReact} name="React" color="text-cyan-500" />
            <TechLogo icon={SiNextdotjs} name="Next.js" color="text-gray-900" />
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

        {/* Values Section */}
        <section className="mb-24">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 mb-6">
              <span className="text-primary font-medium text-sm">VALUES</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Drives Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">The principles that guide our work and relationships.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <ValueItem
              icon={Zap}
              title="Speed & Efficiency"
              desc="We build fast, and we build things that run fast. Optimization is at our core, ensuring every product performs at its best."
            />
            <ValueItem
              icon={Users}
              title="User Centric"
              desc="We design with the end-user in mind, ensuring intuitive and engaging experiences that solve real problems."
            />
            <ValueItem
              icon={Rocket}
              title="Innovation"
              desc="We constantly explore new technologies to keep your business ahead of the curve and ready for tomorrow."
            />
          </div>
        </section>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Let&apos;s discuss your project and see how we can help bring your vision to life.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/finvolve/request" variant="primary" size="large">
              Start a Project
            </Button>
            <Button href="/finvolve/contact" variant="secondary" size="large">
              Contact Us
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Stat({ number, label }) {
  return (
    <div className="text-center p-4">
      <div className="text-3xl font-bold text-gray-900 mb-1">{number}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

function ValueItem({ icon: Icon, title, desc }) {
  return (
    <Card className="text-center">
      <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-6">
        <Icon className="text-primary" size={28} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{desc}</p>
    </Card>
  );
}

function TechLogo({ icon: Icon, name, color }) {
  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-primary/30 hover:bg-purple-50 transition-all duration-300 cursor-pointer">
      <Icon className={`text-3xl ${color}`} />
      <span className="text-xs text-gray-500 font-medium">{name}</span>
    </div>
  );
}

function PortfolioCard({ title, category, desc, tech }) {
  return (
    <Card className="group cursor-pointer">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-medium text-primary uppercase tracking-wider">{category}</span>
        <ExternalLink size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed mb-4">{desc}</p>
      <div className="flex flex-wrap gap-2">
        {tech.map((t, i) => (
          <span key={i} className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-md">
            {t}
          </span>
        ))}
      </div>
    </Card>
  );
}

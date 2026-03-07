"use client";

import { motion } from "framer-motion";
import { Globe, Smartphone, Cloud, CheckCircle, Zap, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-50 to-transparent opacity-50" />
        
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-8"
            >
              {/* Tagline */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100">
                <span className="text-primary font-medium text-sm">NEXT GEN ENGINEERING</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-gray-900">
                Build <span className="text-primary">Fast.</span><br />
                Scale <span className="text-primary">Faster.</span>
              </h1>

              {/* Subheading */}
              <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                A modern engineering agency helping you ship high-quality products at lightning speed. Friendly, high-energy, and ready to scale your vision.
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button href="/finvolve/request" variant="primary" size="large">
                  Start Project
                </Button>
                <Button href="/finvolve/services" variant="secondary" size="large">
                  View Services
                </Button>
              </div>
            </motion.div>

            {/* Right Content - Visual Element */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              className="relative"
            >
              {/* Gradient Box */}
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-500 to-cyan-400 rounded-3xl transform rotate-3 opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-500 to-cyan-400 rounded-3xl flex items-center justify-center">
                  {/* Decorative stars */}
                  <div className="grid grid-cols-3 gap-8">
                    {[...Array(9)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                        className="w-4 h-4 text-white"
                      >
                        ✦
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Speed Stats Box */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-card flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="text-green-600" size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">SPEED INCREASE</div>
                    <div className="text-xl font-bold text-gray-900">400% Faster</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Expertise
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We specialize in cutting-edge technologies to bring your digital products to life with unmatched performance and scalability.
            </p>
          </motion.div>

          {/* Service Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            <Card delay={0.1}>
              <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center mb-6">
                <Globe className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Web Development</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Custom frontend and backend solutions optimized for high performance.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <Zap size={16} className="text-primary" />
                  React & Next.js Experts
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <Zap size={16} className="text-primary" />
                  Core Web Vitals Optimization
                </li>
              </ul>
            </Card>

            <Card delay={0.2}>
              <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center mb-6">
                <Smartphone className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Mobile Apps</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Native and cross-platform mobile experiences that users love.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <Zap size={16} className="text-primary" />
                  iOS & Android Development
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <Zap size={16} className="text-primary" />
                  Smooth Fluid Animations
                </li>
              </ul>
            </Card>

            <Card delay={0.3}>
              <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center mb-6">
                <Cloud className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">SaaS Architecture</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Scalable cloud infrastructure designed for millions of users.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <Zap size={16} className="text-primary" />
                  AWS & Azure Solutions
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <Zap size={16} className="text-primary" />
                  Microservices Design
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary via-purple-600 to-primary p-12 md:p-20 text-center"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Ready on the Grid?
              </h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                Let&apos;s ignite your next project with our expert engineering team. We are ready to shift your development into high gear.
              </p>
              <Button 
                href="/finvolve/request" 
                variant="secondary" 
                size="large"
                icon={ArrowRight}
                className="mt-4"
              >
                Start Engine
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { 
  Globe, 
  Smartphone, 
  Brain, 
  Cloud, 
  Code, 
  Database, 
  Shield, 
  Palette,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const services = [
  {
    id: "web-app",
    icon: Globe,
    title: "Web App Development",
    description: "Build powerful, responsive web applications that scale. From single-page applications to complex enterprise platforms, we deliver high-performance solutions.",
    features: [
      "React & Next.js Development",
      "Progressive Web Apps (PWA)",
      "E-commerce Solutions",
      "Real-time Applications",
      "API Development & Integration"
    ],
    color: "from-purple-500 to-blue-500"
  },
  {
    id: "mobile-app",
    icon: Smartphone,
    title: "Mobile App Development",
    description: "Native and cross-platform mobile applications that users love. Beautiful interfaces with smooth animations and offline capabilities.",
    features: [
      "iOS & Android Native Apps",
      "React Native Cross-Platform",
      "Flutter Development",
      "App Store Optimization",
      "Push Notifications & Analytics"
    ],
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "ai",
    icon: Brain,
    title: "AI Solutions",
    description: "Leverage the power of artificial intelligence to automate processes, gain insights, and create intelligent applications.",
    features: [
      "Machine Learning Models",
      "Natural Language Processing",
      "Computer Vision",
      "Predictive Analytics",
      "AI Chatbots & Assistants"
    ],
    color: "from-cyan-500 to-teal-500"
  },
  {
    id: "saas",
    icon: Cloud,
    title: "Custom SaaS Development",
    description: "Build scalable Software-as-a-Service platforms designed for millions of users. Multi-tenant architecture with enterprise-grade security.",
    features: [
      "Multi-tenant Architecture",
      "Subscription Management",
      "User Authentication & RBAC",
      "Cloud Infrastructure",
      "Automated Scaling"
    ],
    color: "from-teal-500 to-green-500"
  },
  {
    id: "custom-software",
    icon: Code,
    title: "Custom Software",
    description: "Tailored software solutions for your unique business needs. From internal tools to complex automation systems.",
    features: [
      "Business Process Automation",
      "Internal Tools & Dashboards",
      "Legacy System Modernization",
      "Third-party Integrations",
      "Custom CRM & ERP Solutions"
    ],
    color: "from-green-500 to-emerald-500"
  },
  {
    id: "database",
    icon: Database,
    title: "Database & Backend",
    description: "Robust backend systems and database architecture. Secure, scalable, and optimized for performance.",
    features: [
      "Database Design & Optimization",
      "RESTful & GraphQL APIs",
      "Microservices Architecture",
      "Real-time Data Processing",
      "Cloud Database Management"
    ],
    color: "from-emerald-500 to-yellow-500"
  },
  {
    id: "security",
    icon: Shield,
    title: "Security & Compliance",
    description: "Enterprise-grade security solutions to protect your applications and data. Meet industry compliance standards.",
    features: [
      "Security Audits & Testing",
      "OWASP Compliance",
      "Data Encryption",
      "Access Control Systems",
      "GDPR & HIPAA Compliance"
    ],
    color: "from-yellow-500 to-orange-500"
  },
  {
    id: "design",
    icon: Palette,
    title: "UI/UX Design",
    description: "User-centered design that converts. Create intuitive, beautiful interfaces that your users will love.",
    features: [
      "User Research & Testing",
      "Wireframing & Prototyping",
      "Visual Design Systems",
      "Responsive Design",
      "Design-to-Development Handoff"
    ],
    color: "from-orange-500 to-pink-500"
  }
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 mb-6">
            <span className="text-primary font-medium text-sm">OUR SERVICES</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Solutions That <span className="text-primary">Scale</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From concept to deployment, we provide end-to-end development services 
            to bring your digital vision to life. Our expert team delivers 
            high-quality solutions tailored to your needs.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full group">
                {/* Icon with gradient */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="text-white" size={28} />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>

                {/* Features list */}
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle size={16} className="text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <Button 
                    href={`/finvolve/request?service=${service.id}`} 
                    variant="ghost" 
                    className="group/btn p-0 hover:bg-transparent"
                  >
                    Get Started
                    <ArrowRight size={16} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary via-purple-600 to-primary p-12 md:p-16 text-center"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Not Sure Where to Start?
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Let us help you find the right solution for your business. 
              Our team will analyze your requirements and provide a tailored proposal.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                href="/finvolve/contact" 
                variant="secondary" 
                size="large"
              >
                Talk to an Expert
              </Button>
              <Button 
                href="/finvolve/request" 
                variant="secondary" 
                size="large"
                className="bg-white/10 border-white text-white hover:bg-white/20"
              >
                Start a Project
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

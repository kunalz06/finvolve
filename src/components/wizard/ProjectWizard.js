"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle, Smartphone, Globe, Code, Cpu, User, Mail, Loader2, AlertCircle, Zap } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 'idea', title: 'Project Type', subtitle: 'What are you building?' },
  { id: 'scope', title: 'Timeline', subtitle: 'When do you need it?' },
  { id: 'budget', title: 'Budget', subtitle: 'What is your budget range?' },
  { id: 'contact', title: 'Contact', subtitle: 'How do we reach you?' },
];

const PROJECT_TYPES = [
  { id: 'web', label: 'Web Platform', icon: Globe, desc: 'SaaS, E-commerce, Marketing' },
  { id: 'mobile', label: 'Mobile App', icon: Smartphone, desc: 'iOS, Android, Cross-platform' },
  { id: 'custom', label: 'Custom Software', icon: Code, desc: 'Internal tools, Automation' },
  { id: 'ai', label: 'AI Solution', icon: Cpu, desc: 'LLMs, Predictive Models' },
];

const BUDGET_RANGES = [
  { id: 'starter', label: '< $5k', desc: 'MVP / Prototype' },
  { id: 'standard', label: '$5k - $20k', desc: 'Full Production Build' },
  { id: 'premium', label: '$20k - $50k', desc: 'Enterprise Scale' },
  { id: 'custom', label: '$50k+', desc: 'Complex Ecosystem' },
];

export default function ProjectWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [formData, setFormData] = useState({
    projectType: '',
    timeline: 4,
    budget: '',
    name: '',
    email: '',
    description: ''
  });
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  };

  const updateData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setStatus('loading');
    setErrorMessage('');
    try {
      if (!db) throw new Error("Firebase not initialized");

      await addDoc(collection(db, "requests"), {
        ...formData,
        createdAt: serverTimestamp(),
        status: 'new',
        wizardSubmission: true
      });
      setStatus('success');
    } catch (error) {
      console.error("Submission error:", error);
      setStatus('error');
      setErrorMessage(error.message || "Failed to submit request.");
    }
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  if (status === 'success') {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle className="text-green-600 w-12 h-12" />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Message Received!</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Thank you for reaching out. We&apos;re already reviewing your concept and will respond within 24 hours.
        </p>
        <Button onClick={() => window.location.reload()} variant="primary">
          Start New Project
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Quick Start Banner */}
      <Card hover={false} className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-100">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Zap size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Need it Fast?</h3>
              <p className="text-sm text-gray-600">Skip the queue with our priority Quick Start service.</p>
            </div>
          </div>
          <Link
            href="/finvolve/quick-start"
            className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-hover transition-colors whitespace-nowrap"
          >
            Quick Start - ₹99
          </Link>
        </div>
      </Card>

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 mb-6">
          <Zap size={16} className="text-primary" />
          <span className="text-primary font-medium text-sm">PROJECT WIZARD</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Start Your Project</h1>
        <p className="text-gray-600 max-w-lg mx-auto">Tell us about your project and we&apos;ll get back to you with a tailored proposal.</p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-12 relative px-4">
        <div className="absolute top-4 left-0 w-full h-1 bg-gray-200 -z-10" />
        <motion.div
          className="absolute top-4 left-0 h-1 bg-primary -z-10 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: currentStep / (STEPS.length - 1) }}
          transition={{ duration: 0.5 }}
        />

        {STEPS.map((step, i) => (
          <div key={step.id} className="flex flex-col items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors duration-300",
              i <= currentStep ? "border-primary bg-primary text-white" : "border-gray-300 text-gray-400 bg-white"
            )}>
              {i + 1}
            </div>
            <span className="text-xs font-medium hidden sm:block text-gray-500">{step.title}</span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card hover={false} className="min-h-[400px] relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            className="w-full"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{STEPS[currentStep].title}</h2>
            <p className="text-gray-600 mb-8">{STEPS[currentStep].subtitle}</p>

            {/* Step 1: Idea */}
            {currentStep === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PROJECT_TYPES.map((type) => (
                  <div
                    key={type.id}
                    className={cn(
                      "p-6 rounded-xl border-2 cursor-pointer transition-all group",
                      formData.projectType === type.label 
                        ? "border-primary bg-purple-50" 
                        : "border-gray-200 hover:border-primary/50"
                    )}
                    onClick={() => updateData('projectType', type.label)}
                  >
                    <type.icon className={cn(
                      "mb-4 w-8 h-8",
                      formData.projectType === type.label ? "text-primary" : "text-gray-400 group-hover:text-primary"
                    )} />
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{type.label}</h3>
                    <p className="text-sm text-gray-500">{type.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Step 2: Scope */}
            {currentStep === 1 && (
              <div className="py-6">
                <label className="block text-base font-medium text-gray-700 mb-4">
                  Timeline Estimate: <span className="text-primary font-bold">{formData.timeline} Weeks</span>
                </label>
                <div className="relative pt-6 pb-2">
                  <div className="relative w-full h-4 bg-gray-200 rounded-full">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-purple-600 rounded-full"
                      style={{ width: `${((formData.timeline - 2) / 22) * 100}%` }}
                    />
                    <input
                      type="range"
                      min="2"
                      max="24"
                      step="2"
                      value={formData.timeline}
                      onChange={(e) => updateData('timeline', parseInt(e.target.value))}
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg pointer-events-none flex items-center justify-center text-xs font-bold text-gray-900"
                      style={{
                        left: `calc(${((formData.timeline - 2) / 22) * 100}% - 12px)`
                      }}
                    >
                      {formData.timeline}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>2 Weeks</span>
                  <span>12 Weeks</span>
                  <span>24 Weeks</span>
                </div>

                <div className="mt-8">
                  <label className="block text-base font-medium text-gray-700 mb-2">Brief Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateData('description', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all h-32 resize-none"
                    placeholder="Describe the core features..."
                  />
                </div>
              </div>
            )}

            {/* Step 3: Budget */}
            {currentStep === 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BUDGET_RANGES.map((range) => (
                  <div
                    key={range.id}
                    className={cn(
                      "p-6 rounded-xl border-2 cursor-pointer transition-all",
                      formData.budget === range.label 
                        ? "border-primary bg-purple-50" 
                        : "border-gray-200 hover:border-primary/50"
                    )}
                    onClick={() => updateData('budget', range.label)}
                  >
                    <div className="text-2xl font-bold text-gray-900 mb-1">{range.label}</div>
                    <p className="text-sm text-gray-500">{range.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Step 4: Contact */}
            {currentStep === 3 && (
              <div className="space-y-6 max-w-md mx-auto">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => updateData('name', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-6 text-gray-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => updateData('email', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-6 text-gray-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>
                <div className="text-sm text-gray-500 text-center">
                  We respect your privacy. No spam, ever.
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center mt-8 pt-8 border-t border-gray-200 gap-4">
        <button
          onClick={handleBack}
          className={cn(
            "flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium",
            currentStep === 0 && "opacity-0 pointer-events-none"
          )}
        >
          <ArrowLeft size={20} /> Back
        </button>

        {currentStep === STEPS.length - 1 ? (
          <Button
            onClick={handleSubmit}
            variant="primary"
            disabled={status === 'loading'}
            className={cn(status === 'loading' && "opacity-70 cursor-not-allowed")}
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="animate-spin" size={18} /> Submitting...
              </>
            ) : (
              <>
                Launch Request <ArrowRight size={18} />
              </>
            )}
          </Button>
        ) : (
          <Button onClick={handleNext} variant="primary">
            Next Step <ArrowRight size={18} />
          </Button>
        )}
      </div>

      {status === 'error' && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
          <AlertCircle size={20} />
          {errorMessage}
        </div>
      )}
    </div>
  );
}

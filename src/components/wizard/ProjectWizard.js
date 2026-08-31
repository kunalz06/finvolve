"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle, Smartphone, Globe, Code, Cpu, User, Mail, Loader2, AlertCircle, Zap } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { apiUrl } from '@/lib/api';

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
  { id: 'starter', label: '< \u20B95k', desc: 'MVP / Prototype' },
  { id: 'standard', label: '\u20B95k - \u20B920k', desc: 'Full Production Build' },
  { id: 'premium', label: '\u20B920k - \u20B950k', desc: 'Enterprise Scale' },
  { id: 'custom', label: '\u20B950k+', desc: 'Complex Ecosystem' },
];

export default function ProjectWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [timelineTouched, setTimelineTouched] = useState(false);
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
  const [showSuccessBurst, setShowSuccessBurst] = useState(false);

  useEffect(() => {
    if (status !== 'success') return undefined;
    setShowSuccessBurst(true);
    const timeout = window.setTimeout(() => setShowSuccessBurst(false), 1400);
    return () => window.clearTimeout(timeout);
  }, [status]);

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

    const description = formData.description.trim();
    if (!timelineTouched || !description) {
      setDirection(-1);
      setCurrentStep(1);
      setStatus('error');
      setErrorMessage('Please choose a timespan and add a brief description before submitting.');
      return;
    }

    if (description.length < 10) {
      setDirection(-1);
      setCurrentStep(1);
      setStatus('error');
      setErrorMessage('Please add a little more detail to the project description before submitting.');
      return;
    }

    if (!formData.projectType || !formData.budget || !formData.name.trim() || !formData.email.trim()) {
      setStatus('error');
      setErrorMessage('Please complete the project type, budget, name, and email before submitting.');
      return;
    }

    try {
      const response = await fetch(apiUrl('/dev/api/project-request'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          description,
          timeline: Number(formData.timeline),
        }),
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.error || "Failed to submit request.");
      }
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
      opacity: 1,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 1,
    }),
  };

  if (status === 'success') {
    return (
      <>
        <AnimatePresence>
          {showSuccessBurst && (
            <motion.div
              className="fixed inset-0 z-[80] flex items-center justify-center bg-emerald-950/35 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              aria-hidden="true"
            >
              <motion.div
                className="flex h-36 w-36 items-center justify-center rounded-full border-[10px] border-emerald-400 bg-[var(--surface-strong)] shadow-[0_0_0_18px_rgba(16,185,129,0.18)] md:h-44 md:w-44"
                initial={{ scale: 0.35, rotate: -10 }}
                animate={{ scale: [0.35, 1.12, 1], rotate: 0 }}
                exit={{ scale: 0.82, opacity: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              >
                <CheckCircle className="h-20 w-20 text-emerald-600 md:h-24 md:w-24" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="glass-surface-strong mx-auto max-w-2xl rounded-2xl px-8 py-16 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border-4 border-emerald-500 bg-emerald-500/15"
          >
            <CheckCircle className="h-12 w-12 text-emerald-600" />
          </motion.div>
          <h2 className="mb-4 text-3xl font-bold text-slate-950">Message Received!</h2>
          <p className="mx-auto mb-8 max-w-md text-lg text-slate-600">
            Thank you for reaching out. We&apos;re already reviewing your concept and will respond within 24 hours.
          </p>
          <Button onClick={() => window.location.reload()} variant="primary">
            Start New Project
          </Button>
        </div>
      </>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Quick Start Banner */}
      <Card hover={false} className="glass-surface-strong mb-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="glass-icon-plate flex h-10 w-10 items-center justify-center rounded-full">
              <Zap size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-slate-950">Need it Fast?</h3>
              <p className="text-sm text-slate-600">Skip the queue with our priority Quick Start service.</p>
            </div>
          </div>
          <Link
            href="/dev/quick-start"
              className="inline-flex whitespace-nowrap rounded-xl border-2 border-[var(--border)] bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5"
          >
            Quick Start - INR 99
          </Link>
        </div>
      </Card>

      {/* Header */}
      <div className="mb-12 text-center">
        <div className="glass-chip-strong mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2">
          <Zap size={16} className="text-primary" />
          <span className="text-sm font-medium text-primary">PROJECT WIZARD</span>
        </div>
        <h1 className="mb-4 text-3xl font-bold text-slate-950 md:text-4xl">Start Your Project</h1>
        <p className="mx-auto max-w-lg text-slate-600">Tell us about your project and we&apos;ll get back to you with a tailored proposal.</p>
      </div>

      <div className="relative mb-12 flex items-center justify-between px-4">
        <div className="glass-track absolute left-0 top-4 -z-10 h-1 w-full rounded-full" />
        <motion.div
          className="absolute left-0 top-4 -z-10 h-1 origin-left rounded-full bg-[var(--primary)]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: currentStep / (STEPS.length - 1) }}
          transition={{ duration: 0.5 }}
        />

        {STEPS.map((step, i) => (
          <div key={step.id} className="flex flex-col items-center gap-2">
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-bold transition-colors duration-300",
              i <= currentStep ? "border-[var(--border)] bg-[var(--primary)] text-white shadow-[var(--shadow-soft)]" : "glass-chip text-slate-500"
            )}>
              {i + 1}
            </div>
            <span className="hidden text-xs font-medium text-slate-500 sm:block">{step.title}</span>
          </div>
        ))}
      </div>

      <Card hover={false} className="glass-surface-strong relative min-h-[400px] overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial={false}
            animate="center"
            exit="exit"
            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            className="w-full"
          >
            <h2 className="mb-2 text-2xl font-bold text-slate-950">{STEPS[currentStep].title}</h2>
            <p className="mb-8 text-slate-600">{STEPS[currentStep].subtitle}</p>

            {/* Step 1: Idea */}
            {currentStep === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PROJECT_TYPES.map((type) => (
                  <div
                    key={type.id}
                    className={cn(
                      "group cursor-pointer rounded-[24px] border p-6 transition-all",
                      formData.projectType === type.label 
                        ? "border-primary/40 bg-white/78 shadow-[0_24px_60px_rgba(103,88,255,0.16)]" 
                        : "glass-chip hover:border-primary/35 hover:bg-white/72"
                    )}
                    onClick={() => updateData('projectType', type.label)}
                  >
                    <type.icon className={cn(
                      "mb-4 w-8 h-8",
                       formData.projectType === type.label ? "text-primary" : "text-slate-400 group-hover:text-primary"
                     )} />
                    <h3 className="mb-1 text-lg font-bold text-slate-950">{type.label}</h3>
                    <p className="text-sm text-slate-500">{type.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Step 2: Scope */}
            {currentStep === 1 && (
              <div className="py-6">
                <label className="mb-4 block text-base font-medium text-slate-700">
                  Timeline Estimate: <span className="text-primary font-bold">{formData.timeline} Weeks</span>
                </label>
                <div className="relative pt-6 pb-2">
                  <div className="glass-track relative h-4 w-full rounded-full">
                    <div
                      className="absolute top-0 left-0 h-full rounded-full bg-[var(--primary)]"
                      style={{ width: `${((formData.timeline - 2) / 22) * 100}%` }}
                    />
                    <input
                      type="range"
                      min="2"
                      max="24"
                      step="2"
                      value={formData.timeline}
                      onChange={(e) => {
                        setTimelineTouched(true);
                        updateData('timeline', parseInt(e.target.value));
                      }}
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div
                      className="pointer-events-none absolute top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-900 shadow-lg"
                      style={{
                        left: `calc(${((formData.timeline - 2) / 22) * 100}% - 12px)`
                      }}
                    >
                      {formData.timeline}
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex justify-between text-xs text-slate-500">
                  <span>2 Weeks</span>
                  <span>12 Weeks</span>
                  <span>24 Weeks</span>
                </div>

                <div className="mt-8">
                  <label className="mb-2 block text-base font-medium text-slate-700">Brief Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateData('description', e.target.value)}
                    className="h-32 w-full rounded-[22px] p-4 text-slate-900 resize-none"
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
                      "cursor-pointer rounded-[24px] border p-6 transition-all",
                      formData.budget === range.label 
                        ? "border-primary/40 bg-white/78 shadow-[0_24px_60px_rgba(103,88,255,0.16)]" 
                        : "glass-chip hover:border-primary/35 hover:bg-white/72"
                    )}
                    onClick={() => updateData('budget', range.label)}
                  >
                    <div className="mb-1 text-2xl font-bold text-slate-950">{range.label}</div>
                    <p className="text-sm text-slate-500">{range.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Step 4: Contact */}
            {currentStep === 3 && (
              <div className="space-y-6 max-w-md mx-auto">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => updateData('name', e.target.value)}
                    required
                    className="w-full rounded-[22px] py-3 pl-12 pr-6 text-slate-900"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => updateData('email', e.target.value)}
                    required
                    className="w-full rounded-[22px] py-3 pl-12 pr-6 text-slate-900"
                  />
                </div>
                <div className="text-center text-sm text-slate-500">
                  We respect your privacy. No spam, ever.
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </Card>

      {/* Navigation Buttons */}
      <div className="mt-8 flex flex-col-reverse items-center justify-between gap-4 border-t border-[var(--border-soft)] pt-8 sm:flex-row">
        <Button
          onClick={handleBack}
          variant="ghost"
          className={cn(
            "font-medium text-slate-600 hover:!text-primary",
            currentStep === 0 && "opacity-0 pointer-events-none"
          )}
        >
          <ArrowLeft size={20} /> Back
        </Button>

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
        <div className="mt-4 flex items-center gap-2 rounded-[22px] border border-red-500/40 bg-red-500/10 p-4 text-red-400">
          <AlertCircle size={20} />
          {errorMessage}
        </div>
      )}
    </div>
  );
}

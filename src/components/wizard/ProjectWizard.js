"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle, Smartphone, Globe, Code, Cpu, Calendar, DollarSign, User, Mail, Send, Loader2, AlertCircle } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import GlassCard from '@/components/ui/GlassCard';
import GradientButton from '@/components/ui/GradientButton';
import { cn } from '@/lib/utils';

const STEPS = [
    { id: 'idea', title: 'The Idea', subtitle: 'What are we building?' },
    { id: 'scope', title: 'The Scope', subtitle: 'What is your timeline?' },
    { id: 'budget', title: 'The Budget', subtitle: 'Ballpark figures help us plan.' },
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
        timeline: 4, // weeks
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
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
        }),
    };

    if (status === 'success') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6"
                >
                    <CheckCircle className="text-green-500 w-12 h-12" />
                </motion.div>
                <h2 className="text-3xl font-heading font-bold mb-4">Message Received!</h2>
                <p className="text-gray-400 mb-8 max-w-md">
                    Our team is already reviewing your concept. expect a response within 24 hours.
                </p>
                <GradientButton onClick={() => window.location.reload()}>
                    Start New Project
                </GradientButton>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="flex items-center justify-between mb-12 relative px-4">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -z-10" />
                <motion.div
                    className="absolute top-1/2 left-0 h-1 bg-primary -z-10 origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: currentStep / (STEPS.length - 1) }}
                    transition={{ duration: 0.5 }}
                />

                {STEPS.map((step, i) => (
                    <div key={step.id} className="flex flex-col items-center gap-2 bg-black/50 backdrop-blur-md p-2 rounded-lg">
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors duration-300",
                            i <= currentStep ? "border-primary bg-primary text-white" : "border-white/20 text-gray-500"
                        )}>
                            {i + 1}
                        </div>
                        <span className="text-xs font-mono uppercase hidden sm:block text-gray-400">{step.title}</span>
                    </div>
                ))}
            </div>

            {/* Step Content */}
            <div className="min-h-[400px] relative overflow-hidden">
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
                        <h2 className="text-4xl font-heading font-bold mb-2">{STEPS[currentStep].title}</h2>
                        <p className="text-xl text-gray-400 mb-8">{STEPS[currentStep].subtitle}</p>

                        {/* Step 1: Idea */}
                        {currentStep === 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {PROJECT_TYPES.map((type) => (
                                    <GlassCard
                                        key={type.id}
                                        className={cn(
                                            "cursor-pointer hover:border-primary transition-colors group",
                                            formData.projectType === type.label ? "border-primary bg-primary/10" : ""
                                        )}
                                        onClick={() => updateData('projectType', type.label)}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <type.icon className={cn("mb-4 w-8 h-8", formData.projectType === type.label ? "text-primary" : "text-gray-400 group-hover:text-white")} />
                                        <h3 className="text-lg font-bold mb-1">{type.label}</h3>
                                        <p className="text-sm text-gray-500">{type.desc}</p>
                                    </GlassCard>
                                ))}
                            </div>
                        )}

                        {/* Step 2: Scope */}
                        {currentStep === 1 && (
                            <div className="py-10">
                                <label className="block text-lg mb-4">Timeline Estimate: <span className="text-primary font-bold">{formData.timeline} Weeks</span></label>
                                <input
                                    type="range"
                                    min="2"
                                    max="24"
                                    step="2"
                                    value={formData.timeline}
                                    onChange={(e) => updateData('timeline', parseInt(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary/80"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono uppercase">
                                    <span>2 Weeks (Rush)</span>
                                    <span>24 Weeks (Long-term)</span>
                                </div>

                                <div className="mt-8">
                                    <label className="block text-lg mb-2">Brief Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => updateData('description', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary transition-colors h-32"
                                        placeholder="Describe the core features..."
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 3: Budget */}
                        {currentStep === 2 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {BUDGET_RANGES.map((range) => (
                                    <GlassCard
                                        key={range.id}
                                        className={cn(
                                            "cursor-pointer hover:border-primary transition-colors group",
                                            formData.budget === range.label ? "border-primary bg-primary/10" : ""
                                        )}
                                        onClick={() => updateData('budget', range.label)}
                                    >
                                        <div className="text-2xl font-bold mb-1">{range.label}</div>
                                        <p className="text-sm text-gray-500">{range.desc}</p>
                                    </GlassCard>
                                ))}
                            </div>
                        )}

                        {/* Step 4: Contact */}
                        {currentStep === 3 && (
                            <div className="space-y-6 max-w-md mx-auto">
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={(e) => updateData('name', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 text-white focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        value={formData.email}
                                        onChange={(e) => updateData('email', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 text-white focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>
                                <div className="text-sm text-gray-500 text-center">
                                    We respect your privacy. No spam, ever.
                                </div>
                            </div>
                        )}

                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-between items-center mt-12 pt-8 border-t border-white/10 gap-4">
                <button
                    onClick={handleBack}
                    className={cn(
                        "flex items-center gap-2 text-gray-400 hover:text-white transition-colors",
                        currentStep === 0 && "opacity-0 pointer-events-none"
                    )}
                >
                    <ArrowLeft size={20} /> Back
                </button>

                {currentStep === STEPS.length - 1 ? (
                    <GradientButton
                        onClick={handleSubmit}
                        disabled={status === 'loading'}
                        className={cn("px-12", status === 'loading' && "opacity-70 cursor-not-allowed")}
                    >
                        {status === 'loading' ? <Loader2 className="animate-spin" /> : "Launch Request"}
                    </GradientButton>
                ) : (
                    <button
                        onClick={handleNext}
                        className="flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all"
                    >
                        Next Step <ArrowRight size={20} />
                    </button>
                )}
            </div>

            {status === 'error' && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400">
                    <AlertCircle size={20} />
                    {errorMessage}
                </div>
            )}
        </div>
    );
}

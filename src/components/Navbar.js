"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import GradientButton from './ui/GradientButton';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <motion.nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
                scrolled ? "bg-black/50 backdrop-blur-xl border-white/5 py-4" : "bg-transparent py-6"
            )}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Link href="/finvolve" className="text-2xl font-heading font-bold tracking-tighter hover:text-primary transition-colors">
                    Finvolve
                </Link>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-white" onClick={toggleMenu} aria-label="Toggle menu">
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {['Home', 'About', 'Contact', 'Quick Start'].map((item) => (
                        <Link
                            key={item}
                            href={`/finvolve/${item === 'Home' ? '' : item.toLowerCase().replace(' ', '-')}`}
                            className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
                        >
                            {item}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                        </Link>
                    ))}
                    <Link href="/finvolve/request">
                        <GradientButton className="px-6 py-2 text-sm">Start Project</GradientButton>
                    </Link>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-black/90 backdrop-blur-xl border-t border-white/10"
                    >
                        <div className="flex flex-col p-6 gap-4">
                            {['Home', 'About', 'Contact', 'Quick Start'].map((item) => (
                                <Link
                                    key={item}
                                    href={`/finvolve/${item === 'Home' ? '' : item.toLowerCase().replace(' ', '-')}`}
                                    className="text-lg font-medium text-gray-300 hover:text-primary"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item}
                                </Link>
                            ))}
                            <Link href="/finvolve/request" onClick={() => setIsOpen(false)}>
                                <GradientButton className="w-full">Start Project</GradientButton>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}

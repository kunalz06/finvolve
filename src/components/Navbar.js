"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, Activity } from "lucide-react";
import RaceButton from "@/components/ui/RaceButton";

const navLinks = [
    { name: "Services", href: "/finvolve" },
    { name: "About", href: "/finvolve/about" },
    { name: "Contact", href: "/finvolve/contact" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? "bg-black/90 backdrop-blur-md border-primary/50 py-3" : "bg-transparent border-transparent py-5"
                }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo Area - Telemetry Style */}
                <Link href="/finvolve" className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10 bg-primary skew-x-[-12deg] flex items-center justify-center border border-white/20 group-hover:bg-white transition-colors duration-300">
                        <Activity className="text-white skew-x-[12deg] group-hover:text-primary" size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold font-heading italic tracking-tighter uppercase leading-none">
                            Finvolve
                        </span>
                        <span className="text-[10px] font-mono text-primary tracking-[0.3em] uppercase opacity-80">
                            Racing Systems
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav - Pit Wall Monitors */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="relative text-sm font-mono uppercase tracking-widest text-gray-400 hover:text-white transition-colors group py-2"
                        >
                            {link.name}
                            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-300 ease-out" />
                        </Link>
                    ))}
                    <RaceButton href="/finvolve/request" variant="primary" className="ml-4 text-xs px-6 py-2">
                        Start Engine
                    </RaceButton>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-white hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 w-full bg-black border-b border-primary/30 p-6 md:hidden flex flex-col gap-4 shadow-2xl"
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-4 text-lg font-heading italic text-gray-300 hover:text-primary border-l-2 border-transparent hover:border-primary pl-4 transition-all"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <RaceButton href="/finvolve/request" className="w-full text-center mt-4">
                        Initialize
                    </RaceButton>
                </motion.div>
            )}
        </nav>
    );
}

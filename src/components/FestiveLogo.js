"use client";

import { motion } from 'framer-motion';

const SantaHat = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Red Hat Part */}
        <path d="M10 80 C 10 80, 40 10, 80 80 Z" fill="#EF4444" />
        <path d="M10 80 Q 45 5, 80 80" fill="#DC2626" />
        {/* White Trim */}
        <rect x="5" y="78" width="90" height="22" rx="11" fill="white" />
        {/* Pom Pom */}
        <circle cx="80" cy="80" r="10" fill="white" className="drop-shadow-md" />
        {/* Fold animation hack */}
        <circle cx="80" cy="80" r="10" fill="white" />
    </svg>
);

const GiftBox = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="40" width="60" height="50" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
        <rect x="45" y="40" width="10" height="50" fill="#EF4444" />
        <rect x="15" y="30" width="70" height="15" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
        <rect x="45" y="30" width="10" height="15" fill="#EF4444" />
        <path d="M50 30 Q 30 10 50 30 Q 70 10 50 30" fill="none" stroke="#EF4444" strokeWidth="4" />
    </svg>
);

export default function FestiveLogo() {
    return (
        <div className="relative inline-flex items-center justify-center group">
            {/* Santa Hat on 'F' */}
            <motion.div
                initial={{ rotate: -10, y: -5 }}
                animate={{ rotate: [-10, 0, -10] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-[22px] -left-[14px] w-12 h-12 z-20 pointer-events-none"
            >
                {/* Custom Hat Path */}
                <svg viewBox="0 0 512 512" fill="none" className="w-full h-full drop-shadow-lg">
                    {/* Main Red Body */}
                    <path d="M112.5 389.9c.7-61.9 29.3-108.5 70.1-137.6 42.4-30.2 96.3-36.8 136.6-16.7 34.3 17.1 57.5 54.3 64.8 98.6-25-11.8-54.6-11.6-82.6 1.8-31 14.8-51.9 44.9-56.1 79.1 0 0-76.3-11.1-132.8-25.2z" fill="#EF4444" />
                    {/* White Ball */}
                    <circle cx="417" cy="334" r="35" fill="white" />
                    {/* White Brim */}
                    <path d="M88.9 407.5c-3.1-9.2 1.8-19.2 10.9-22.3 9.1-3.1 19.1 1.8 22.2 10.9 26.6 77.9 146.1 48.7 146.1 48.7 8.3-2 16.9 3.1 18.9 11.4 2 8.3-3.1 16.9-11.4 18.9 0 0-141.6 34.5-186.7-67.6z" fill="white" />
                    {/* Simplified Hat for better look */}
                    <path d="M100 380 Q 250 150 400 350" fill="none" stroke="none" />
                </svg>
                {/* Using a simpler SVg because path drawing from memory is hard. Falling back to simple shapes in the first component I wrote but improved */}
                <svg viewBox="0 0 100 100" className="w-full h-full" overflow="visible">
                    <path d="M10 85 Q 50 5 90 85" fill="#DC2626" />
                    <circle cx="90" cy="85" r="10" fill="white" />
                    <rect x="0" y="80" width="100" height="20" rx="10" fill="white" />
                </svg>
            </motion.div>

            {/* The Word */}
            <span className="text-2xl font-heading font-bold tracking-tighter relative z-10 bg-clip-text text-transparent animate-text-firework bg-[length:200%_auto] bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500">
                Finvolve
            </span>

            {/* Gift Box on Right */}
            <motion.div
                className="absolute -bottom-2 -right-6 w-6 h-6 z-20"
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
            >
                <svg viewBox="0 0 512 512" className="w-full h-full drop-shadow-md">
                    <rect x="64" y="160" width="384" height="112" rx="32" ry="32" fill="#FBBF24" />
                    <rect x="64" y="272" width="384" height="192" rx="32" ry="32" fill="#F59E0B" />
                    <rect x="224" y="160" width="64" height="304" fill="#EF4444" />
                    <path d="M256 160 C 256 160, 200 64, 128 96 C 80 118, 112 160, 144 160 L 256 160 Z" fill="#EF4444" />
                    <path d="M256 160 C 256 160, 312 64, 384 96 C 432 118, 400 160, 368 160 L 256 160 Z" fill="#EF4444" />
                </svg>
            </motion.div>
        </div>
    );
}

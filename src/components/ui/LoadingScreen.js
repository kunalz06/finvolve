"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate a "Race Start" delay
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3500); // 3.5 seconds for the full "lights out" sequence

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -200, scale: 1.1 }}
                    transition={{ duration: 0.8, ease: "circIn" }}
                    className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden"
                >
                    {/* Race Start Lights */}
                    <div className="flex gap-4 mb-12 bg-gray-900 p-6 rounded-lg border-2 border-gray-800 shadow-2xl">
                        {[0, 1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex flex-col gap-2">
                                <motion.div
                                    initial={{ backgroundColor: "#333" }}
                                    animate={{ backgroundColor: "#FF1801" }}
                                    transition={{ delay: i * 0.5, duration: 0.1 }}
                                    className="w-12 h-12 rounded-full border-4 border-gray-800 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"
                                    suppressHydrationWarning
                                />
                                <motion.div
                                    initial={{ backgroundColor: "#333" }}
                                    animate={{ backgroundColor: "#FF1801" }}
                                    transition={{ delay: i * 0.5, duration: 0.1 }}
                                    className="w-12 h-12 rounded-full border-4 border-gray-800 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"
                                    suppressHydrationWarning
                                />
                            </div>
                        ))}
                    </div>

                    {/* F1 Car Animation (CSS Abstract) */}
                    <div className="relative">
                        <motion.div
                            initial={{ x: "-100vw" }}
                            animate={{ x: "100vw" }}
                            transition={{ duration: 1.5, delay: 2.5, ease: "easeIn" }}
                            className="w-64 h-12 bg-primary skew-x-[-20deg] relative blur-sm"
                        >
                            <div className="absolute top-0 right-0 w-16 h-full bg-white/20 skew-x-[20deg]" />
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-white font-mono text-xl mt-8 tracking-[0.5em] uppercase text-center"
                        >
                            Initialising Telemetry...
                        </motion.h2>
                    </div>

                </motion.div>
            )}
        </AnimatePresence>
    );
}

"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function GlassCard({ children, className, ...props }) {
    return (
        <motion.div
            className={cn(
                "relative backdrop-blur-2xl bg-glass border border-glass-border rounded-2xl p-8 overflow-hidden transition-all duration-300",
                "shadow-[0_4px_30px_rgba(0,0,0,0.1)]",
                "hover:shadow-[0_10px_40px_-10px_rgba(139,92,246,0.3)] hover:border-glass-highlight hover:bg-[rgba(255,255,255,0.05)]",
                "before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
                className
            )}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            whileHover={{ y: -5 }}
            {...props}
        >
            {children}
        </motion.div>
    );
}

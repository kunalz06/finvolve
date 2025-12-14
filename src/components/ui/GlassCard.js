"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function GlassCard({ children, className, ...props }) {
    return (
        <motion.div
            className={cn(
                "relative backdrop-blur-xl bg-glass border border-glass-border rounded-2xl p-6 overflow-hidden shadow-lg",
                "before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none",
                className
            )}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(99, 102, 241, 0.3)" }}
            {...props}
        >
            {children}
        </motion.div>
    );
}

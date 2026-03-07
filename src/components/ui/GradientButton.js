"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function GradientButton({ children, className, onClick, ...props }) {
    return (
        <motion.button
            className={cn(
                "relative px-8 py-3 rounded-lg font-semibold text-white overflow-hidden group",
                "bg-gradient-primary shadow-button",
                className
            )}
            whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(139, 92, 246, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            {...props}
        >
            <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
        </motion.button>
    );
}

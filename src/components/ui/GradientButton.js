"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function GradientButton({ children, className, onClick, ...props }) {
    return (
        <motion.button
            className={cn(
                "relative px-8 py-3 rounded-full font-semibold text-white overflow-hidden group",
                "bg-gradient-to-r from-primary to-secondary shadow-[0_0_15px_rgba(99,102,241,0.5)]",
                className
            )}
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(99, 102, 241, 0.8)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            {...props}
        >
            <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
        </motion.button>
    );
}

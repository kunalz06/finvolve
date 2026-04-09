"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function GlassCard({ children, className, ...props }) {
    return (
        <motion.div
            className={cn(
                "glass-surface relative rounded-[28px] p-6",
                "hover:-translate-y-1.5 hover:border-white/85 transition-all duration-300",
                className
            )}
            initial={false}
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

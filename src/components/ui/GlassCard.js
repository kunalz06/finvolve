"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function GlassCard({ children, className, ...props }) {
    return (
        <motion.div
            className={cn(
                "relative bg-white border border-gray-200 rounded-xl p-6",
                "hover:shadow-card-hover hover:border-primary/30 transition-all duration-300",
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

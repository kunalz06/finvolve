"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Card({
    children,
    className = "",
    delay = 0,
    hover = true,
    ...props
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay }}
            viewport={{ once: true }}
            className={cn(
                "relative bg-white border border-gray-200 rounded-xl p-6",
                hover && "hover:shadow-card-hover hover:border-primary/30 transition-all duration-300",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}

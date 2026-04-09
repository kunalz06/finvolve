"use client";

import { motion } from "framer-motion";

export default function Card({ 
  children, 
  className = "", 
  delay = 0,
  hover = true,
  ...props 
}) {
  return (
    <motion.div
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`glass-surface rounded-[28px] p-8 ${hover ? 'hover:-translate-y-1.5 hover:border-white/85 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_24px_60px_rgba(27,38,68,0.18)]' : ''} transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

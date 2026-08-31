"use client";

import { motion } from "framer-motion";

export default function GlassCard({ children, className = "", hoverEffect = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`glass-surface rounded-xl p-4 backdrop-blur-md ${hoverEffect ? 'hover:shadow-lg transition-all duration-300' : ''} ${className}`}
      whileHover={hoverEffect ? { scale: 1.02, y: -2 } : {}}
    >
      {children}
    </motion.div>
  );
}

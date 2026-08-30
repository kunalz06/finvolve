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
      className={`glass-surface rounded-2xl p-8 ${hover ? 'hover:-translate-x-0.5 hover:-translate-y-0.5' : ''} transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

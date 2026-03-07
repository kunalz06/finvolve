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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`bg-white rounded-2xl p-8 border border-gray-100 ${hover ? 'hover:shadow-card-hover hover:-translate-y-1' : ''} transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

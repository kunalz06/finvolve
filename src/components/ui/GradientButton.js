"use client";

import { motion } from "framer-motion";
import { forwardRef } from "react";

export const GradientButton = forwardRef(({ children, className = "", ...props }, ref) => {
  return (
    <motion.button
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={`relative overflow-hidden rounded-full px-6 py-3 text-sm font-semibold text-white transition-all duration-300 ${className}`}
      whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0,0,0,0.2)" }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </motion.button>
  );
});

GradientButton.displayName = "GradientButton";

export default GradientButton;

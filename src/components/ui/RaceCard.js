"use client";

import { motion } from "framer-motion";

export default function RaceCard({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`glass-surface rounded-xl p-4 backdrop-blur-md ${className}`}
      whileHover={{ scale: 1.02, y: -2, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
    >
      {children}
    </motion.div>
  );
}

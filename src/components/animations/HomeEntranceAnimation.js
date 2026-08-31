"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function HomeEntranceAnimation({ className = "" }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation when component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* House Structure */}
      <div className="relative">
        {/* House Base */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          {/* House Walls */}
          <div className="w-64 h-40 bg-[var(--surface-strong)] border-2 border-[var(--border)] rounded-t-2xl relative overflow-hidden shadow-[var(--shadow)]" />
          
          {/* Roof */}
          <div className="absolute -top-8 left-0 right-0 h-16 bg-[var(--red-primary)] border-b-2 border-l-2 border-r-2 border-[var(--border)]" style={{ clipPath: "polygon(0 100%, 50% 0, 100% 100%)" }} />
          
          {/* Door */}
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-20 bg-[var(--red-secondary)] border-2 border-[var(--border)] rounded-t-xl"
            initial={{ y: 0 }}
            animate={{ y: isVisible ? -10 : 0 }}
            transition={{ duration: 1.2, ease: "easeInOut", delay: 1.5 }}
          >
            {/* Door Handle */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[var(--surface)] border border-[var(--border)]" />
          </motion.div>
          
          {/* Window */}
          <div className="absolute top-8 left-8 w-12 h-12 bg-[var(--surface-muted)] border-2 border-[var(--border)] rounded-xl">
            <div className="absolute inset-2 grid grid-cols-2 gap-1">
              <div className="bg-[var(--border)]" />
              <div className="bg-[var(--border)]" />
              <div className="bg-[var(--border)]" />
              <div className="bg-[var(--border)]" />
            </div>
          </div>
          
          {/* Chimney */}
          <div className="absolute -top-4 right-8 w-6 h-12 bg-[var(--red-primary)] border-2 border-[var(--border)] rounded-t-sm" />
        </motion.div>

        {/* Person - initially hidden behind the house */}
        <motion.div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2"
          initial={{ x: -100, y: 0, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
        >
          {/* Person Body */}
          <div className="relative">
            {/* Head */}
            <motion.div
              className="w-8 h-8 rounded-full bg-[var(--red-primary)] border-2 border-[var(--border)] relative z-10"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: 2 }}
            >
              {/* Eyes */}
              <div className="absolute top-2 left-2 w-1 h-1 rounded-full bg-[var(--surface)]" />
              <div className="absolute top-2 right-2 w-1 h-1 rounded-full bg-[var(--surface)]" />
              {/* Smile */}
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-1.5 border-b-2 border-[var(--surface)] rounded-full" />
            </motion.div>
            
            {/* Body */}
            <motion.div
              className="w-10 h-14 bg-[var(--red-light)] border-2 border-[var(--border)] rounded-b-xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {/* Arms */}
              <motion.div
                className="absolute -left-6 top-4 w-8 h-2 bg-[var(--red-light)] border-2 border-[var(--border)] rounded-full origin-left"
                animate={{ rotate: [0, -15, 0, 15, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 2 }}
              />
              <motion.div
                className="absolute -right-6 top-4 w-8 h-2 bg-[var(--red-light)] border-2 border-[var(--border)] rounded-full origin-right"
                animate={{ rotate: [0, 15, 0, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 2 }}
              />
            </motion.div>
            
            {/* Legs */}
            <motion.div
              className="flex justify-center gap-1 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <motion.div
                className="w-3 h-8 bg-[var(--surface-strong)] border-2 border-[var(--border)] rounded-full"
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: 2 }}
                style={{ origin: "top center" }}
              />
              <motion.div
                className="w-3 h-8 bg-[var(--surface-strong)] border-2 border-[var(--border)] rounded-full"
                animate={{ rotate: [0, -5, 0, 5, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: 2 }}
                style={{ origin: "top center" }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Welcoming Smoke from Chimney */}
        {isVisible && (
          <>
            <motion.div
              className="absolute -top-8 right-6 w-4 h-8 bg-[var(--red-soft)] rounded-full opacity-60"
              initial={{ scale: 0, y: 0 }}
              animate={{ scale: [0.5, 1, 0.8, 0], y: [-20, -30, -40, -50], opacity: [1, 0.8, 0.4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 2.5 }}
            />
            <motion.div
              className="absolute -top-12 right-4 w-5 h-10 bg-[var(--red-soft)] rounded-full opacity-40"
              initial={{ scale: 0, y: 0 }}
              animate={{ scale: [0.3, 0.8, 0.5, 0], y: [-30, -45, -60, -75], opacity: [1, 0.6, 0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 3 }}
            />
          </>
        )}

        {/* Ground */}
        <div className="w-80 h-4 bg-[var(--surface-muted)] border-t-2 border-[var(--border)] rounded-b-xl mt-2" />
      </div>
    </div>
  );
}

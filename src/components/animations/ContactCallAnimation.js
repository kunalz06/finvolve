"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ContactCallAnimation({ className = "" }) {
  const [isRinging, setIsRinging] = useState(false);
  const [isTalking, setIsTalking] = useState(false);

  useEffect(() => {
    // Start ringing animation
    const ringTimer = setTimeout(() => {
      setIsRinging(true);
    }, 500);

    // Switch to talking after ringing
    const talkTimer = setTimeout(() => {
      setIsRinging(false);
      setIsTalking(true);
    }, 2500);

    return () => {
      clearTimeout(ringTimer);
      clearTimeout(talkTimer);
    };
  }, []);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="relative">
        {/* Telephone Base */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          {/* Telephone Body */}
          <div className="w-48 h-32 bg-[var(--surface-strong)] border-2 border-[var(--border)] rounded-2xl shadow-[var(--shadow)] relative overflow-hidden">
            
            {/* Receiver */}
            <motion.div
              className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-[var(--surface-strong)] border-2 border-[var(--border)] rounded-full"
              initial={{ x: 0, y: 0 }}
              animate={isRinging ? { x: [0, 5, 0, -5, 0], y: [0, -2, 0, 2, 0] } : { x: 0, y: 0 }}
              transition={{ duration: 0.3, repeat: Infinity }}
            >
              {/* Receiver Grill */}
              <div className="absolute inset-1 grid grid-cols-8 gap-0.5">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-[var(--border)] rounded-sm" />
                ))}
              </div>
              {/* Earpiece */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-[var(--surface-muted)] border-2 border-[var(--border)] rounded-full" />
            </motion.div>

            {/* Dial Pad */}
            <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((num, i) => (
                <div key={i} className="w-8 h-8 bg-[var(--surface-muted)] border border-[var(--border-soft)] rounded-full flex items-center justify-center text-[10px] font-bold text-[var(--foreground)]">
                  {num}
                </div>
              ))}
            </div>

            {/* Number Display */}
            <div className="absolute top-8 left-4 right-4 h-6 bg-[var(--red-primary)] border-2 border-[var(--border)] rounded-lg flex items-center justify-center">
              <motion.span
                className="text-xs font-bold text-[var(--surface)]"
                initial={{ opacity: 0 }}
                animate={isRinging ? { opacity: [0.5, 1, 0.5] } : { opacity: 1 }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                CALLING...
              </motion.span>
            </div>

            {/* Mouthpiece */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-4 bg-[var(--red-secondary)] border-2 border-[var(--border)] rounded-full" />
          </div>

          {/* Handset Cord */}
          <motion.div
            className="absolute -top-8 left-1/2 -translate-x-1/4 w-2 h-16 bg-[var(--border)] rounded-full origin-top"
            initial={{ rotate: 0 }}
            animate={isRinging ? { rotate: [0, 10, 0, -10, 0] } : { rotate: 0 }}
            transition={{ duration: 0.4, repeat: Infinity }}
            style={{ transformOrigin: "top center" }}
          />

          {/* Base Cord */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1 h-8 bg-[var(--border)] rounded-full" />
        </motion.div>

        {/* Person Talking on Phone */}
        <motion.div
          className="absolute -right-32 top-0"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
        >
          {/* Person Body */}
          <div className="relative">
            {/* Head with Phone */}
            <motion.div
              className="w-10 h-10 rounded-full bg-[var(--red-primary)] border-2 border-[var(--border)] relative"
              animate={isTalking ? { y: [0, -2, 0] } : { y: 0 }}
              transition={{ duration: 0.4, repeat: Infinity, delay: 3.5 }}
            >
              {/* Eyes */}
              <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-[var(--surface)]" />
              <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[var(--surface)]" />
              {/* Mouth - talking animation */}
              <motion.div
                className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-2 border-b-2 border-[var(--surface)] rounded-full"
                animate={isTalking ? { scaleY: [1, 0.5, 1, 0.8, 1] } : { scaleY: 1 }}
                transition={{ duration: 0.3, repeat: Infinity, delay: 3.5 }}
                style={{ origin: "center bottom" }}
              />
            </motion.div>

            {/* Body */}
            <motion.div
              className="w-12 h-20 bg-[var(--red-light)] border-2 border-[var(--border)] rounded-b-xl mt-2"
              animate={isTalking ? { x: [0, 2, 0, -2, 0] } : { x: 0 }}
              transition={{ duration: 2, repeat: Infinity, delay: 3.5 }}
            >
              {/* Arm holding phone */}
              <motion.div
                className="absolute -right-8 top-6 w-12 h-3 bg-[var(--red-light)] border-2 border-[var(--border)] rounded-full origin-right"
                animate={isTalking ? { rotate: [0, -5, 0, 5, 0] } : { rotate: 0 }}
                transition={{ duration: 1, repeat: Infinity, delay: 3.5 }}
                style={{ transformOrigin: "right center" }}
              >
                {/* Hand */}
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[var(--surface-strong)] border border-[var(--border)]" />
              </motion.div>
            </motion.div>

            {/* Legs */}
            <motion.div
              className="flex justify-center gap-1 mt-1"
              animate={isTalking ? { y: [0, 1, 0, -1, 0] } : { y: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 3.5 }}
            >
              <div className="w-3 h-10 bg-[var(--surface-strong)] border-2 border-[var(--border)] rounded-full" />
              <div className="w-3 h-10 bg-[var(--surface-strong)] border-2 border-[var(--border)] rounded-full" />
            </motion.div>
          </div>
        </motion.div>

        {/* Call Bubbles */}
        <motion.div
          className="absolute -top-8 -left-8"
          initial={{ scale: 0, opacity: 0 }}
          animate={isTalking ? { scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] } : { scale: 0, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 4 }}
        >
          <div className="relative">
            <div className="w-16 h-10 bg-[var(--red-soft)] border-2 border-[var(--border)] rounded-2xl" />
            <div className="absolute -bottom-2 left-2 w-4 h-4 bg-[var(--red-soft)] border-2 border-b-transparent border-l-2 border-r-2 border-[var(--border)] rounded-bl-xl" />
          </div>
        </motion.div>

        <motion.div
          className="absolute -top-12 -right-16"
          initial={{ scale: 0, opacity: 0 }}
          animate={isTalking ? { scale: [0.6, 1, 0.6], opacity: [0.3, 0.8, 0.3] } : { scale: 0, opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity, delay: 4.5 }}
        >
          <div className="relative">
            <div className="w-12 h-8 bg-[var(--red-soft)] border-2 border-[var(--border)] rounded-2xl opacity-80" />
            <div className="absolute -bottom-2 right-2 w-3 h-3 bg-[var(--red-soft)] border-2 border-b-transparent border-l-2 border-r-2 border-[var(--border)] rounded-br-xl opacity-80" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function ContactCallAnimation({ className = "", onClose }) {
  const [isRinging, setIsRinging] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    const ringTimer = setTimeout(() => {
      setIsRinging(true);
    }, 500);

    const talkTimer = setTimeout(() => {
      setIsRinging(false);
      setIsTalking(true);
    }, 2500);

    return () => {
      clearTimeout(ringTimer);
      clearTimeout(talkTimer);
    };
  }, []);

  const handleClose = () => {
    setShowOverlay(false);
    if (onClose) onClose();
  };

  if (!showOverlay) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm ${className}`}>
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-strong)] border-2 border-[var(--border)] shadow-lg hover:bg-[var(--surface-muted)] transition-colors"
        aria-label="Close animation"
      >
        <X size={20} className="text-[var(--foreground)]" />
      </button>

      <div className="relative w-full max-w-3xl px-4">
        {/* Table/Desk surface */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-[var(--surface-muted)] border-2 border-[var(--border)] rounded-2xl" />

        <div className="relative flex items-end justify-center h-96">
          {/* Vintage Telephone */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            {/* Telephone Base */}
            <div className="w-64 h-48 bg-[var(--surface-strong)] border-2 border-[var(--border)] rounded-2xl shadow-2xl relative overflow-hidden" />
            
            {/* Receiver Cradle */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-40 h-12 bg-[var(--surface-muted)] border-2 border-[var(--border)] rounded-t-2xl">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-[var(--surface-strong)] border-2 border-b-0 border-l-2 border-r-2 border-[var(--border)] rounded-b-2xl">
                {/* Cradle Rest */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-16 h-2 bg-[var(--red-primary)] border border-[var(--border)] rounded-full" />
              </div>
            </div>

            {/* Receiver - on hook initially, then lifted */}
            <motion.div
              className="absolute -top-8 left-1/2 -translate-x-1/2"
              initial={{ x: 0, y: 0, rotate: 0 }}
              animate={isRinging ? { x: [0, 5, 0, -5, 0], y: [0, -3, 0, 3, 0], rotate: [0, 5, 0, -5, 0] } : 
                         isTalking ? { x: 12, y: -20, rotate: -15 } : { x: 0, y: 0, rotate: 0 }}
              transition={{ duration: isRinging ? 0.3 : 0.8, repeat: isRinging ? Infinity : 0, ease: "easeInOut" }}
              style={{ transformOrigin: "left center" }}
            >
              <div className="w-32 h-10 bg-[var(--surface-strong)] border-2 border-[var(--border)] rounded-full shadow-xl">
                {/* Receiver Grill */}
                <div className="absolute inset-1 grid grid-cols-8 gap-0.5">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-[var(--border)] rounded-sm" />
                  ))}
                </div>
                {/* Earpiece */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-[var(--surface-muted)] border-2 border-[var(--border)] rounded-full" />
              </div>
              {/* Cord */}
              <motion.div
                className="absolute -left-32 top-2 w-32 h-1 bg-[var(--border)] rounded-full origin-right"
                initial={{ opacity: 0 }}
                animate={isTalking ? { opacity: 1, pathLength: 1 } : { opacity: isRinging ? 0.7 : 0 }}
                transition={{ duration: 0.5 }}
                style={{ transformOrigin: "right center" }}
              />
            </motion.div>

            {/* Dial Pad */}
            <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-3">
              {[
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9],
                ["*", 0, "#"]
              ].flat().map((num, i) => (
                <div 
                  key={i} 
                  className="w-10 h-10 bg-[var(--surface-muted)] border border-[var(--border-soft)] rounded-full flex items-center justify-center text-sm font-bold text-[var(--foreground)] hover:bg-[var(--surface-strong)] transition-colors"
                >
                  {num}
                </div>
              ))}
            </div>

            {/* Number Display */}
            <div className="absolute top-12 left-6 right-6 h-8 bg-[var(--red-primary)] border-2 border-[var(--border)] rounded-xl flex items-center justify-center px-4">
              <motion.span
                className="text-sm font-bold text-[var(--surface)]"
                initial={{ opacity: 0 }}
                animate={isRinging ? { opacity: [0.5, 1, 0.5] } : { opacity: 1 }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                {isTalking ? "CALLING..." : isRinging ? "RINGING" : "READY"}
              </motion.span>
            </div>

            {/* Mouthpiece */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-6 bg-[var(--red-secondary)] border-2 border-[var(--border)] rounded-full" />
            
            {/* Branding */}
            <div className="absolute bottom-4 left-2 text-[8px] font-bold text-[var(--muted)] rotate-90 origin-center">
              DEV
            </div>

            {/* Base Cord */}
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-1.5 h-24 bg-[var(--border)] rounded-full" />
          </motion.div>

          {/* Person Talking on Phone */}
          <motion.div
            className="absolute -right-40 top-8"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
          >
            {/* Person Body */}
            <div className="relative">
              {/* Head with Phone */}
              <motion.div
                className="relative w-14 h-14 rounded-full bg-[var(--red-primary)] border-2 border-[var(--border)] shadow-lg"
                animate={isTalking ? { y: [0, -2, 0] } : { y: 0 }}
                transition={{ duration: 0.4, repeat: Infinity, delay: 3.5 }}
              >
                {/* Hair */}
                <div className="absolute -top-4 left-0 right-0 h-5 bg-[var(--red-dark)] rounded-t-full border-2 border-b-0 border-[var(--border)]" />
                {/* Face */}
                <div className="absolute top-4 left-3 w-2.5 h-2.5 rounded-full bg-[var(--surface)]" />
                <div className="absolute top-4 right-3 w-2.5 h-2.5 rounded-full bg-[var(--surface)]" />
                {/* Mouth - talking animation */}
                <motion.div
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 w-6 h-3 border-b-2 border-[var(--surface)] rounded-full"
                  animate={isTalking ? { scaleY: [1, 0.4, 1, 0.7, 1], height: [12, 8, 12, 10, 12] } : { scaleY: 1 }}
                  transition={{ duration: 0.3, repeat: Infinity, delay: 3.5 }}
                  style={{ origin: "center bottom", width: 24 }}
                />
                {/* Eye brows */}
                <div className="absolute top-2 left-2.5 w-4 h-1 bg-[var(--red-dark)] rounded-full" style={{ borderRadius: "4px 4px 0 0" }} />
                <div className="absolute top-2 right-2.5 w-4 h-1 bg-[var(--red-dark)] rounded-full" style={{ borderRadius: "4px 4px 0 0" }} />
              </motion.div>

              {/* Neck */}
              <div className="w-4 h-4 bg-[var(--red-light)] border-2 border-t-0 border-[var(--border)] mx-auto" />
              
              {/* Body - Shirt */}
              <motion.div
                className="w-16 h-24 bg-[var(--red-light)] border-2 border-[var(--border)] rounded-b-2xl mx-auto relative shadow-md"
                animate={isTalking ? { x: [0, 2, 0, -2, 0] } : { x: 0 }}
                transition={{ duration: 2, repeat: Infinity, delay: 3.5 }}
              >
                {/* Shirt Pocket */}
                <div className="absolute top-4 left-2 w-5 h-5 bg-[var(--red-primary)] border border-[var(--border)] rounded-sm" />
                
                {/* Arm holding phone - More realistic */}
                <motion.div
                  className="absolute -right-14 top-8"
                  animate={isTalking ? { rotate: [-10, -15, -10, -20, -10] } : { rotate: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 3.5 }}
                  style={{ transformOrigin: "right center" }}
                >
                  <div className="w-16 h-4 bg-[var(--red-light)] border-2 border-[var(--border)] rounded-full origin-right" />
                  <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[var(--surface-strong)] border border-[var(--border)]" />
                </motion.div>
              </motion.div>

              {/* Belt */}
              <div className="w-16 h-1.5 bg-[var(--border)] border border-[var(--border)] mx-auto" />
              
              {/* Pants */}
              <motion.div
                className="flex justify-center gap-1 mt-1"
                animate={isTalking ? { y: [0, 1, 0, -1, 0] } : { y: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 3.5 }}
              >
                <div className="w-6 h-16 bg-[var(--surface-strong)] border-2 border-[var(--border)] rounded-full" />
                <div className="w-6 h-16 bg-[var(--surface-strong)] border-2 border-[var(--border)] rounded-full" />
              </motion.div>
              
              {/* Shoes */}
              <div className="flex justify-center gap-2">
                <div className="w-8 h-5 bg-[var(--border)] border-2 border-t-0 border-[var(--border)] rounded-t-full" />
                <div className="w-8 h-5 bg-[var(--border)] border-2 border-t-0 border-[var(--border)] rounded-t-full" />
              </div>
            </div>
          </motion.div>

          {/* Call Bubbles */}
          <motion.div
            className="absolute -top-12 left-8"
            initial={{ scale: 0, opacity: 0 }}
            animate={isTalking ? { scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] } : { scale: 0, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 4 }}
          >
            <div className="relative">
              <div className="w-20 h-14 bg-[var(--red-soft)] border-2 border-[var(--border)] rounded-2xl" />
              <div className="absolute -bottom-3 left-3 w-5 h-5 bg-[var(--red-soft)] border-2 border-b-transparent border-l-2 border-r-2 border-[var(--border)] rounded-bl-2xl" />
            </div>
          </motion.div>

          <motion.div
            className="absolute -top-20 right-12"
            initial={{ scale: 0, opacity: 0 }}
            animate={isTalking ? { scale: [0.6, 1, 0.6], opacity: [0.3, 0.8, 0.3] } : { scale: 0, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, delay: 4.5 }}
          >
            <div className="relative">
              <div className="w-16 h-10 bg-[var(--red-soft)] border-2 border-[var(--border)] rounded-2xl opacity-80" />
              <div className="absolute -bottom-3 right-3 w-4 h-4 bg-[var(--red-soft)] border-2 border-b-transparent border-l-2 border-r-2 border-[var(--border)] rounded-br-2xl opacity-80" />
            </div>
          </motion.div>

          <motion.div
            className="absolute -top-16 left-1/2 -translate-x-1/2"
            initial={{ scale: 0, opacity: 0 }}
            animate={isTalking ? { scale: [0.5, 0.9, 0.5], opacity: [0.2, 0.6, 0.2] } : { scale: 0, opacity: 0 }}
            transition={{ duration: 1.8, repeat: Infinity, delay: 5 }}
          >
            <div className="relative">
              <div className="w-12 h-8 bg-[var(--red-soft)] border-2 border-[var(--border)] rounded-2xl opacity-60" />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-[var(--red-soft)] border-2 border-b-transparent border-l-2 border-r-2 border-[var(--border)] rounded-b-2xl opacity-60" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

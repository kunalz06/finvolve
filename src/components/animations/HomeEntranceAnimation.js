"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function HomeEntranceAnimation({ className = "", onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);
    return () => clearTimeout(timer);
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

      <div className="relative w-full max-w-2xl px-4">
        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-[var(--surface-muted)] border-t-2 border-[var(--border)] rounded-t-2xl" />

        {/* House Structure */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative mx-auto"
        >
          {/* House Base */}
          <div className="relative w-72 h-56 bg-[var(--surface-strong)] border-2 border-[var(--border)] rounded-t-2xl shadow-2xl overflow-hidden" />
          
          {/* Roof */}
          <div className="absolute -top-10 left-0 right-0 h-20 bg-[var(--red-primary)] border-b-2 border-l-2 border-r-2 border-[var(--border)]" 
               style={{ clipPath: "polygon(0 100%, 50% 0, 100% 100%)" }} />
          
          {/* Roof Shingles */}
          <div className="absolute -top-10 left-0 right-0 h-20 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-full h-3 bg-[var(--red-secondary)] opacity-20"
                style={{ top: i * 10 + 2, left: i % 2 === 0 ? 0 : 4 }}
              />
            ))}
          </div>
          
          {/* Chimney */}
          <div className="absolute -top-6 right-10 w-8 h-20 bg-[var(--red-dark)] border-2 border-[var(--border)] rounded-t-sm">
            <div className="absolute -top-2 right-1 w-6 h-4 bg-[var(--red-light)] border-2 border-b-0 border-[var(--border)]" />
          </div>
          
          {/* Door */}
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-28 bg-[var(--red-secondary)] border-2 border-[var(--border)] rounded-t-xl shadow-inner"
            initial={{ y: 0 }}
            animate={{ y: isVisible ? -14 : 0 }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 1.8 }}
          >
            <div className="absolute inset-2 bg-[var(--red-primary)] rounded-sm" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-3 h-3 rounded-full bg-[var(--surface)] border border-[var(--border)] shadow" />
              <div className="w-1 h-2 bg-[var(--border)]" style={{ marginLeft: 6 }} />
            </div>
          </motion.div>
          
          {/* Windows */}
          <div className="absolute top-12 left-10 w-14 h-14 bg-[var(--surface-muted)] border-2 border-[var(--border)] rounded-xl">
            <div className="absolute inset-2 grid grid-cols-2 gap-1">
              <div className="bg-[var(--border)] rounded-sm" />
              <div className="bg-[var(--border)] rounded-sm" />
              <div className="bg-[var(--border)] rounded-sm" />
              <div className="bg-[var(--border)] rounded-sm" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-0.5 bg-[var(--border)]" />
              <div className="absolute left-1/2 w-0.5 h-full bg-[var(--border)] -translate-x-1/2" />
            </div>
          </div>
          
          <div className="absolute top-12 right-10 w-14 h-14 bg-[var(--surface-muted)] border-2 border-[var(--border)] rounded-xl">
            <div className="absolute inset-2 grid grid-cols-2 gap-1">
              <div className="bg-[var(--border)] rounded-sm" />
              <div className="bg-[var(--border)] rounded-sm" />
              <div className="bg-[var(--border)] rounded-sm" />
              <div className="bg-[var(--border)] rounded-sm" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-0.5 bg-[var(--border)]" />
              <div className="absolute left-1/2 w-0.5 h-full bg-[var(--border)] -translate-x-1/2" />
            </div>
          </div>
          
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-4 bg-[var(--surface-muted)] border-t-2 border-l-2 border-r-2 border-[var(--border)] rounded-t-sm" />
        </motion.div>

        {/* Person */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ x: -150, y: 0, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.8 }}
        >
          <div className="relative">
            {/* Head */}
            <motion.div
              className="relative w-12 h-12 rounded-full bg-[var(--red-primary)] border-2 border-[var(--border)] shadow-lg z-10"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 3 }}
            >
              <div className="absolute -top-3 left-0 right-0 h-4 bg-[var(--red-dark)] rounded-t-full border-2 border-b-0 border-[var(--border)]" />
              <div className="absolute top-3 left-2 w-2 h-2 rounded-full bg-[var(--surface)]" />
              <div className="absolute top-3 right-2 w-2 h-2 rounded-full bg-[var(--surface)]" />
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-5 h-2 border-b-2 border-[var(--surface)] rounded-full" />
            </motion.div>
            
            <div className="w-4 h-3 bg-[var(--red-light)] border-2 border-t-0 border-[var(--border)] mx-auto" />
            
            <motion.div
              className="w-16 h-20 bg-[var(--red-light)] border-2 border-[var(--border)] rounded-b-xl mx-auto relative shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <div className="absolute top-4 left-2 w-4 h-4 bg-[var(--red-primary)] border border-[var(--border)] rounded-sm" />
              <div className="absolute top-5 left-2.5 w-2 h-0.5 bg-[var(--border)] rounded-full" />
              
              <motion.div
                className="absolute -left-10 top-6 w-12 h-3 bg-[var(--red-light)] border-2 border-[var(--border)] rounded-full origin-left"
                animate={{ rotate: [0, -20, 0, 15, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 3 }}
              >
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[var(--red-primary)] border border-[var(--border)] rounded-full" />
              </motion.div>
              
              <motion.div
                className="absolute -right-10 top-6 w-12 h-3 bg-[var(--red-light)] border-2 border-[var(--border)] rounded-full origin-right"
                animate={{ rotate: [0, 20, 0, -15, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 3 }}
              >
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[var(--red-primary)] border border-[var(--border)] rounded-full" />
              </motion.div>
            </motion.div>
            
            <div className="w-16 h-1.5 bg-[var(--border)] border border-[var(--border)] mx-auto" />
            
            <motion.div
              className="flex justify-center gap-1 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              <motion.div
                className="w-5 h-14 bg-[var(--surface-strong)] border-2 border-[var(--border)] rounded-full"
                animate={{ rotate: [0, 8, 0, -8, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 3 }}
                style={{ origin: "top center" }}
              />
              <motion.div
                className="w-5 h-14 bg-[var(--surface-strong)] border-2 border-[var(--border)] rounded-full"
                animate={{ rotate: [0, -8, 0, 8, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 3 }}
                style={{ origin: "top center" }}
              />
            </motion.div>
            
            <div className="flex justify-center gap-2">
              <div className="w-6 h-4 bg-[var(--border)] border-2 border-t-0 border-[var(--border)] rounded-t-full" />
              <div className="w-6 h-4 bg-[var(--border)] border-2 border-t-0 border-[var(--border)] rounded-t-full" />
            </div>
          </div>
        </motion.div>

        {/* Smoke from Chimney */}
        {isVisible && (
          <>
            <motion.div
              className="absolute -top-8 right-14 w-6 h-12 bg-[var(--red-soft)]/60 rounded-full opacity-80"
              initial={{ scale: 0, y: 0 }}
              animate={{ scale: [0.3, 0.8, 0.5, 0], y: [-20, -35, -50, -65], opacity: [1, 0.8, 0.4, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 3 }}
            />
            <motion.div
              className="absolute -top-16 right-12 w-8 h-16 bg-[var(--red-soft)]/40 rounded-full opacity-60"
              initial={{ scale: 0, y: 0 }}
              animate={{ scale: [0.2, 0.6, 0.4, 0], y: [-30, -50, -75, -95], opacity: [1, 0.6, 0.3, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 3.5 }}
            />
            <motion.div
              className="absolute -top-24 right-8 w-5 h-10 bg-[var(--red-soft)]/30 rounded-full opacity-50"
              initial={{ scale: 0, y: 0 }}
              animate={{ scale: [0.1, 0.4, 0.3, 0], y: [-40, -65, -85, -105], opacity: [1, 0.5, 0.2, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 4 }}
            />
          </>
        )}
      </div>
    </div>
  );
}

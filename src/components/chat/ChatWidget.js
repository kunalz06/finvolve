"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ChatWindow from "./ChatWindow";

const STORAGE_KEY = "dev_chat_minimized";
const TOOLTIP_KEY = "dev_chat_tooltip_seen";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [mounted, setMounted] = useState(false);
  const tooltipTimerRef = useRef(null);

  // Ensure framer-motion animations only run client-side
  useEffect(() => {
    setMounted(true);
    setIsMinimized(sessionStorage.getItem(STORAGE_KEY) === "true");
    setShowTooltip(!sessionStorage.getItem(TOOLTIP_KEY));
  }, []);

  // Hide tooltip after 6 seconds
  useEffect(() => {
    if (!showTooltip) return;
    tooltipTimerRef.current = setTimeout(() => {
      setShowTooltip(false);
      sessionStorage.setItem(TOOLTIP_KEY, "true");
    }, 6000);
    return () => clearTimeout(tooltipTimerRef.current);
  }, [showTooltip]);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    sessionStorage.removeItem(STORAGE_KEY);
    setShowTooltip(false);
    sessionStorage.setItem(TOOLTIP_KEY, "true");
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsOpen(false);
    setIsMinimized(true);
    sessionStorage.setItem(STORAGE_KEY, "true");
  };

  return (
    <div className="chat-widget">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chat-window-wrapper"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <ChatWindow onClose={handleClose} onMinimize={handleMinimize} />
          </motion.div>
        )}
      </AnimatePresence>

      {mounted && (
        <AnimatePresence mode="wait">
          {!isOpen && (
            <motion.button
              key={isMinimized ? "minimized" : "default"}
              className={`chat-fab ${isMinimized ? "chat-fab-muted" : ""}`}
              onClick={handleOpen}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              type="button"
              aria-label="Open chat assistant"
            >
              <MessageCircle size={24} />
              {isMinimized && <span className="chat-fab-badge" />}
            </motion.button>
          )}
        </AnimatePresence>
      )}

      {mounted && (
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              className="chat-tooltip"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
            >
              <span>Need help? Chat with DEV&#8734;</span>
              <button
                className="chat-tooltip-close"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(false);
                  sessionStorage.setItem(TOOLTIP_KEY, "true");
                }}
                type="button"
                aria-label="Dismiss tooltip"
              >
                <X size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

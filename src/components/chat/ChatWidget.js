"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MessageCircle, X } from "lucide-react";
import ChatWindow from "./ChatWindow";

const STORAGE_KEY = "dev_chat_minimized";
const TOOLTIP_KEY = "dev_chat_tooltip_seen";
const PROACTIVE_DELAY = 15000; // 15 seconds
const EXIT_INTENT_Y = 10; // Cursor within 10px of top = likely leaving

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [windowVisible, setWindowVisible] = useState(false);
  const [fabVisible, setFabVisible] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const tooltipTimerRef = useRef(null);
  const proactiveTimerRef = useRef(null);
  const closeTimerRef = useRef(null);

  // Client-only mount
  useEffect(() => {
    setMounted(true);
    setIsMinimized(sessionStorage.getItem(STORAGE_KEY) === "true");
    const tooltipSeen = sessionStorage.getItem(TOOLTIP_KEY);
    setShowTooltip(!tooltipSeen);

    // FAB entrance animation
    requestAnimationFrame(() => {
      setFabVisible(true);
    });

    // Proactive tooltip: show after delay if user hasn't interacted
    proactiveTimerRef.current = setTimeout(() => {
      if (!isOpen && !tooltipSeen) {
        setTooltipVisible(true);
        sessionStorage.setItem(TOOLTIP_KEY, "true");
      }
    }, PROACTIVE_DELAY);

    // Exit intent detection
    const handleMouseLeave = (e) => {
      if (e.clientY <= EXIT_INTENT_Y && !isOpen) {
        // Show tooltip proactively on exit intent
        if (!showTooltip) {
          setTooltipVisible(true);
          setShowTooltip(true);
          sessionStorage.setItem(TOOLTIP_KEY, "true");
        }
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(proactiveTimerRef.current);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Sync tooltip visibility
  useEffect(() => {
    if (!mounted) return;
    if (showTooltip) {
      const t = setTimeout(() => setTooltipVisible(true), 100);
      return () => clearTimeout(t);
    } else {
      setTooltipVisible(false);
    }
  }, [showTooltip, mounted]);

  // Auto-dismiss tooltip after 6s
  useEffect(() => {
    if (!tooltipVisible) return;
    const t = setTimeout(() => {
      setTooltipVisible(false);
      setShowTooltip(false);
    }, 6000);
    return () => clearTimeout(t);
  }, [tooltipVisible]);

  const handleOpen = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setIsOpen(true);
    setWindowVisible(true);
    setFabVisible(false);
    setTooltipVisible(false);
    setShowTooltip(false);
    setIsMinimized(false);
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.setItem(TOOLTIP_KEY, "true");
  }, []);

  const handleClose = useCallback(() => {
    setWindowVisible(false);
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      setFabVisible(true);
    }, 220);
  }, []);

  const handleMinimize = useCallback(() => {
    setWindowVisible(false);
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      setIsMinimized(true);
      setFabVisible(true);
    }, 220);
    sessionStorage.setItem(STORAGE_KEY, "true");
  }, []);

  return (
    <div className="chat-widget">
      {isOpen && (
        <div
          className={`chat-window-wrapper ${windowVisible ? "cw-enter" : "cw-exit"}`}
        >
          <ChatWindow onClose={handleClose} onMinimize={handleMinimize} />
        </div>
      )}

      {mounted && !isOpen && (
        <button
          className={`chat-fab ${isMinimized ? "chat-fab-muted" : ""} ${fabVisible ? "chat-fab-visible" : ""}`}
          onClick={handleOpen}
          type="button"
          aria-label="Open chat assistant"
        >
          <MessageCircle size={24} />
          {isMinimized && <span className="chat-fab-badge" />}
        </button>
      )}

      {mounted && tooltipVisible && !isOpen && (
        <div className="chat-tooltip chat-tooltip-visible">
          <span>Need help? Chat with DEV&#8734;</span>
          <button
            className="chat-tooltip-close"
            onClick={(e) => {
              e.stopPropagation();
              setTooltipVisible(false);
              setShowTooltip(false);
              sessionStorage.setItem(TOOLTIP_KEY, "true");
            }}
            type="button"
            aria-label="Dismiss tooltip"
          >
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  );
}

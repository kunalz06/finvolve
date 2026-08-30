"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MessageCircle, X } from "lucide-react";
import ChatWindow from "./ChatWindow";

const STORAGE_KEY = "dev_chat_minimized";
const TOOLTIP_KEY = "dev_chat_tooltip_seen";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [windowVisible, setWindowVisible] = useState(false);
  const [fabVisible, setFabVisible] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const tooltipTimerRef = useRef(null);
  const closeTimerRef = useRef(null);

  // Client-only mount: kick off CSS-transition-driven entrances
  useEffect(() => {
    setMounted(true);
    setIsMinimized(sessionStorage.getItem(STORAGE_KEY) === "true");
    const tooltipSeen = sessionStorage.getItem(TOOLTIP_KEY);
    setShowTooltip(!tooltipSeen);

    // Staggered entrance: FAB first, then tooltip
    requestAnimationFrame(() => {
      setFabVisible(true);
      if (!tooltipSeen) {
        setTimeout(() => setTooltipVisible(true), 200);
      }
    });
  }, []);

  // Sync tooltip visibility when showTooltip changes after mount
  useEffect(() => {
    if (!mounted) return;
    if (showTooltip) {
      setTimeout(() => setTooltipVisible(true), 50);
    } else {
      setTooltipVisible(false);
    }
  }, [showTooltip, mounted]);

  // Hide tooltip after 6 seconds
  useEffect(() => {
    if (!showTooltip) return;
    tooltipTimerRef.current = setTimeout(() => {
      setShowTooltip(false);
      sessionStorage.setItem(TOOLTIP_KEY, "true");
    }, 6000);
    return () => clearTimeout(tooltipTimerRef.current);
  }, [showTooltip]);

  const handleOpen = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setIsOpen(true);
    setWindowVisible(true);
    setFabVisible(false);
    setTooltipVisible(false);
    setIsMinimized(false);
    sessionStorage.removeItem(STORAGE_KEY);
    setShowTooltip(false);
    sessionStorage.setItem(TOOLTIP_KEY, "true");
  }, []);

  const handleClose = useCallback(() => {
    setWindowVisible(false);
    // Wait for CSS transition to finish before unmounting
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

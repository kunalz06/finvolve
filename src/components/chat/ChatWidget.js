"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MessageCircle, X } from "lucide-react";
import ChatWindow from "./ChatWindow";
import Button from "@/components/ui/Button";

const STORAGE_KEY = "dev_chat_minimized";
const TOOLTIP_KEY = "dev_chat_tooltip_seen";
const PROACTIVE_DELAY = 15000;
const EXIT_INTENT_Y = 10;

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

  useEffect(() => {
    setMounted(true);
    setIsMinimized(sessionStorage.getItem(STORAGE_KEY) === "true");
    const tooltipSeen = sessionStorage.getItem(TOOLTIP_KEY);
    setShowTooltip(!tooltipSeen);

    requestAnimationFrame(() => setFabVisible(true));

    proactiveTimerRef.current = setTimeout(() => {
      if (!isOpen && !tooltipSeen) {
        setTooltipVisible(true);
        sessionStorage.setItem(TOOLTIP_KEY, "true");
      }
    }, PROACTIVE_DELAY);

    const handleMouseLeave = (e) => {
      if (e.clientY <= EXIT_INTENT_Y && !isOpen) {
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

  useEffect(() => {
    if (!mounted) return;
    if (showTooltip) {
      const t = setTimeout(() => setTooltipVisible(true), 100);
      return () => clearTimeout(t);
    } else {
      setTooltipVisible(false);
    }
  }, [showTooltip, mounted]);

  useEffect(() => {
    if (!tooltipVisible) return;
    const t = setTimeout(() => {
      setTooltipVisible(false);
      setShowTooltip(false);
    }, 6000);
    return () => clearTimeout(t);
  }, [tooltipVisible]);

  // Lock body scroll when chat is open on mobile
  useEffect(() => {
    if (!mounted) return;
    const isMobile = window.innerWidth <= 480;
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, mounted]);

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
        <Button
          className={`chat-fab ${isMinimized ? "chat-fab-muted" : ""} ${fabVisible ? "chat-fab-visible" : ""}`}
          onClick={handleOpen}
          type="button"
          aria-label="Open chat assistant"
          variant="primary"
          size="icon"
        >
          <MessageCircle size={24} />
          {isMinimized && <span className="chat-fab-badge" />}
        </Button>
      )}

      {mounted && tooltipVisible && !isOpen && (
        <div className="chat-tooltip chat-tooltip-visible">
          <span>Need help? Chat with DEV&#8734;</span>
          <Button
            className="chat-tooltip-close"
            onClick={(e) => {
              e.stopPropagation();
              setTooltipVisible(false);
              setShowTooltip(false);
              sessionStorage.setItem(TOOLTIP_KEY, "true");
            }}
            type="button"
            aria-label="Dismiss tooltip"
            variant="ghost"
            size="icon"
          >
            <X size={12} />
          </Button>
        </div>
      )}
    </div>
  );
}

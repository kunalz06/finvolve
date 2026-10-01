"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MessageCircle } from "lucide-react";
import ChatWindow from "./ChatWindow";
import Button from "@/components/ui/Button";

const STORAGE_KEY = "dev_chat_minimized";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [windowVisible, setWindowVisible] = useState(false);
  const [fabVisible, setFabVisible] = useState(false);
  const closeTimerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    setIsMinimized(sessionStorage.getItem(STORAGE_KEY) === "true");
    requestAnimationFrame(() => setFabVisible(true));
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const isMobile = window.innerWidth <= 480;
    document.body.style.overflow = isMobile && isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, mounted]);

  const handleOpen = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setIsOpen(true);
    setWindowVisible(true);
    setFabVisible(false);
    setIsMinimized(false);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const handleClose = useCallback(() => {
    setWindowVisible(false);
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      setFabVisible(true);
    }, 180);
  }, []);

  const handleMinimize = useCallback(() => {
    setWindowVisible(false);
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      setIsMinimized(true);
      setFabVisible(true);
    }, 180);
    sessionStorage.setItem(STORAGE_KEY, "true");
  }, []);

  return (
    <div className="chat-widget">
      {isOpen && (
        <div className={`chat-window-wrapper ${windowVisible ? "cw-enter" : "cw-exit"}`}>
          <ChatWindow onClose={handleClose} onMinimize={handleMinimize} />
        </div>
      )}

      {mounted && !isOpen && (
        <Button
          className={`chat-launcher ${isMinimized ? "chat-launcher-muted" : ""} ${fabVisible ? "chat-launcher-visible" : ""}`}
          onClick={handleOpen}
          type="button"
          aria-label={isMinimized ? "Continue chat with DEV Infinity assistant" : "Open DEV Infinity assistant"}
          variant="secondary"
          size="default"
        >
          <MessageCircle size={18} />
          <span>{isMinimized ? "Continue request" : "DEV∞ Actions"}</span>
          {isMinimized && <span className="chat-launcher-dot" aria-hidden="true" />}
        </Button>
      )}
    </div>
  );
}

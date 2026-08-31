"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, Minus, RotateCcw } from "lucide-react";
import { ChatEngine } from "@/lib/chat/chat-engine";
import { getSessionId, saveChatSession, saveContactMessage, loadPreviousSession, setLastChatTime, getLastChatTime } from "@/lib/chat/chat-utils";
import ChatMessage from "./ChatMessage";
import QuickReplies from "./QuickReplies";
import TypingIndicator from "./TypingIndicator";
import Button from "@/components/ui/Button";

const WELCOME = {
  role: "bot",
  text: "Hey! I'm DEV\u221e, your assistant at DEV Infinity. I can help you explore our services, cloud plans, pricing, or start a project. What would you like to know?",
  quickReplies: ["Our Services", "Cloud Plans", "Start a Project", "Contact Us"],
};

const SESSION_RESTORE_HOURS = 24; // Restore sessions less than 24h old

export default function ChatWindow({ onClose, onMinimize }) {
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeReplies, setActiveReplies] = useState(WELCOME.quickReplies);
  const [initialized, setInitialized] = useState(false);
  const [engine, setEngine] = useState(null);
  const [restoring, setRestoring] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const saveTimerRef = useRef(null);

  // Initialize ML engine
  useEffect(() => {
    const eng = new ChatEngine();
    setEngine(eng);
    eng.init().then(() => setInitialized(true));
  }, []);

  // Restore previous session
  useEffect(() => {
    async function restore() {
      const lastTime = getLastChatTime();
      const now = Date.now();
      const hoursSince = (now - lastTime) / (1000 * 60 * 60);

      if (hoursSince < SESSION_RESTORE_HOURS && lastTime > 0) {
        const sessionId = getSessionId();
        const prev = await loadPreviousSession(sessionId);
        if (prev && prev.messages && prev.messages.length > 1) {
          const restored = prev.messages.map((m) => ({
            role: m.role,
            text: m.text,
            timestamp: m.timestamp,
          }));
          setMessages(restored);
          setActiveReplies([]);
        }
      }
      setRestoring(false);
    }
    restore();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input
  useEffect(() => {
    if (!restoring) setTimeout(() => inputRef.current?.focus(), 300);
  }, [restoring]);

  // Debounced Firestore save
  const scheduleSave = useCallback(
    (msgs) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        const sessionId = getSessionId();
        if (sessionId) saveChatSession(sessionId, msgs);
        setLastChatTime();
      }, 3000);
    },
    []
  );

  // Add a bot message with typing delay
  const addBotResponse = useCallback(
    (response) => {
      setIsTyping(true);
      const delay = 300 + Math.random() * 400;

      setTimeout(() => {
        setIsTyping(false);

        const botMsg = {
          role: "bot",
          text: response.text,
          timestamp: Date.now(),
          cards: response.cards || undefined,
          intent: response.confidence > 0 ? null : undefined,
        };

        setMessages((prev) => {
          const next = [...prev, botMsg];
          scheduleSave(next);
          return next;
        });

        setActiveReplies(response.quickReplies || []);

        // Handle navigation (supports #hash deep-links for section scrolling)
        if (response.action === "navigate" && response.link) {
          setTimeout(() => {
            const url = new URL(response.link, window.location.origin);
            const isSamePage = url.pathname === window.location.pathname;
            if (isSamePage && url.hash) {
              // Same page — smooth scroll to section
              const el = document.getElementById(url.hash.slice(1));
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            } else {
              // Different page — navigate (browser will handle #hash)
              window.location.href = response.link;
            }
          }, 800);
        }

        // Handle message sent
        if (response.action === "message_sent" && response.actionData) {
          saveContactMessage(response.actionData);
        }

        // Handle project brief
        if (response.action === "project_brief_complete" && response.actionData) {
          const d = response.actionData;
          const params = new URLSearchParams({
            type: d.projectType || "",
            timeline: d.timeline || "",
            budget: d.budget || "",
          });
          setTimeout(() => {
            window.location.href = `/dev/request?${params.toString()}`;
          }, 800);
        }
      }, delay);
    },
    [scheduleSave]
  );

  const handleSend = useCallback(
    async (text) => {
      const trimmed = (text || input).trim();
      if (!trimmed || !engine) return;

      setInput("");
      setActiveReplies([]);

      const userMsg = { role: "user", text: trimmed, timestamp: Date.now() };
      setMessages((prev) => {
        const next = [...prev, userMsg];
        scheduleSave(next);
        return next;
      });

      const response = await engine.processMessage(trimmed);
      addBotResponse(response);
    },
    [engine, input, addBotResponse, scheduleSave]
  );

  const handleQuickReply = useCallback(
    (label) => {
      setActiveReplies([]);

      const userMsg = { role: "user", text: label, timestamp: Date.now() };
      setMessages((prev) => {
        const next = [...prev, userMsg];
        scheduleSave(next);
        return next;
      });

      const response = engine.handleQuickReply(label);
      addBotResponse(response);
    },
    [engine, addBotResponse, scheduleSave]
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    engine.cancelFlow();
    // Clear persisted session
    localStorage.removeItem("dev_chat_session_id");
    localStorage.removeItem("dev_chat_last_time");
    setMessages([WELCOME]);
    setActiveReplies(WELCOME.quickReplies);
    setInput("");
  };

  const isInFlow = engine?.isInFlow;

  return (
    <div className="chat-window glass-panel">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-left">
          <div className="chat-header-avatar">DEV</div>
          <div>
            <div className="chat-header-name">DEV\u221e Assistant</div>
            <div className="chat-header-status">
              <span className="chat-status-dot" />
              {initialized ? "Online" : "Loading..."}
            </div>
          </div>
        </div>
        <div className="chat-header-actions">
          <Button
            className="chat-header-btn"
            onClick={handleReset}
            title="Reset conversation"
            type="button"
            variant="ghost"
            size="icon"
          >
            <RotateCcw size={14} />
          </Button>
          <Button
            className="chat-header-btn"
            onClick={onMinimize}
            title="Minimize"
            type="button"
            variant="ghost"
            size="icon"
          >
            <Minus size={14} />
          </Button>
          <Button
            className="chat-header-btn"
            onClick={onClose}
            title="Close"
            type="button"
            variant="ghost"
            size="icon"
          >
            <X size={14} />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {restoring && (
          <div className="chat-msg bot-msg">
            <div className="chat-msg-avatar">DEV</div>
            <div className="chat-typing">
              <span className="chat-typing-dot" />
              <span className="chat-typing-dot" />
              <span className="chat-typing-dot" />
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {activeReplies.length > 0 && (
        <QuickReplies replies={activeReplies} onSelect={handleQuickReply} />
      )}

      {/* Input */}
      <div className="chat-input-area">
        {isInFlow && (
          <Button
            className="chat-cancel-flow"
            onClick={() => {
              engine.cancelFlow();
              setActiveReplies(["Our Services", "Cloud Plans", "Contact Us"]);
              setMessages((prev) => [
                ...prev,
                {
                  role: "bot",
                  text: "No problem, flow cancelled. How can I help you?",
                  timestamp: Date.now(),
                },
              ]);
            }}
            type="button"
            variant="outline"
            size="xsmall"
          >
            Cancel
          </Button>
        )}
        <input
          ref={inputRef}
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isInFlow ? "Type your response..." : "Ask about services, pricing, projects..."}
          disabled={isTyping || restoring}
          autoComplete="off"
        />
        <Button
          className="chat-send-btn"
          onClick={() => handleSend()}
          disabled={!input.trim() || isTyping || restoring}
          type="button"
          aria-label="Send message"
          variant="primary"
          size="icon"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13" />
            <path d="M22 2L15 22L11 13L2 9L22 2Z" />
          </svg>
        </Button>
      </div>
    </div>
  );
}

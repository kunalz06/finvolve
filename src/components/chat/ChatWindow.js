"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, Minus, RotateCcw } from "lucide-react";
import { ChatEngine } from "@/lib/chat/chat-engine";
import { getSessionId, saveChatSession, saveContactMessage } from "@/lib/chat/chat-utils";
import ChatMessage from "./ChatMessage";
import QuickReplies from "./QuickReplies";
import TypingIndicator from "./TypingIndicator";

const WELCOME = {
  role: "bot",
  text: "Hey! I'm DEV\u221e, your assistant at DEV Infinity. I can help you explore our services, cloud plans, pricing, or start a project. What would you like to know?",
  quickReplies: ["Our Services", "Cloud Plans", "Start a Project", "Contact Us"],
};

export default function ChatWindow({ onClose, onMinimize }) {
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeReplies, setActiveReplies] = useState(WELCOME.quickReplies);
  const [initialized, setInitialized] = useState(false);
  const [engine, setEngine] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const saveTimerRef = useRef(null);

  // Initialize ML engine
  useEffect(() => {
    const eng = new ChatEngine();
    setEngine(eng);
    eng.init().then(() => setInitialized(true));
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  // Debounced Firestore save
  const scheduleSave = useCallback(
    (msgs) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        const sessionId = getSessionId();
        if (sessionId) saveChatSession(sessionId, msgs);
      }, 3000);
    },
    []
  );

  // Add a bot message with typing delay
  const addBotResponse = useCallback(
    (response) => {
      setIsTyping(true);
      const delay = 300 + Math.random() * 400; // 300-700ms

      setTimeout(() => {
        setIsTyping(false);

        const botMsg = {
          role: "bot",
          text: response.text,
          timestamp: Date.now(),
        };

        setMessages((prev) => {
          const next = [...prev, botMsg];
          scheduleSave(next);
          return next;
        });

        setActiveReplies(response.quickReplies || []);

        // Handle navigation
        if (response.action === "navigate" && response.link) {
          setTimeout(() => {
            window.location.href = response.link;
          }, 800);
        }

        // Handle message sent → save to contact_messages
        if (response.action === "message_sent" && response.actionData) {
          saveContactMessage(response.actionData);
        }

        // Handle project brief → navigate to form with params
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

  // Handle send
  const handleSend = useCallback(
    async (text) => {
      const trimmed = (text || input).trim();
      if (!trimmed || !engine) return;

      setInput("");
      setActiveReplies([]);

      // Add user message
      const userMsg = { role: "user", text: trimmed, timestamp: Date.now() };
      setMessages((prev) => {
        const next = [...prev, userMsg];
        scheduleSave(next);
        return next;
      });

      // Process through engine
      const response = await engine.processMessage(trimmed);
      addBotResponse(response);
    },
    [engine, input, addBotResponse, scheduleSave]
  );

  // Handle quick reply
  const handleQuickReply = useCallback(
    (label) => {
      setActiveReplies([]);

      // Add user message showing the quick reply
      const userMsg = { role: "user", text: label, timestamp: Date.now() };
      setMessages((prev) => {
        const next = [...prev, userMsg];
        scheduleSave(next);
        return next;
      });

      // Get engine response
      const response = engine.handleQuickReply(label);
      addBotResponse(response);
    },
    [engine, addBotResponse, scheduleSave]
  );

  // Handle keyboard
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Reset chat
  const handleReset = () => {
    engine.cancelFlow();
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
          <button
            className="chat-header-btn"
            onClick={handleReset}
            title="Reset conversation"
            type="button"
          >
            <RotateCcw size={14} />
          </button>
          <button
            className="chat-header-btn"
            onClick={onMinimize}
            title="Minimize"
            type="button"
          >
            <Minus size={14} />
          </button>
          <button
            className="chat-header-btn"
            onClick={onClose}
            title="Close"
            type="button"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
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
          <button
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
          >
            Cancel
          </button>
        )}
        <input
          ref={inputRef}
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isInFlow ? "Type your response..." : "Ask about services, pricing, projects..."}
          disabled={isTyping}
          autoComplete="off"
        />
        <button
          className="chat-send-btn"
          onClick={() => handleSend()}
          disabled={!input.trim() || isTyping}
          type="button"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13" />
            <path d="M22 2L15 22L11 13L2 9L22 2Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, Minus, RotateCcw, Send } from "lucide-react";
import { ChatEngine } from "@/lib/chat/chat-engine";
import {
  getSessionId,
  saveChatSession,
  saveContactMessage,
  loadPreviousSession,
  setLastChatTime,
  getLastChatTime,
} from "@/lib/chat/chat-utils";
import ChatMessage from "./ChatMessage";
import QuickReplies from "./QuickReplies";
import TypingIndicator from "./TypingIndicator";
import Button from "@/components/ui/Button";
import BrandMark from "@/components/BrandMark";

const WELCOME = {
  role: "bot",
  text: "Hi, I’m the DEV Infinity assistant. I can help you compare services, understand cloud plans, find pricing information, or prepare a project request.",
  quickReplies: ["Explore services", "Compare cloud plans", "Start a project", "Contact the team"],
};

const SESSION_RESTORE_HOURS = 24;
const MAX_MESSAGE_LENGTH = 1000;

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

  useEffect(() => {
    try {
      const eng = new ChatEngine();
      setEngine(eng);
      eng.init()
        .then(() => setInitialized(true))
        .catch((err) => {
          console.warn("Engine init failed:", err);
          setInitialized(true);
        });
    } catch (err) {
      console.warn("Engine setup error:", err);
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    async function restore() {
      try {
        const lastTime = getLastChatTime();
        const hoursSince = (Date.now() - lastTime) / (1000 * 60 * 60);

        if (hoursSince < SESSION_RESTORE_HOURS && lastTime > 0) {
          const sessionId = getSessionId();
          const prev = await loadPreviousSession(sessionId);
          if (prev?.messages?.length > 1) {
            setMessages(
              prev.messages.map((message) => ({
                role: message.role,
                text: message.text,
                timestamp: message.timestamp,
              })),
            );
            setActiveReplies([]);
          }
        }
      } catch (err) {
        console.warn("Session restore error:", err);
      } finally {
        setRestoring(false);
      }
    }

    restore();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!restoring) {
      const timer = setTimeout(() => inputRef.current?.focus(), 220);
      return () => clearTimeout(timer);
    }
  }, [restoring]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const scheduleSave = useCallback((msgs) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      const sessionId = getSessionId();
      if (sessionId) saveChatSession(sessionId, msgs);
      setLastChatTime();
    }, 2500);
  }, []);

  const addBotResponse = useCallback(
    (response) => {
      setIsTyping(true);
      const delay = 260 + Math.random() * 260;

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

        if (response.action === "navigate" && response.link) {
          setTimeout(() => {
            const url = new URL(response.link, window.location.origin);
            const isSamePage = url.pathname === window.location.pathname;

            if (isSamePage && url.hash) {
              const element = document.getElementById(url.hash.slice(1));
              if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
            } else {
              window.location.href = response.link;
            }
          }, 650);
        }

        if (response.action === "message_sent" && response.actionData) {
          saveContactMessage(response.actionData);
        }

        if (response.action === "project_brief_complete" && response.actionData) {
          const data = response.actionData;
          const params = new URLSearchParams({
            type: data.projectType || "",
            timeline: data.timeline || "",
            budget: data.budget || "",
          });

          setTimeout(() => {
            window.location.href = `/dev/request?${params.toString()}`;
          }, 650);
        }
      }, delay);
    },
    [scheduleSave],
  );

  const handleSend = useCallback(
    async (text) => {
      const trimmed = (text || input).trim();
      if (!trimmed || !engine || isTyping || restoring) return;

      setInput("");
      setActiveReplies([]);
      if (inputRef.current) inputRef.current.style.height = "auto";

      const userMsg = { role: "user", text: trimmed, timestamp: Date.now() };
      setMessages((prev) => {
        const next = [...prev, userMsg];
        scheduleSave(next);
        return next;
      });

      try {
        const response = await engine.processMessage(trimmed);
        addBotResponse(response);
      } catch (err) {
        console.warn("Message processing error:", err);
        addBotResponse({
          text: "I couldn’t process that message. You can try again or contact the team directly.",
          quickReplies: ["Start over", "Contact the team"],
        });
      }
    },
    [engine, input, isTyping, restoring, addBotResponse, scheduleSave],
  );

  const handleQuickReply = useCallback(
    (label) => {
      if (!engine || !initialized || restoring || isTyping) return;

      try {
        setActiveReplies([]);

        const userMsg = { role: "user", text: label, timestamp: Date.now() };
        setMessages((prev) => {
          const next = [...prev, userMsg];
          scheduleSave(next);
          return next;
        });

        const response = engine.handleQuickReply(label);
        addBotResponse(response);
      } catch (err) {
        console.warn("Quick reply error:", err);
        addBotResponse({
          text: "I couldn’t open that option. Try another suggestion or type your question below.",
          quickReplies: ["Start over", "Contact the team"],
        });
      }
    },
    [engine, initialized, restoring, isTyping, addBotResponse, scheduleSave],
  );

  const handleInputChange = (event) => {
    setInput(event.target.value.slice(0, MAX_MESSAGE_LENGTH));
    event.target.style.height = "auto";
    event.target.style.height = `${Math.min(event.target.scrollHeight, 112)}px`;
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    engine?.cancelFlow?.();
    localStorage.removeItem("dev_chat_session_id");
    localStorage.removeItem("dev_chat_last_time");
    setMessages([WELCOME]);
    setActiveReplies(WELCOME.quickReplies);
    setInput("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.focus();
    }
  };

  const cancelFlow = () => {
    engine?.cancelFlow?.();
    setActiveReplies(["Explore services", "Compare cloud plans", "Contact the team"]);
    setMessages((prev) => [
      ...prev,
      {
        role: "bot",
        text: "No problem. I’ve stopped that flow. What would you like help with instead?",
        timestamp: Date.now(),
      },
    ]);
  };

  const isInFlow = engine?.isInFlow;

  return (
    <section className="chat-window" aria-label="DEV Infinity assistant">
      <header className="chat-header">
        <div className="chat-header-left">
          <BrandMark size="small" />
          <div>
            <div className="chat-header-name">DEV Infinity Assistant</div>
            <div className="chat-header-status">
              <span className="chat-status-dot" aria-hidden="true" />
              {initialized ? "Ready to help" : "Starting assistant…"}
            </div>
          </div>
        </div>

        <div className="chat-header-actions">
          <Button
            className="chat-header-btn"
            onClick={handleReset}
            title="Start a new conversation"
            aria-label="Start a new conversation"
            type="button"
            variant="ghost"
            size="icon"
          >
            <RotateCcw size={15} />
          </Button>
          <Button
            className="chat-header-btn"
            onClick={onMinimize}
            title="Minimize chat"
            aria-label="Minimize chat"
            type="button"
            variant="ghost"
            size="icon"
          >
            <Minus size={16} />
          </Button>
          <Button
            className="chat-header-btn"
            onClick={onClose}
            title="Close chat"
            aria-label="Close chat"
            type="button"
            variant="ghost"
            size="icon"
          >
            <X size={16} />
          </Button>
        </div>
      </header>

      <div className="chat-messages" aria-live="polite" aria-busy={isTyping || restoring}>
        {restoring && <TypingIndicator label="Restoring conversation" />}
        {!restoring &&
          messages.map((message, index) => (
            <ChatMessage key={message.timestamp || index} message={message} />
          ))}
        {isTyping && <TypingIndicator label="DEV Infinity is replying" />}
        <div ref={messagesEndRef} />
      </div>

      {!restoring && activeReplies.length > 0 && (
        <QuickReplies
          replies={activeReplies}
          onSelect={handleQuickReply}
          disabled={!initialized || isTyping}
        />
      )}

      <div className="chat-input-area">
        {isInFlow && (
          <div className="chat-flow-bar">
            <span>You’re answering a guided question.</span>
            <Button
              className="chat-cancel-flow"
              onClick={cancelFlow}
              type="button"
              variant="ghost"
              size="xsmall"
            >
              Exit flow
            </Button>
          </div>
        )}

        <div className="chat-composer">
          <textarea
            ref={inputRef}
            className="chat-input"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={isInFlow ? "Type your response…" : "Ask about services, cloud, pricing, or a project…"}
            disabled={isTyping || restoring}
            autoComplete="off"
            rows={1}
            maxLength={MAX_MESSAGE_LENGTH}
            aria-label="Message DEV Infinity assistant"
          />
          <Button
            className="chat-send-btn"
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping || restoring || !engine}
            type="button"
            aria-label="Send message"
            variant="primary"
            size="icon"
          >
            <Send size={18} />
          </Button>
        </div>

        <div className="chat-input-meta">
          <span>Enter to send · Shift+Enter for a new line</span>
          <span>{input.length}/{MAX_MESSAGE_LENGTH}</span>
        </div>
      </div>
    </section>
  );
}

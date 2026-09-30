"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, Minus, RotateCcw, Send } from "lucide-react";
import { ChatEngine } from "@/lib/chat/chat-engine";
import {
  getSessionId,
  saveChatSession,
  loadPreviousSession,
  setLastChatTime,
  getLastChatTime,
} from "@/lib/chat/chat-utils";
import { apiUrl } from "@/lib/api";
import ChatMessage from "./ChatMessage";
import QuickReplies from "./QuickReplies";
import TypingIndicator from "./TypingIndicator";
import ChatActionCard from "./ChatActionCard";
import Button from "@/components/ui/Button";
import BrandMark from "@/components/BrandMark";

const WELCOME = {
  role: "bot",
  text: "Hi, I’m the DEV Infinity assistant. I can answer questions, remember project details during the conversation, open pages for you, send a message to the team, or prepare and submit a project request after you confirm it.",
  quickReplies: ["Our Services", "Cloud Plans", "Start a Project", "Send a Message"],
};

const SESSION_RESTORE_HOURS = 24;
const MAX_MESSAGE_LENGTH = 1000;
const CONFIRM_RE = /^(yes|confirm|confirmed|do it|go ahead|send it|submit it|proceed)$/i;
const CANCEL_RE = /^(no|cancel|stop|never mind|nevermind|don'?t|do not)$/i;

export default function ChatWindow({ onClose, onMinimize }) {
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeReplies, setActiveReplies] = useState(WELCOME.quickReplies);
  const [initialized, setInitialized] = useState(false);
  const [engine, setEngine] = useState(null);
  const [restoring, setRestoring] = useState(true);
  const [restoredContext, setRestoredContext] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [actionStatus, setActionStatus] = useState("idle");
  const [actionError, setActionError] = useState("");
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
          if (prev?.context) setRestoredContext(prev.context);
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
    if (!engine || !restoredContext) return;
    engine.restoreContext(restoredContext);
    setRestoredContext(null);
  }, [engine, restoredContext]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping, pendingAction, actionStatus]);

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

  const scheduleSave = useCallback((msgs, contextOverride = null) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      const sessionId = getSessionId();
      if (sessionId) {
        const context = contextOverride || engine?.getContextSnapshot?.() || null;
        saveChatSession(sessionId, msgs, context);
      }
      setLastChatTime();
    }, 2000);
  }, [engine]);

  const appendBotMessage = useCallback((botMsg) => {
    setMessages((prev) => {
      const next = [...prev, botMsg];
      scheduleSave(next, engine?.getContextSnapshot?.());
      return next;
    });
  }, [engine, scheduleSave]);

  const executeNavigation = useCallback((link) => {
    if (!link) return;
    const url = new URL(link, window.location.origin);
    const isSamePage = url.pathname === window.location.pathname;

    if (isSamePage && url.hash) {
      const element = document.getElementById(url.hash.slice(1));
      if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    window.location.href = link;
  }, []);

  const addBotResponse = useCallback(
    (response) => {
      setIsTyping(true);
      const delay = 220 + Math.random() * 220;

      setTimeout(() => {
        setIsTyping(false);

        const botMsg = {
          role: "bot",
          text: response.text,
          timestamp: Date.now(),
          cards: response.cards || undefined,
          intent: response.confidence > 0 ? response.intent || null : undefined,
        };

        appendBotMessage(botMsg);
        setActiveReplies(response.quickReplies || []);

        if (response.pendingAction) {
          setPendingAction(response.pendingAction);
          setActionStatus("idle");
          setActionError("");
        }

        if (response.action === "navigate" && response.link) {
          setTimeout(() => executeNavigation(response.link), 450);
        }
      }, delay);
    },
    [appendBotMessage, executeNavigation],
  );

  const executePendingAction = useCallback(async () => {
    if (!pendingAction || actionStatus === "running") return;

    setActionStatus("running");
    setActionError("");
    setActiveReplies([]);

    try {
      const response = await fetch(apiUrl("/dev/api/chat/action"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: pendingAction.type,
          payload: pendingAction.payload,
        }),
      });

      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.error || "The action could not be completed.");
      }

      engine?.markActionCompleted?.(pendingAction.type, {
        recordId: json.recordId || null,
        emailSent: json.emailSent,
      });

      const completedAction = pendingAction;
      setPendingAction(null);
      setActionStatus("success");

      appendBotMessage({
        role: "bot",
        text: json.message || (completedAction.type === "project_request"
          ? "Your project request was submitted."
          : "Your message was sent to the team."),
        timestamp: Date.now(),
      });

      setActiveReplies(
        completedAction.type === "project_request"
          ? ["Our Services", "Cloud Plans", "Contact Us"]
          : ["Our Services", "Start a Project", "Cloud Plans"],
      );
    } catch (err) {
      setActionStatus("error");
      setActionError(err.message || "The action could not be completed.");
    }
  }, [pendingAction, actionStatus, engine, appendBotMessage]);

  const cancelPendingAction = useCallback(() => {
    if (!pendingAction || actionStatus === "running") return;
    engine?.clearRequestedAction?.();
    setPendingAction(null);
    setActionStatus("idle");
    setActionError("");
    appendBotMessage({
      role: "bot",
      text: "Cancelled. I didn’t perform that action.",
      timestamp: Date.now(),
    });
    setActiveReplies(["Our Services", "Cloud Plans", "Contact Us"]);
  }, [pendingAction, actionStatus, engine, appendBotMessage]);

  const handleSend = useCallback(
    async (text) => {
      const trimmed = (text || input).trim();
      if (!trimmed || !engine || isTyping || restoring || actionStatus === "running") return;

      setInput("");
      if (inputRef.current) inputRef.current.style.height = "auto";

      const userMsg = { role: "user", text: trimmed, timestamp: Date.now() };
      setMessages((prev) => {
        const next = [...prev, userMsg];
        scheduleSave(next, engine.getContextSnapshot?.());
        return next;
      });

      if (pendingAction && CONFIRM_RE.test(trimmed)) {
        await executePendingAction();
        return;
      }

      if (pendingAction && CANCEL_RE.test(trimmed)) {
        cancelPendingAction();
        return;
      }

      if (pendingAction) {
        setPendingAction(null);
        setActionStatus("idle");
        setActionError("");
      }

      setActiveReplies([]);

      try {
        const response = await engine.processMessage(trimmed);
        addBotResponse(response);
      } catch (err) {
        console.warn("Message processing error:", err);
        addBotResponse({
          text: "I couldn’t process that reliably. Try rephrasing your instruction, or contact the team directly.",
          quickReplies: ["Our Services", "Contact Us"],
        });
      }
    },
    [
      engine,
      input,
      isTyping,
      restoring,
      actionStatus,
      pendingAction,
      scheduleSave,
      executePendingAction,
      cancelPendingAction,
      addBotResponse,
    ],
  );

  const handleQuickReply = useCallback(
    (label) => {
      if (!engine || !initialized || restoring || isTyping || actionStatus === "running") return;

      const userMsg = { role: "user", text: label, timestamp: Date.now() };
      setMessages((prev) => {
        const next = [...prev, userMsg];
        scheduleSave(next, engine.getContextSnapshot?.());
        return next;
      });
      setActiveReplies([]);

      try {
        const response = engine.handleQuickReply(label);
        addBotResponse(response);
      } catch (err) {
        console.warn("Quick reply error:", err);
        addBotResponse({
          text: "I couldn’t open that option. Try another suggestion or type your request below.",
          quickReplies: ["Our Services", "Contact Us"],
        });
      }
    },
    [engine, initialized, restoring, isTyping, actionStatus, scheduleSave, addBotResponse],
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
    engine?.clearRequestedAction?.();
    localStorage.removeItem("dev_chat_session_id");
    localStorage.removeItem("dev_chat_last_time");
    setMessages([WELCOME]);
    setActiveReplies(WELCOME.quickReplies);
    setPendingAction(null);
    setActionStatus("idle");
    setActionError("");
    setInput("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.focus();
    }
  };

  const cancelFlow = () => {
    engine?.cancelFlow?.();
    setActiveReplies(["Our Services", "Cloud Plans", "Contact Us"]);
    appendBotMessage({
      role: "bot",
      text: "No problem. I stopped that guided flow. I’ll keep the useful details you already shared in this conversation.",
      timestamp: Date.now(),
    });
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
              {initialized ? "Context-aware · actions enabled" : "Starting assistant…"}
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

      <div className="chat-messages" aria-live="polite" aria-busy={isTyping || restoring || actionStatus === "running"}>
        {restoring && <TypingIndicator label="Restoring conversation" />}
        {!restoring &&
          messages.map((message, index) => (
            <ChatMessage key={message.timestamp || index} message={message} />
          ))}
        {isTyping && <TypingIndicator label="DEV Infinity is replying" />}
        <div ref={messagesEndRef} />
      </div>

      {pendingAction && (
        <ChatActionCard
          action={pendingAction}
          status={actionStatus}
          error={actionError}
          onConfirm={executePendingAction}
          onCancel={cancelPendingAction}
        />
      )}

      {!restoring && !pendingAction && activeReplies.length > 0 && (
        <QuickReplies
          replies={activeReplies}
          onSelect={handleQuickReply}
          disabled={!initialized || isTyping || actionStatus === "running"}
        />
      )}

      <div className="chat-input-area">
        {isInFlow && !pendingAction && (
          <div className="chat-flow-bar">
            <span>Guided input is active. You can answer naturally.</span>
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
            placeholder={
              pendingAction
                ? "Type confirm, cancel, or revise the details…"
                : isInFlow
                  ? "Type your response…"
                  : "Ask a question or give an instruction…"
            }
            disabled={isTyping || restoring || actionStatus === "running"}
            autoComplete="off"
            rows={1}
            maxLength={MAX_MESSAGE_LENGTH}
            aria-label="Message DEV Infinity assistant"
          />
          <Button
            className="chat-send-btn"
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping || restoring || !engine || actionStatus === "running"}
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

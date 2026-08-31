"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, ExternalLink } from "lucide-react";
import { parseInlineBold } from "@/lib/chat/chat-utils";
import { saveFeedback } from "@/lib/chat/chat-utils";
import { getSessionId } from "@/lib/chat/chat-utils";

export default function ChatMessage({ message, onFeedback }) {
  const isBot = message.role === "bot";

  return (
    <div className={`chat-msg ${isBot ? "bot-msg" : "user-msg"}`}>
      {isBot && <div className="chat-msg-avatar">DEV</div>}
      <div className={`chat-bubble ${isBot ? "bot-bubble" : "user-bubble"}`}>
        <MessageContent text={message.text} />
        {/* Link Cards */}
        {message.cards && message.cards.length > 0 && (
          <div className="chat-cards">
            {message.cards.map((card, i) => (
              <a
                key={i}
                className="chat-card"
                href={card.link}
                target={card.external ? "_blank" : undefined}
                rel={card.external ? "noopener noreferrer" : undefined}
                onClick={(e) => {
                  if (!card.external) {
                    e.preventDefault();
                    window.location.href = card.link;
                  }
                }}
              >
                <div className="chat-card-body">
                  <div className="chat-card-title">{card.title}</div>
                  <div className="chat-card-desc">{card.desc}</div>
                </div>
                <span className="chat-card-cta">
                  {card.external && <ExternalLink size={12} />}
                  {card.cta}
                </span>
              </a>
            ))}
          </div>
        )}
        {/* Feedback (thumbs up/down) on bot messages */}
        {isBot && message.timestamp && (
          <FeedbackRow
            messageText={message.text}
            intent={message.intent}
            onFeedback={onFeedback}
          />
        )}
      </div>
    </div>
  );
}

function FeedbackRow({ messageText, intent, onFeedback }) {
  const [sent, setSent] = useState(null);

  const handleFeedback = async (type) => {
    if (sent) return;
    setSent(type);
    const sessionId = getSessionId();
    await saveFeedback({ sessionId, messageText, feedback: type, intent: intent || null });
    if (onFeedback) onFeedback(type);
  };

  return (
    <div className="chat-feedback-row">
      {sent === null ? (
        <>
          <button
            className="chat-feedback-btn"
            onClick={() => handleFeedback("up")}
            type="button"
            aria-label="Helpful"
            title="Helpful"
          >
            <ThumbsUp size={12} />
          </button>
          <button
            className="chat-feedback-btn"
            onClick={() => handleFeedback("down")}
            type="button"
            aria-label="Not helpful"
            title="Not helpful"
          >
            <ThumbsDown size={12} />
          </button>
        </>
      ) : (
        <span className={`chat-feedback-sent ${sent === "up" ? "feedback-up" : "feedback-down"}`}>
          {sent === "up" ? "Thanks!" : "We'll improve."}
        </span>
      )}
    </div>
  );
}

function MessageContent({ text }) {
  if (!text) return null;
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => {
        const isEmpty = !line.trim();
        if (isEmpty) return <br key={i} />;
        if (line.trim().startsWith("•")) {
          const content = line.trim().slice(1).trim();
          return (
            <div className="chat-bullet" key={i}>
              <span className="chat-bullet-dot" />
              <span>{<InlineText text={content} />}</span>
            </div>
          );
        }
        return (
          <p className="chat-line" key={i}>
            <InlineText text={line} />
          </p>
        );
      })}
    </>
  );
}

function InlineText({ text }) {
  const parts = parseInlineBold(text);
  return (
    <>
      {parts.map((part, i) =>
        part.bold ? (
          <strong key={i}>{part.text}</strong>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </>
  );
}

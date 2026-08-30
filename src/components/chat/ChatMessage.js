"use client";

import { parseInlineBold } from "@/lib/chat/chat-utils";

export default function ChatMessage({ message }) {
  const isBot = message.role === "bot";

  return (
    <div className={`chat-msg ${isBot ? "bot-msg" : "user-msg"}`}>
      {isBot && <div className="chat-msg-avatar">DEV</div>}
      <div className={`chat-bubble ${isBot ? "bot-bubble" : "user-bubble"}`}>
        <MessageContent text={message.text} />
      </div>
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

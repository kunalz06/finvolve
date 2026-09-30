"use client";

import BrandMark from "@/components/BrandMark";

export default function TypingIndicator({ label = "Assistant is typing" }) {
  return (
    <div className="chat-msg bot-msg" aria-label={label}>
      <BrandMark size="small" className="chat-msg-brand" />
      <div className="chat-typing">
        <span className="chat-typing-dot" />
        <span className="chat-typing-dot" />
        <span className="chat-typing-dot" />
      </div>
    </div>
  );
}

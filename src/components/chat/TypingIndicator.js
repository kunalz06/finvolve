"use client";

export default function TypingIndicator() {
  return (
    <div className="chat-msg bot-msg">
      <div className="chat-msg-avatar">DEV</div>
      <div className="chat-typing">
        <span className="chat-typing-dot" />
        <span className="chat-typing-dot" />
        <span className="chat-typing-dot" />
      </div>
    </div>
  );
}

"use client";

export default function QuickReplies({ replies, onSelect }) {
  if (!replies || replies.length === 0) return null;

  return (
    <div className="chat-quick-replies">
      {replies.map((reply) => (
        <button
          key={reply}
          className="chat-chip"
          onClick={() => onSelect(reply)}
          type="button"
        >
          {reply}
        </button>
      ))}
    </div>
  );
}

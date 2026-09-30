"use client";

import Button from "@/components/ui/Button";

export default function QuickReplies({ replies, onSelect, disabled = false }) {
  if (!replies || replies.length === 0) return null;

  return (
    <div className="chat-quick-replies" aria-label="Suggested questions">
      <div className="chat-quick-label">Suggested</div>
      <div className="chat-quick-grid">
        {replies.map((reply) => (
          <Button
            key={reply}
            className="chat-chip"
            onClick={() => onSelect(reply)}
            disabled={disabled}
            type="button"
            variant="secondary"
            size="small"
          >
            {reply}
          </Button>
        ))}
      </div>
    </div>
  );
}

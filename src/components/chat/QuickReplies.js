"use client";

import Button from "@/components/ui/Button";

export default function QuickReplies({ replies, onSelect }) {
  if (!replies || replies.length === 0) return null;

  return (
    <div className="chat-quick-replies">
      {replies.map((reply) => (
        <Button
          key={reply}
          className="chat-chip"
          onClick={() => onSelect(reply)}
          type="button"
          variant="secondary"
          size="small"
        >
          {reply}
        </Button>
      ))}
    </div>
  );
}

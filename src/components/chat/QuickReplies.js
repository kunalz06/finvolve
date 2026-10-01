"use client";

import { ArrowUpRight } from "lucide-react";
import Button from "@/components/ui/Button";

export default function QuickReplies({ replies, onSelect, disabled = false }) {
  if (!replies || replies.length === 0) return null;

  return (
    <div className="chat-quick-replies" aria-label="Popular actions">
      <div className="chat-quick-label">Popular actions</div>
      <div className="chat-quick-grid">
        {replies.map((reply) => (
          <Button
            key={reply}
            className="chat-action-option"
            onClick={() => onSelect(reply)}
            disabled={disabled}
            type="button"
            variant="ghost"
            size="small"
          >
            <span>{reply}</span>
            <ArrowUpRight size={14} aria-hidden="true" />
          </Button>
        ))}
      </div>
    </div>
  );
}

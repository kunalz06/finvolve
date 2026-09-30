"use client";

import { Check, Loader2, ShieldCheck, X } from "lucide-react";
import Button from "@/components/ui/Button";

export default function ChatActionCard({
  action,
  status = "idle",
  error = "",
  onConfirm,
  onCancel,
}) {
  if (!action) return null;

  const running = status === "running";

  return (
    <div className="chat-action-card" role="region" aria-label="Pending assistant action">
      <div className="chat-action-heading">
        <span className="chat-action-icon">
          <ShieldCheck size={17} />
        </span>
        <div>
          <div className="chat-action-title">{action.title || "Confirm action"}</div>
          <div className="chat-action-description">
            {action.description || "Review this action before it runs."}
          </div>
        </div>
      </div>

      {action.summary?.length > 0 && (
        <dl className="chat-action-summary">
          {action.summary.map((item) => (
            <div className="chat-action-row" key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {error && <div className="chat-action-error">{error}</div>}

      <div className="chat-action-controls">
        <Button
          type="button"
          variant="primary"
          size="small"
          disabled={running}
          onClick={onConfirm}
          className="chat-action-confirm"
        >
          {running ? <Loader2 size={15} className="chat-spin" /> : <Check size={15} />}
          {running ? "Working…" : "Confirm"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="small"
          disabled={running}
          onClick={onCancel}
        >
          <X size={15} />
          Cancel
        </Button>
      </div>

      <div className="chat-action-hint">You can also type “confirm” or “cancel”.</div>
    </div>
  );
}

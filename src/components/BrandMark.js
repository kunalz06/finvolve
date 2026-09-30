"use client";

export default function BrandMark({ size = "default", withWordmark = false, className = "" }) {
  const sizeClass = size === "small" ? "brand-mark-small" : size === "large" ? "brand-mark-large" : "";

  return (
    <span className={`brand-lockup ${withWordmark ? "brand-lockup-with-wordmark" : ""} ${className}`}>
      <span className={`brand-mark ${sizeClass}`} aria-hidden="true">
        <svg viewBox="0 0 40 40" role="presentation">
          <path
            d="M9 8h8.2c8.8 0 14 4.5 14 12s-5.2 12-14 12H9V8Zm6.1 5.5v13h2c5 0 7.9-2.2 7.9-6.5s-2.9-6.5-7.9-6.5h-2Z"
            fill="currentColor"
          />
          <path
            d="M22.3 17.1c1.6-2 3.2-3 5-3 3.4 0 5.7 2.4 5.7 5.8 0 3.3-2.3 5.8-5.7 5.8-1.8 0-3.5-.9-5-3-1.5 2.1-3.2 3-5 3-2.7 0-4.8-1.5-5.5-3.8h3.7c.4.7 1 1.1 1.8 1.1 1 0 2-.8 3.2-2.6l.3-.5-.3-.5c-1.2-1.8-2.2-2.6-3.2-2.6-.8 0-1.4.4-1.8 1.1h-3.7c.7-2.3 2.8-3.8 5.5-3.8 1.8 0 3.5.9 5 3Zm1.8 2.8.3.5c1.2 1.8 2.2 2.6 3.2 2.6 1.3 0 2.1-1.2 2.1-3s-.8-3-2.1-3c-1 0-2 .8-3.2 2.6l-.3.3Z"
            fill="var(--brand-mark-accent)"
          />
        </svg>
      </span>
      {withWordmark && (
        <span className="brand-wordmark">
          <span className="brand-wordmark-main">DEV Infinity</span>
          <span className="brand-wordmark-sub">Software studio</span>
        </span>
      )}
    </span>
  );
}

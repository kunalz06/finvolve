"use client";

export default function Card({
  children,
  className = "",
  hover = true,
  ...props
}) {
  return (
    <div
      className={`glass-surface rounded-2xl p-6 sm:p-7 md:p-8 ${hover ? "hover:-translate-y-1 hover:shadow-[var(--shadow)]" : ""} transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

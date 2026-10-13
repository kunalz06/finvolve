"use client";

export default function Card({
  children,
  className = "",
  hover = true,
  ...props
}) {
  return (
    <div
      className={`card-shell p-5 sm:p-6 md:p-7 ${hover ? "hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]" : ""} transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

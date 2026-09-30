"use client";

import Link from "next/link";

export default function Button({
  children,
  href,
  variant = "primary",
  size = "default",
  className = "",
  icon: Icon,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-xl text-center font-bold transition-all duration-200 focus-visible:outline-none";

  const variants = {
    primary:
      "brand-gradient border border-white/15 !text-white shadow-[var(--shadow-soft)] hover:-translate-y-1 hover:!text-white hover:shadow-[var(--shadow-color)]",
    secondary:
      "border border-[var(--border-soft)] bg-[var(--surface-strong)] !text-[var(--heading)] shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:border-[var(--primary)]/25 hover:bg-[var(--primary-soft)] hover:!text-[var(--heading)]",
    outline:
      "border border-[var(--primary)]/35 bg-transparent !text-[var(--primary)] hover:bg-[var(--primary-soft)] hover:!text-[var(--primary)]",
    ghost:
      "border border-transparent bg-transparent !text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:!text-[var(--heading)]",
    danger:
      "border border-[var(--red-primary)] bg-[var(--red-primary)] !text-white shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:bg-[var(--red-secondary)] hover:!text-white",
    success:
      "border border-[var(--accent-mint)] bg-[var(--accent-mint)] !text-white shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:opacity-90 hover:!text-white",
    warning:
      "border border-[var(--accent-amber)] bg-[var(--accent-amber)] !text-white shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:opacity-90 hover:!text-white",
    red:
      "border border-[var(--red-primary)] bg-[var(--red-soft)] !text-[var(--red-primary)] hover:-translate-y-0.5 hover:!text-[var(--red-dark)]",
    glass:
      "border border-[var(--border-soft)] bg-[var(--surface)] !text-[var(--foreground)] hover:bg-[var(--surface-strong)] hover:!text-[var(--heading)]",
  };

  const sizes = {
    xsmall: "px-3 py-1.5 text-xs",
    small: "px-4 py-2.5 text-sm",
    default: "px-5 py-3 text-sm md:px-6",
    large: "px-6 py-3.5 text-sm md:px-7 md:py-4 md:text-base",
    icon: "h-11 w-11 p-0",
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClassName} {...props}>
        {children}
        {Icon && <Icon size={18} />}
      </Link>
    );
  }

  return (
    <button className={combinedClassName} {...props}>
      {children}
      {Icon && <Icon size={18} />}
    </button>
  );
}

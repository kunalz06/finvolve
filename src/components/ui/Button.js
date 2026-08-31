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
  const baseStyles = "inline-flex items-center justify-center gap-2 text-center transition-all duration-200";
  
  const variants = {
    primary: "rounded-xl border-2 border-[var(--border)] bg-[var(--primary)] !text-white shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:bg-[var(--primary-hover)] hover:!text-white font-bold",
    secondary: "rounded-xl border-2 border-[var(--border)] bg-[var(--surface-strong)] !text-[var(--foreground)] shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:bg-[var(--primary-soft)] hover:!text-[var(--foreground)] font-bold",
    outline: "rounded-xl border-2 border-[var(--border)] bg-transparent !text-[var(--foreground)] hover:bg-[var(--surface-muted)] hover:!text-[var(--foreground)] font-bold",
    ghost: "rounded-xl border-2 border-transparent bg-transparent !text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:!text-[var(--foreground)] font-bold",
    danger: "rounded-xl border-2 border-[var(--red-primary)] bg-[var(--red-primary)] !text-white shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:bg-[var(--red-secondary)] hover:!text-white font-bold",
    success: "rounded-xl border-2 border-[var(--accent-mint)] bg-[var(--accent-mint)] !text-white shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:bg-[var(--accent-mint)]/80 hover:!text-white font-bold",
    warning: "rounded-xl border-2 border-[var(--accent-amber)] bg-[var(--accent-amber)] !text-white shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:bg-[var(--accent-amber)]/80 hover:!text-white font-bold",
    red: "rounded-xl border-2 border-[var(--red-primary)] bg-[var(--red-soft)] !text-[var(--red-primary)] shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:bg-[var(--red-light)] hover:!text-[var(--red-dark)] font-bold",
    glass: "glass-chip-strong rounded-full border-transparent bg-transparent !text-slate-600 hover:bg-white/85 hover:!text-slate-900 font-semibold",
  };

  const sizes = {
    xsmall: "px-3 py-1.5 text-xs",
    small: "px-4 py-2 text-sm",
    default: "px-5 py-3 text-sm md:px-6",
    large: "px-6 py-3.5 text-sm md:px-8 md:py-4 md:text-base",
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

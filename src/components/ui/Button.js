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
  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-xl border-2 text-center font-bold transition-all duration-200";
  
  const variants = {
    primary: "border-[var(--border)] bg-[var(--primary)] text-white shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:bg-[var(--primary-hover)]",
    secondary: "border-[var(--border)] bg-[var(--surface-strong)] text-[var(--foreground)] shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:bg-[var(--primary-soft)]",
    outline: "border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--surface-muted)]",
    ghost: "border-transparent bg-transparent text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]",
  };

  const sizes = {
    small: "px-4 py-2.5 text-sm",
    default: "px-5 py-3 text-sm md:px-6",
    large: "px-6 py-3.5 text-sm md:px-8 md:py-4 md:text-base",
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

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
  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-full border font-semibold backdrop-blur-xl transition-all duration-300";
  
  const variants = {
    primary: "border-white/35 bg-[linear-gradient(135deg,rgba(124,92,255,0.95),rgba(105,183,255,0.85))] text-white shadow-[0_18px_40px_rgba(103,88,255,0.28)] hover:-translate-y-0.5 hover:shadow-[0_24px_52px_rgba(103,88,255,0.34)]",
    secondary: "glass-surface border-white/60 text-slate-800 hover:-translate-y-0.5 hover:border-white/85 hover:bg-white/60",
    outline: "border-white/40 bg-white/14 text-slate-700 hover:bg-white/28 hover:text-slate-900",
    ghost: "border-transparent bg-transparent text-slate-600 hover:bg-white/28 hover:text-slate-900",
  };

  const sizes = {
    small: "px-4 py-2.5 text-sm",
    default: "px-6 py-3 text-sm",
    large: "px-8 py-4 text-base",
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

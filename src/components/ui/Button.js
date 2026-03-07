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
  const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 rounded-xl";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover shadow-button hover:shadow-lg hover:-translate-y-0.5",
    secondary: "bg-white text-primary border-2 border-primary hover:bg-purple-50",
    outline: "bg-transparent text-primary border-2 border-primary hover:bg-purple-50",
    ghost: "bg-transparent text-gray-600 hover:text-primary hover:bg-gray-100",
  };

  const sizes = {
    small: "px-4 py-2 text-sm",
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

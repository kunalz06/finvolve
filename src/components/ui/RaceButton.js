"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { forwardRef, useEffect, useState } from "react";

export const RaceButton = forwardRef((
  { 
    children, 
    className = "", 
    disabled = false,
    loading = false,
    icon: Icon = null,
    variant = "primary",
    ...props 
  }, 
  ref
) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 50 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 50 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    if (!ref?.current || disabled) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const baseClasses = `relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-transparent text-sm font-bold transition-all duration-500`;
  
  const variants = {
    primary: `bg-[var(--primary)] text-white shadow-[inset_0_0_0_1px_var(--border),inset_0_2px_8px_rgba(0,0,0,0.1)] hover:bg-[var(--primary-soft)] hover:border-[var(--border)]`,
    secondary: `bg-[var(--surface-strong)] text-[var(--foreground)] border-2 border-[var(--border)] hover:bg-[var(--surface-muted)]`,
    ghost: `bg-transparent text-[var(--foreground)] hover:bg-[var(--surface-muted)]`,
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      style={isHovered ? { rotateX, rotateY, transformStyle: "preserve-3d" } : {}}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...props}
    >
      {loading ? <span className="animate-spin" /> : <>{Icon && <Icon size={16} />}{children}</>}
    </motion.button>
  );
});

RaceButton.displayName = "RaceButton";

export default RaceButton;

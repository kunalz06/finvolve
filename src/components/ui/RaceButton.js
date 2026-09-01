"use client";

import { forwardRef, useState, useRef, useEffect } from "react";
import { animate as _aa } from "animejs";const runAnim=(p)=>{const{targets,...r}=p;return _aa(targets,r);};
import { cn } from "@/lib/utils";

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
  const buttonRef = useRef(null);
  const x = useRef(0);
  const y = useRef(0);

  const handleMouseMove = (e) => {
    if (!buttonRef.current || disabled) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.current = xPct;
    y.current = yPct;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    x.current = 0;
    y.current = 0;
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

  // Apply 3D tilt effect using CSS transform
  const getTransform = () => {
    if (!isHovered || disabled) return "none";
    const rotateX = y.current * -10;
    const rotateY = x.current * 10;
    return `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  // Handle tap animation
  const handleMouseDown = () => {
    if (disabled) return;
    if (buttonRef.current) {
      runAnim({
        targets: buttonRef.current,
        scale: 0.98,
        duration: 100,
        easing: "easeOutQuad",
        complete: () => {
          runAnim({
            targets: buttonRef.current,
            scale: 1.02,
            duration: 100,
            easing: "easeOutQuad"
          });
        }
      });
    }
  };

  // Handle hover animation
  useEffect(() => {
    if (buttonRef.current && isHovered && !disabled) {
      runAnim({
        targets: buttonRef.current,
        scale: 1.02,
        duration: 200,
        easing: "easeOutQuad"
      });
    } else if (buttonRef.current && !isHovered && !disabled) {
      runAnim({
        targets: buttonRef.current,
        scale: 1,
        duration: 200,
        easing: "easeOutQuad"
      });
    }
  }, [isHovered, disabled]);

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      style={{ transform: getTransform(), transformStyle: "preserve-3d" }}
      {...props}
    >
      {loading ? <span className="animate-spin" /> : <>{Icon && <Icon size={16} />}{children}</>}
    </button>
  );
});

RaceButton.displayName = "RaceButton";

export default RaceButton;

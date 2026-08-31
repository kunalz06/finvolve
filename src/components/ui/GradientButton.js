"use client";

import { useRef, useEffect, forwardRef } from "react";
import * as anime from "animejs";

export const GradientButton = forwardRef(({ children, className = "", ...props }, ref) => {
  const buttonRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    if (buttonRef.current) {
      const handleMouseEnter = () => {
        anime({
          targets: buttonRef.current,
          scale: 1.05,
          boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
          duration: 300,
          easing: "easeOutQuad"
        });
        if (innerRef.current) {
          anime({
            targets: innerRef.current,
            opacity: 1,
            duration: 300,
            easing: "easeInOutQuad"
          });
        }
      };

      const handleMouseLeave = () => {
        anime({
          targets: buttonRef.current,
          scale: 1,
          boxShadow: "",
          duration: 300,
          easing: "easeOutQuad"
        });
        if (innerRef.current) {
          anime({
            targets: innerRef.current,
            opacity: 0,
            duration: 300,
            easing: "easeInOutQuad"
          });
        }
      };

      const element = buttonRef.current;
      element.addEventListener("mouseenter", handleMouseEnter);
      element.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        element.removeEventListener("mouseenter", handleMouseEnter);
        element.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, []);

  return (
    <button
      ref={buttonRef}
      className={`relative overflow-hidden rounded-full px-6 py-3 text-sm font-semibold text-white transition-all duration-300 ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <div
        ref={innerRef}
        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0"
      />
    </button>
  );
});

GradientButton.displayName = "GradientButton";

export default GradientButton;

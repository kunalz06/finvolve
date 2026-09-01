"use client";

import { useRef, useEffect } from "react";
import { animate as animeAnimate } from "animejs";

// animejs v4 uses animate(targets, params) but code uses v3-style animate({targets, ...params})
const runAnim = (params) => {
  const { targets, ...rest } = params;
  return animeAnimate(targets, rest);
};

export default function GlassCard({ children, className = "", hoverEffect = true }) {
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current && hoverEffect) {
      const handleMouseEnter = () => {
        runAnim({
          targets: cardRef.current,
          scale: 1.02,
          y: -2,
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          duration: 300,
          easing: "easeOutQuad"
        });
      };
      const handleMouseLeave = () => {
        runAnim({
          targets: cardRef.current,
          scale: 1,
          y: 0,
          boxShadow: "",
          duration: 300,
          easing: "easeOutQuad"
        });
      };
      const element = cardRef.current;
      element.addEventListener("mouseenter", handleMouseEnter);
      element.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        element.removeEventListener("mouseenter", handleMouseEnter);
        element.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [hoverEffect]);

  return (
    <div
      ref={cardRef}
      className={`glass-surface rounded-xl p-4 backdrop-blur-md ${hoverEffect ? 'transition-all duration-300' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

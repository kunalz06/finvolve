"use client";

import { useRef, useEffect } from "react";
import * as anime from "animejs";

export default function RaceCard({ children, className = "" }) {
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      const handleMouseEnter = () => {
        anime({
          targets: cardRef.current,
          scale: 1.02,
          y: -2,
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          duration: 300,
          easing: "easeOutQuad"
        });
      };

      const handleMouseLeave = () => {
        anime({
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
  }, []);

  return (
    <div
      ref={cardRef}
      className={`glass-surface rounded-xl p-4 backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  );
}

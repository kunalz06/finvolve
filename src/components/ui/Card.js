"use client";

import { AnimatedDiv } from "./Animated";

export default function Card({ 
  children, 
  className = "", 
  delay = 0,
  hover = true,
  ...props 
}) {
  return (
    <AnimatedDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`glass-surface rounded-2xl p-8 ${hover ? 'hover:-translate-x-0.5 hover:-translate-y-0.5' : ''} transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </AnimatedDiv>
  );
}

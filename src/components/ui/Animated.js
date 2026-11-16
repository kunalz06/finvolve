"use client";

import { forwardRef, useEffect, useRef } from "react";
import { animateSurface, motionStyle } from "@/lib/ui/liquid-motion.mjs";

// Preserve the legacy API without its incompatible animation-engine adapter.
// Final values render on the server, including the wizard progress scale.
export const createAnimatedComponent = (tag, displayName) => {
  const Component = forwardRef(function AnimatedElement({
    initial = {}, animate = {}, transition = {}, whileInView,
    viewport, whileHover: _hover, whileTap: _tap,
    onAnimationComplete, onAnimationStart, style, ...props
  }, ref) {
    const localRef = useRef(null);
    const callbacks = useRef({ onAnimationComplete, onAnimationStart });
    callbacks.current = { onAnimationComplete, onAnimationStart };
    const animationKey = JSON.stringify({ initial, animate, transition, whileInView, viewport });
    useEffect(() => {
      const element = localRef.current;
      if (!element) return;
      const config = JSON.parse(animationKey);
      const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
      let animation;
      let observer;
      const run = () => {
        animation?.cancel();
        if (preference.matches) return;
        animation = animateSurface(element, [
          motionStyle(config.initial || {}),
          motionStyle(config.whileInView || config.animate),
        ], { duration: (config.transition.duration ?? .38) * 1000, delay: (config.transition.delay ?? 0) * 1000 });
        if (animation) {
          callbacks.current.onAnimationStart?.();
          animation.onfinish = () => callbacks.current.onAnimationComplete?.();
        }
      };
      if (config.whileInView && window.IntersectionObserver) {
        observer = new IntersectionObserver((entries) => {
          if (entries.some((entry) => entry.isIntersecting)) { run(); observer.disconnect(); }
        }, { threshold: config.viewport?.amount || .06 });
        observer.observe(element);
      } else run();
      const reduce = () => { if (preference.matches) animation?.cancel(); };
      preference.addEventListener("change", reduce);
      return () => { animation?.cancel(); observer?.disconnect(); preference.removeEventListener("change", reduce); };
    }, [animationKey]);
    const Element = tag;
    return <Element ref={(node) => {
      localRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    }} style={{ ...motionStyle(animate), ...style }} {...props} />;
  });
  Component.displayName = displayName || `Animated${tag}`;
  return Component;
};

export const AnimatedDiv = createAnimatedComponent("div", "AnimatedDiv");
export const AnimatedSpan = createAnimatedComponent("span", "AnimatedSpan");
export const AnimatedButton = createAnimatedComponent("button", "AnimatedButton");
export const AnimatedP = createAnimatedComponent("p", "AnimatedP");
export const AnimatedH1 = createAnimatedComponent("h1", "AnimatedH1");
export const AnimatedH2 = createAnimatedComponent("h2", "AnimatedH2");
export const AnimatedH3 = createAnimatedComponent("h3", "AnimatedH3");
export const AnimatedSection = createAnimatedComponent("section", "AnimatedSection");
export const AnimatedArticle = createAnimatedComponent("article", "AnimatedArticle");
export const AnimatedHeader = createAnimatedComponent("header", "AnimatedHeader");
export const AnimatedFooter = createAnimatedComponent("footer", "AnimatedFooter");
export const AnimatedComponents = {
  div: AnimatedDiv, span: AnimatedSpan, button: AnimatedButton,
  p: AnimatedP, h1: AnimatedH1, h2: AnimatedH2, h3: AnimatedH3,
  section: AnimatedSection, article: AnimatedArticle,
  header: AnimatedHeader, footer: AnimatedFooter, createAnimatedComponent,
};
export default AnimatedComponents;

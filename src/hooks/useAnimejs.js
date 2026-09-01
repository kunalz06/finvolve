"use client";

import { useEffect, useRef, useCallback } from "react";
import anime from "animejs";

/**
 * Custom hook for animejs animations
 * Handles common animation patterns used throughout the app
 */
export function useAnimejs() {
  const animatedElements = useRef(new Map());

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      animatedElements.current.forEach((anim, key) => {
        if (anim && typeof anim.pause === "function") {
          anim.pause();
        }
      });
      animatedElements.current.clear();
    };
  }, []);

  /**
   * Animate element with fade in effect
   * @param {HTMLElement} element - The element to animate
   * @param {Object} options - Animation options
   */
  const fadeIn = useCallback((element, options = {}) => {
    if (!element) return null;

    const anim = anime({
      targets: element,
      opacity: [0, 1],
      duration: options.duration || 500,
      easing: options.easing || "easeOutQuad",
      delay: options.delay || 0,
      begin: options.begin,
      complete: options.complete,
      loop: options.loop || false,
      direction: options.direction || "normal",
      autoplay: true,
    });

    const animId = Date.now().toString();
    animatedElements.current.set(animId, anim);

    return animId;
  }, []);

  /**
   * Animate element with slide in from bottom
   * @param {HTMLElement} element - The element to animate
   * @param {Object} options - Animation options
   */
  const slideInUp = useCallback((element, options = {}) => {
    if (!element) return null;

    const anim = anime({
      targets: element,
      opacity: [0, 1],
      translateY: [options.distance || 20, 0],
      duration: options.duration || 500,
      easing: options.easing || "easeOutCubic",
      delay: options.delay || 0,
      begin: options.begin,
      complete: options.complete,
      autoplay: true,
    });

    const animId = Date.now().toString();
    animatedElements.current.set(animId, anim);

    return animId;
  }, []);

  /**
   * Animate element with slide in from left
   * @param {HTMLElement} element - The element to animate
   * @param {Object} options - Animation options
   */
  const slideInLeft = useCallback((element, options = {}) => {
    if (!element) return null;

    const anim = anime({
      targets: element,
      opacity: [0, 1],
      translateX: [options.distance || -20, 0],
      duration: options.duration || 500,
      easing: options.easing || "easeOutCubic",
      delay: options.delay || 0,
      begin: options.begin,
      complete: options.complete,
      autoplay: true,
    });

    const animId = Date.now().toString();
    animatedElements.current.set(animId, anim);

    return animId;
  }, []);

  /**
   * Animate element with slide in from right
   * @param {HTMLElement} element - The element to animate
   * @param {Object} options - Animation options
   */
  const slideInRight = useCallback((element, options = {}) => {
    if (!element) return null;

    const anim = anime({
      targets: element,
      opacity: [0, 1],
      translateX: [options.distance || 20, 0],
      duration: options.duration || 500,
      easing: options.easing || "easeOutCubic",
      delay: options.delay || 0,
      begin: options.begin,
      complete: options.complete,
      autoplay: true,
    });

    const animId = Date.now().toString();
    animatedElements.current.set(animId, anim);

    return animId;
  }, []);

  /**
   * Animate element with scale effect (for buttons, icons, etc.)
   * @param {HTMLElement} element - The element to animate
   * @param {Object} options - Animation options
   */
  const scaleIn = useCallback((element, options = {}) => {
    if (!element) return null;

    const anim = anime({
      targets: element,
      opacity: [0, 1],
      scale: [options.from || 0.8, options.to || 1],
      duration: options.duration || 300,
      easing: options.easing || "easeOutBack",
      delay: options.delay || 0,
      begin: options.begin,
      complete: options.complete,
      autoplay: true,
    });

    const animId = Date.now().toString();
    animatedElements.current.set(animId, anim);

    return animId;
  }, []);

  /**
   * Animate element with bounce effect
   * @param {HTMLElement} element - The element to animate
   * @param {Object} options - Animation options
   */
  const bounceIn = useCallback((element, options = {}) => {
    if (!element) return null;

    const anim = anime({
      targets: element,
      opacity: [0, 1],
      translateY: [100, -20, 0],
      duration: options.duration || 800,
      easing: "easeOutBounce",
      delay: options.delay || 0,
      begin: options.begin,
      complete: options.complete,
      autoplay: true,
    });

    const animId = Date.now().toString();
    animatedElements.current.set(animId, anim);

    return animId;
  }, []);

  /**
   * Animate element with fade in and scale (combined)
   * @param {HTMLElement} element - The element to animate
   * @param {Object} options - Animation options
   */
  const fadeInScale = useCallback((element, options = {}) => {
    if (!element) return null;

    const anim = anime({
      targets: element,
      opacity: [0, 1],
      scale: [options.from || 0, options.to || 1],
      duration: options.duration || 500,
      easing: options.easing || "easeOutBack",
      delay: options.delay || 0,
      begin: options.begin,
      complete: options.complete,
      autoplay: true,
    });

    const animId = Date.now().toString();
    animatedElements.current.set(animId, anim);

    return animId;
  }, []);

  /**
   * Animate on scroll (Intersection Observer pattern)
   * @param {HTMLElement} element - The element to animate
   * @param {Object} options - Animation options
   */
  const animateOnScroll = useCallback((element, animationType = "fadeIn", options = {}) => {
    if (!element) return null;

    const animMap = {
      fadeIn: fadeIn,
      slideInUp,
      slideInLeft,
      slideInRight,
      scaleIn,
      bounceIn,
      fadeInScale,
    };

    const animFn = animMap[animationType] || fadeIn;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animFn(entry.target, options);
            if (options.unobserve !== false) {
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: options.threshold || 0.1 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [fadeIn, slideInUp, slideInLeft, slideInRight, scaleIn, bounceIn, fadeInScale]);

  /**
   * Continuous pulse animation for attention grabbing
   * @param {HTMLElement} element - The element to animate
   * @param {Object} options - Animation options
   */
  const pulse = useCallback((element, options = {}) => {
    if (!element) return null;

    const anim = anime({
      targets: element,
      opacity: [1, options.opacity || 0.7, 1],
      scale: [1, options.scale || 1.02, 1],
      duration: options.duration || 2000,
      easing: "easeInOutSine",
      loop: true,
      direction: "alternate",
      autoplay: true,
    });

    const animId = Date.now().toString();
    animatedElements.current.set(animId, anim);

    return animId;
  }, []);

  /**
   * Shake animation for error states
   * @param {HTMLElement} element - The element to animate
   * @param {Object} options - Animation options
   */
  const shake = useCallback((element, options = {}) => {
    if (!element) return null;

    const anim = anime({
      targets: element,
      translateX: [0, -10, 10, -10, 10, 0],
      duration: options.duration || 400,
      easing: "easeInOutSine",
      loop: options.loop || false,
      autoplay: true,
    });

    const animId = Date.now().toString();
    animatedElements.current.set(animId, anim);

    return animId;
  }, []);

  /**
   * Float animation for hovering effects
   * @param {HTMLElement} element - The element to animate
   * @param {Object} options - Animation options
   */
  const float = useCallback((element, options = {}) => {
    if (!element) return null;

    const anim = anime({
      targets: element,
      translateY: [0, options.distance || -5, 0],
      duration: options.duration || 3000,
      easing: "easeInOutSine",
      loop: true,
      direction: "alternate",
      autoplay: true,
    });

    const animId = Date.now().toString();
    animatedElements.current.set(animId, anim);

    return animId;
  }, []);

  /**
   * Stop animation by ID
   * @param {string} animId - The animation ID to stop
   */
  const stopAnimation = useCallback((animId) => {
    if (animatedElements.current.has(animId)) {
      const anim = animatedElements.current.get(animId);
      if (anim && typeof anim.pause === "function") {
        anim.pause();
      }
      animatedElements.current.delete(animId);
    }
  }, []);

  /**
   * Complex orbital animation for multiple elements
   * @param {HTMLElement[]} elements - Array of elements to animate in orbit
   * @param {Object} options - Animation options
   */
  const orbitalAnimation = useCallback((elements, options = {}) => {
    if (!elements || elements.length === 0) return null;

    const radius = options.radius || 150;
    const centerX = options.centerX || window.innerWidth / 2;
    const centerY = options.centerY || window.innerHeight / 2;
    const duration = options.duration || 20000;

    const animations = elements.map((el, index) => {
      const angle = (index / elements.length) * 360;
      const anim = anime({
        targets: el,
        translateX: radius * Math.cos((angle * Math.PI) / 180),
        translateY: radius * Math.sin((angle * Math.PI) / 180),
        x: centerX,
        y: centerY,
        duration: duration,
        easing: "linear",
        loop: true,
        autoplay: true,
      });
      return anim;
    });

    return animations;
  }, []);

  return {
    fadeIn,
    slideInUp,
    slideInLeft,
    slideInRight,
    scaleIn,
    bounceIn,
    fadeInScale,
    animateOnScroll,
    pulse,
    shake,
    float,
    orbitalAnimation,
    stopAnimation,
  };
}

// Higher-order component for simple animations
export function withAnimejs(WrappedComponent, animationType = "fadeIn", options = {}) {
  return function WithAnimejs(props) {
    const elementRef = useRef(null);
    const animationMethods = useAnimejs();
    const animationFn = animationMethods[animationType] || animationMethods.fadeIn;

    useEffect(() => {
      if (elementRef.current) {
        animationFn(elementRef.current, options);
      }
    }, [animationFn, options]);

    return <WrappedComponent ref={elementRef} {...props} />;
  };
}

export default useAnimejs;

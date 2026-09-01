"use client";

import { useEffect, useRef, forwardRef } from "react";
import { useAnimejs } from "@/hooks/useAnimejs";
import { animate as animeAnimate } from "animejs";

// animejs v4 uses animate(targets, params) but code uses v3-style animate({targets, ...params})
const runAnim = (params) => {
  const { targets, ...rest } = params;
  return animeAnimate(targets, rest);
};

/**
 * Animated component - a drop-in replacement for framer-motion's motion components
 * Uses animejs for animations
 * 
 * @example
 * <Animated.div
 *   initial={{ opacity: 0, y: 20 }}
 *   animate={{ opacity: 1, y: 0 }}
 *   transition={{ duration: 0.5 }}
 *   className="my-element"
 * >
 *   Content
 * </Animated.div>
 */

// Map framer-motion easing to animejs easing
const easingMap = {
  "linear": "linear",
  "easeIn": "easeInSine",
  "easeOut": "easeOutSine",
  "easeInOut": "easeInOutSine",
  "easeInQuad": "easeInQuad",
  "easeOutQuad": "easeOutQuad",
  "easeInOutQuad": "easeInOutQuad",
  "easeInCubic": "easeInCubic",
  "easeOutCubic": "easeOutCubic",
  "easeInOutCubic": "easeInOutCubic",
  "easeInQuart": "easeInQuart",
  "easeOutQuart": "easeOutQuart",
  "easeInOutQuart": "easeInOutQuart",
  "easeInQuint": "easeInQuint",
  "easeOutQuint": "easeOutQuint",
  "easeInOutQuint": "easeInOutQuint",
  "easeInExpo": "easeInExpo",
  "easeOutExpo": "easeOutExpo",
  "easeInOutExpo": "easeInOutExpo",
  "easeInCirc": "easeInCirc",
  "easeOutCirc": "easeOutCirc",
  "easeInOutCirc": "easeInOutCirc",
  "easeInBack": "easeInBack",
  "easeOutBack": "easeOutBack",
  "easeInOutBack": "easeInOutBack",
  "easeInElastic": "easeInElastic",
  "easeOutElastic": "easeOutElastic",
  "easeInOutElastic": "easeInOutElastic",
  "easeInBounce": "easeInBounce",
  "easeOutBounce": "easeOutBounce",
  "easeInOutBounce": "easeInOutBounce",
  "anticipate": "easeInBack",
  default: "easeOutQuad",
};

// Convert framer-motion transition to animejs options
const convertTransition = (transition = {}) => {
  const result = {};
  
  if (transition.delay !== undefined) {
    result.delay = transition.delay * 1000; // framer uses seconds, anime uses ms
  }
  if (transition.duration !== undefined) {
    result.duration = transition.duration * 1000; // framer uses seconds, anime uses ms
  }
  if (transition.ease !== undefined) {
    result.easing = easingMap[transition.ease] || easingMap.default;
  }
  if (transition.type !== undefined) {
    // Handle spring types
    if (transition.type === "spring") {
      result.easing = "easeOutElastic";
    }
  }
  if (transition.damping !== undefined || transition.stiffness !== undefined) {
    // Spring physics - approximate with elastic easing
    result.easing = "easeOutElastic";
  }
  if (transition.repeat !== undefined) {
    result.loop = transition.repeat === Infinity || transition.repeat > 0;
  }
  if (transition.repeatType !== undefined) {
    result.direction = transition.repeatType === "reverse" ? "alternate" : "normal";
  }
  
  return result;
};

// Convert framer-motion values to animejs values
// Handles variants like { opacity: [0, 1] } or { opacity: 1 }
const convertValues = (initial = {}, animate = {}, isInitial = false) => {
  const result = {};
  
  // Merge initial and animate
  const target = isInitial ? initial : { ...initial, ...animate };
  
  for (const [key, value] of Object.entries(target)) {
    if (value === undefined || value === null) continue;
    
    // Handle array values (from-to animation)
    if (Array.isArray(value)) {
      if (value.length === 2) {
        result[key] = isInitial ? value[0] : [value[0], value[1]];
      } else if (value.length === 1) {
        result[key] = isInitial ? value[0] : [value[0], value[0]];
      }
    } else if (typeof value === "number" || typeof value === "string") {
      // Single value
      result[key] = isInitial ? value : [isInitial ? value : (initial[key] !== undefined ? initial[key] : value), value];
    } else if (typeof value === "object") {
      // Nested object (e.g., for color values)
      result[key] = value;
    }
  }
  
  return result;
};

/**
 * Animated div component
 */
export const AnimatedDiv = forwardRef(({ 
  initial = {},
  animate = {},
  transition = {},
  whileInView = null,
  viewport = null,
  whileHover = null,
  whileTap = null,
  onAnimationComplete = null,
  onAnimationStart = null,
  children,
  className = "",
  style = {},
  ...props
}, ref) => {
  const elementRef = useRef(null);
  const animationRef = useRef(null);
  const hasAnimated = useRef(false);

  // Combine refs
  const combinedRef = (node) => {
    elementRef.current = node;
    if (ref) {
      if (typeof ref === "function") ref(node);
      else ref.current = node;
    }
  };

  // Handle viewport scroll animations
  useEffect(() => {
    if (!elementRef.current) return;

    // If whileInView is specified, use IntersectionObserver
    if (whileInView) {
      const handleIntersection = (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            animateIn();
            hasAnimated.current = true;
          }
        });
      };

      const observer = new IntersectionObserver(
        handleIntersection,
        {
          threshold: viewport?.threshold || 0.1,
          once: viewport?.once !== false,
        }
      );

      observer.observe(elementRef.current);
      
      return () => {
        observer.disconnect();
        if (animationRef.current) {
          animationRef.current.pause();
        }
      };
    } else {
      // Immediate animation
      animateIn();
      
      return () => {
        if (animationRef.current) {
          animationRef.current.pause();
        }
      };
    }
  }, [whileInView, viewport]);

  const animateIn = () => {
    if (!elementRef.current) return;

    const animOptions = {
      targets: elementRef.current,
      ...convertValues(initial, animate),
      ...convertTransition(transition),
      autoplay: true,
      begin: () => {
        // Set initial styles
        if (initial && !hasAnimated.current) {
          const initialStyles = convertValues(initial, {}, true);
          Object.assign(elementRef.current.style, initialStyles);
        }
        if (onAnimationStart) onAnimationStart();
      },
      complete: () => {
        if (onAnimationComplete) onAnimationComplete();
      },
    };

    animationRef.current = runAnim(animOptions);
  };

  // Handle hover animations
  useEffect(() => {
    if (!elementRef.current || !whileHover) return;

    const handleMouseEnter = () => {
      const anim = runAnim({
        targets: elementRef.current,
        ...convertValues({}, whileHover),
        duration: 200,
        easing: "easeOutQuad",
        autoplay: true,
      });
      return anim;
    };

    const handleMouseLeave = () => {
      // Animate back to original state
      if (animationRef.current) {
        runAnim({
          targets: elementRef.current,
          ...convertValues(initial, animate),
          duration: 200,
          easing: "easeOutQuad",
          autoplay: true,
        });
      }
    };

    elementRef.current.addEventListener("mouseenter", handleMouseEnter);
    elementRef.current.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      elementRef.current?.removeEventListener("mouseenter", handleMouseEnter);
      elementRef.current?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [whileHover, initial, animate]);

  // Handle tap animations
  useEffect(() => {
    if (!elementRef.current || !whileTap) return;

    const handleClick = () => {
      const anim = runAnim({
        targets: elementRef.current,
        scale: 0.95,
        duration: 100,
        easing: "easeOutQuad",
        autoplay: true,
        complete: () => {
          runAnim({
            targets: elementRef.current,
            scale: 1,
            duration: 100,
            easing: "easeOutQuad",
            autoplay: true,
          });
        },
      });
    };

    elementRef.current.addEventListener("click", handleClick);

    return () => {
      elementRef.current?.removeEventListener("click", handleClick);
    };
  }, [whileTap]);

  // Combine className and style
  const combinedStyle = {
    ...style,
    // Ensure element starts with initial state
    opacity: initial.opacity || initial.opacity === 0 ? initial.opacity : undefined,
    transform: initial.scale || initial.x || initial.y || initial.translateX || initial.translateY 
      ? `scale(${initial.scale || 1}) translate(${initial.translateX || initial.x || 0}px, ${initial.translateY || initial.y || 0}px)`
      : undefined,
  };

  return (
    <div
      ref={combinedRef}
      className={className}
      style={combinedStyle}
      {...props}
    >
      {children}
    </div>
  );
});

AnimatedDiv.displayName = "AnimatedDiv";

/**
 * Animated span component
 */
export const AnimatedSpan = forwardRef(({ 
  initial = {},
  animate = {},
  transition = {},
  whileHover = null,
  children,
  className = "",
  style = {},
  ...props
}, ref) => {
  const elementRef = useRef(null);

  const combinedRef = (node) => {
    elementRef.current = node;
    if (ref) {
      if (typeof ref === "function") ref(node);
      else ref.current = node;
    }
  };

  useEffect(() => {
    if (!elementRef.current) return;

    const anim = runAnim({
      targets: elementRef.current,
      ...convertValues(initial, animate),
      ...convertTransition(transition),
      autoplay: true,
    });

    return () => {
      if (anim) anim.pause();
    };
  }, [initial, animate, transition]);

  return (
    <span
      ref={combinedRef}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </span>
  );
});

AnimatedSpan.displayName = "AnimatedSpan";

/**
 * Animated button component
 */
export const AnimatedButton = forwardRef(({ 
  initial = {},
  animate = {},
  transition = {},
  whileHover = null,
  whileTap = null,
  children,
  className = "",
  style = {},
  onClick,
  ...props
}, ref) => {
  const elementRef = useRef(null);

  const combinedRef = (node) => {
    elementRef.current = node;
    if (ref) {
      if (typeof ref === "function") ref(node);
      else ref.current = node;
    }
  };

  useEffect(() => {
    if (!elementRef.current) return;

    const anim = runAnim({
      targets: elementRef.current,
      ...convertValues(initial, animate),
      ...convertTransition(transition),
      autoplay: true,
    });

    return () => {
      if (anim) anim.pause();
    };
  }, [initial, animate, transition]);

  // Handle hover and tap
  useEffect(() => {
    if (!elementRef.current) return;

    const handleMouseEnter = () => {
      if (whileHover) {
        runAnim({
          targets: elementRef.current,
          ...convertValues({}, whileHover),
          duration: 200,
          easing: "easeOutQuad",
          autoplay: true,
        });
      }
    };

    const handleMouseLeave = () => {
      if (whileHover) {
        runAnim({
          targets: elementRef.current,
          ...convertValues(initial, animate),
          duration: 200,
          easing: "easeOutQuad",
          autoplay: true,
        });
      }
    };

    const handleClick = (e) => {
      if (whileTap) {
        runAnim({
          targets: elementRef.current,
          scale: 0.95,
          duration: 100,
          easing: "easeOutQuad",
          autoplay: true,
          complete: () => {
            runAnim({
              targets: elementRef.current,
              scale: 1,
              duration: 100,
              easing: "easeOutQuad",
              autoplay: true,
            });
          },
        });
      }
      if (onClick) onClick(e);
    };

    elementRef.current.addEventListener("mouseenter", handleMouseEnter);
    elementRef.current.addEventListener("mouseleave", handleMouseLeave);
    elementRef.current.addEventListener("click", handleClick);

    return () => {
      elementRef.current?.removeEventListener("mouseenter", handleMouseEnter);
      elementRef.current?.removeEventListener("mouseleave", handleMouseLeave);
      elementRef.current?.removeEventListener("click", handleClick);
    };
  }, [whileHover, whileTap, initial, animate, onClick]);

  return (
    <button
      ref={combinedRef}
      className={className}
      style={style}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
});

AnimatedButton.displayName = "AnimatedButton";

/**
 * Animated component factory - creates any animated element
 */
export const createAnimatedComponent = (tag, displayName) => {
  const Component = forwardRef(({ 
    initial = {},
    animate = {},
    transition = {},
    whileHover = null,
    whileTap = null,
    children,
    className = "",
    style = {},
    ...props
  }, ref) => {
    const elementRef = useRef(null);
    const ElementType = tag;

    const combinedRef = (node) => {
      elementRef.current = node;
      if (ref) {
        if (typeof ref === "function") ref(node);
        else ref.current = node;
      }
    };

    useEffect(() => {
      if (!elementRef.current) return;

      const anim = runAnim({
        targets: elementRef.current,
        ...convertValues(initial, animate),
        ...convertTransition(transition),
        autoplay: true,
      });

      return () => {
        if (anim) anim.pause();
      };
    }, [initial, animate, transition]);

    return (
      <ElementType
        ref={combinedRef}
        className={className}
        style={style}
        {...props}
      >
        {children}
      </ElementType>
    );
  });
  
  Component.displayName = displayName || `Animated${tag}`;
  return Component;
};

// Pre-created animated elements
export const AnimatedP = createAnimatedComponent("p", "AnimatedP");
export const AnimatedH1 = createAnimatedComponent("h1", "AnimatedH1");
export const AnimatedH2 = createAnimatedComponent("h2", "AnimatedH2");
export const AnimatedH3 = createAnimatedComponent("h3", "AnimatedH3");
export const AnimatedSection = createAnimatedComponent("section", "AnimatedSection");
export const AnimatedArticle = createAnimatedComponent("article", "AnimatedArticle");
export const AnimatedHeader = createAnimatedComponent("header", "AnimatedHeader");
export const AnimatedFooter = createAnimatedComponent("footer", "AnimatedFooter");

// Export all
const AnimatedComponents = {
  div: AnimatedDiv,
  span: AnimatedSpan,
  button: AnimatedButton,
  p: AnimatedP,
  h1: AnimatedH1,
  h2: AnimatedH2,
  h3: AnimatedH3,
  section: AnimatedSection,
  article: AnimatedArticle,
  header: AnimatedHeader,
  footer: AnimatedFooter,
  createAnimatedComponent,
};

export { AnimatedComponents };
export default AnimatedComponents;

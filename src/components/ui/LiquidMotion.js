"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { animateSurface, revealSurfaces } from "@/lib/ui/liquid-motion.mjs";

export default function LiquidMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const main = document.querySelector(".dev-shell > main");
    if (!main) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cleanup = () => {};
    const setup = () => {
      cleanup();
      if (preference.matches) return;
      const entry = animateSurface(main, [
        { opacity: .7, transform: "translateY(8px)" },
        { opacity: 1, transform: "translateY(0)" },
      ]);
      const selectors = "section, [data-reveal], .card-shell";
      // Animate outer surfaces only, avoiding compounded nested transforms/blur.
      const eligible = (node) => !node.parentElement?.closest(selectors);
      const reveals = revealSurfaces([...main.querySelectorAll(selectors)].filter(eligible), {
        Observer: window.IntersectionObserver,
      });
      const changes = new MutationObserver((records) => {
        for (const record of records) for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.matches(selectors) && eligible(node)) reveals.observe?.(node);
          node.querySelectorAll(selectors).forEach((el) => { if (eligible(el)) reveals.observe?.(el); });
        }
      });
      changes.observe(main, { childList: true, subtree: true });
      const ripples = new Map();
      const press = (event) => {
        if (event.button !== 0 || !(event.target instanceof Element)) return;
        const control = event.target.closest(".liquid-button, .nav-link, .workspace-tab");
        if (!control || control.matches(":disabled, [aria-disabled='true']")) return;
        const bounds = control.getBoundingClientRect();
        const size = Math.max(bounds.width, bounds.height) * 2;
        const ripple = document.createElement("span");
        ripple.className = "liquid-ripple";
        ripple.setAttribute("aria-hidden", "true");
        Object.assign(ripple.style, {
          width: `${size}px`, height: `${size}px`,
          left: `${event.clientX - bounds.left - size / 2}px`,
          top: `${event.clientY - bounds.top - size / 2}px`,
        });
        control.appendChild(ripple);
        const animation = animateSurface(ripple, [
          { transform: "scale(0)", opacity: .22 },
          { transform: "scale(1)", opacity: 0 },
        ], { duration: 520 });
        const remove = () => { ripple.remove(); ripples.delete(ripple); };
        if (animation) { ripples.set(ripple, animation); animation.onfinish = remove; }
        else remove();
      };
      document.addEventListener("pointerdown", press, { passive: true });
      cleanup = () => {
        entry?.cancel();
        reveals.disconnect();
        changes.disconnect();
        document.removeEventListener("pointerdown", press);
        for (const [node, animation] of ripples) { animation.cancel(); node.remove(); }
        ripples.clear();
      };
    };
    setup();
    preference.addEventListener("change", setup);
    return () => { cleanup(); preference.removeEventListener("change", setup); };
  }, [pathname]);

  return null;
}

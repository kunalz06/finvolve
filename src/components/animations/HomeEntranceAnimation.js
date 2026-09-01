"use client";

import { useEffect, useState, useRef } from "react";
import { animate } from "animejs";
import { X } from "lucide-react";

export default function HomeEntranceAnimation({ className = "", onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  
  const houseRef = useRef(null);
  const doorRef = useRef(null);
  const personRef = useRef(null);
  const headRef = useRef(null);
  const bodyRef = useRef(null);
  const leftArmRef = useRef(null);
  const rightArmRef = useRef(null);
  const legsRef = useRef(null);
  const leftLegRef = useRef(null);
  const rightLegRef = useRef(null);
  const smoke1Ref = useRef(null);
  const smoke2Ref = useRef(null);
  const smoke3Ref = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (houseRef.current) {
      animate({ targets: houseRef.current, opacity: [0, 1], translateY: [40, 0], duration: 1000, easing: "easeOutCubic", autoplay: true });
    }
  }, []);

  useEffect(() => {
    if (doorRef.current) {
      if (isVisible) {
        animate({ targets: doorRef.current, translateY: [0, -14], duration: 1500, easing: "easeInOutCubic", delay: 1800, autoplay: true });
      }
    }
  }, [isVisible]);

  useEffect(() => {
    if (personRef.current) {
      animate({ targets: personRef.current, translateX: [-150, 0], translateY: [0, 0], opacity: [0, 1], duration: 2000, easing: "easeOutCubic", delay: 800, autoplay: true });
    }
  }, []);

  useEffect(() => {
    if (headRef.current) {
      animate({ targets: headRef.current, translateY: [0, -2, 0], duration: 600, easing: "easeInOutSine", loop: true, delay: 3000, autoplay: true });
    }
  }, []);

  useEffect(() => {
    if (bodyRef.current) {
      animate({ targets: bodyRef.current, opacity: [0, 1], duration: 500, delay: 1200, easing: "easeOutQuad", autoplay: true });
    }
  }, []);

  useEffect(() => {
    if (leftArmRef.current) {
      animate({ targets: leftArmRef.current, rotate: [0, -20, 0, 15, 0], duration: 2500, easing: "easeInOutSine", loop: true, delay: 3000, autoplay: true });
    }
  }, []);

  useEffect(() => {
    if (rightArmRef.current) {
      animate({ targets: rightArmRef.current, rotate: [0, 20, 0, -15, 0], duration: 2500, easing: "easeInOutSine", loop: true, delay: 3000, autoplay: true });
    }
  }, []);

  useEffect(() => {
    if (leftLegRef.current) {
      animate({ targets: leftLegRef.current, rotate: [0, 8, 0, -8, 0], duration: 1000, easing: "easeInOutSine", loop: true, delay: 3000, autoplay: true });
    }
  }, []);

  useEffect(() => {
    if (rightLegRef.current) {
      animate({ targets: rightLegRef.current, rotate: [0, -8, 0, 8, 0], duration: 1000, easing: "easeInOutSine", loop: true, delay: 3000, autoplay: true });
    }
  }, []);

  useEffect(() => {
    if (isVisible && smoke1Ref.current && smoke2Ref.current && smoke3Ref.current) {
      const s1 = animate({ targets: smoke1Ref.current, scale: [0, 0.8, 0.5, 0], translateY: [-20, -35, -50, -65], opacity: [1, 0.8, 0.4, 0], duration: 2000, easing: "easeInOutQuad", loop: true, delay: 3000, autoplay: true });
      const s2 = animate({ targets: smoke2Ref.current, scale: [0, 0.6, 0.4, 0], translateY: [-30, -50, -75, -95], opacity: [1, 0.6, 0.3, 0], duration: 2500, easing: "easeInOutQuad", loop: true, delay: 3500, autoplay: true });
      const s3 = animate({ targets: smoke3Ref.current, scale: [0, 0.4, 0.3, 0], translateY: [-40, -65, -85, -105], opacity: [1, 0.5, 0.2, 0], duration: 3000, easing: "easeInOutQuad", loop: true, delay: 4000, autoplay: true });
      return () => { s1.pause(); s2.pause(); s3.pause(); };
    }
  }, [isVisible]);

  const handleClose = () => { setShowOverlay(false); if (onClose) onClose(); };
  if (!showOverlay) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm ${className}`}>
      <button onClick={handleClose} className="absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-strong)] border-2 border-[var(--border)] shadow-lg hover:bg-[var(--surface-muted)] transition-colors" aria-label="Close animation">
        <X size={20} className="text-[var(--foreground)]" />
      </button>
      <div className="relative w-full max-w-2xl px-4">
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-[var(--surface-muted)] border-t-2 border-[var(--border)] rounded-t-2xl" />
        <div ref={houseRef} className="relative mx-auto" style={{ opacity: 0, transform: "translateY(40px)" }}>
          <div className="relative w-72 h-56 bg-[var(--surface-strong)] border-2 border-[var(--border)] rounded-t-2xl shadow-2xl overflow-hidden" />
          <div className="absolute -top-10 left-0 right-0 h-20 bg-[var(--red-primary)] border-b-2 border-l-2 border-r-2 border-[var(--border)]" style={{ clipPath: "polygon(0 100%, 50% 0, 100% 100%)" }} />
          <div className="absolute -top-10 left-0 right-0 h-20 overflow-hidden">
            {[...Array(5)].map((_, i) => <div key={i} className="absolute w-full h-3 bg-[var(--red-secondary)] opacity-20" style={{ top: i * 10 + 2, left: i % 2 === 0 ? 0 : 4 }} />)}
          </div>
          <div className="absolute -top-6 right-10 w-8 h-20 bg-[var(--red-dark)] border-2 border-[var(--border)] rounded-t-sm">
            <div className="absolute -top-2 right-1 w-6 h-4 bg-[var(--red-light)] border-2 border-b-0 border-[var(--border)]" />
          </div>
          <div ref={doorRef} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-28 bg-[var(--red-secondary)] border-2 border-[var(--border)] rounded-t-xl shadow-inner">
            <div className="absolute inset-2 bg-[var(--red-primary)] rounded-sm" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-3 h-3 rounded-full bg-[var(--surface)] border border-[var(--border)] shadow" />
              <div className="w-1 h-2 bg-[var(--border)]" style={{ marginLeft: 6 }} />
            </div>
          </div>
          <div className="absolute top-12 left-10 w-14 h-14 bg-[var(--surface-muted)] border-2 border-[var(--border)] rounded-xl">
            <div className="absolute inset-2 grid grid-cols-2 gap-1">
              <div className="bg-[var(--border)] rounded-sm" /><div className="bg-[var(--border)] rounded-sm" />
              <div className="bg-[var(--border)] rounded-sm" /><div className="bg-[var(--border)] rounded-sm" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-0.5 bg-[var(--border)]" /><div className="absolute left-1/2 w-0.5 h-full bg-[var(--border)] -translate-x-1/2" />
            </div>
          </div>
          <div className="absolute top-12 right-10 w-14 h-14 bg-[var(--surface-muted)] border-2 border-[var(--border)] rounded-xl">
            <div className="absolute inset-2 grid grid-cols-2 gap-1">
              <div className="bg-[var(--border)] rounded-sm" /><div className="bg-[var(--border)] rounded-sm" />
              <div className="bg-[var(--border)] rounded-sm" /><div className="bg-[var(--border)] rounded-sm" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-0.5 bg-[var(--border)]" /><div className="absolute left-1/2 w-0.5 h-full bg-[var(--border)] -translate-x-1/2" />
            </div>
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-4 bg-[var(--surface-muted)] border-t-2 border-l-2 border-r-2 border-[var(--border)] rounded-t-sm" />
        </div>
        <div ref={personRef} className="absolute bottom-8 left-1/2 -translate-x-1/2" style={{ transform: "translateX(-150px)", opacity: 0 }}>
          <div className="relative">
            <div ref={headRef} className="relative w-12 h-12 rounded-full bg-[var(--red-primary)] border-2 border-[var(--border)] shadow-lg z-10">
              <div className="absolute -top-3 left-0 right-0 h-4 bg-[var(--red-dark)] rounded-t-full border-2 border-b-0 border-[var(--border)]" />
              <div className="absolute top-3 left-2 w-2 h-2 rounded-full bg-[var(--surface)]" /><div className="absolute top-3 right-2 w-2 h-2 rounded-full bg-[var(--surface)]" />
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-5 h-2 border-b-2 border-[var(--surface)] rounded-full" />
            </div>
            <div className="w-4 h-3 bg-[var(--red-light)] border-2 border-t-0 border-[var(--border)] mx-auto" />
            <div ref={bodyRef} className="w-16 h-20 bg-[var(--red-light)] border-2 border-[var(--border)] rounded-b-xl mx-auto relative shadow-md" style={{ opacity: 0 }}>
              <div className="absolute top-4 left-2 w-4 h-4 bg-[var(--red-primary)] border border-[var(--border)] rounded-sm" />
              <div ref={leftArmRef} className="absolute -left-10 top-6 w-12 h-3 bg-[var(--red-light)] border-2 border-[var(--border)] rounded-full origin-left" style={{ transformOrigin: "left center" }}>
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[var(--red-primary)] border border-[var(--border)] rounded-full" />
              </div>
              <div ref={rightArmRef} className="absolute -right-10 top-6 w-12 h-3 bg-[var(--red-light)] border-2 border-[var(--border)] rounded-full origin-right" style={{ transformOrigin: "right center" }}>
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[var(--red-primary)] border border-[var(--border)] rounded-full" />
              </div>
            </div>
            <div className="w-16 h-1.5 bg-[var(--border)] border border-[var(--border)] mx-auto" />
            <div ref={legsRef} className="flex justify-center gap-1 mt-1">
              <div ref={leftLegRef} className="w-5 h-14 bg-[var(--surface-strong)] border-2 border-[var(--border)] rounded-full" style={{ origin: "top center" }} />
              <div ref={rightLegRef} className="w-5 h-14 bg-[var(--surface-strong)] border-2 border-[var(--border)] rounded-full" style={{ origin: "top center" }} />
            </div>
            <div className="flex justify-center gap-2">
              <div className="w-6 h-4 bg-[var(--border)] border-2 border-t-0 border-[var(--border)] rounded-t-full" />
              <div className="w-6 h-4 bg-[var(--border)] border-2 border-t-0 border-[var(--border)] rounded-t-full" />
            </div>
          </div>
        </div>
        {isVisible && (
          <>
            <div ref={smoke1Ref} className="absolute -top-8 right-14 w-6 h-12 bg-[var(--red-soft)]/60 rounded-full opacity-80" style={{ scale: 0, transform: "translateY(0px)", opacity: 0 }} />
            <div ref={smoke2Ref} className="absolute -top-16 right-12 w-8 h-16 bg-[var(--red-soft)]/40 rounded-full opacity-60" style={{ scale: 0, transform: "translateY(0px)", opacity: 0 }} />
            <div ref={smoke3Ref} className="absolute -top-24 right-8 w-5 h-10 bg-[var(--red-soft)]/30 rounded-full opacity-50" style={{ scale: 0, transform: "translateY(0px)", opacity: 0 }} />
          </>
        )}
      </div>
    </div>
  );
}

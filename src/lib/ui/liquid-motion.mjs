// Presentation only: never hides content or delays a business interaction.
export const scrollBehavior = (reduced) => reduced ? 'auto' : 'smooth';

export function animateSurface(element, frames, options = {}, reduced = false) {
  if (reduced || typeof element?.animate !== 'function') return null;
  return element.animate(frames, {
    duration: 380,
    easing: 'cubic-bezier(.22,1,.36,1)',
    ...options,
  });
}

export function revealSurfaces(elements, { Observer, reduced = false } = {}) {
  if (reduced || !Observer) return { disconnect() {} };
  const seen = new WeakSet();
  const animations = new Set();
  const observer = new Observer((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting || seen.has(entry.target)) continue;
      seen.add(entry.target);
      observer.unobserve(entry.target);
      const animation = animateSurface(entry.target, [
        { opacity: .65, transform: 'translateY(14px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ]);
      if (animation) {
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      }
    }
  }, { threshold: .06, rootMargin: '0px 0px -16px 0px' });
  for (const element of elements) observer.observe(element);
  return {
    observe(element) { if (!seen.has(element)) observer.observe(element); },
    disconnect() {
      observer.disconnect();
      for (const animation of animations) animation.cancel();
      animations.clear();
    },
  };
}

export function motionStyle(values = {}) {
  const style = {};
  const transforms = [];
  for (const [key, raw] of Object.entries(values)) {
    const value = Array.isArray(raw) ? raw.at(-1) : raw;
    if (key === 'x' || key === 'y') transforms.push(`translate${key.toUpperCase()}(${typeof value === 'number' ? `${value}px` : value})`);
    else if (['scale', 'scaleX', 'scaleY'].includes(key)) transforms.push(`${key}(${value})`);
    else if (key === 'rotate') transforms.push(`rotate(${typeof value === 'number' ? `${value}deg` : value})`);
    else style[key] = value;
  }
  if (transforms.length) style.transform = transforms.join(' ');
  return style;
}

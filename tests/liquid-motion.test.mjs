import test from 'node:test';
import assert from 'node:assert/strict';
import { animateSurface, revealSurfaces, scrollBehavior } from '../src/lib/ui/liquid-motion.mjs';

test('reduced motion skips transforms and uses instant scrolling', () => {
  let calls = 0;
  const node = { animate() { calls++; } };
  assert.equal(animateSurface(node, [{opacity: 0}, {opacity: 1}], {}, true), null);
  assert.equal(calls, 0);
  assert.equal(scrollBehavior(true), 'auto');
  assert.equal(scrollBehavior(false), 'smooth');
});

test('unsupported animation leaves content visible and does not throw', () => {
  assert.equal(animateSurface({}, [], {}, false), null);
});

test('scroll reveal animates each visible surface once and cleans up', () => {
  let notify;
  let disconnected = false;
  const watched = new Set();
  const frames = [];
  const node = { animate(keys) { frames.push(keys); return { cancel() {} }; } };
  class Observer {
    constructor(callback) { notify = callback; }
    observe(el) { watched.add(el); }
    unobserve(el) { watched.delete(el); }
    disconnect() { disconnected = true; }
  }
  const observer = revealSurfaces([node], { Observer, reduced: false });
  assert.equal(watched.has(node), true);
  assert.equal(node.style, undefined, 'must not hide content pending observation');
  notify([{target: node, isIntersecting: true}]);
  notify([{target: node, isIntersecting: true}]);
  assert.equal(frames.length, 1);
  assert.equal(watched.size, 0);
  observer.disconnect();
  assert.equal(disconnected, true);
});

test('legacy motion values preserve wizard progress and translate correctly', async () => {
  const { motionStyle } = await import('../src/lib/ui/liquid-motion.mjs');
  assert.deepEqual(motionStyle({scaleX: .5}), {transform: 'scaleX(0.5)'});
  assert.deepEqual(motionStyle({opacity: 1, x: 0, y: 20}), {opacity: 1, transform: 'translateX(0px) translateY(20px)'});
});

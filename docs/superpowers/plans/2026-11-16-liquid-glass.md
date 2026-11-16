# Porcelain Jaali Implementation Plan

> Implement inline in the current isolated feature branch, using executing-plans.

**Goal:** Apply the selected Porcelain Jaali design across the existing app, with a matching dark theme.
**Architecture:** Shared semantic theme tokens and components supply visual consistency. A persistent motion layer handles presentation only, without delaying navigation or resetting form state.
**Tech Stack:** Next.js 15, React 19, existing Tailwind and Lucide, CSS and Web Animations API.
**Spec:** docs/superpowers/specs/2026-11-16-liquid-glass-design.md

## Global constraints
- White, blue/navy, black, red and gold; no green.
- Preserve all business logic, API routes, payment/email/security code.
- No decorative information pills; keep functional choices and useful status text.
- Content remains accessible without JS/animations/blur; reduced-motion supported.

## Review focus
- Payment and rental form state must survive visual changes.
- Reduced motion must affect JS as well as CSS animation and scrolling.
- Small screens must have usable scrollable navigation and no page overflow.
- Both themes must provide readable surfaces, labels, errors and status colors.
- Animation cleanup must not leave hidden content or observers after navigation.

## Tasks
- [ ] Capture baseline tests; add behavioral motion tests before implementation.
- [ ] Add local typography and gold jaali asset. Replace theme with semantic glass surfaces, color mappings, controls, scrollbars, responsive and accessibility fallbacks.
- [ ] Add shared presentation motion without changing business handlers. Improve navigation, admin tab semantics, auth labels and quiet page hierarchy.
- [ ] Run tests, lint, production build; browser-check light/dark, navigation, forms, chat, mobile and reduced motion; record design QA.
- [ ] Review diff and prepare feature branch / pull request for deployment, reporting credential-limited verification explicitly.

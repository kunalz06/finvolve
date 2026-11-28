# Branded Email Implementation Plan

**Goal:** Give every existing email a consistent Porcelain Jaali visual identity.
**Architecture:** Pure email renderer modules share one table-based layout, detail rows and action helper. Existing sender modules re-export renderers and retain delivery behavior.
**Tech stack:** Existing Next.js/Node/Nodemailer, inline HTML/CSS, PNG assets; no new application dependencies.
**Spec:** docs/superpowers/specs/2026-11-17-email-design.md

## Constraints
No real sends. No payment/rental/API/auth changes. Existing sender APIs, subjects, plain text and unsubscribe behavior remain unchanged. White/navy/black/red/gold, no green; progressive dark/mobile enhancement with inline fallbacks.

## Tasks
- [x] Add meaningful renderer tests before implementation: escaping, safe URLs, exact billing values, zero usage, all lifecycle events and unsubscribe preservation.
- [x] Implement shared email layout and PNG brand/motif assets, keeping images optional and all critical text live.
- [x] Implement newsletter, acknowledgement, payment, rental and subscription renderers and wire existing senders without changing their delivery blocks.
- [x] Generate 15 offline fictional previews, including narrow, dark and long-content examples. Browser relay access failed; visual rendering remains unverified. Narrow header sizing was reviewed and adjusted in source.
- [x] Run full tests, lint/build and independent review; prepare a feature PR for deployment. Record client-specific verification limits.

## Review focus
Unchanged payment query tokens and link expiry; decimal billing values; HTML injection and unsafe URLs; Starter versus monthly plan copy; long identifiers/mobile width; unsubscribe links and plain-text delivery parity; readable content with images/styles blocked.

## Verification results
- `npm test`: 30 passed, including mock-only SMTP delivery verification. No email sent.
- `npm run lint`: no errors; three existing animation-hook warnings.
- `npm run build`: passed.
- Independent review: no blocking findings or introduced regressions.
- Local browser preview was unreachable through the browser relay. Gmail/Outlook rendering, automatic dark-mode transforms and remote image loading after deployment require inbox verification.
- Existing subscription subjects/plain text still use monthly wording for Starter; retained unchanged because this task preserves delivery content. New HTML uses the applicable billing cycle.

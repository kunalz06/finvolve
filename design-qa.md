# Porcelain Jaali design QA

**Source visual truth:** selected Porcelain Jaali concept, Library file `libfile_7d7009d42b5c8191bd41887e3b23b453`; generated source `/workspace/scratch/040659582702/generated_images/exec-10215ba9-270c-41af-89d1-5b071720e6bd.png`.

**Rendered evidence:** Vercel feature-branch preview; `docs/design-qa/home-light.png`, `home-dark.png`, `admin-light.png`, and `comparison.jpg`.

**Viewport:** browser desktop 1363 × 936 CSS pixels, screenshots 1363 × 936 pixels, density 1. Source 1487 × 1058 pixels. Comparison sheet scales both uniformly to fit labeled equal-width regions; no distortion. The source is authenticated Projects state and the rendered homepage/login are different route/auth states. The comparison proves shared visual-language direction only; it cannot prove exact admin composition fidelity.

## Findings and fixes

- Fixed: broad status palette mapping reduced warning usage fills to near-invisible pale surfaces. Separate saturated fill tokens now exceed 3:1 contrast against both theme tracks, with a regression test.
- Fixed: partial utility matching accidentally affected pale icon backgrounds. Saturated mappings now target complete shade values; overlay mapping uses an exact class token.
- Fixed: inactive wizard choices lost their visual boundaries after information-pill styling was removed. Functional choices now have distinct surfaces, selected borders and native keyboard semantics.
- Fixed: wizard animated from hidden markup and did not respect reduced motion. SSR/final content now remains visible and motion uses the shared guarded implementation.
- No P0/P1 defect observed on accessible desktop public routes. Exact authenticated admin comparison remains blocked by the missing administrator session.

## Required fidelity surfaces

- Typography: local Yatra One display and Mukta body fonts loaded in-browser. Indian influence is concentrated in headings; functional labels remain legible. Brand retained from existing app.
- Spacing/layout: uncluttered public hierarchy, horizontal primary navigation and generous surfaces; project ledger code follows the selected composition. Browser desktop had no document overflow. Mobile CSS is implemented; physical narrow viewport verification remains pending.
- Colors/tokens: navy/white light theme, near-black/navy dark theme, red actions and gold jaali. No green tokens or rendered status colors. Success uses blue. Focus and warning visibility checked.
- Images: generated jaali artwork, lossless WebP, sparse low-opacity corner placement; original vector brand asset reused. No recreated CSS/SVG decorative substitute.
- Copy/content: existing real product copy and business information retained. Removed decorative pill presentation and one redundant home eyebrow; no concept mock data added to live paths.

## Primary interactions checked

- Theme control changes both palette and accessible button name.
- Shared navigation enters the correct routes.
- Wizard project selection advances, Back/Next retains entered description, and theme change retains entered text.
- Subscription lookup empty email triggers native validity/focus without an API request.
- Chat launcher opens, ready actions render, and close returns to launcher.
- Payment portal renders missing-token error without initiating checkout.
- Terms navigation and admin sign-in surface render.
- No app JavaScript error was observed in the inspected console output; observed metadata errors were from a browser extension.

## Limitations and remaining gate

Local preview returned HTTP 200 inside its process, but its browser relay was unreachable. Verification therefore used the real Vercel preview. Authenticated admin/project/rental screenshots, live Razorpay/Cashfree charges, webhook/email delivery and physical mobile testing were not exercised. Do not describe these as end-to-end verified. Keep PR draft pending the authenticated visual check. Automated motion tests cover reduced-motion skipping, unsupported browser fallback, reveal-once behavior, observer cleanup and wizard scale/translation mapping.

**Focused comparison:** typography/navigation/control edges are readable in full-resolution captures; exact ledger region comparison requires the signed-in state and is pending.

**Comparison history:** first shared-system pass found status utility contrast and choice boundaries; these were fixed. Public routes were recaptured after status shade correction. The authenticated-state gap remains and is recorded rather than inferred from source.

**final result: blocked**

Blocked only for the complete authenticated admin visual comparison and narrow-device coverage; code is available for review in draft PR #12, with passing tests and production build.

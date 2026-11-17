# Branded email design

Extend the already selected Porcelain Jaali direction to every application-owned outgoing email: newsletter/welcome, project/Quick Start acknowledgements, payment links, rental activation/usage bills/receipts and all six subscription events.

Use white, navy, black, red and restrained gold, no green. Use serif display typography and readable system body fonts, a small jaali accent and the existing brand mark. Email clients cannot reliably render the app's live blur or motion: use a fluid table layout, solid fallback colors, inline styles, optional dark-mode enhancement and a red, email-compatible call to action. Brand images must have PNG alternatives and alt text; the message remains understandable with images blocked.

Preserve existing exported renderer/sender APIs, SMTP credentials/settings, recipients, subjects, plain-text alternatives, unsubscribe tokens and links, payment URLs and expiry, billing arithmetic, rates, plan definitions, auth and webhook logic. Keep essential amounts and status in text. Escape dynamic text and reject unsafe link schemes in rendered markup.

Implementation choice: central email layout and pure renderer modules, with the existing sender modules continuing to own delivery. Generate fictional-data previews offline; do not send any real emails or trigger payments.

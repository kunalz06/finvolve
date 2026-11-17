# Email design previews

From the repository root, run `node scripts/preview-emails.mjs --serve`, then open `http://localhost:4173`.

The gallery renders 15 fictional examples from the production renderers, including newsletter and welcome messages, payment links, project acknowledgements, cloud rental activation/bills/receipts, six subscription lifecycle events and a long-content example. It offers 680px and 320px frames and a dark-style toggle. Generated HTML/assets stay local and can be regenerated without credentials. No email is sent.

This browser gallery is not Gmail/Outlook certification. Inbox testing and deployed image loading remain to be verified. Essential status, billing details and links use live text and remain available without remote images.

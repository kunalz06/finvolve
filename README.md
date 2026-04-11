# Finvolve

Finvolve is a Next.js App Router project with:
- Marketing and lead-capture flows under `/finvolve`
- Tokenized client payment flow under `/finvolve/payments`
- Admin dashboard under `/finvolve/admin`
- IEM minor-degree registration flow under `/iemminor`

## Prerequisites

- Node.js 20+
- Firebase project (Firestore + Auth + Storage)
- Razorpay account keys
- Firebase Admin service account credentials for server routes

## Environment Setup

Copy `.env.example` to `.env.local` and fill values:

- Client Firebase keys (`NEXT_PUBLIC_FIREBASE_*`)
- Razorpay keys:
  - `NEXT_PUBLIC_RAZORPAY_KEY_ID`
  - `RAZORPAY_KEY_ID`
  - `RAZORPAY_KEY_SECRET`
- Firebase Admin credentials (`FIREBASE_SERVICE_ACCOUNT_KEY` or split vars)
- Optional `NEXT_PUBLIC_SITE_URL` for absolute payment links
- Newsletter SMTP credentials for personal-mail sending:
  - `NEWSLETTER_SMTP_HOST`
  - `NEWSLETTER_SMTP_PORT`
  - `NEWSLETTER_SMTP_SECURE`
  - `NEWSLETTER_SMTP_USER`
  - `NEWSLETTER_SMTP_PASS`
  - `NEWSLETTER_FROM_EMAIL`
  - `NEWSLETTER_FROM_NAME`
  - `NEWSLETTER_REPLY_TO`

For Gmail, enable 2-step verification and use a Gmail App Password for `NEWSLETTER_SMTP_PASS`. Do not use your normal Gmail password.

## Admin Access

Admin dashboard auth is Firebase Auth based.  
You must set a custom claim on admin users:

```bash
npm run set-admin -- FIREBASE_UID
```

This repo helper applies:

```json
{ "role": "admin", "admin": true }
```

## Scripts

```bash
npm install
npm run dev
npm run lint
npm run build
npm run migrate:payments
npm run set-admin -- FIREBASE_UID
```

## Security Notes

- Firestore rules are deny-by-default for sensitive reads/writes.
- Payment links are tokenized and server-verified before marking paid.
- Payment verification happens via `/finvolve/api/verify-payment`.

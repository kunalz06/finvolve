# DEV♾️

DEV♾️ is a Next.js App Router project with:
- Marketing and lead-capture flows under `/dev`
- Tokenized client payment flow under `/dev/payments`
- Admin dashboard under `/dev/admin`

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
- Optional `NEXT_PUBLIC_API_BASE_URL` for frontend-only hosts such as Netlify to call the Vercel backend
- Optional `CORS_ALLOWED_ORIGINS` on Vercel to allow Netlify/custom frontend domains to call API routes
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

## Netlify Frontend Deployment

This app can be deployed to Netlify as a static frontend while Vercel continues to host the API routes for Razorpay, Firebase Admin, and newsletter email. The Netlify root (`/`) serves the DEV app by default.

Netlify uses `npm run build:netlify`, which temporarily excludes App Router API route folders so `output: "export"` can produce the static `out` directory. The Netlify config also points functions at `netlify/disabled-functions` so this deployment ships no Netlify backend. The build requires `NEXT_PUBLIC_API_BASE_URL` so frontend API calls target the Vercel backend. The normal `npm run build` still includes API routes for Vercel.

Keep `.firebaserc` placeholder-only in this repository. Use Firebase CLI `--project your-project-id` or a local untracked Firebase config when deploying Firebase rules.

Set these environment variables on Netlify:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_SITE_URL=https://your-netlify-site.netlify.app
NEXT_PUBLIC_API_BASE_URL=https://your-vercel-app.vercel.app
```

`NEXT_PUBLIC_API_BASE_URL` must point to the Vercel deployment that hosts the API routes. Use the full URL with `https://`; a bare `your-vercel-app.vercel.app` hostname is normalized during the build, but values such as `/api`, `localhost`, or a placeholder string will fail.

Do not set server secrets on Netlify, including `RAZORPAY_KEY_SECRET`, Firebase Admin private keys, or SMTP passwords. This deployment is frontend-only; server API routes and payment logic continue to run on Vercel.

The public browser keys are intentionally bundled into the frontend, so `netlify.toml` omits the `NEXT_PUBLIC_*` keys from Netlify secret scanning. Do not add private server credentials to that omit list.

Set this on Vercel so Netlify can call the backend:

```bash
CORS_ALLOWED_ORIGINS=https://your-netlify-site.netlify.app,https://your-custom-domain.com
NEXT_PUBLIC_SITE_URL=https://your-netlify-site.netlify.app
NEXT_PUBLIC_API_BASE_URL=https://your-vercel-app.vercel.app
NEXT_PUBLIC_RAZORPAY_KEY_ID=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
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
- Payment verification happens via `/dev/api/verify-payment`.

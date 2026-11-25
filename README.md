# DEV♾️

DEV♾️ is a Next.js App Router project with:
- Marketing and lead-capture flows under `/dev`
- Tokenized client payment flow under `/dev/payments`
- Admin dashboard under `/dev/admin`

## Prerequisites

- Node.js 20+
- Firebase project (Firestore + Auth + Storage)
- Razorpay account keys and/or a Cashfree Payments account
- Firebase Admin service account credentials for server routes

## Environment Setup

Copy `.env.example` to `.env.local` and fill values:

- Client Firebase keys (`NEXT_PUBLIC_FIREBASE_*`)
- Razorpay keys:
  - `NEXT_PUBLIC_RAZORPAY_KEY_ID`
  - `RAZORPAY_KEY_ID`
  - `RAZORPAY_KEY_SECRET`
- Cashfree server credentials (configure only on the backend deployment):
  - `CASHFREE_CLIENT_ID`
  - `CASHFREE_CLIENT_SECRET`
  - `CASHFREE_ENVIRONMENT` (`sandbox` or `production`)
- Firebase Admin credentials (`FIREBASE_SERVICE_ACCOUNT_KEY` or split vars)
- Optional `NEXT_PUBLIC_SITE_URL` for absolute payment links
- Optional `DEV_APP_SITE_URL` as a server-only override for DEV payment links
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
DEV_APP_SITE_URL=https://your-netlify-site.netlify.app
NEXT_PUBLIC_API_BASE_URL=https://your-vercel-app.vercel.app
```

`NEXT_PUBLIC_SITE_URL` and `DEV_APP_SITE_URL` should each be one DEV app URL, not a comma-separated list. Put multiple frontend domains only in `CORS_ALLOWED_ORIGINS`.

`NEXT_PUBLIC_API_BASE_URL` must point to the Vercel deployment that hosts the API routes. Use the full URL with `https://`; a bare `your-vercel-app.vercel.app` hostname is normalized during the build, but values such as `/api`, `localhost`, or a placeholder string will fail.

Do not set server secrets on Netlify, including `RAZORPAY_KEY_SECRET`, Firebase Admin private keys, or SMTP passwords. This deployment is frontend-only; server API routes and payment logic continue to run on Vercel.

Cashfree credentials must likewise be set only on the backend deployment. Never create
`NEXT_PUBLIC_CASHFREE_*` variables: the browser receives only Cashfree's short-lived
payment session ID. In the Cashfree dashboard, configure the signed payment webhook as
`https://<your-backend-domain>/dev/api/cashfree/webhook` and enable successful payment
events. The backend verifies Cashfree's `x-webhook-signature` and timestamp, then fetches
the order and payment directly from Cashfree before updating Firestore.

The public browser keys are intentionally bundled into the frontend, so `netlify.toml` omits the `NEXT_PUBLIC_*` keys from Netlify secret scanning. Do not add private server credentials to that omit list.

Set this on Vercel so Netlify can call the backend:

```bash
CORS_ALLOWED_ORIGINS=https://your-netlify-site.netlify.app,https://your-custom-domain.com
NEXT_PUBLIC_SITE_URL=https://your-netlify-site.netlify.app
DEV_APP_SITE_URL=https://your-netlify-site.netlify.app
NEXT_PUBLIC_API_BASE_URL=https://your-vercel-app.vercel.app
NEXT_PUBLIC_RAZORPAY_KEY_ID=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
CASHFREE_CLIENT_ID=...
CASHFREE_CLIENT_SECRET=...
CASHFREE_ENVIRONMENT=production
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
- Payment verification happens via `/dev/api/verify-payment`; signed Cashfree notifications use `/dev/api/cashfree/webhook`.

## Professional Technology Training Program

- Public course: `/dev/course`
- Student login, registration, and dashboard: `/dev/course/portal`
- Course administration: `/dev/course/admin`

The course uses Firebase Authentication, Firestore, and the site's Razorpay credentials. Enable the Email/Password and Google providers in Firebase Authentication and add each frontend hostname to Authorized domains. Students can use either provider to create and return to a course account. For a Google sign-in, the server uses the Google account's name and email for enrollment and checkout. If Google provides no name, the student enters one. Course administrators sign in with email and password and use the existing admin custom claim. Course collections use the server SDK and are covered by the Firestore rules' default deny for direct client access.

Set `CLOUDINARY_URL` as a server-only sensitive environment variable on the Vercel deployment handling course API requests. New course materials, recordings, and submissions upload directly to Cloudinary as authenticated assets. The course API checks enrollment and permissions before returning time-limited download links. Uploads use the Cloudinary Free limits of 10 MiB for documents and 100 MiB for recordings. Check authenticated PDF and ZIP delivery in the Cloudinary environment before adding course files. The portal can still resolve existing Firebase Storage references if their bucket is accessible. Re-upload legacy files to move them to Cloudinary while Firebase stays on Spark.

For automatic payment confirmation and refund status, configure Razorpay to send `payment.captured` and `refund.processed` events to `/dev/api/course/webhook` with the existing `RAZORPAY_WEBHOOK_SECRET`, or set `COURSE_RAZORPAY_WEBHOOK_SECRET` for a separate webhook secret. Enable automatic capture in Razorpay. Students and administrators can also reconcile payment status from their portals. Production and Vercel Preview course data are separate when Vercel system environment variables are exposed. Vercel-hosted course pages use their own deployment’s API. To activate test enrollment on the protected Preview, add both `COURSE_RAZORPAY_KEY_ID` and `COURSE_RAZORPAY_KEY_SECRET` to the Preview environment for the course branch, then redeploy. Use a matching Razorpay Test Mode pair. Test enrollment is available through the registration deadline while course terms are still in draft. Production uses the existing live Razorpay keys and the publication and enrollment switches.

The approved course terms are prefilled and live enrollment is enabled by default through the registration deadline. Course administration can pause enrollment or update publication settings. Students must accept the enrollment terms before payment. The portal provides a receipt after payment confirmation and a certificate after an administrator confirms course completion. The internship opportunity requires a score above 80%. The schedule, refund policy, and optional printed-copy price can be entered as they are confirmed. The printed option remains unavailable until a price is saved. Registration closes at the end of 3 December 2026 in India.

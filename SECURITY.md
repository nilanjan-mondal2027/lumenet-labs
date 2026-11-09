# Security Policy and Operations

## Architecture

The application runs on Cloudflare Workers. Registration data is stored in D1, email jobs use Queues, bot checks use Turnstile, and outbound email uses Resend. There are no private credentials in browser code.

## Secret handling

Set production secrets with Wrangler or the Cloudflare dashboard:

- `TURNSTILE_SECRET_KEY`
- `RATE_LIMIT_SECRET`
- `SESSION_SECRET`
- `ORGANIZER_PASSWORD_HASH`
- `RESEND_API_KEY`
- `WORKSHOP_WHATSAPP_GROUP_URL`

Never commit `.dev.vars`, `.env`, exports, database files, provider tokens, passwords, or participant data. `.env.example` and `.dev.vars.example` contain names and placeholders only.

If a real credential is exposed, rotate it immediately, inspect Git history, and clean history only through a reviewed incident process.

## Controls implemented

- Zod server validation
- Cloudflare Turnstile verification outside local development
- Honeypot field
- Salted IP hash rate limiting with short retention
- Idempotency keys and unique active email index
- Guardian approval for under 18 registrations
- Private, token-gated workshop group invitations only after confirmation
- PBKDF2-HMAC-SHA-256 organizer password verification with a unique salt and constant-time comparison
- HMAC-signed HttpOnly Secure SameSite Strict session cookie
- Origin check on organizer login
- Organizer authentication on personal data export
- Spreadsheet formula neutralisation in CSV and XLSX
- D1 persistence before queue publication
- Retry state for email delivery failures
- Signed Resend webhook handling with replay-age validation and idempotent delivery events
- CSP, HSTS, frame denial, permission restrictions, and no-sniff headers
- Preview noindex header

## Before production

- Replace all preview resources with production D1 and Queues IDs.
- Set `ENVIRONMENT=production` only after approval.
- Use a verified sender domain.
- Configure a Resend webhook for `email.sent`, `email.delivered`, `email.delivery_delayed`, `email.bounced`, `email.failed`, and `email.suppressed` at `/webhooks/resend`.
- Replace the temporary legacy `ORGANIZER_PASSWORD` secret with a PBKDF2 `ORGANIZER_PASSWORD_HASH` secret before real participant records are accepted.
- Run GitHub secret scanning and a local secret scan.
- Confirm the retention schedule and privacy notice with the responsible adult or organisation.
- Test guardian consent and email retries with non-participant test addresses.
- Configure `WORKSHOP_WHATSAPP_GROUP_URL` as a Worker secret. Do not put the group invitation in public source, page content, or static assets.
- Enable administrator approval for workshop WhatsApp join requests before sharing invitations.
- Confirm production DNS and route changes explicitly.

## Reporting

Add an approved security contact before public production launch. Do not publish a personal student email as the security address.

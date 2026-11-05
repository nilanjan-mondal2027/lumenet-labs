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

Never commit `.dev.vars`, `.env`, exports, database files, provider tokens, passwords, or participant data. `.env.example` and `.dev.vars.example` contain names and placeholders only.

If a real credential is exposed, rotate it immediately, inspect Git history, and clean history only through a reviewed incident process.

## Controls implemented

- Zod server validation
- Cloudflare Turnstile verification outside local development
- Honeypot field
- Salted IP hash rate limiting with short retention
- Idempotency keys and unique active email index
- Guardian approval for under 18 registrations
- PBKDF2 organizer password verification
- HMAC-signed HttpOnly Secure SameSite Strict session cookie
- Origin check on organizer login
- Organizer authentication on personal data export
- Spreadsheet formula neutralisation in CSV and XLSX
- D1 persistence before queue publication
- Retry state for email delivery failures
- CSP, HSTS, frame denial, permission restrictions, and no-sniff headers
- Preview noindex header

## Before production

- Replace all preview resources with production D1 and Queues IDs.
- Set `ENVIRONMENT=production` only after approval.
- Use a verified sender domain.
- Run GitHub secret scanning and a local secret scan.
- Confirm the retention schedule and privacy notice with the responsible adult or organisation.
- Test guardian consent and email retries with non-participant test addresses.
- Confirm production DNS and route changes explicitly.

## Reporting

Add an approved security contact before public production launch. Do not publish a personal student email as the security address.

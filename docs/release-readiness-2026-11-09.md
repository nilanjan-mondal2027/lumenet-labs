# Release Readiness: 9 November 2026

Branch: `feature/2026-platform-rebuild`  
Draft pull request: #1  
Protected preview: `https://lumenet-labs-platform-preview.nilanjanmondal2025.workers.dev/`  
Deployed Worker version: `4965543b-0822-4e70-94b8-ccc019030c2c`  
Deployed source commit: `da9fcdc`

## Completed

- D1 migrations through `0003_email_delivery_events.sql` are applied to the isolated preview database.
- Registration IDs, D1 persistence, duplicate prevention, guardian approval, private status tokens, protected CSV and XLSX export, and WhatsApp eligibility gating passed synthetic local integration tests.
- Organizer password verification now supports PBKDF2-HMAC-SHA-256 with a unique salt and 310,000 iterations.
- Resend API acceptance is recorded as `provider_accepted`. A signed, replay-protected Resend webhook updates the record to `delivered`, `bounced`, `delivery_delayed`, `failed`, `suppressed`, or `complained`.
- The webhook accepts only POST, rejects unsigned requests, and is idempotent through the `email_delivery_events` ledger.
- Typecheck, 11 unit tests, production build, 8 Playwright checks, copy validation, and `npm audit --omit=dev` passed.
- Current-tree scan, all-reachable-history scan of 10 commits, and GitHub secret scanning found no secret-shaped values or open alerts.
- The protected preview returns `401` with Basic Auth and `Cache-Control: no-store` when unauthenticated.

## Unverified because configuration is intentionally absent

- Real transactional delivery. `RESEND_API_KEY`, `RESEND_WEBHOOK_SECRET`, and a verified `RESEND_FROM` sender are not configured.
- Real Resend delivery-state callbacks. The endpoint is deployed, but it cannot validate live events without the webhook secret.
- Live Turnstile widget and full remote registration journey. Existing Basic Auth credentials were not retrieved or changed.
- Organizer login using PBKDF2. `ORGANIZER_PASSWORD_HASH` has not been configured. The legacy `ORGANIZER_PASSWORD` fallback remains active for the current preview only.
- Authenticated remote CSV and XLSX download.

## Configuration actions before retesting

1. Complete [transactional email setup](./transactional-email-setup.md) using a verified Resend domain and two authorized real test inboxes.
2. Configure `RESEND_API_KEY`, `RESEND_WEBHOOK_SECRET`, `RESEND_FROM`, and PBKDF2 `ORGANIZER_PASSWORD_HASH` as encrypted Cloudflare Worker secrets or variables.
3. Verify organizer login with the new PBKDF2 secret, then delete the legacy `ORGANIZER_PASSWORD` Worker secret.
4. Enable GitHub Dependabot alerts in repository **Settings**, **Security**, **Code security and analysis**, then review the first report.
5. Complete the [privacy ownership checklist](./privacy-ownership-approval-checklist.md).
6. Enable WhatsApp group administrator approval for join requests.
7. Use authorized adult and guardian test inboxes to run the remote workflow. Delete their synthetic records through the approved private organizer process after verification.

## Recommendation

**NO-GO for production registration.** The application security controls and preview deployment are ready for final configuration, but live delivery, PBKDF2 organizer authentication, authenticated remote journey testing, and Dependabot activation remain incomplete. Do not merge the draft PR, change production DNS, or open public registration until these items are verified.

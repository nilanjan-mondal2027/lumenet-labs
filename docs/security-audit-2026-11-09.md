# Security Audit: 9 November 2026

## Scope

Reviewed the React Router application, Cloudflare Worker, D1 migrations, Queues, Git history reachable from local and remote refs, GitHub security state, deployment configuration, organizer access, registration, guardian approval, export routes, and public asset boundaries.

## Verified controls

- Registration input is validated server-side with Zod, constrained field lengths, origin checks, a honeypot, duplicate active-email prevention, and a short-lived salted rate limiter.
- Turnstile is verified server-side outside localhost. The response must match the `register` action and configured preview hostname.
- Registration records are written to D1 before their email job is queued.
- Under 18 records remain `pending_guardian` without private status access until a guardian approves.
- Private registration access tokens and guardian consent tokens are stored as SHA-256 hashes.
- The WhatsApp invitation is a Worker secret. It is absent from public pages and non-token status pages, and is offered only after confirmation. Guardian emails do not receive it.
- Organizer routes and spreadsheet exports require an HMAC-signed, `HttpOnly`, `Secure`, `SameSite=Strict` session cookie.
- CSV and XLSX export helpers neutralise spreadsheet formulas. Export responses use `Cache-Control: no-store`.
- Preview Basic Auth uses a constant-time comparison, returns `401`, and adds `Cache-Control: no-store` before application handling.
- Preview responses set noindex, content-type, framing, referrer, permission, HSTS, and CSP headers.
- Worker source maps are disabled for deployment.

## Scan evidence

- `npm audit --omit=dev`: zero vulnerabilities reported on 6 November 2026.
- GitHub secret scanning: no open alerts reported.
- Path-only current-tree scan found placeholders and expected secret variable names only. No secret-shaped values were identified.
- All reachable Git history refs were scanned for common key, token, private-key, and credential patterns. No commit with secret-shaped content was identified.
- `.env`, `.dev.vars`, local Worker state, build output, test output, and creative output are ignored by Git. `.env.example` and `.dev.vars.example` contain placeholders only.

## Findings and repairs

### High severity

No high-severity issue was identified in the reviewed source or reachable Git history.

### Medium severity

1. Dependabot alerts are disabled in the GitHub repository. Enable Dependabot alerts in GitHub repository settings before production approval. This requires a repository administrator and is not changed by this audit.
2. The Content Security Policy retains `unsafe-inline` for script and style compatibility with the current React build and Turnstile integration. This is a residual risk. Replace it with nonce or hash-based CSP only as a separately tested architecture change.
3. Live transactional delivery is not configured in preview. `RESEND_API_KEY` is absent and `RESEND_FROM` remains an invalid preview sender. Queue behavior was tested only as `preview_suppressed`; no real email was sent.
4. Authenticated remote preview testing is blocked by the existing Basic Auth password, which was not retrieved or changed during this audit. The unauthenticated remote response was verified as `401` with `no-store`.

### Low severity

- `ORGANIZER_PASSWORD` remains supported for backward compatibility. Move to `ORGANIZER_PASSWORD_HASH` before production and use a long unique organizer password.
- A direct Google Sheets sync is intentionally deferred. D1 plus protected Excel and CSV export is the safer, lower-complexity system of record until private OAuth or service-account ownership and failure handling are approved.

## Release gate

Do not enable production registration until the following are complete:

- Configure verified Resend sender identity and a non-production test recipient.
- Test one adult and one guardian-approved synthetic registration against the protected preview with the actual Turnstile widget.
- Confirm the organizer can log in and download both CSV and XLSX from the protected preview.
- Enable Dependabot alerts and review the first result.
- Configure WhatsApp administrator approval for join requests.
- Approve the retention owner, contact channel, and deletion request process.
- Complete authenticated desktop and mobile preview QA without using real participant records.

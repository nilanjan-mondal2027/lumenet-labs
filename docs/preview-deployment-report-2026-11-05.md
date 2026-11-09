# Lumenet Labs 2026 Platform Preview Deployment Report

Date: 5 November 2026

## Preview

- Preview URL: `https://lumenet-labs-platform-preview.nilanjanmondal2025.workers.dev`
- Source branch: `feature/2026-platform-rebuild`
- Pull request: https://github.com/nilanjan-mondal2027/lumenet-labs/pull/1
- Production status: unchanged. No production DNS, domain, Netlify deployment, Search Console configuration, or production database was modified.
- Preview access: HTTP Basic Authentication is enforced before the application is served. The review credentials are shared separately and are not committed to the repository.
- Search indexing: disabled for the preview through `X-Robots-Tag: noindex, nofollow`.

## Provisioned Preview Resources

- Cloudflare Worker: `lumenet-labs-platform-preview`
- Cloudflare D1 preview database: `lumenet-platform-preview`
- Cloudflare Queue: `lumenet-email-preview`
- Cloudflare dead letter queue: `lumenet-email-preview-dlq`
- Turnstile: Cloudflare test credentials only

The preview database migration `migrations/0001_registration.sql` was applied and schema counts were verified. Synthetic test records were removed after testing. The final preview database contains the single event seed and zero participant registrations, guardian consent records, and queued email records.

## Registration Journey Evidence

The November 25 workshop journey was tested with synthetic data only.

| Scenario | Result |
| --- | --- |
| Adult registration | Confirmed registration created with a unique public registration ID |
| Duplicate prevention | Duplicate active email was rejected with a safe, user-facing error |
| Minor registration | Guardian consent required before confirmation |
| Guardian approval | One-time consent completion confirmed the registration |
| Reused guardian token | Rejected |
| Registration status | Correctly displayed for a test registration ID |
| Email queue | Confirmation messages queued and marked `preview_suppressed` |
| Live email delivery | Intentionally not sent. No provider key or verified sender was configured |

Real participant emails were not used and live registration is not enabled on production.

## Organizer Verification

- Unauthenticated organizer access redirects to `/organizer/login`.
- The organizer login accepts the server-only preview secret and issues an HTTP-only, Secure, SameSite=Strict session cookie.
- Protected organizer dashboard access was verified after login.
- Registration management, status data, CSV export, and XLSX export were tested using synthetic data.
- The downloaded XLSX archive passed `unzip -t` integrity validation.
- Temporary test data was deleted after verification.

## Security and Privacy Verification

- The Worker rejects unauthenticated preview requests with `401` and `WWW-Authenticate`.
- The preview sends HSTS, CSP, Permissions-Policy, Referrer-Policy, X-Content-Type-Options, X-Frame-Options, and noindex headers.
- Sensitive paths, including organizer routes, exports, API routes, legacy static content, and reference directories, are protected by the preview gate.
- No confidential CAS documents, NGO records, participant records, or unapproved impact claims are exposed by the tested public preview.
- No secrets are included in committed configuration, documentation, or client bundles. Worker secrets are held in Cloudflare secret storage.
- The preview organizer password is checked only server-side using a constant-time digest comparison. For production, move organizer access behind Cloudflare Access or a dedicated identity provider before enabling real records.

## Functional and Route Verification

The following declared application routes returned successfully behind preview access control:

`/`, `/programs`, `/programs/evolve-with-ai`, `/workshops`, `/workshops/2026-11-25`, `/register`, `/resources`, the three starter-kit resource pages, `/projects`, `/projects/ekya`, `/community`, `/about`, `/contact`, `/privacy`, `/terms`, `/robots.txt`, and `/sitemap.xml`.

No approved AdQuadra content or connection is present in the source content. No public claim has been added for it.

## Quality Assurance Results

| Check | Result |
| --- | --- |
| `npm run check` | Passed: types, unit tests, production build, copy-character check |
| Browser end-to-end suite | Passed: 8 tests including accessibility and guardian flow checks |
| `npm audit --audit-level=high` | Passed: zero high severity vulnerabilities |
| Desktop, tablet, mobile visual QA | Passed in two full rendered loops at 1440px, 768px, and 390px |
| Norton Neo preview check | Passed after dismissing Neo's password-save sheet, which temporarily covered the rendered page after Basic Auth |
| Horizontal overflow test at 390px | Passed |
| Serious or critical axe violations | None found on tested public routes |

Visual evidence is stored locally in the ignored `output/preview-qa-v1/` and `output/preview-qa-v2/` folders. The second review found a stable responsive hierarchy, readable contrast, consistent typography, and no blocking layout defect. Visual quality score: 47/50.

## Cost and Environment Notes

- The preview uses Cloudflare Workers, D1, Queues, and Turnstile test credentials on the connected account.
- No paid email provider was enabled and no real emails were sent.
- No purchase, plan upgrade, or production billing change was made.
- Actual Cloudflare charges depend on the account plan and later traffic volume. Review Cloudflare usage before enabling public production traffic.

## Remaining Configuration Before Production

1. Obtain written approval for the final workshop content, claims, and public launch copy.
2. Add a verified sender and approved Resend API key only when real confirmation email delivery is authorized.
3. Complete one isolated staging delivery test using a real approved test inbox.
4. Configure production-only secrets, a production D1 database, and production email queue.
5. Put the organizer dashboard behind Cloudflare Access or a dedicated identity provider.
6. Confirm the final canonical domain and update metadata only as part of the production release.
7. Complete CAS and privacy review approval before collecting participant data.
8. Run final production visual, accessibility, registration, and email verification after DNS and environment configuration.

## Release Boundary

This preview is ready for private stakeholder review. It is not approved for production merge, DNS cutover, live registration, or real participant email delivery.

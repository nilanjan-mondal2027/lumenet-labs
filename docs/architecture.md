# Lumenet Labs Platform Architecture

Updated: 2026-11-05

## Decision

Use React Router on Cloudflare Workers with D1, Queues, Turnstile, and Resend. Keep the existing public indexed URLs and Cloudflare Pages hostname. Deploy the rebuild to a separate preview Worker first. Production DNS and the current public site remain unchanged until approval.

## Why Cloudflare

| Requirement | Cloudflare Workers and D1 | Netlify static plus functions | Decision |
|---|---|---|---|
| Existing deployment continuity | Current repository metadata and live hostname already use Cloudflare Pages | Would require a hosting move or a split backend | Cloudflare |
| Registration database | D1 is bound directly to the Worker | Requires an external database | Cloudflare |
| Bot protection | Turnstile integrates at edge | External integration required | Cloudflare |
| Durable email workflow | Queues plus D1 status records | Background functions are available, but introduce another service boundary | Cloudflare |
| Static performance | Global edge and framework static asset handling | Strong CDN support | Tie |
| Operational complexity | One provider for app, database, queue, and bot check | More external configuration for this use case | Cloudflare |
| Rollback | Worker versions and Git branch rollback | Netlify deploy rollback | Tie |

Netlify remains a viable fallback for a static presentation site. It is not the preferred architecture for this registration system because D1 and Queues reduce the number of operational boundaries.

## Runtime

1. The browser requests a route from the Worker.
2. React Router renders public content or a server route.
3. Registration actions validate with Zod, check the honeypot, rate limit a salted IP hash, and verify Turnstile.
4. D1 stores the registration, consent record, and queued email record in a batch.
5. The Worker publishes an email job to Cloudflare Queues only after persistence succeeds.
6. The queue consumer sends through Resend. Preview environments suppress sending when no provider key exists.
7. Under 18 registrations remain pending until a time-limited guardian token is approved.
8. Organizer sessions use a PBKDF2 password hash and an HMAC-signed HttpOnly cookie.
9. Exports require organizer authentication and neutralise spreadsheet formulas.

## Data boundaries

- Public pages contain no private CAS correspondence, signatures, participant records, or unapproved partner claims.
- Registration records store no raw IP address.
- Marketing consent is separate and optional.
- Guardian tokens are stored as SHA-256 hashes.
- Email delivery errors are truncated and never include provider credentials.
- Analytics are not loaded in the current build.
- Preview is noindex through `X-Robots-Tag`.

## Database

D1 tables:

- `events`
- `registrations`
- `guardian_consents`
- `email_messages`
- `rate_limits`
- `audit_log`

The active email and event index prevents accidental duplicate registrations. Public registration IDs are random and nonsequential.

## Production configuration still required

- Create a production D1 database and apply migrations.
- Create the email queue and dead letter queue.
- Add Worker secrets for Turnstile, rate limiting, session signing, organizer password hash, and Resend.
- Verify the email sending domain.
- Confirm event time, format, venue, capacity, fee, facilitator list, and agenda before publishing those fields.
- Approve the privacy notice, retention period, and guardian workflow.
- Approve production DNS or Worker route activation.

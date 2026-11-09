# Lumenet Labs Platform

A privacy-aware, mobile-first learning and registration platform for Lumenet Labs. The 2026 rebuild translates the Beyond Answers idea into a practical system: prompts, workflows, systems, and outcomes.

## Stack

- React Router 8 and React 19
- TypeScript
- Tailwind CSS build pipeline with a custom authored design system
- Cloudflare Workers
- Cloudflare D1
- Cloudflare Queues
- Cloudflare Turnstile
- Resend email delivery
- Vitest, Playwright, and axe

No browser API key, paid SDK, heavy animation framework, or remote font service is used.

## Local setup

```bash
npm install
cp .dev.vars.example .dev.vars
npm run db:migrate:local
npm run db:seed:local
npm run dev
```

Open the local URL printed by React Router. Localhost bypasses Turnstile only for synthetic local testing. Deployed preview and production requests always require server-side Turnstile verification.

## Verification

```bash
npm run typecheck
npm run test
npm run build
npm run test:e2e
npm run check:copy
```

## Registration configuration

Required Worker secrets:

- `TURNSTILE_SECRET_KEY`
- `TURNSTILE_EXPECTED_HOSTNAME`
- `RATE_LIMIT_SECRET`
- `SESSION_SECRET`
- `ORGANIZER_PASSWORD_HASH`
- `RESEND_API_KEY`
- `RESEND_WEBHOOK_SECRET`
- `WORKSHOP_WHATSAPP_GROUP_URL`

Public variables in `wrangler.jsonc`:

- `ENVIRONMENT`
- `SITE_URL`
- `TURNSTILE_SITE_KEY`
- `RESEND_FROM`

Set the organizer credential only as a Cloudflare Worker secret. `ORGANIZER_PASSWORD_HASH` must use the PBKDF2-HMAC-SHA-256 format created by `scripts/generate-organizer-password-hash.mjs`, with a unique password of at least 20 characters. It is never committed or sent to the browser. Login attempts are rate limited and successful sessions are signed, HttpOnly, Secure, and SameSite Strict.

The WhatsApp group invitation is a Worker secret, not public page content. It is included only in a confirmed participant email and a token-gated confirmed registration status page. Under 18 invitations are released only after guardian approval. Configure WhatsApp administrator approval for join requests before launch.

Resend accepting an API request is recorded as `provider_accepted`. Only a verified `email.delivered` webhook changes the record to `delivered`. Configure the Resend webhook at `/webhooks/resend` using `RESEND_WEBHOOK_SECRET` before testing live delivery.

## Content updates

- Verified public facts: `app/content/fact-register.ts`
- Workshop and site content: `app/content/site.ts`
- Database event details: `events` table
- Learning kits: `public/downloads`

Time, venue, delivery format, capacity, fee, facilitator list, and final agenda for 25 November 2026 remain unpublished until confirmed.

## Deployment

The target is a separate Cloudflare Worker preview first. Do not route the production hostname until preview QA, privacy approval, school publication approval, and email domain verification are complete.

```bash
npm run check
npx wrangler deploy --dry-run
```

See `docs/architecture.md` for the platform comparison and production checklist.

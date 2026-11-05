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

Open the local URL printed by React Router. Local development bypasses Turnstile when `ENVIRONMENT` is `development`.

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
- `RATE_LIMIT_SECRET`
- `SESSION_SECRET`
- `ORGANIZER_PASSWORD_HASH`
- `RESEND_API_KEY`

Public variables in `wrangler.jsonc`:

- `ENVIRONMENT`
- `SITE_URL`
- `TURNSTILE_SITE_KEY`
- `RESEND_FROM`

Generate the organizer PBKDF2 hash locally, then place only the resulting value in a Cloudflare Worker secret. Never commit the plain password or generated hash.

```bash
npm run organizer:hash
```

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

# SECURITY

## Secret Handling Rules
- Store real secrets only in local `.env.local` (for local testing) or Netlify environment variables.
- Never commit `.env`, `.env.local`, `.env.production`, private keys, token files, or credential exports.
- Keep `.env.example` placeholder-only.
- Do not expose server-only secrets in frontend code or `NEXT_PUBLIC_*` variables.

## If a Secret Is Exposed
1. Rotate the credential immediately at the provider.
2. Remove the secret from current files.
3. Check git history for past exposure.
4. If history is contaminated, clean with `git filter-repo` or BFG before further public releases.
5. Re-issue least-privilege credentials.

## Static Site Security Baseline (This Project)
- Strict security headers via `/_headers`:
  - CSP, HSTS, X-Frame-Options, X-Content-Type-Options, COOP/CORP, Referrer-Policy, Permissions-Policy.
- No backend API routes in this project.
- Registration is outbound to Google Forms; no user form payload is processed server-side here.
- Cookie banner stores only minimal consent preference in `localStorage`.

## Abuse Protection Checklist
- Keep Netlify bot/DDoS protections enabled.
- Keep all expensive workflows off client-side code.
- If you add on-site form handling later, add:
  - rate limiting (per IP),
  - request validation,
  - honeypot/CAPTCHA (e.g., Turnstile),
  - request size limits,
  - safe error responses.

## Deployment Security Checklist
- HTTPS enabled (Netlify default).
- Correct production URL in metadata/canonical tags.
- No debug secrets in HTML/JS/docs.
- GitHub secret scanning enabled.
- Optional pre-push secret scan run (see commands below).

## Optional Secret Scanning Commands
```bash
# quick regex scan in tracked files
git grep -nEi "sk-|ghp_|AKIA|AIza|OPENAI_API_KEY|DATABASE_URL|AWS_SECRET_ACCESS_KEY|CLIENT_SECRET|PRIVATE_KEY"

# gitleaks (if installed)
gitleaks detect --source . --redact
```

## Reporting Placeholder
For production vulnerability reports, add a dedicated security contact (email or form) before broad public launch.

# PRIVACY CHECKLIST

## Frontend Privacy Checks
- [ ] No API keys/tokens in `index.html`, `404.html`, `assets/js/*`, `assets/css/*`.
- [ ] No personal emails/phones/addresses embedded unless intentionally public.
- [ ] External links use `rel="noopener noreferrer"` when opened in new tabs.
- [ ] No sensitive data stored in `localStorage` or `sessionStorage`.

## Backend/API Privacy Checks
> Current project is static-only (no backend routes).

If backend routes are added later:
- [ ] Validate and sanitize input.
- [ ] Add rate limiting and abuse controls.
- [ ] Return safe errors (no stack traces/private internals).
- [ ] Keep server credentials server-only.

## Logging and Error Handling
- [ ] Avoid logging personal data and tokens in browser console.
- [ ] Avoid exposing raw exception payloads to end users.
- [ ] Keep diagnostics generic in production.

## Analytics and Cookies
- [ ] No analytics loaded before consent (if analytics is added).
- [ ] Consent stores only minimal choice value.
- [ ] Tracking scripts are documented and privacy-reviewed.

## Forms and Registration
- [ ] Registration handled by trusted external provider (Google Forms).
- [ ] No sensitive fields collected on this static site.
- [ ] Privacy microcopy clearly explains minimal data use.

## Third-Party Assets and Scripts
- [ ] Only required external domains are allowed in CSP.
- [ ] Fonts/scripts from trusted providers only.
- [ ] Review third-party updates before replacing local bundles.

## Pre-Launch Routine
```bash
git status
git ls-files | rg -n "\\.env|\\.pem$|\\.key$" || true
git grep -nEi "sk-|ghp_|AKIA|AIza|OPENAI_API_KEY|DATABASE_URL|CLIENT_SECRET|PRIVATE_KEY" || true
```

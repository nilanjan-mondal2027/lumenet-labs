## 1. Recommended File Structure
```txt
lumenet-evolve-ai/
  index.html
  404.html
  _headers
  _redirects
  netlify.toml
  assets/
    css/styles.css
    js/main.js
    img/
    video/
  docs/
  .github/workflows/netlify-deploy.yml (optional)
```

## 2. GitHub Setup Steps
1. Create a GitHub repo named `lumenet-evolve-ai`.
2. Push local project folder.
3. Keep `main` protected if collaborating.

## 3. Netlify Setup Steps
1. Log into Netlify and select “Add new site” from GitHub.
2. Choose repo `lumenet-evolve-ai`.
3. Build command: none.
4. Publish directory: project root (`.`).
5. Deploy and verify HTTPS is active.

## 4. netlify.toml
```toml
[build]
  publish = "."
  command = ""

[[redirects]]
  from = "/*"
  to = "/404.html"
  status = 404
```

## 5. _headers
```txt
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

## 6. _redirects
```txt
/* /404.html 404
```

## 7. Optional GitHub Actions Workflow
Use optional workflow only for checks; Netlify GitHub integration is enough for deploy.

## 8. Pre-Deployment Checks
- [ ] Confirm registration link opens correctly.
- [ ] Verify no outdated date/time visuals are shown.
- [ ] Check mobile navigation and FAQ behavior.
- [ ] Validate metadata placeholders.

## 9. Post-Deployment Checks
- [ ] HTTPS active.
- [ ] 404 route works.
- [ ] Caching headers applied.
- [ ] Social preview tags resolve.

## 10. Custom Domain Notes
- Add domain in Netlify Domain Management.
- Update canonical/OG URLs from `https://example.com` to real domain.

## 11. Rollback Plan
- Keep tagged release commits.
- Use Netlify deploy history to restore previous publish instantly.

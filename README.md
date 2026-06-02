# Lumenet Labs: Beyond Answers

A premium, lightweight landing page for **Lumenet Labs Presents: Evolve with AI**, a free live 8-day AI workshop for students and early builders.

The site is designed around one strategic idea: **Beyond Answers**. It positions Lumenet Labs as more than prompt tips or AI hype. The experience moves visitors from scattered AI use toward workflows, systems, and practical outcomes.

## What This Website Is

This is a static, Netlify-ready website built with:

- **HTML** for semantic structure
- **CSS** for the full visual system, responsive layout, typography, and motion
- **Vanilla JavaScript** for the mobile menu, reveal animations, registration link handling, copy shortcut, and lightweight canvas signal field
- **Netlify redirects and headers** for production routing, security headers, and cache control

There is no React, Next.js, Vite, backend server, database, paid API, or heavy animation framework required.

## Design Direction

The website uses a restrained editorial brand world:

- Deep near-black backgrounds
- Metallic gold hierarchy
- Muted neutral reading text
- Soft cyan signal accents
- Large expressive typography
- Lightweight canvas particles that suggest intelligence forming from noise
- Mobile-first layouts built for Instagram's in-app browser

The goal is premium without being bloated.

## Event Details

- **Event:** Lumenet Labs Presents: Evolve with AI
- **Concept:** Beyond Answers
- **Dates:** 1 July to 8 July 2026
- **Time:** 7:30 PM to 9:30 PM IST
- **Format:** Live online via Zoom
- **Duration:** 8 days, 16 total guided hours
- **Cost:** Free
- **Certificate:** Available for active participants

## Registration

Primary registration goes to the Google Form:

`https://docs.google.com/forms/d/e/1FAIpQLSeDVzOZRa7Wltxo0KVpDZaRwOVljjysP6djv6Yxxqyx-yvAIw/viewform?usp=send_form`

## Local Preview

From the project folder:

```bash
python3 -m http.server 8090
```

Then open:

```text
http://127.0.0.1:8090/index.html
```

## Build

No build step is required.

## Netlify Settings

- **Build command:** leave empty
- **Publish directory:** `.`
- **Deploy source:** GitHub repository
- **Branch:** `main`

Netlify should automatically redeploy whenever `main` is pushed.

## Production Files

- `index.html`: homepage
- `404.html`: branded custom error page
- `assets/css/styles.css`: design system and responsive styling
- `assets/js/main.js`: lightweight interaction layer
- `_redirects`: registration redirect and custom 404 behavior
- `_headers`: security and cache headers
- `assets/img/`: favicon, social image, and optional QR image

## Privacy And Security

The site does not collect user data directly. Registration happens through Google Forms. The website does not include analytics by default, does not use cookies for tracking, and does not expose API keys or backend credentials.

See `SECURITY.md` and `PRIVACY-CHECKLIST.md` for deployment safety notes.

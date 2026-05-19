# Lumenet Labs — Evolve with AI

Live website: [https://lumenet-labs.netlify.app](https://lumenet-labs.netlify.app)

This project is a premium, conversion-focused launch website for **Lumenet Labs Presents: Evolve with AI**.  
It is designed to feel high-trust, high-clarity, and high-performance for students, parents, and early professionals discovering practical AI learning.

## What Makes This Build Strong
- Clear event-first messaging with repeated conversion CTAs.
- Premium black-gold-cyan visual system without heavy frameworks.
- Mobile-first responsive layout for real-world student usage.
- Accessibility-minded structure (semantic HTML, keyboard-friendly interactions, readable contrast).
- Fast static delivery for reliable performance on low bandwidth.

## Built With
- **HTML5** for semantic page structure and SEO-friendly markup.
- **Modern CSS3** for design tokens, responsive grids, motion, and premium visual styling.
- **Vanilla JavaScript (ES6+)** for interactions:
  - sticky/active navigation
  - mobile menu behavior
  - countdown states
  - FAQ accordion
  - video modal handling
  - cookie-consent hooks
- **Python tooling (optional, local only)** for generating and processing video assets.

## Architecture
- **Project type:** Static website (no framework runtime).
- **Frontend stack:** Plain HTML + CSS + JS.
- **Build requirement:** None.
- **Deployment model:** Git-based static hosting on Netlify.

## Run Locally
```bash
cd /Users/nilanjanmondal/Downloads/lumenet-evolve-ai
python3 -m http.server 8080
```
Open: [http://localhost:8080](http://localhost:8080)

## Build
No build step is required.

## Netlify Deployment Settings
- **Build command:** *(leave empty)*
- **Publish directory:** `.`
- **Framework preset:** None / Other

## Project Structure
- `index.html` - primary landing page
- `404.html` - branded custom 404 page
- `assets/css/styles.css` - full design system and responsive styling
- `assets/js/main.js` - all interactive behaviors
- `assets/img/` - logo, OG image, QR, and image assets
- `assets/video/` - trailers, intros, captions, and source artifacts
- `docs/` - complete strategy, UX, content, SEO, QA, and launch documentation
- `netlify.toml`, `_headers`, `_redirects` - production deployment configuration

## Optional Video Regeneration (Local)
```bash
cd /Users/nilanjanmondal/Downloads/lumenet-evolve-ai
python3 -m venv .venv
. .venv/bin/activate
pip install pillow numpy imageio imageio-ffmpeg
python scripts/generate_videos.py
```

## Quality Checklist Before Launch
1. Confirm all registration CTA links open the correct Google Form in a new tab.
2. Verify modal video open/close behavior on desktop and mobile.
3. Verify countdown state and FAQ accordion behavior.
4. Validate metadata, social preview image, and canonical URLs.
5. Run a final Netlify production check after each push.

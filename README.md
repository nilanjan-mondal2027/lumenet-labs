# Lumenet Labs

Premium static landing website for **Lumenet Labs Presents: Evolve with AI** (July 2026 workshop launch).

## Detected Framework / Setup
- **Type:** Plain static frontend
- **Stack:** HTML + CSS + Vanilla JavaScript
- **Build tool:** None required

## Run Locally
```bash
cd /Users/nilanjanmondal/Downloads/lumenet-evolve-ai
python3 -m http.server 8080
```
Open [http://localhost:8080](http://localhost:8080)

## Build
No build step is required for this project.

## Project Structure
- `index.html` - main landing page
- `404.html` - custom 404 page
- `assets/css/styles.css` - styling
- `assets/js/main.js` - interaction logic
- `assets/img/` - images and QR assets
- `assets/video/` - promo/intro videos and captions
- `docs/` - planning and launch documentation
- `netlify.toml`, `_headers`, `_redirects` - deployment configuration

## Netlify Deployment Settings
- **Build command:** *(leave empty)*
- **Publish directory:** `.`
- **Framework preset:** None / Other (static site)

## Optional Video Regeneration (Local)
```bash
cd /Users/nilanjanmondal/Downloads/lumenet-evolve-ai
python3 -m venv .venv
. .venv/bin/activate
pip install pillow numpy imageio imageio-ffmpeg
python scripts/generate_videos.py
```

## Pre-Deploy Checks
1. Replace placeholder domain values (`https://example.com`) in metadata if still present.
2. Verify registration links open correctly in a new tab.
3. Verify modal video open/close, mobile menu, FAQ accordion, and countdown state.

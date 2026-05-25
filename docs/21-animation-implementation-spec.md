# Lumenet Labs Animation Implementation Spec

## Goal
Upgrade the existing landing page with premium studio-style motion inspired by modern digital portfolio experiences, while preserving existing content and conversion flow.

## Stack Used
- HTML5 / CSS3 / Vanilla JavaScript
- GSAP 3.12.5 (self-hosted)
- ScrollTrigger (self-hosted)

## Files Added
- `assets/js/vendor/gsap.min.js`
- `assets/js/vendor/ScrollTrigger.min.js`

## Files Updated
- `index.html`
- `assets/css/styles.css`
- `assets/js/main.js`

## Motion System (Implemented)
1. Page-load intro timeline
- Header fade/slide in
- Hero eyebrow reveal
- Hero headline split into animated words
- Hero lead, facts, CTA, and hero panel sequenced with eased stagger

2. Scroll-triggered reveals
- Non-hero `.reveal` elements animate in with opacity, translate, scale, and blur cleanup
- Trigger start around 84% viewport for natural pacing

3. Pointer parallax (hero only)
- Layered movement on glow orbs, gold arc, and hero panel
- Resets to neutral on pointer leave

4. Magnetic button hover
- Applied to primary CTA, video button, and nav CTA
- Uses quickTo easing for smooth attraction effect

5. Ambient interaction polish
- Animated scanning overlay and drifting grid
- Header progress line tied to scroll depth
- Desktop cursor glow and card tilt depth

## Accessibility and Safety
- Reduced-motion mode respected
- Hover-only effects disabled on touch devices
- Existing keyboard behavior, modal handling, and link semantics preserved
- Registration links remain unchanged and continue opening in new tab

## Performance Notes
- Self-hosted GSAP avoids extra third-party runtime dependency
- Motion relies mostly on `transform`, `opacity`, and controlled `filter`
- Effects auto-downgrade for touch and reduced-motion preferences

## Optional Visual Asset Upgrades (Not Mandatory)
If you want richer section visuals later, use compressed WebP/AVIF stills and short loop clips only for cards, not full-page video backgrounds.

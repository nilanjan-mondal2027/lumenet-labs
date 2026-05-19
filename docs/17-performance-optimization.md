## 1. Performance Goals
- Mobile Lighthouse Performance 90+
- Fast first paint on low-bandwidth mobile
- Smooth interaction with minimal scripting overhead

## 2. Likely Bottlenecks
- Large poster/video assets
- Unoptimized web fonts
- Excessive visual effects
- Long-running JS on scroll

## 3. HTML Optimizations
- Keep semantic, lean markup.
- Defer main JS.
- Use explicit dimensions where media is present.
- Avoid heavy iframe embeds in first viewport.

## 4. CSS Optimizations
- Use one stylesheet.
- Favor reusable tokens/utilities.
- Avoid expensive layered shadows on every element.
- Respect reduced-motion.

## 5. JavaScript Optimizations
- Guard for missing elements before attaching handlers.
- Use IntersectionObserver for reveals.
- Use passive scroll listeners where possible.
- Avoid polling except countdown tick.

## 6. Font Optimizations
- Use only two font families.
- Prefer `display=swap` loading behavior.
- Limit weight variants to what is actually used.

## 7. Image and Video Optimizations
- Convert large visuals to WebP/AVIF where practical.
- Lazy-load non-critical media.
- Keep hero video short, compressed, and muted autoplay-safe.
- Provide poster image fallback for video.

## 8. Netlify Deployment Optimizations
- Long cache headers for versioned assets.
- No-cache for HTML.
- Keep static root publish and avoid unnecessary build step.

## 9. Testing Tools
- Lighthouse (Chrome DevTools)
- WebPageTest
- Chrome Performance panel
- GTmetrix free tier

## 10. Final Performance Checklist
- [ ] JS deferred
- [ ] Fonts minimal and swapped
- [ ] Images compressed
- [ ] Video optimized and optional
- [ ] No layout shift from dynamic UI
- [ ] Headers configured

## 11. Optional Code Snippets
```html
<script src="assets/js/main.js" defer></script>
```

```txt
/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

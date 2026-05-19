# 1. Global Layout Principles
- Mobile-first with progressive enhancement.
- High contrast and generous spacing.
- Conversion-first hierarchy with repeated CTA points.
- Cards and grids for scan-friendly consumption.
- Avoid heavy media dependency.

# 2. Desktop Wireframe
- Sticky top nav with brand + section links + CTA.
- Hero in two columns:
  - Left: title, facts, value, CTA, countdown.
  - Right: premium value panel + optional video trigger.
- Subsequent sections use structured card grids.
- Schedule as 4-column readable card matrix.
- Registration section in split panel.
- Footer in 3 columns.

# 3. Tablet Wireframe
- Header keeps sticky behavior; compact nav spacing.
- Hero remains two columns but tighter gutters.
- Card grids mostly 2 columns.
- Schedule becomes 2 columns.
- Footer compresses but keeps sections distinct.

# 4. Mobile Wireframe
- Sticky header with hamburger menu and CTA.
- Hero stacks vertically.
- Buttons full-width or near-full-width touch targets.
- Value strip cards become single-column stack.
- Schedule cards single-column.
- FAQ accordion optimized for thumb scanning.

# 5. Homepage Section-by-Section Layout Notes
- Hero: strongest visual contrast + direct action.
- Value strip: immediate factual proof.
- Audience/outcomes: short cards, no wall of text.
- Schedule: concise and modular day cards.
- Host/resources: trust + practical support.
- FAQ: objection handling.
- Registration + final CTA: high-focus close.

# 6. 404 Page Wireframe
- Centered branded card.
- `404` headline + clear explanation.
- Two actions: go home, register free.
- Keep same visual identity as homepage.

# 7. Spacing and Grid Guidelines
- Container max width: ~1180px.
- Vertical section rhythm: 56–80px range.
- Card padding: 20–28px.
- Mobile side gutters: 16px.
- Desktop gutters: 24–32px.

# 8. CTA Placement Map
- Header CTA
- Hero primary CTA
- Hero secondary CTA
- Registration section CTAs
- Final CTA
- Footer CTA

# 9. Responsive Behavior Rules
- 320px+ support baseline.
- No horizontal overflow.
- Maintain readable line length on large screens.
- Keep nav/menu keyboard accessible at all breakpoints.

# 10. Implementation Notes for HTML/CSS
- Semantic tags across all sections.
- Use `scroll-margin-top` to protect anchors from sticky header overlap.
- Use CSS custom properties for consistent color/spacing.
- JS-enhanced interactions must fail gracefully if unavailable.

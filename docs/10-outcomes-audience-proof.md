Copy Deck
- Proof Strip: Completely free, 8-day structured depth, practical resources, certificates for active participants.
- Who It&apos;s For: Students, applicants, university learners, early professionals, creators, founders, underserved learners.
- What You&apos;ll Learn: Study improvement, scholarship/application workflows, AI brain setup, business/idea workflows, career assets, content systems, project building, ethical use.

HTML
```html
<section class="value-strip section">...</section>
<section class="section" id="audience">...</section>
<section class="section" id="outcomes">...</section>
```

CSS
```css
.value-strip-grid,
.audience-grid,
.outcome-grid {
  display: grid;
  gap: 1.25rem;
}

@media (min-width: 640px) {
  .value-strip-grid,
  .audience-grid,
  .outcome-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .audience-grid,
  .outcome-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
```

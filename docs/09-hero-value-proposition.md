Final Hero Copy
- Lumenet Labs Presents
- Evolve with AI
- Free 8-day live online AI workshop to help you study smarter, research better, build faster, and apply AI ethically in real life.
- 1 July to 8 July 2026
- 7:30 PM to 9:30 PM IST
- 8 days, 16 total hours
- Live online via Google Meet
- Includes worksheets, templates, practical prompts, and guided resources
- Certificates available for active participants
- Primary CTA: Register Free
- Secondary CTA: View 8-Day Plan

HTML
```html
<section class="hero section" id="home">
  <div class="container hero-grid">
    <article class="hero-copy">
      <p class="eyebrow">Lumenet Labs Presents</p>
      <h1>Evolve with AI</h1>
      <p class="hero-lead">Free 8-day live online AI workshop...</p>
      <ul class="hero-facts">
        <li>1 July to 8 July 2026</li>
        <li>7:30 PM to 9:30 PM IST</li>
        <li>Live online via Google Meet</li>
        <li>8 days, 16 total hours, completely free</li>
      </ul>
      <div class="hero-cta-row">
        <a class="btn btn-primary" href="https://forms.gle/oViwgzHnwdGuMUZK9" target="_blank" rel="noopener noreferrer">Register Free</a>
        <a class="btn btn-secondary" href="#schedule">View 8-Day Plan</a>
      </div>
      <div data-countdown aria-live="polite"></div>
    </article>
  </div>
</section>
```

CSS
```css
.hero {
  padding-top: 5rem;
  position: relative;
}

.hero h1 {
  color: var(--color-gold-strong);
}

.hero-lead {
  max-width: 68ch;
}

.hero-facts li::before {
  content: "";
  width: .45rem;
  height: .45rem;
  border-radius: 50%;
  background: var(--color-gold-strong);
}
```

Optional JavaScript Notes
- Countdown updates every second with pre-event, in-event, and post-event messaging.
- Maintain reduced-motion-friendly behavior for any hero reveal animation.

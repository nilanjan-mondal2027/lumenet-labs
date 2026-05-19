CTA Strategy
- Primary conversion path: outbound Google Form in new tab.
- CTA placements: header, hero, registration block, final CTA, footer.
- Preferred labels: Register Free, Save My Seat, Join the Free Workshop.
- Trust microcopy near CTA: event facts, privacy note, ethical AI note.

Registration Copy
- Free 8-day live workshop
- 1 July to 8 July 2026
- 7:30 PM to 9:30 PM IST
- Live online via Google Meet
- 16 total hours
- Certificates for active participants
- No replay promise

HTML
```html
<section id="register" class="section">
  <article class="registration-panel card">
    <h2>Save your seat for free</h2>
    <a class="btn btn-primary" href="https://forms.gle/oViwgzHnwdGuMUZK9" target="_blank" rel="noopener noreferrer">Save My Seat</a>
    <p class="micro-note">Registration is via Google Forms. Share only needed workshop details.</p>
  </article>
</section>
```

CSS
```css
.registration-panel {
  border-color: rgba(62, 211, 201, 0.35);
}

.hero-cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: .75rem;
}
```

JavaScript Notes
- Ensure all registration links enforce `target="_blank"` and `rel="noopener noreferrer"`.
- Keep flow simple; avoid forced form embeds in v1.

Privacy Strategy
- Collect minimal personal data on website.
- Route registration through Google Forms.
- Keep privacy language simple and student-safe.
- Store cookie preference locally and respect decline.

Cookie Banner Copy
- “We use essential storage for site preferences. Optional analytics only loads if you accept.”
- Buttons: “Decline” and “Accept”

HTML
```html
<section class="cookie-banner" data-cookie-banner hidden aria-live="polite">
  <p>We use essential storage for site preferences. Optional analytics only loads if you accept.</p>
  <div class="cookie-actions">
    <button type="button" data-cookie-decline>Decline</button>
    <button type="button" data-cookie-accept>Accept</button>
  </div>
</section>
```

CSS
```css
.cookie-banner {
  position: fixed;
  left: 1rem;
  right: 1rem;
  bottom: 1rem;
  border-radius: 1rem;
  background: rgba(14, 16, 20, .97);
}
```

JavaScript
```javascript
const key = "lumenet_cookie_consent_v1";
const banner = document.querySelector("[data-cookie-banner]");
const accept = document.querySelector("[data-cookie-accept]");
const decline = document.querySelector("[data-cookie-decline]");

if (!localStorage.getItem(key)) banner.hidden = false;

accept?.addEventListener("click", () => {
  localStorage.setItem(key, "accepted");
  banner.hidden = true;
  window.dispatchEvent(new CustomEvent("analytics:consent-granted"));
});

decline?.addEventListener("click", () => {
  localStorage.setItem(key, "declined");
  banner.hidden = true;
});
```

Footer Privacy Microcopy
- “Registration is processed via Google Forms.”
- “We keep data use minimal for workshop communication only.”
- “Students should use correct guardian or school guidance where required.”

Analytics Placeholder Notes
- Do not load analytics script until explicit consent.
- Keep hook event `analytics:consent-granted` for future integration.
- Default to no tracking if consent is declined.

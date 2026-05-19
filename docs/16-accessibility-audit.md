## 1. Critical Issues
- [ ] Confirm all interactive controls are keyboard reachable.
- [ ] Ensure mobile menu updates `aria-expanded` correctly.
- [ ] Verify FAQ buttons map to panels via `aria-controls` and `aria-labelledby`.
- [ ] Validate color contrast for gold text on dark backgrounds.
- [ ] Ensure skip link is visible on focus.

## 2. Important Improvements
- [ ] Add clear `aria-live` behavior for countdown updates.
- [ ] Confirm modal traps focus and closes with `Escape`.
- [ ] Keep touch targets at least ~44px high.
- [ ] Ensure heading order is logical and not skipped.

## 3. Nice-to-Have Improvements
- [ ] Add descriptive `aria-label` on back-to-top button if icon-only.
- [ ] Provide optional transcript links for video assets.
- [ ] Add richer landmark labels for complex sections.

## 4. Keyboard Testing Steps
- [ ] Tab through header links and CTA.
- [ ] Open/close mobile menu via keyboard.
- [ ] Trigger FAQ open/close using `Enter`/`Space`.
- [ ] Open modal, cycle focus, and close with `Escape`.
- [ ] Activate back-to-top and confirm focus behavior.

## 5. Screen Reader Testing Steps
- [ ] Confirm page title and landmark announcements.
- [ ] Verify heading hierarchy is meaningful.
- [ ] Verify FAQ controls are announced as expandable.
- [ ] Confirm registration links announce destination clearly.

## 6. Mobile Accessibility Testing Steps
- [ ] Test at 320px width for readability and no clipping.
- [ ] Confirm menu and CTA are thumb-friendly.
- [ ] Check zoom at 200% without loss of content/function.

## 7. Color Contrast Review
- [ ] Body text against background >= WCAG AA.
- [ ] CTA text over gold gradient remains readable.
- [ ] Links and focus indicators remain visible on dark surfaces.

## 8. Code Fix Examples
```css
:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(62, 211, 201, 0.65);
}
```

```html
<a class="skip-link" href="#main-content">Skip to main content</a>
```

```javascript
button.setAttribute("aria-expanded", String(isOpen));
```

## 9. Final Accessibility Pass Criteria
- [ ] Keyboard-complete navigation with no traps.
- [ ] Readable content and contrast at mobile sizes.
- [ ] All dynamic UI states announced or inferable.
- [ ] Reduced motion mode behaves safely.
- [ ] No blocker issues in Lighthouse + axe DevTools (free) + WAVE.

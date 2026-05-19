Motion Principles
- Motion supports clarity, not spectacle.
- Keep transitions short and subtle.
- Use glow sparingly and only on priority UI elements.
- Always honor reduced motion preferences.

CSS
```css
.reveal {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 320ms ease, transform 320ms ease;
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.btn:hover {
  transform: translateY(-1px);
}

.glow-orb-a {
  animation: pulse 5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: .55; transform: scale(1); }
  50% { opacity: .85; transform: scale(1.04); }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Optional JavaScript
```javascript
const observer = new IntersectionObserver((entries, io) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    io.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
```

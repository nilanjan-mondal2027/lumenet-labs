@import url("https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap");

:root {
  --color-bg: #060607;
  --color-bg-soft: #0f1013;
  --color-bg-elevated: #14161a;
  --color-border: #2a2d34;
  --color-text: #f4f5f7;
  --color-text-soft: #cfd4dc;
  --color-text-muted: #a1aab8;
  --color-gold: #d4a84f;
  --color-gold-strong: #f1c96b;
  --color-gold-deep: #8b6122;
  --color-cyan: #3ed3c9;
  --color-cyan-soft: #9deee7;
  --gradient-bg: radial-gradient(circle at 12% 4%, rgba(62, 211, 201, 0.1), transparent 35%), radial-gradient(circle at 85% 10%, rgba(212, 168, 79, 0.16), transparent 36%), linear-gradient(150deg, #050506 0%, #0b0d10 45%, #060607 100%);
  --gradient-gold: linear-gradient(135deg, #8b6122 0%, #d4a84f 40%, #f1c96b 65%, #b98130 100%);
  --font-heading: "Playfair Display", serif;
  --font-body: "Manrope", sans-serif;
  --focus-ring: 0 0 0 3px rgba(62, 211, 201, 0.65);
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  font-family: var(--font-body);
  color: var(--color-text);
  background: var(--gradient-bg);
  line-height: 1.62;
}

a { color: var(--color-cyan-soft); }
a:focus-visible, button:focus-visible { outline: none; box-shadow: var(--focus-ring); }

h1, h2, h3, h4 {
  font-family: var(--font-heading);
  line-height: 1.2;
}

.section { padding-block: 3.5rem; }
.container { width: min(100% - 2rem, 1180px); margin-inline: auto; }

.card {
  border: 1px solid rgba(212, 168, 79, 0.2);
  background: linear-gradient(170deg, rgba(24, 26, 32, 0.9), rgba(13, 15, 18, 0.88));
  border-radius: 1.35rem;
  padding: 1.75rem;
}

.badge {
  border: 1px solid rgba(212, 168, 79, 0.5);
  border-radius: 999px;
  background: rgba(9, 10, 13, 0.95);
  color: var(--color-text-soft);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.95rem;
  border-radius: 999px;
  font-weight: 700;
}

.btn-primary {
  color: #16110a;
  background: var(--gradient-gold);
}

.btn-secondary {
  color: var(--color-text);
  background: linear-gradient(180deg, rgba(25, 28, 33, 0.96), rgba(13, 15, 18, 0.96));
  border: 1px solid rgba(62, 211, 201, 0.45);
}

.skip-link {
  position: absolute;
  left: 1rem;
  top: -100%;
}

.skip-link:focus {
  top: 1rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

.container {
  width: min(100% - 2rem, 1180px);
  margin-inline: auto;
}

.section {
  padding-block: 3.5rem;
  scroll-margin-top: calc(4.5rem + 1rem);
}

.hero-grid,
.value-strip-grid,
.audience-grid,
.outcome-grid,
.schedule-grid,
.benefit-grid,
.speaker-grid,
.faq-list,
.registration-grid,
.footer-grid {
  display: grid;
  gap: 1.25rem;
}

.hero-grid {
  grid-template-columns: 1fr;
}

.schedule-grid {
  grid-template-columns: 1fr;
}

.btn {
  min-height: 2.95rem;
}

.mobile-nav-toggle {
  display: inline-flex;
}

.primary-nav {
  position: absolute;
  left: 1rem;
  right: 1rem;
  top: calc(100% + 0.45rem);
  opacity: 0;
  pointer-events: none;
  transform: scaleY(0.9);
}

.primary-nav.is-open {
  opacity: 1;
  pointer-events: auto;
  transform: scaleY(1);
}

@media (min-width: 640px) {
  .value-strip-grid,
  .audience-grid,
  .outcome-grid,
  .benefit-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .speaker-grid,
  .registration-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 768px) {
  .hero-grid {
    grid-template-columns: 1.2fr 0.8fr;
  }

  .schedule-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .audience-grid,
  .outcome-grid,
  .benefit-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .schedule-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (min-width: 860px) {
  .mobile-nav-toggle {
    display: none;
  }

  .primary-nav {
    position: static;
    opacity: 1;
    pointer-events: auto;
    transform: none;
  }
}

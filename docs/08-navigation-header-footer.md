HTML
```html
<header class="site-header" id="home">
  <div class="container nav-wrap">
    <a class="brand" href="#home">Lumenet Labs</a>
    <button class="mobile-nav-toggle" aria-expanded="false" aria-controls="primary-menu" data-mobile-toggle>
      <span class="sr-only">Open navigation menu</span>
      <span class="hamburger" aria-hidden="true"></span>
    </button>
    <nav id="primary-menu" class="primary-nav" data-mobile-menu>
      <ul class="nav-list">
        <li><a href="#audience">Who It&apos;s For</a></li>
        <li><a href="#outcomes">Outcomes</a></li>
        <li><a href="#schedule">8-Day Plan</a></li>
        <li><a href="#host">Host Team</a></li>
        <li><a href="#resources">Resources</a></li>
        <li><a href="#faq">FAQ</a></li>
        <li><a class="btn btn-primary" href="https://forms.gle/oViwgzHnwdGuMUZK9" target="_blank" rel="noopener noreferrer">Register Free</a></li>
      </ul>
    </nav>
  </div>
</header>

<footer class="site-footer">...</footer>
```

CSS
```css
.site-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  min-height: 4.5rem;
  background: rgba(5, 6, 8, 0.86);
  border-bottom: 1px solid rgba(212, 168, 79, 0.22);
}

.nav-list a.is-active {
  background: rgba(212, 168, 79, 0.14);
}

.primary-nav.is-open {
  opacity: 1;
  pointer-events: auto;
}
```

JavaScript
```javascript
const toggle = document.querySelector("[data-mobile-toggle]");
const menu = document.querySelector("[data-mobile-menu]");

toggle?.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") !== "true";
  toggle.setAttribute("aria-expanded", String(open));
  menu?.classList.toggle("is-open", open);
});

document.querySelectorAll("[data-mobile-menu] a[href^='#']").forEach((link) => {
  link.addEventListener("click", () => {
    toggle?.setAttribute("aria-expanded", "false");
    menu?.classList.remove("is-open");
  });
});
```

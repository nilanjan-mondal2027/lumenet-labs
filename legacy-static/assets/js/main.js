(() => {
  "use strict";

  const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeDVzOZRa7Wltxo0KVpDZaRwOVljjysP6djv6Yxxqyx-yvAIw/viewform?usp=send_form";
  const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isSmall = window.matchMedia("(max-width: 760px)").matches;
  const ua = navigator.userAgent || "";
  const isInApp = /Instagram|FBAN|FBAV|FB_IAB|Line|Twitter/i.test(ua);

  document.documentElement.classList.add("js-ready");

  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  function initRegistrationLinks() {
    qsa('a[href="/register"]').forEach((link) => {
      link.setAttribute("href", FORM_URL);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });
  }

  function initNav() {
    const button = qs("[data-nav-toggle]");
    const nav = qs("[data-nav]");
    if (!button || !nav) return;

    const setOpen = (open) => {
      button.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
    };

    button.addEventListener("click", () => {
      setOpen(button.getAttribute("aria-expanded") !== "true");
    });

    qsa("a", nav).forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });
  }

  function initReveal() {
    const nodes = qsa(".reveal");
    if (!nodes.length) return;
    if (isReduced || typeof IntersectionObserver !== "function") {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );

    nodes.forEach((node, index) => {
      node.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
      observer.observe(node);
    });
  }

  function initActiveNav() {
    if (typeof IntersectionObserver !== "function") return;
    const links = qsa('.site-nav a[href^="#"]');
    const sections = links.map((link) => qs(link.getAttribute("href"))).filter(Boolean);
    if (!links.length || !sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
          });
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0.1 }
    );

    sections.forEach((section) => observer.observe(section));
  }

  function initSignalField() {
    const canvas = qs("[data-signal-field]");
    if (!canvas || isReduced) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const density = isInApp || isSmall ? 34 : 72;
    const links = isInApp || isSmall ? 92 : 132;
    const points = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      points.length = 0;
      for (let i = 0; i < density; i += 1) {
        const focus = i / density;
        points.push({
          x: width * (0.15 + Math.random() * 0.7),
          y: height * (0.1 + Math.random() * 0.78),
          ox: (Math.random() - 0.5) * 0.22,
          oy: (Math.random() - 0.5) * 0.22,
          r: 0.8 + Math.random() * 1.5,
          phase: Math.random() * Math.PI * 2,
          pull: focus
        });
      }
    };

    const draw = () => {
      frame += 0.006;
      ctx.clearRect(0, 0, width, height);

      const targetX = width * 0.55;
      const targetY = height * 0.42;
      const visible = points.map((point) => {
        const order = Math.min(1, frame * 0.55);
        const wave = Math.sin(frame * 2 + point.phase);
        const x = point.x + point.ox * width * wave + (targetX - point.x) * order * point.pull * 0.18;
        const y = point.y + point.oy * height * Math.cos(frame * 1.7 + point.phase) + (targetY - point.y) * order * point.pull * 0.12;
        return { ...point, x, y };
      });

      ctx.lineWidth = 1;
      for (let i = 0; i < Math.min(links, visible.length * 2); i += 1) {
        const a = visible[i % visible.length];
        const b = visible[(i * 7 + 11) % visible.length];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 190) continue;
        const alpha = Math.max(0, 1 - distance / 190) * 0.18;
        ctx.strokeStyle = `rgba(214, 173, 92, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      visible.forEach((point) => {
        const pulse = 0.45 + Math.sin(frame * 3 + point.phase) * 0.2;
        ctx.fillStyle = `rgba(168, 221, 209, ${pulse})`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    raf = window.requestAnimationFrame(draw);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) window.cancelAnimationFrame(raf);
      else raf = window.requestAnimationFrame(draw);
    });
  }

  initRegistrationLinks();
  initNav();
  initReveal();
  initActiveNav();
  initSignalField();

  window.LUMENET_REGISTER_URL = FORM_URL;
})();

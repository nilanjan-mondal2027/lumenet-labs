(() => {
  "use strict";

  const EVENT_START = new Date("2026-07-01T19:30:00+05:30");
  const EVENT_END = new Date("2026-07-08T21:30:00+05:30");
  const REGISTER_URL = "https://forms.gle/oViwgzHnwdGuMUZK9";
  const CONSENT_KEY = "lumenet_cookie_consent_v1";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const connection = navigator.connection || navigator.webkitConnection || navigator.mozConnection;
  const isPerformanceLite =
    !!(connection && connection.saveData) ||
    (typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4) ||
    (typeof navigator.deviceMemory === "number" && navigator.deviceMemory <= 4);
  const hasGsap = typeof window !== "undefined" && typeof window.gsap === "object";

  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  function initLoader() {
    const loader = qs("[data-loader]");
    if (!loader) return;

    const finish = () => {
      loader.classList.add("is-hidden");
      document.body.classList.remove("is-loading");
    };

    if (reducedMotion) {
      finish();
      return;
    }

    const fallbackTimer = window.setTimeout(finish, 2400);
    window.addEventListener(
      "load",
      () => {
        window.clearTimeout(fallbackTimer);
        window.setTimeout(finish, 500);
      },
      { once: true }
    );
  }

  function initPerformanceMode() {
    if (!isPerformanceLite) return;
    document.body.classList.add("performance-lite");
  }

  function initMobileNav() {
    const toggle = qs("[data-mobile-toggle]");
    const menu = qs("[data-mobile-menu]");
    if (!toggle || !menu) return;

    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      menu.classList.toggle("is-open", open);
      if (!open) toggle.focus();
    };

    toggle.addEventListener("click", () => {
      const next = toggle.getAttribute("aria-expanded") !== "true";
      setOpen(next);
    });

    qsa("a[href^='#']", menu).forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });

    document.addEventListener("click", (event) => {
      if (!menu.classList.contains("is-open")) return;
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!menu.contains(target) && !toggle.contains(target)) setOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menu.classList.contains("is-open")) {
        setOpen(false);
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 860 && menu.classList.contains("is-open")) {
        setOpen(false);
      }
    });
  }

  function initSmoothAnchors() {
    qsa("a[href^='#']").forEach((link) => {
      link.addEventListener("click", (event) => {
        if (link.classList.contains("skip-link")) return;
        const href = link.getAttribute("href");
        if (!href || href === "#") return;
        const target = qs(href);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
      });
    });
  }

  function initActiveNav() {
    if (typeof IntersectionObserver !== "function") return;
    const sections = qsa("main section[id]");
    const navLinks = qsa(".nav-list a[href^='#']");
    if (!sections.length || !navLinks.length) return;

    const linkMap = new Map(navLinks.map((link) => [link.getAttribute("href")?.slice(1), link]));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("id");
          if (!id) return;
          navLinks.forEach((l) => l.classList.remove("is-active"));
          const active = linkMap.get(id);
          if (active) active.classList.add("is-active");
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0.2, 0.5] }
    );

    sections.forEach((section) => observer.observe(section));
  }

  function formatCountdown(ms) {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  function initCountdown() {
    const el = qs("[data-countdown]");
    if (!el) return;

    const tick = () => {
      const now = new Date();
      if (now < EVENT_START) {
        const diff = EVENT_START.getTime() - now.getTime();
        el.textContent = `Starts in ${formatCountdown(diff)} (IST)`;
        return;
      }
      if (now >= EVENT_START && now <= EVENT_END) {
        const diff = EVENT_END.getTime() - now.getTime();
        el.textContent = `Workshop is live now. Final session window closes in ${formatCountdown(diff)} (IST)`;
        return;
      }
      el.textContent = "Live series has ended. Register to get updates about the next Lumenet Labs workshop.";
    };

    tick();
    window.setInterval(tick, 1000);
  }

  function initFaq() {
    const buttons = qsa("[data-faq-button]");
    if (!buttons.length) return;

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const panelId = button.getAttribute("aria-controls");
        if (!panelId) return;
        const panel = qs(`#${panelId}`);
        if (!panel) return;

        const willOpen = button.getAttribute("aria-expanded") !== "true";

        buttons.forEach((otherBtn) => {
          const otherPanelId = otherBtn.getAttribute("aria-controls");
          if (!otherPanelId) return;
          const otherPanel = qs(`#${otherPanelId}`);
          otherBtn.setAttribute("aria-expanded", "false");
          if (otherPanel) otherPanel.hidden = true;
        });

        button.setAttribute("aria-expanded", String(willOpen));
        panel.hidden = !willOpen;
      });
    });
  }

  function initScheduleTabs() {
    const tabs = qsa("[data-schedule-tab]");
    const cards = qsa(".schedule-card[data-track]");
    if (!tabs.length || !cards.length) return;

    const update = (filter) => {
      tabs.forEach((tab) => {
        const active = tab.getAttribute("data-schedule-tab") === filter;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", String(active));
      });

      cards.forEach((card) => {
        const track = card.getAttribute("data-track");
        const show = filter === "all" || track === filter;
        card.hidden = !show;
      });
    };

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const filter = tab.getAttribute("data-schedule-tab") || "all";
        update(filter);
      });
    });

    update("all");
  }

  function initModal() {
    const modal = qs("[data-modal]");
    const open = qs("[data-modal-open]");
    const closeButtons = qsa("[data-modal-close]", modal || document);
    const video = qs("video", modal || document);
    if (!modal || !open || !closeButtons.length) return;

    let lastFocus = null;

    const getFocusable = () =>
      qsa(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        modal
      );

    const trapFocus = (event) => {
      if (event.key !== "Tab") return;
      const nodes = getFocusable();
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const closeModal = () => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
      modal.hidden = true;
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeydown);
      if (lastFocus instanceof HTMLElement) lastFocus.focus();
    };

    const openModal = () => {
      lastFocus = document.activeElement;
      modal.hidden = false;
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      if (video) {
        video.muted = false;
        video.volume = 0.95;
      }
      document.addEventListener("keydown", onKeydown);
      const nodes = getFocusable();
      if (nodes.length) nodes[0].focus();
    };

    const onKeydown = (event) => {
      if (event.key === "Escape") closeModal();
      trapFocus(event);
    };

    open.addEventListener("click", openModal);
    closeButtons.forEach((closeButton) => closeButton.addEventListener("click", closeModal));
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });
  }

  function initModalFallback() {
    // Delegated fallback so close actions still work even if modal setup changes.
    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const closeTrigger = target.closest("[data-modal-close]");
      if (!closeTrigger) return;
      const modal = closeTrigger.closest("[data-modal]");
      if (!modal) return;
      const video = qs("video", modal);
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
      modal.hidden = true;
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    });
  }

  function initBackToTop() {
    const button = qs("[data-back-to-top]");
    if (!button) return;

    const update = () => {
      const show = window.scrollY > 700;
      button.hidden = !show;
    };

    button.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    });

    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  function initCookieConsent() {
    const banner = qs("[data-cookie-banner]");
    const accept = qs("[data-cookie-accept]");
    const decline = qs("[data-cookie-decline]");
    if (!banner || !accept || !decline) return;

    const value = localStorage.getItem(CONSENT_KEY);
    if (!value) banner.hidden = false;

    const hide = (selection) => {
      localStorage.setItem(CONSENT_KEY, selection);
      banner.hidden = true;
      if (selection === "accepted") {
        window.dispatchEvent(new CustomEvent("analytics:consent-granted"));
      }
    };

    accept.addEventListener("click", () => hide("accepted"));
    decline.addEventListener("click", () => hide("declined"));
  }

  function initReveal() {
    if (hasGsap && !reducedMotion && !isPerformanceLite) return;
    const nodes = qsa(".reveal");
    if (!nodes.length) return;

    if (reducedMotion || typeof IntersectionObserver !== "function") {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, io) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    nodes.forEach((node) => observer.observe(node));
  }

  function initExternalRegistrationLinks() {
    qsa(`a[href='${REGISTER_URL}']`).forEach((link) => {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });
  }

  function initAmbientVideos() {
    const videos = qsa("[data-ambient-video]");
    if (!videos.length) return;

    if (isPerformanceLite) {
      qsa("video[data-ambient-heavy='true']").forEach((video) => {
        if (!(video instanceof HTMLVideoElement)) return;
        qsa("source", video).forEach((source) => source.removeAttribute("src"));
        video.pause();
        video.load();
      });
    }

    videos.forEach((video) => {
      if (!(video instanceof HTMLVideoElement)) return;
      if (isPerformanceLite && video.dataset.ambientHeavy === "true") return;
      video.muted = true;
      video.playsInline = true;
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") playPromise.catch(() => {});
    });

    if (typeof IntersectionObserver !== "function") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (!(video instanceof HTMLVideoElement)) return;
          if (isPerformanceLite && video.dataset.ambientHeavy === "true") return;
          if (entry.isIntersecting) {
            const promise = video.play();
            if (promise && typeof promise.catch === "function") promise.catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.2 }
    );

    videos.forEach((video) => observer.observe(video));
  }

  function initScrollProgress() {
    const root = document.body;
    if (!root) return;

    const update = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const pct = Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100));
      root.style.setProperty("--scroll-progress", `${pct}%`);
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  function initCursorGlow() {
    // Disabled to keep motion elegant and lightweight.
  }

  function initPointerSpotlight() {
    // Disabled to avoid extra visual FX layering.
  }

  function initTiltCards() {
    // Disabled to keep interaction smooth on all devices.
  }

  function splitHeadlineWords(el) {
    if (!el || el.dataset.splitReady === "true") return [];
    const text = (el.textContent || "").trim();
    if (!text) return [];
    el.dataset.splitReady = "true";
    el.setAttribute("aria-label", text);
    const words = text.split(/\s+/g);
    el.innerHTML = words.map((word) => `<span class="hero-word">${word}</span>`).join(" ");
    return qsa(".hero-word", el);
  }

  function initGsapExperience() {
    if (!hasGsap || reducedMotion || isPerformanceLite) return;
    const gsap = window.gsap;
    const scrollTriggerPlugin = window.ScrollTrigger;
    if (scrollTriggerPlugin) gsap.registerPlugin(scrollTriggerPlugin);

    const hero = qs(".hero");
    if (!hero) return;
    gsap.set(".hero .reveal", { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" });
    qsa(".hero .reveal").forEach((node) => node.classList.add("is-visible"));

    const heroTitle = qs(".hero h1");
    const splitWords = splitHeadlineWords(heroTitle);
    const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    heroTimeline
      .from(".site-header", { y: -20, opacity: 0, duration: 0.65 })
      .from(".hero .eyebrow", { y: 18, opacity: 0, duration: 0.45 }, "-=0.25");

    if (splitWords.length) {
      heroTimeline.from(
        splitWords,
        {
          y: 56,
          opacity: 0,
          filter: "blur(8px)",
          duration: 0.9,
          stagger: 0.08,
          ease: "power4.out"
        },
        "-=0.12"
      );
    }

    heroTimeline
      .from(".hero-lead", { y: 24, opacity: 0, duration: 0.55 }, "-=0.55")
      .from(".hero-facts li", { y: 16, opacity: 0, duration: 0.4, stagger: 0.08 }, "-=0.45")
      .from(".hero-value", { y: 14, opacity: 0, duration: 0.4 }, "-=0.35")
      .from(".hero-cta-row .btn", { y: 20, opacity: 0, duration: 0.45, stagger: 0.1 }, "-=0.25")
      .from(".hero-panel", { x: 26, opacity: 0, duration: 0.65 }, "-=0.62");

    qsa("main .section:not(.hero) .reveal").forEach((node) => {
      gsap.to(node, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: node,
          start: "top 84%",
          toggleActions: "play none none none"
        }
      });
    });

    qsa(".section-head").forEach((head) => {
      gsap.fromTo(
        head,
        { y: 28, opacity: 0.35 },
        {
          y: 0,
          opacity: 1,
          duration: 1.05,
          ease: "power3.out",
          scrollTrigger: {
            trigger: head,
            start: "top 88%",
            scrub: false,
            toggleActions: "play none none none"
          }
        }
      );
    });

    qsa(".section-video-backdrop video").forEach((bgVideo) => {
      gsap.to(bgVideo, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: bgVideo.closest(".section"),
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });

    // Intentionally keeping hero interactions minimal for a cleaner premium feel.
  }

  function initMagneticButtons() {
    // Disabled to keep CTA behavior consistent and predictable.
  }

  const safe = (fn) => {
    try {
      fn();
    } catch (error) {
      // Keep the rest of the interaction layer alive if one module fails.
      console.error("Init error:", error);
    }
  };

  safe(initPerformanceMode);
  safe(initLoader);
  safe(initMobileNav);
  safe(initSmoothAnchors);
  safe(initActiveNav);
  safe(initCountdown);
  safe(initFaq);
  safe(initScheduleTabs);
  safe(initModal);
  safe(initModalFallback);
  safe(initBackToTop);
  safe(initCookieConsent);
  safe(initReveal);
  safe(initExternalRegistrationLinks);
  safe(initAmbientVideos);
  safe(initGsapExperience);
  safe(initScrollProgress);
  safe(initCursorGlow);
  safe(initPointerSpotlight);
  safe(initTiltCards);
  safe(initMagneticButtons);
})();

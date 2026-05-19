const EVENT_START = new Date("2026-07-01T19:30:00+05:30");
const EVENT_END = new Date("2026-07-08T21:30:00+05:30");

function initCountdown(el) {
  if (!el) return;
  const tick = () => {
    const now = new Date();
    if (now < EVENT_START) {
      el.textContent = "Starts soon";
      return;
    }
    if (now <= EVENT_END) {
      el.textContent = "Workshop is live now";
      return;
    }
    el.textContent = "Series ended. Register for updates.";
  };
  tick();
  setInterval(tick, 1000);
}

function initFaq(buttons) {
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const panel = document.getElementById(button.getAttribute("aria-controls"));
      const open = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(open));
      if (panel) panel.hidden = !open;
    });
  });
}

function initTabs(tabs, cards) {
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const filter = tab.getAttribute("data-schedule-tab");
      cards.forEach((card) => {
        card.hidden = filter !== "all" && card.getAttribute("data-track") !== filter;
      });
    });
  });
}

function initModal(openBtn, closeBtn, modal) {
  if (!openBtn || !closeBtn || !modal) return;
  openBtn.addEventListener("click", () => {
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
  });
  closeBtn.addEventListener("click", () => {
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
  });
}

function initCookieHook() {
  window.addEventListener("analytics:consent-granted", () => {
    // load optional analytics script here later
  });
}

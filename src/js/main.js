(function () {
  const config = window.MARY_BLOOMS_CONFIG || {};
  const header = document.getElementById("header");
  const burger = document.querySelector("[data-burger]");
  const navLinks = document.querySelectorAll(".header__link, .header__cta");
  const stickyCta = document.querySelector("[data-sticky-cta]");
  const guideSection = document.getElementById("get-guide");
  const finalCtaSection = document.getElementById("final-cta");

  function resolveStartPayload() {
    const bot = config.telegramBot;
    if (!bot) {
      return "shpargalka";
    }

    const params = new URLSearchParams(window.location.search);
    const utmSource = (params.get("utm_source") || "").toLowerCase();
    const sources = bot.sources || {};

    if (sources[utmSource]) {
      return sources[utmSource];
    }

    return bot.defaultStartPayload || "shpargalka";
  }

  function applyBotLinks() {
    const bot = config.telegramBot;
    if (!bot || typeof bot.buildUrl !== "function") {
      return;
    }

    const botUrl = bot.buildUrl(resolveStartPayload());

    document.querySelectorAll("[data-bot-cta]").forEach(function (link) {
      link.setAttribute("href", botUrl);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });
  }

  applyBotLinks();

  if (burger && header) {
    burger.addEventListener("click", function () {
      const isOpen = header.classList.toggle("header--open");
      burger.setAttribute("aria-expanded", String(isOpen));
      burger.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        header.classList.remove("header--open");
        burger.setAttribute("aria-expanded", "false");
        burger.setAttribute("aria-label", "Открыть меню");
      });
    });
  }

  if (stickyCta && "IntersectionObserver" in window) {
    const targets = [guideSection, finalCtaSection].filter(Boolean);

    const observer = new IntersectionObserver(
      function (entries) {
        const ctaVisible = entries.some(function (entry) {
          return entry.isIntersecting;
        });
        stickyCta.classList.toggle("sticky-cta--hidden", ctaVisible);
      },
      { threshold: 0.2 }
    );

    targets.forEach(function (target) {
      observer.observe(target);
    });
  }

  document.querySelectorAll(".faq__question").forEach(function (button) {
    button.addEventListener("click", function () {
      const item = button.closest(".faq__item");
      const isOpen = item.classList.contains("faq__item--open");

      document.querySelectorAll(".faq__item--open").forEach(function (openItem) {
        openItem.classList.remove("faq__item--open");
        openItem.querySelector(".faq__question").setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("faq__item--open");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });
})();

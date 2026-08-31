(function () {
  "use strict";

  // ---------- Mobile navigation ----------
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ---------- Sticky header shadow ----------
  var header = document.getElementById("siteHeader");
  if (header) {
    window.addEventListener("scroll", function () {
      header.classList.toggle("scrolled", window.scrollY > 8);
    });
  }

  // ---------- Scroll reveal ----------
  var revealEls = document.querySelectorAll(".reveal");

  // Stagger siblings that reveal together (e.g. cards in a grid) so they
  // cascade in rather than all popping in at once.
  var staggerParent = null;
  var staggerIndex = 0;
  revealEls.forEach(function (el) {
    if (el.parentElement !== staggerParent) {
      staggerParent = el.parentElement;
      staggerIndex = 0;
    }
    el.style.transitionDelay = (Math.min(staggerIndex, 6) * 55) + "ms";
    staggerIndex++;
  });

  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // ---------- FAQ: smooth accordion ----------
  var prefersReducedMotion = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  document.querySelectorAll(".faq-item").forEach(function (details) {
    var summary = details.querySelector("summary");
    var panel = details.querySelector("p");
    if (!summary || !panel || prefersReducedMotion) return;

    summary.addEventListener("click", function (event) {
      event.preventDefault();
      if (details.hasAttribute("open")) {
        collapseFaq(details, panel);
      } else {
        expandFaq(details, panel);
      }
    });
  });

  function expandFaq(details, panel) {
    details.setAttribute("open", "");
    var targetHeight = panel.scrollHeight;
    panel.style.height = "0px";
    panel.style.opacity = "0";
    requestAnimationFrame(function () {
      panel.style.transition = "height 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease";
      panel.style.height = targetHeight + "px";
      panel.style.opacity = "1";
    });
    panel.addEventListener("transitionend", function handler(e) {
      if (e.propertyName !== "height") return;
      panel.style.height = "auto";
      panel.removeEventListener("transitionend", handler);
    });
  }

  function collapseFaq(details, panel) {
    var startHeight = panel.scrollHeight;
    panel.style.height = startHeight + "px";
    requestAnimationFrame(function () {
      panel.style.transition = "height 0.3s cubic-bezier(0.4,0,1,1), opacity 0.2s ease";
      panel.style.height = "0px";
      panel.style.opacity = "0";
    });
    panel.addEventListener("transitionend", function handler(e) {
      if (e.propertyName !== "height") return;
      details.removeAttribute("open");
      panel.removeEventListener("transitionend", handler);
    });
  }

  // ---------- Ersparnis-Rechner ----------
  var roofArea = document.getElementById("roofArea");
  var consumption = document.getElementById("consumption");
  var price = document.getElementById("price");

  var roofAreaOut = document.getElementById("roofAreaOut");
  var consumptionOut = document.getElementById("consumptionOut");
  var priceOut = document.getElementById("priceOut");

  var outKwp = document.getElementById("outKwp");
  var outSavings = document.getElementById("outSavings");
  var outPayback = document.getElementById("outPayback");

  var M2_PER_KWP = 6;
  var YIELD_PER_KWP = 950;
  var SELF_CONSUMPTION_SHARE = 0.3;
  var FEED_IN_TARIFF = 0.08;
  var COST_PER_KWP = 1500;

  function formatNumber(value, decimals) {
    return value.toLocaleString("de-DE", {
      minimumFractionDigits: decimals || 0,
      maximumFractionDigits: decimals || 0,
    });
  }

  // Keeps the custom filled track in sync 1:1 with the thumb, every input event.
  function updateRangeFill(input) {
    if (!input || !input.parentElement) return;
    var min = Number(input.min) || 0;
    var max = Number(input.max) || 100;
    var fraction = (Number(input.value) - min) / (max - min);
    input.parentElement.style.setProperty("--val", fraction);
  }

  function updateCalculator() {
    if (!roofArea || !consumption || !price) return;

    var area = Number(roofArea.value);
    var yearlyConsumption = Number(consumption.value);
    var pricePerKwh = Number(price.value) / 100;

    roofAreaOut.textContent = formatNumber(area) + " m²";
    consumptionOut.textContent = formatNumber(yearlyConsumption) + " kWh";
    priceOut.textContent = Number(price.value) + " ct";

    updateRangeFill(roofArea);
    updateRangeFill(consumption);
    updateRangeFill(price);

    var kwp = Math.min(area / M2_PER_KWP, yearlyConsumption / YIELD_PER_KWP * 1.6);
    kwp = Math.max(kwp, 1);

    var yearlyProduction = kwp * YIELD_PER_KWP;
    var selfConsumed = Math.min(yearlyProduction * SELF_CONSUMPTION_SHARE, yearlyConsumption);
    var fedIn = Math.max(yearlyProduction - selfConsumed, 0);

    var yearlySavings = selfConsumed * pricePerKwh + fedIn * FEED_IN_TARIFF;
    var systemCost = kwp * COST_PER_KWP;
    var paybackYears = yearlySavings > 0 ? systemCost / yearlySavings : 0;

    outKwp.textContent = "≈ " + formatNumber(kwp, 1) + " kWp";
    outSavings.textContent = "≈ " + formatNumber(yearlySavings) + " € / Jahr";
    outPayback.textContent = "≈ " + formatNumber(paybackYears, 1) + " Jahre";
  }

  [roofArea, consumption, price].forEach(function (input) {
    if (input) input.addEventListener("input", updateCalculator);
  });

  updateCalculator();

  // ---------- Kontaktformular (Netlify Forms) ----------
  var form = document.getElementById("kontaktForm");

  function encodeFormData(data) {
    return Object.keys(data)
      .map(function (key) {
        return encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
      })
      .join("&");
  }

  if (form) {
    var formError = document.getElementById("kontaktFormError");

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      if (formError) formError.hidden = true;

      var submitButton = form.querySelector("button[type=submit]");
      if (submitButton) submitButton.disabled = true;

      var formData = Object.fromEntries(new FormData(form).entries());

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeFormData(formData),
      })
        .then(function () {
          window.location.href = "danke.html";
        })
        .catch(function () {
          if (submitButton) submitButton.disabled = false;
          if (formError) {
            formError.textContent = "Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder rufen Sie uns direkt an.";
            formError.hidden = false;
          }
        });
    });
  }

  // ---------- Footer year ----------
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();

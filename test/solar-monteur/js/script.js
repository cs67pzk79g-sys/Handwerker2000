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

  function updateCalculator() {
    if (!roofArea || !consumption || !price) return;

    var area = Number(roofArea.value);
    var yearlyConsumption = Number(consumption.value);
    var pricePerKwh = Number(price.value) / 100;

    roofAreaOut.textContent = formatNumber(area) + " m²";
    consumptionOut.textContent = formatNumber(yearlyConsumption) + " kWh";
    priceOut.textContent = Number(price.value) + " ct";

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

  // ---------- Kontaktformular (Demo, kein Backend) ----------
  var form = document.getElementById("kontaktForm");
  var formSuccess = document.getElementById("formSuccess");

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      if (formSuccess) {
        formSuccess.hidden = false;
      }
      form.reset();
      updateCalculator();
    });
  }

  // ---------- Footer year ----------
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();

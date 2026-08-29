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

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      window.location.href = "danke.html";
    });
  }

  // ---------- Footer year ----------
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // ---------- 3D PV-Modell ----------
  initPv3d(prefersReducedMotion);
})();

function initPv3d(prefersReducedMotion) {
  "use strict";

  var THREE_VERSION = "0.128.0";
  var stage = document.getElementById("pv3dStage");
  var canvas = document.getElementById("pv3dCanvas");
  var fallback = document.getElementById("pv3dFallback");
  var hint = document.getElementById("pv3dHint");
  if (!stage || !canvas) return;

  var started = false;

  function supportsWebGL() {
    try {
      var test = document.createElement("canvas");
      return !!(window.WebGLRenderingContext &&
        (test.getContext("webgl") || test.getContext("experimental-webgl")));
    } catch (e) {
      return false;
    }
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function start() {
    if (started || !supportsWebGL()) return;
    started = true;

    loadScript("https://cdn.jsdelivr.net/npm/three@" + THREE_VERSION + "/build/three.min.js")
      .then(function () {
        return loadScript("https://cdn.jsdelivr.net/npm/three@" + THREE_VERSION + "/examples/js/controls/OrbitControls.js");
      })
      .then(buildScene)
      .catch(function () {
        // CDN unreachable/blocked – the SVG fallback stays visible.
      });
  }

  function buildScene() {
    if (!window.THREE || !window.THREE.OrbitControls) return;
    var THREE = window.THREE;

    var width = stage.clientWidth;
    var height = stage.clientHeight;
    if (!width || !height) return;

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    } catch (e) {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(5.6, 4.1, 7.2);

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    var sunLight = new THREE.DirectionalLight(0xfff3d6, 0.85);
    sunLight.position.set(6, 8, 4);
    scene.add(sunLight);
    scene.add(new THREE.HemisphereLight(0xbfd7ff, 0x223344, 0.35));

    var houseGroup = new THREE.Group();

    var wallMat = new THREE.MeshLambertMaterial({ color: 0x173c60 });
    var walls = new THREE.Mesh(new THREE.BoxGeometry(4.6, 2.2, 3.2), wallMat);
    walls.position.y = 1.1;
    houseGroup.add(walls);

    var roofMat = new THREE.MeshLambertMaterial({ color: 0x0b2438 });
    var roofGeo = new THREE.BoxGeometry(2.9, 0.12, 3.6);
    var DEG = Math.PI / 180;

    var roofLeft = new THREE.Mesh(roofGeo, roofMat);
    roofLeft.position.set(-1.28, 2.55, 0);
    roofLeft.rotation.z = 24 * DEG;
    houseGroup.add(roofLeft);

    var roofRight = new THREE.Mesh(roofGeo, roofMat);
    roofRight.position.set(1.28, 2.55, 0);
    roofRight.rotation.z = -24 * DEG;
    houseGroup.add(roofRight);

    var ridge = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.12, 3.6),
      roofMat
    );
    ridge.position.set(0, 2.98, 0);
    houseGroup.add(ridge);

    // Solar panels: 2 rows x 3 cols on the right roof slope
    var panelMat = new THREE.MeshPhongMaterial({ color: 0x2f80ed, shininess: 70, specular: 0x9fc4ff });
    var frameMat = new THREE.MeshLambertMaterial({ color: 0x0f2942 });
    var panelGeo = new THREE.BoxGeometry(0.78, 0.04, 0.56);
    var frameGeo = new THREE.BoxGeometry(0.84, 0.03, 0.6);

    var cols = 3, rows = 2;
    var startX = -0.86, stepX = 0.86;
    var startZ = -0.62, stepZ = 0.64;

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var localX = startX + c * stepX;
        var localZ = startZ + r * stepZ;
        var frame = new THREE.Mesh(frameGeo, frameMat);
        var panel = new THREE.Mesh(panelGeo, panelMat);
        frame.position.set(localX, 0.05, localZ);
        panel.position.set(localX, 0.075, localZ);
        roofRight.add(frame);
        roofRight.add(panel);
      }
    }

    scene.add(houseGroup);

    var sunMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.42, 20, 20),
      new THREE.MeshBasicMaterial({ color: 0xffc94a })
    );
    sunMesh.position.set(5.2, 5.6, -3.2);
    scene.add(sunMesh);

    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.5, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minPolarAngle = 45 * DEG;
    controls.maxPolarAngle = 85 * DEG;
    controls.autoRotate = !prefersReducedMotion;
    controls.autoRotateSpeed = 1.1;
    controls.update();

    var idleTimer = null;

    function pauseAutoRotate() {
      controls.autoRotate = false;
      if (hint) hint.classList.add("is-hidden");
      clearTimeout(idleTimer);
      if (!prefersReducedMotion) {
        idleTimer = setTimeout(function () {
          controls.autoRotate = true;
        }, 3500);
      }
    }

    canvas.addEventListener("pointerdown", pauseAutoRotate);

    function onResize() {
      var w = stage.clientWidth;
      var h = stage.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }

    if ("ResizeObserver" in window) {
      new ResizeObserver(onResize).observe(stage);
    } else {
      window.addEventListener("resize", onResize);
    }

    var isVisible = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        isVisible = entries[0].isIntersecting;
      }, { threshold: 0.05 }).observe(stage);
    }

    function animate() {
      requestAnimationFrame(animate);
      if (!isVisible) return;
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    if (fallback) fallback.classList.add("is-hidden");
  }

  if ("IntersectionObserver" in window) {
    var loadObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          start();
          loadObserver.disconnect();
        }
      });
    }, { rootMargin: "200px" });
    loadObserver.observe(stage);
  } else {
    start();
  }
}

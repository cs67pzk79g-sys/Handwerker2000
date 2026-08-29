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

    // Everything below is wrapped so that any unexpected error (e.g. an
    // API mismatch) leaves the SVG fallback visible instead of a broken
    // or blank canvas.
    try {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
      camera.position.set(5.9, 3.9, 7.6);

      var DEG = Math.PI / 180;
      var skyColor = new THREE.Color(0xbcd8ff);

      // ---------- Small procedural textures (no external images needed) ----------
      function canvasTexture(draw, w, h, repeatX, repeatY) {
        var c = document.createElement("canvas");
        c.width = w; c.height = h;
        draw(c.getContext("2d"), w, h);
        var tex = new THREE.CanvasTexture(c);
        if (repeatX) {
          tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
          tex.repeat.set(repeatX, repeatY);
        }
        return tex;
      }

      var wallTexture = canvasTexture(function (ctx, w, h) {
        ctx.fillStyle = "#f2ead9";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "rgba(150,128,98,0.16)";
        ctx.lineWidth = 1;
        var x;
        for (x = 0; x < w; x += 16) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        ctx.strokeStyle = "rgba(150,128,98,0.07)";
        var y;
        for (y = 0; y < h; y += 8) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }
      }, 256, 256, 3, 2);

      var roofTexture = canvasTexture(function (ctx, w, h) {
        ctx.fillStyle = "#1a3350";
        ctx.fillRect(0, 0, w, h);
        var y;
        for (y = 0; y < h; y += 18) {
          ctx.strokeStyle = "rgba(0,0,0,0.3)";
          ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
          ctx.strokeStyle = "rgba(255,255,255,0.06)";
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(0, y + 2); ctx.lineTo(w, y + 2); ctx.stroke();
        }
      }, 256, 256, 4, 5);

      var grassTexture = canvasTexture(function (ctx, w, h) {
        ctx.fillStyle = "#d8ecd4";
        ctx.fillRect(0, 0, w, h);
        var i, gx, gy;
        for (i = 0; i < 900; i++) {
          gx = Math.random() * w; gy = Math.random() * h;
          ctx.fillStyle = Math.random() > 0.5 ? "rgba(90,150,80,0.16)" : "rgba(210,235,200,0.4)";
          ctx.fillRect(gx, gy, 2, 2);
        }
      }, 256, 256, 5, 5);

      // ---------- Lighting: warm sun + cool sky fill + soft ambient ----------
      scene.add(new THREE.HemisphereLight(0xbcd8ff, 0x8a7457, 0.5));
      scene.add(new THREE.AmbientLight(0xffffff, 0.22));
      var sunLight = new THREE.DirectionalLight(0xfff1d6, 1.15);
      sunLight.position.set(6, 8.5, 4);
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.set(1024, 1024);
      sunLight.shadow.camera.left = -4.5;
      sunLight.shadow.camera.right = 4.5;
      sunLight.shadow.camera.top = 4.5;
      sunLight.shadow.camera.bottom = -4.5;
      sunLight.shadow.camera.near = 1;
      sunLight.shadow.camera.far = 20;
      sunLight.shadow.bias = -0.0025;
      sunLight.shadow.radius = 3;
      scene.add(sunLight);

      // ---------- Reflection source: a small cube camera above the roof ----------
      // Only updated every few frames – cheap, and gives windows/panels a real
      // (if simplified) sky+ground reflection instead of a flat color.
      var cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
        format: THREE.RGBFormat,
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter
      });
      var cubeCamera = new THREE.CubeCamera(0.1, 50, cubeRenderTarget);
      cubeCamera.position.set(0, 3.3, 0.4);
      scene.add(cubeCamera);

      // ---------- Ground: grass disc + soft contact shadow ----------
      var groundMat = new THREE.MeshStandardMaterial({ map: grassTexture, roughness: 1, metalness: 0 });
      var ground = new THREE.Mesh(new THREE.CircleGeometry(6.2, 32), groundMat);
      ground.rotation.x = -90 * DEG;
      ground.position.y = -0.02;
      ground.receiveShadow = true;
      scene.add(ground);

      var shadowCanvas = document.createElement("canvas");
      shadowCanvas.width = 128;
      shadowCanvas.height = 128;
      var shadowCtx = shadowCanvas.getContext("2d");
      var grad = shadowCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, "rgba(10,20,35,0.3)");
      grad.addColorStop(1, "rgba(10,20,35,0)");
      shadowCtx.fillStyle = grad;
      shadowCtx.fillRect(0, 0, 128, 128);
      var shadowMat = new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(shadowCanvas),
        transparent: true,
        depthWrite: false
      });
      var shadowBlob = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 4), shadowMat);
      shadowBlob.rotation.x = -90 * DEG;
      shadowBlob.position.set(0, -0.01, 0);
      scene.add(shadowBlob);

      // ---------- Bushes ----------
      function addBush(x, z, scale, colorHex) {
        var bush = new THREE.Mesh(
          new THREE.SphereGeometry(0.42, 8, 6),
          new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.9 })
        );
        bush.position.set(x, 0.26 * scale, z);
        bush.scale.set(scale, scale * 0.8, scale);
        bush.castShadow = true;
        scene.add(bush);
      }
      addBush(-2.75, 1.85, 1, 0x4c8c3a);
      addBush(-2.3, 2.1, 0.7, 0x6ba852);
      addBush(2.65, 1.8, 0.85, 0x5da34a);

      var houseGroup = new THREE.Group();

      // ---------- Walls ----------
      var wallMat = new THREE.MeshStandardMaterial({ map: wallTexture, roughness: 0.85, metalness: 0 });
      var walls = new THREE.Mesh(new THREE.BoxGeometry(4.6, 2.2, 3.2), wallMat);
      walls.position.y = 1.1;
      walls.castShadow = true;
      walls.receiveShadow = true;
      houseGroup.add(walls);

      // ---------- Door ----------
      var doorMat = new THREE.MeshStandardMaterial({ color: 0xe8990a, roughness: 0.55 });
      var door = new THREE.Mesh(new THREE.BoxGeometry(0.62, 1.3, 0.06), doorMat);
      door.position.set(-1.35, 0.65, 1.63);
      door.castShadow = true;
      houseGroup.add(door);
      var doorknob = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0xffe08a, roughness: 0.3, metalness: 0.6 })
      );
      doorknob.position.set(-1.15, 0.65, 1.67);
      houseGroup.add(doorknob);

      // ---------- Windows (reflective glass via the cube camera) ----------
      var winFrameMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
      var winGlassMat = new THREE.MeshPhysicalMaterial({
        color: 0x9fc7ea,
        roughness: 0.08,
        metalness: 0.1,
        reflectivity: 0.9,
        clearcoat: 0.5,
        clearcoatRoughness: 0.15,
        envMap: cubeRenderTarget.texture,
        envMapIntensity: 1.3,
        transparent: true,
        opacity: 0.82
      });

      function addWindow(x, y, z, rotY) {
        // The frame sits flush on the wall; the glass (and mullion bars)
        // are pushed outward along the window's own facing direction via
        // translateZ, so they sit in front of the frame instead of being
        // buried inside its solid geometry (which made them invisible).
        var frame = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.05), winFrameMat);
        var glass = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.46, 0.03), winGlassMat);
        var vBar = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.46, 0.05), winFrameMat);
        var hBar = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.04, 0.05), winFrameMat);

        [frame, glass, vBar, hBar].forEach(function (mesh) {
          mesh.position.set(x, y, z);
          if (rotY) mesh.rotation.y = rotY;
        });
        glass.translateZ(0.045);
        vBar.translateZ(0.047);
        hBar.translateZ(0.047);

        frame.castShadow = true;
        vBar.castShadow = true;
        hBar.castShadow = true;

        houseGroup.add(frame);
        houseGroup.add(glass);
        houseGroup.add(vBar);
        houseGroup.add(hBar);
      }
      addWindow(0.55, 1.3, 1.63, 0);
      addWindow(1.55, 1.3, 1.63, 0);
      addWindow(2.3, 1.3, 0, 90 * DEG);
      addWindow(-2.3, 1.3, 0.5, -90 * DEG);
      addWindow(-0.6, 1.3, -1.63, 180 * DEG);
      addWindow(0.6, 1.3, -1.63, 180 * DEG);

      // ---------- Roof ----------
      var roofMat = new THREE.MeshStandardMaterial({ map: roofTexture, roughness: 0.6, metalness: 0.08 });
      var roofGeo = new THREE.BoxGeometry(2.9, 0.12, 3.7);

      var roofLeft = new THREE.Mesh(roofGeo, roofMat);
      roofLeft.position.set(-1.28, 2.55, 0);
      roofLeft.rotation.z = 24 * DEG;
      roofLeft.castShadow = true;
      roofLeft.receiveShadow = true;
      houseGroup.add(roofLeft);

      var roofRight = new THREE.Mesh(roofGeo, roofMat);
      roofRight.position.set(1.28, 2.55, 0);
      roofRight.rotation.z = -24 * DEG;
      roofRight.castShadow = true;
      roofRight.receiveShadow = true;
      houseGroup.add(roofRight);

      var ridge = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 0.14, 3.72),
        new THREE.MeshStandardMaterial({ color: 0x0e2036, roughness: 0.6 })
      );
      ridge.position.set(0, 2.99, 0);
      houseGroup.add(ridge);

      // Eave fascia trim along the lower edge of each roof slope
      var trimMat = new THREE.MeshStandardMaterial({ color: 0xeef3f9, roughness: 0.7 });
      function addFascia(slope, localX) {
        var fascia = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 3.74), trimMat);
        fascia.position.set(localX, -0.02, 0);
        slope.add(fascia);
      }
      addFascia(roofLeft, -1.47);
      addFascia(roofRight, 1.47);

      // ---------- Chimney ----------
      var chimneyMat = new THREE.MeshStandardMaterial({ color: 0x8a5a45, roughness: 0.85 });
      var chimney = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.7, 0.28), chimneyMat);
      chimney.position.set(-1.55, 2.75, -0.6);
      chimney.castShadow = true;
      houseGroup.add(chimney);
      var chimneyCap = new THREE.Mesh(
        new THREE.BoxGeometry(0.36, 0.06, 0.36),
        new THREE.MeshStandardMaterial({ color: 0x5c3a2c, roughness: 0.7 })
      );
      chimneyCap.position.set(-1.55, 3.11, -0.6);
      houseGroup.add(chimneyCap);

      // ---------- Solar panels: 2 rows x 3 cols with a visible cell grid ----------
      var panelMat = new THREE.MeshPhysicalMaterial({
        color: 0x101f34,
        roughness: 0.32,
        metalness: 0.25,
        reflectivity: 0.6,
        clearcoat: 0.35,
        clearcoatRoughness: 0.2,
        envMap: cubeRenderTarget.texture,
        envMapIntensity: 0.8
      });
      var panelFrameMat = new THREE.MeshStandardMaterial({ color: 0xd7dee5, roughness: 0.4, metalness: 0.5 });
      var gridLineMat = new THREE.LineBasicMaterial({ color: 0x3a5f8a });

      var panelW = 0.78, panelD = 0.56;
      var panelGeo = new THREE.BoxGeometry(panelW, 0.04, panelD);
      var panelFrameGeo = new THREE.BoxGeometry(panelW + 0.06, 0.03, panelD + 0.05);

      function createCellGrid(w, d, cols, rows, y) {
        var pts = [];
        var halfW = w / 2, halfD = d / 2;
        var ci, ri, gx, gz;
        for (ci = 1; ci < cols; ci++) {
          gx = -halfW + (w / cols) * ci;
          pts.push(gx, y, -halfD, gx, y, halfD);
        }
        for (ri = 1; ri < rows; ri++) {
          gz = -halfD + (d / rows) * ri;
          pts.push(-halfW, y, gz, halfW, y, gz);
        }
        var geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
        return new THREE.LineSegments(geo, gridLineMat);
      }

      var cols = 3, rows = 2;
      var startX = -0.86, stepX = 0.86;
      var startZ = -0.62, stepZ = 0.64;
      var r, c, localX, localZ, frame, panel, grid;

      for (r = 0; r < rows; r++) {
        for (c = 0; c < cols; c++) {
          localX = startX + c * stepX;
          localZ = startZ + r * stepZ;
          frame = new THREE.Mesh(panelFrameGeo, panelFrameMat);
          panel = new THREE.Mesh(panelGeo, panelMat);
          frame.position.set(localX, 0.045, localZ);
          panel.position.set(localX, 0.07, localZ);
          frame.castShadow = true;
          panel.castShadow = true;
          roofRight.add(frame);
          roofRight.add(panel);

          grid = createCellGrid(panelW, panelD, 3, 2, 0.093);
          grid.position.set(localX, 0, localZ);
          roofRight.add(grid);
        }
      }

      scene.add(houseGroup);

      // ---------- Sun accent ----------
      var sunMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.42, 20, 20),
        new THREE.MeshBasicMaterial({ color: 0xffc94a })
      );
      sunMesh.position.set(5.4, 5.8, -3.4);
      scene.add(sunMesh);
      var sunGlow = new THREE.Mesh(
        new THREE.SphereGeometry(0.62, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffe9b0, transparent: true, opacity: 0.25 })
      );
      sunGlow.position.copy(sunMesh.position);
      scene.add(sunGlow);

      // ---------- Controls ----------
      var controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 1.4, 0);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.minPolarAngle = 40 * DEG;
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

      function updateReflections() {
        // Hide the house while capturing so its own reflective materials
        // don't read from the same render target they're being written to
        // (a "framebuffer feedback loop") – reflections end up showing the
        // sky/ground/surroundings, which is what glass mostly reflects anyway.
        houseGroup.visible = false;
        scene.background = skyColor;
        cubeCamera.update(renderer, scene);
        scene.background = null;
        houseGroup.visible = true;
      }
      updateReflections();

      var frameCount = 0;
      function animate() {
        requestAnimationFrame(animate);
        if (!isVisible) return;
        controls.update();

        frameCount++;
        if (frameCount % 15 === 0) {
          updateReflections();
        }

        renderer.render(scene, camera);
      }
      animate();

      if (fallback) fallback.classList.add("is-hidden");
    } catch (e) {
      // Something in the scene build failed – keep the SVG fallback visible.
    }
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

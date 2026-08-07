/* Generative homepage appearance composer.
   Runs before CSS paints, so every edition arrives fully composed. */
(function () {
  var root = document.documentElement;
  var looks = ["simple", "paper", "blobs", "crt", "terminal"];
  var lookLabels = { simple: "smpl", paper: "paper", blobs: "blob", crt: "crt", terminal: ">..." };
  var lookAliases = {
    simple: "simple", smpl: "simple", paper: "paper", blobs: "blobs", blob: "blobs",
    crt: "crt", terminal: "terminal", ">...": "terminal"
  };
  var appearanceAttributes = [
    "data-look", "data-edition-seed", "data-paper-rule", "data-paper-heading", "data-blob-layout",
    "data-blob-count", "data-terminal-prompt"
  ];
  var appliedProperties = [];
  var currentEdition;

  function hashSeed(value) {
    var h = 2166136261;
    var text = String(value);
    for (var i = 0; i < text.length; i++) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function randomFrom(seed) {
    var state = hashSeed(seed);
    return function () {
      state += 0x6D2B79F5;
      var n = state;
      n = Math.imul(n ^ (n >>> 15), n | 1);
      n ^= n + Math.imul(n ^ (n >>> 7), n | 61);
      return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
    };
  }

  function makeSeed() {
    if (window.crypto && window.crypto.getRandomValues) {
      var values = new Uint32Array(2);
      window.crypto.getRandomValues(values);
      return values[0].toString(36) + values[1].toString(36);
    }
    return Date.now().toString(36) + Math.floor(Math.random() * 0xffffffff).toString(36);
  }

  function pick(random, values) {
    return values[Math.floor(random() * values.length)];
  }

  function range(random, min, max, decimals) {
    var value = min + random() * (max - min);
    return Number(value.toFixed(decimals || 0));
  }

  function normalizeLook(value) {
    return lookAliases[value] || null;
  }

  function blobColor(random, hue) {
    var variedHue = Math.round((hue + range(random, -20, 20, 0) + 360) % 360);
    var saturation = range(random, 34, 62, 0);
    var lightness = range(random, 28, 49, 0);
    return "hsl(" + variedHue + " " + saturation + "% " + lightness + "%)";
  }

  function grainVars(random, bounds, opacityProperty) {
    var tile = range(random, bounds.tile[0], bounds.tile[1], 0);
    var rasterScale = Math.min(4, Math.max(3, Math.ceil(window.devicePixelRatio || 1)));
    var rasterTile = tile * rasterScale;
    var frequency = range(random, bounds.frequency[0], bounds.frequency[1], 2);
    var octaves = range(random, bounds.octaves[0], bounds.octaves[1], 0);
    var svg = "<svg xmlns='http://www.w3.org/2000/svg' width='" + rasterTile + "' height='" + rasterTile +
      "' viewBox='0 0 " + tile + " " + tile + "' preserveAspectRatio='none'>" +
      "<filter id='n' color-interpolation-filters='sRGB'><feTurbulence type='fractalNoise' " +
      "baseFrequency='" + frequency + "' numOctaves='" + octaves + "' stitchTiles='stitch'/></filter>" +
      "<rect width='" + tile + "' height='" + tile + "' filter='url(#n)'/></svg>";
    var vars = {
      "--grain-url": 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")',
      "--grain-size": tile + "px",
      "--grain-raster-scale": rasterScale,
      "--grain-frequency": frequency,
      "--grain-octaves": octaves,
      "--grain-contrast": range(random, bounds.contrast[0], bounds.contrast[1], 2),
      "--grain-brightness": range(random, bounds.brightness[0], bounds.brightness[1], 2),
      "--grain-rate": range(random, bounds.rate[0], bounds.rate[1], 0) + "ms"
    };
    vars[opacityProperty || "--grain-opacity"] = range(random, bounds.opacity[0], bounds.opacity[1], 3);
    return vars;
  }

  function compose(seed, forcedLook) {
    var random = randomFrom(seed);
    var look = normalizeLook(forcedLook) || pick(random, looks);
    var edition = { look: look, seed: seed, attrs: {}, vars: {}, blobSpeeds: [], blobMotions: [] };

    if (look === "simple") {
      var simplePalettes = [
        { bg: "#000000", ink: "#ccc6b9", bright: "#eae5da", muted: "#847e70", faint: "#7c7568", foot: "#7c7568", accent: "#7d8f5c", hair: "#35322a", rule: "#24221d", border: "#2a2822", chip: "#131311" },
        { bg: "#000000", ink: "#c8ced2", bright: "#eef1f2", muted: "#879096", faint: "#6f7880", foot: "#6f7880", accent: "#7894a5", hair: "#323b40", rule: "#22282c", border: "#293035", chip: "#121619" },
        { bg: "#000000", ink: "#d0c5bb", bright: "#f0e7df", muted: "#908076", faint: "#7e746e", foot: "#7e746e", accent: "#ad755e", hair: "#40332e", rule: "#2b2320", border: "#342a26", chip: "#181310" },
        { bg: "#000000", ink: "#cbc5d0", bright: "#eee9f1", muted: "#89808f", faint: "#82758a", foot: "#82758a", accent: "#927fa7", hair: "#38313e", rule: "#27222b", border: "#302a35", chip: "#151217" },
        { bg: "#000000", ink: "#cec8b8", bright: "#f0ebdd", muted: "#8c8573", faint: "#807760", foot: "#807760", accent: "#a18d57", hair: "#3d3829", rule: "#29261d", border: "#322e23", chip: "#17150f" }
      ];
      var simple = pick(random, simplePalettes);
      edition.vars = paletteVars(simple);
      edition.vars["--appearance-display-size"] = pick(random, ["42px", "44px", "46px"]);
      edition.vars["--appearance-body-size"] = pick(random, ["16px", "16.5px", "17px"]);
      edition.vars["--page-max"] = pick(random, ["1120px", "1180px"]);
      edition.vars["--col-min"] = pick(random, ["360px", "380px"]);
      edition.vars["--gap-col"] = pick(random, ["48px", "56px"]);
      edition.vars["--gap-row"] = pick(random, ["40px", "44px", "48px"]);
    }

    if (look === "paper") {
      var paperPalettes = [
        { bg: "#f1eadc", ink: "#2a241e", bright: "#17130f", muted: "#665d52", faint: "#74685a", foot: "#74685a", accent: "#584a3c", hair: "#b8aa98", rule: "#c9bcaa", border: "#b8aa98", chip: "#e6dccb" },
        { bg: "#e9dfcc", ink: "#29231d", bright: "#17120e", muted: "#685d4f", faint: "#6f604f", foot: "#6f604f", accent: "#674b3b", hair: "#b4a38b", rule: "#c5b59e", border: "#b4a38b", chip: "#ddd1bc" },
        { bg: "#f5f0e6", ink: "#25231f", bright: "#11110f", muted: "#625f58", faint: "#6d6961", foot: "#6d6961", accent: "#4f5b4c", hair: "#c0bbb0", rule: "#d2cdc2", border: "#bdb8ae", chip: "#ebe6dc" }
      ];
      edition.vars = paletteVars(pick(random, paperPalettes));
      edition.vars["--appearance-display-size"] = pick(random, ["44px", "48px", "52px"]);
      edition.vars["--appearance-body-size"] = pick(random, ["16.5px", "17px", "18px"]);
      edition.vars["--appearance-line-height"] = pick(random, [1.55, 1.62, 1.7]);
      edition.vars["--page-max"] = pick(random, ["760px", "840px", "920px"]);
      edition.vars["--col-min"] = pick(random, ["360px", "380px"]);
      edition.vars["--gap-col"] = pick(random, ["44px", "52px"]);
      Object.assign(edition.vars, grainVars(random, {
        tile: [512, 640], frequency: [0.25, 0.55], octaves: [4, 5],
        contrast: [1.2, 1.8], brightness: [0.88, 1.08], opacity: [0.09, 0.18], rate: [480, 1400]
      }));
      edition.attrs["data-paper-rule"] = pick(random, ["solid", "dotted"]);
      edition.attrs["data-paper-heading"] = pick(random, ["small-caps", "italic", "roman"]);
    }

    if (look === "blobs") {
      var blobPalettes = [
        { bg: "#060807", ink: "#d8d4d5", bright: "#f4eff5", muted: "#aaa2a8", faint: "#817981", foot: "#817981", accents: ["#ae91ff", "#8fcdbb", "#d7967f"], hair: "#443b47", rule: "#29242b", border: "#37313a", chip: "#111012", blobHues: [166, 14, 274, 206, 330] },
        { bg: "#07070a", ink: "#d7d5dc", bright: "#f1eff8", muted: "#a6a2ae", faint: "#817c8b", foot: "#817c8b", accents: ["#8ca8ff", "#d98bbd", "#d2ae68"], hair: "#3e3a4b", rule: "#27242f", border: "#34303e", chip: "#111017", blobHues: [218, 318, 42, 178, 270] },
        { bg: "#070807", ink: "#d8d6d1", bright: "#f3f1e9", muted: "#aaa69d", faint: "#817d74", foot: "#817d74", accents: ["#b1a1ff", "#a8c58a", "#cf8077", "#92a6df"], hair: "#423d3a", rule: "#292725", border: "#383431", chip: "#12110f", blobHues: [102, 5, 234, 45, 300] }
      ];
      var blob = pick(random, blobPalettes);
      blob.accent = pick(random, blob.accents);
      edition.vars = paletteVars(blob);
      for (var b = 0; b < 5; b++) {
        edition.vars["--blob-" + (b + 1) + "-color"] = blobColor(random, blob.blobHues[b]);
        edition.vars["--blob-" + (b + 1) + "-size"] = range(random, 34, 72, 0) + "vw";
        edition.vars["--blob-" + (b + 1) + "-opacity"] = range(random, 0.7, 1, 2);
        edition.vars["--blob-" + (b + 1) + "-strength"] = range(random, 0.28, 0.42, 2);
        edition.vars["--blob-" + (b + 1) + "-blur"] = range(random, 24, 58, 0) + "px";
        edition.blobSpeeds.push(range(random, 0.45, 0.85, 2));
        var driftDuration = range(random, 18, 42, 0);
        edition.blobMotions.push({
          duration: driftDuration,
          delay: -range(random, 0, driftDuration, 0),
          fromX: range(random, -12, 12, 0),
          fromY: range(random, -10, 10, 0),
          fromScale: range(random, 0.92, 1.08, 2),
          toX: range(random, -14, 14, 0),
          toY: range(random, -12, 12, 0),
          toScale: range(random, 0.94, 1.16, 2)
        });
      }
      edition.vars["--appearance-display-size"] = pick(random, ["44px", "49px", "54px"]);
      edition.vars["--appearance-display-weight"] = pick(random, [650, 700, 750]);
      edition.vars["--appearance-body-size"] = pick(random, ["15.5px", "16px", "17px"]);
      edition.vars["--page-max"] = pick(random, ["1060px", "1120px", "1180px"]);
      edition.vars["--col-min"] = pick(random, ["360px", "390px"]);
      edition.vars["--gap-col"] = pick(random, ["48px", "56px"]);
      Object.assign(edition.vars, grainVars(random, {
        tile: [512, 640], frequency: [0.42, 0.75], octaves: [4, 5],
        contrast: [1.8, 2.6], brightness: [0.65, 0.9], opacity: [0.09, 0.17], rate: [520, 1280]
      }, "--background-grain-opacity"));
      edition.attrs["data-blob-layout"] = pick(random, ["diagonal", "orbit", "horizon", "scatter"]);
      edition.attrs["data-blob-count"] = pick(random, ["3", "4", "4", "5"]);
    }

    if (look === "crt") {
      var crtPalettes = [
        { bg: "#020502", ink: "#b9efb1", bright: "#dcffd6", muted: "#83b77d", faint: "#628b5e", foot: "#5d8759", accent: "#91df8b", hair: "#274426", rule: "#172b17", border: "#234022", chip: "#071007" },
        { bg: "#070401", ink: "#f0c58d", bright: "#ffe3b7", muted: "#b28b5d", faint: "#98764d", foot: "#98764d", accent: "#e4aa65", hair: "#4a3320", rule: "#302012", border: "#432d1a", chip: "#120b04" },
        { bg: "#020407", ink: "#b9d8ee", bright: "#dceeff", muted: "#809fb7", faint: "#607c92", foot: "#607c92", accent: "#8fc3e5", hair: "#273b4b", rule: "#172633", border: "#223747", chip: "#071019" }
      ];
      edition.vars = paletteVars(pick(random, crtPalettes));
      edition.vars["--appearance-display-size"] = pick(random, ["46px", "50px", "54px"]);
      edition.vars["--appearance-body-size"] = pick(random, ["16.5px", "17px", "17.5px"]);
      edition.vars["--appearance-line-height"] = pick(random, [1.55, 1.62, 1.68]);
      edition.vars["--page-max"] = pick(random, ["1000px", "1100px", "1180px"]);
      edition.vars["--col-min"] = pick(random, ["390px", "410px"]);
      edition.vars["--gap-col"] = pick(random, ["44px", "52px"]);
      edition.vars["--crt-pitch"] = range(random, 2.2, 3, 1) + "px";
      edition.vars["--crt-depth"] = range(random, 66, 82, 0);
      var crtSoftness = range(random, 80, 95, 0) / 100;
      var crtHalfGap = 0.05 + (1 - crtSoftness) * 0.25;
      var crtP2 = 0.62 - crtHalfGap;
      var crtP3 = 0.62 + crtHalfGap;
      edition.vars["--crt-p1"] = Math.max(0, crtP2 - crtSoftness * 0.30).toFixed(3);
      edition.vars["--crt-p2"] = crtP2.toFixed(3);
      edition.vars["--crt-p3"] = crtP3.toFixed(3);
      edition.vars["--crt-triad"] = range(random, 1.8, 2.7, 1) + "px";
      edition.vars["--crt-grille"] = range(random, 0.28, 0.42, 2);
      edition.vars["--crt-bright"] = range(random, 1.55, 1.9, 2);
      edition.vars["--crt-saturation"] = range(random, 1, 1.2, 2);
      edition.vars["--crt-vignette"] = range(random, 0.38, 0.62, 2);
      edition.vars["--crt-roll-period"] = range(random, 6.5, 12.5, 1) + "s";
      edition.vars["--crt-glow"] = range(random, 0.35, 0.85, 2) + "px";
      Object.assign(edition.vars, grainVars(random, {
        tile: [512, 640], frequency: [0.55, 0.9], octaves: [4, 5],
        contrast: [1.4, 2], brightness: [0.78, 1], opacity: [0.012, 0.024], rate: [380, 900]
      }));
    }

    if (look === "terminal") {
      var terminalPalettes = [
        { bg: "#0a0b0a", ink: "#d5d8d3", bright: "#f0f3ed", muted: "#92978f", faint: "#757b73", foot: "#757b73", accent: "#9fc59b", hair: "#343934", rule: "#252925", border: "#303530", chip: "#111411" },
        { bg: "#080c10", ink: "#d2d9df", bright: "#edf3f7", muted: "#8e9aa3", faint: "#707e89", foot: "#707e89", accent: "#8bb6d1", hair: "#303b43", rule: "#212a31", border: "#2c363e", chip: "#0e1418" },
        { bg: "#0b0a06", ink: "#ddd7c8", bright: "#f5efdf", muted: "#9e9581", faint: "#837860", foot: "#837860", accent: "#d0ae69", hair: "#403927", rule: "#2c281b", border: "#393321", chip: "#15130c" }
      ];
      edition.vars = paletteVars(pick(random, terminalPalettes));
      edition.vars["--appearance-display-size"] = pick(random, ["36px", "39px", "42px"]);
      edition.vars["--appearance-body-size"] = pick(random, ["15px", "15.5px", "16px"]);
      edition.vars["--appearance-line-height"] = pick(random, [1.6, 1.68, 1.75]);
      edition.vars["--page-max"] = pick(random, ["900px", "1000px", "1100px"]);
      edition.vars["--col-min"] = pick(random, ["390px", "410px"]);
      edition.vars["--gap-col"] = pick(random, ["44px", "52px"]);
      Object.assign(edition.vars, grainVars(random, {
        tile: [512, 640], frequency: [0.45, 0.8], octaves: [4, 5],
        contrast: [1.35, 2.1], brightness: [0.72, 0.96], opacity: [0.024, 0.052], rate: [520, 1280]
      }));
      edition.attrs["data-terminal-prompt"] = pick(random, ["tilde", "dot", "chevron"]);
    }

    return edition;
  }

  function paletteVars(palette) {
    return {
      "--bg": palette.bg,
      "--ink": palette.ink,
      "--ink-bright": palette.bright,
      "--ink-hover": palette.bright,
      "--muted": palette.muted,
      "--faint": palette.faint,
      "--footnote": palette.foot,
      "--accent": palette.accent,
      "--hairline": palette.hair,
      "--rule": palette.rule,
      "--border": palette.border,
      "--chip-bg": palette.chip
    };
  }

  function apply(edition) {
    for (var i = 0; i < appearanceAttributes.length; i++) {
      root.removeAttribute(appearanceAttributes[i]);
    }
    for (var p = 0; p < appliedProperties.length; p++) {
      root.style.removeProperty(appliedProperties[p]);
    }
    appliedProperties = [];

    root.setAttribute("data-look", edition.look);
    root.setAttribute("data-edition-seed", edition.seed);
    Object.keys(edition.attrs).forEach(function (name) {
      root.setAttribute(name, edition.attrs[name]);
    });
    Object.keys(edition.vars).forEach(function (name) {
      root.style.setProperty(name, edition.vars[name]);
      appliedProperties.push(name);
    });
    currentEdition = edition;
    updateControls();
    updateBlobMotion();
    updateParallax();
  }

  function updateControls() {
    var control = document.querySelector("[data-appearance-control]");
    if (!control || !currentEdition) return;
    control.querySelectorAll("[data-choose-look]").forEach(function (button) {
      if (button.dataset.chooseLook === "random") {
        button.removeAttribute("aria-pressed");
      } else {
        button.setAttribute("aria-pressed", button.dataset.chooseLook === currentEdition.look ? "true" : "false");
      }
    });
    var status = control.querySelector("[data-appearance-status]");
    if (status) status.textContent = lookLabels[currentEdition.look] + " · " + currentEdition.seed.slice(0, 7);
  }

  function clearPinnedUrl() {
    if (!window.history || !window.history.replaceState) return;
    var url = new URL(window.location.href);
    url.searchParams.delete("look");
    url.searchParams.delete("seed");
    window.history.replaceState({}, "", url.pathname + (url.search ? url.search : "") + url.hash);
  }

  var parallaxFrame;
  function updateBlobMotion() {
    var blobs = document.querySelectorAll("[data-parallax-blob]");
    blobs.forEach(function (blob, index) {
      var motion = currentEdition && currentEdition.blobMotions[index];
      if (!motion) return;
      blob.style.setProperty("--blob-drift-speed", motion.duration + "s");
      blob.style.setProperty("--blob-drift-delay", motion.delay + "s");
      blob.style.setProperty("--blob-from-x", motion.fromX + "%");
      blob.style.setProperty("--blob-from-y", motion.fromY + "%");
      blob.style.setProperty("--blob-from-scale", motion.fromScale);
      blob.style.setProperty("--blob-to-x", motion.toX + "%");
      blob.style.setProperty("--blob-to-y", motion.toY + "%");
      blob.style.setProperty("--blob-to-scale", motion.toScale);
    });
  }

  function updateParallax() {
    if (parallaxFrame) window.cancelAnimationFrame(parallaxFrame);
    parallaxFrame = window.requestAnimationFrame(function () {
      parallaxFrame = null;
      var blobs = document.querySelectorAll("[data-parallax-blob]");
      var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      blobs.forEach(function (blob, index) {
        var speed = currentEdition && currentEdition.blobSpeeds[index];
        var offsetY = currentEdition && currentEdition.look === "blobs" && !reduceMotion && speed
          ? window.scrollY * (1 - speed)
          : 0;
        blob.style.setProperty("--blob-parallax-y", offsetY.toFixed(1) + "px");
      });
    });
  }

  var params = new URLSearchParams(window.location.search);
  var requestedLook = params.get("look");
  var initialSeed = params.get("seed") || makeSeed();
  apply(compose(initialSeed, requestedLook));

  document.addEventListener("DOMContentLoaded", function () {
    var control = document.querySelector("[data-appearance-control]");
    if (control) {
      control.addEventListener("click", function (event) {
        var button = event.target.closest("[data-choose-look]");
        if (!button) return;
        clearPinnedUrl();
        var choice = button.dataset.chooseLook;
        var seed = makeSeed();
        apply(compose(seed, choice === "random" ? null : choice));
      });
    }
    updateControls();
    updateBlobMotion();
    updateParallax();
    window.addEventListener("scroll", updateParallax, { passive: true });
    window.addEventListener("resize", updateParallax);
  });
})();

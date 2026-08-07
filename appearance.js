/* Generative homepage appearance composer.
   Runs before CSS paints, so every edition arrives fully composed. */
(function () {
  var root = document.documentElement;
  var looks = ["simple", "paper", "blobs", "crt", "terminal"];
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

  function compose(seed, forcedLook) {
    var random = randomFrom(seed);
    var look = looks.indexOf(forcedLook) !== -1 ? forcedLook : pick(random, looks);
    var edition = { look: look, seed: seed, attrs: {}, vars: {}, blobSpeeds: [] };

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
      edition.vars["--page-max"] = pick(random, ["1040px", "1100px"]);
      edition.vars["--gap-row"] = pick(random, ["40px", "44px", "48px"]);
      edition.vars["--photo-gray"] = range(random, 0.15, 0.35, 2);
    }

    if (look === "paper") {
      var paperPalettes = [
        { bg: "#f1eadc", ink: "#2a241e", bright: "#17130f", muted: "#665d52", faint: "#74685a", foot: "#74685a", accent: "#584a3c", hair: "#b8aa98", rule: "#c9bcaa", border: "#b8aa98", chip: "#e6dccb" },
        { bg: "#e9dfcc", ink: "#29231d", bright: "#17120e", muted: "#685d4f", faint: "#6f604f", foot: "#6f604f", accent: "#674b3b", hair: "#b4a38b", rule: "#c5b59e", border: "#b4a38b", chip: "#ddd1bc" },
        { bg: "#f5f0e6", ink: "#25231f", bright: "#11110f", muted: "#625f58", faint: "#6d6961", foot: "#6d6961", accent: "#4f5b4c", hair: "#c0bbb0", rule: "#d2cdc2", border: "#bdb8ae", chip: "#ebe6dc" }
      ];
      edition.vars = paletteVars(pick(random, paperPalettes));
      edition.vars["--appearance-display-size"] = pick(random, ["46px", "50px", "56px"]);
      edition.vars["--appearance-body-size"] = pick(random, ["16.5px", "17px", "18px"]);
      edition.vars["--appearance-line-height"] = pick(random, [1.55, 1.62, 1.7]);
      edition.vars["--page-max"] = pick(random, ["680px", "750px", "820px"]);
      edition.vars["--grain-opacity"] = range(random, 0.035, 0.085, 3);
      edition.vars["--photo-gray"] = range(random, 0.55, 0.85, 2);
      edition.vars["--photo-sepia"] = range(random, 0.08, 0.18, 2);
      edition.attrs["data-paper-rule"] = pick(random, ["solid", "dotted"]);
      edition.attrs["data-paper-heading"] = pick(random, ["small-caps", "italic", "roman"]);
    }

    if (look === "blobs") {
      var blobPalettes = [
        { bg: "#060807", ink: "#d8d4d5", bright: "#f4eff5", muted: "#aaa2a8", faint: "#817981", foot: "#817981", accent: "#ae91ff", hair: "#443b47", rule: "#29242b", border: "#37313a", chip: "#111012", blobs: ["#326f67", "#743e33", "#604381"] },
        { bg: "#07070a", ink: "#d7d5dc", bright: "#f1eff8", muted: "#a6a2ae", faint: "#817c8b", foot: "#817c8b", accent: "#8ca8ff", hair: "#3e3a4b", rule: "#27242f", border: "#34303e", chip: "#111017", blobs: ["#314f86", "#6e365f", "#8a6531"] },
        { bg: "#070807", ink: "#d8d6d1", bright: "#f3f1e9", muted: "#aaa69d", faint: "#817d74", foot: "#817d74", accent: "#b1a1ff", hair: "#423d3a", rule: "#292725", border: "#383431", chip: "#12110f", blobs: ["#4d683d", "#7b3a37", "#3f4077"] }
      ];
      var blob = pick(random, blobPalettes);
      edition.vars = paletteVars(blob);
      edition.vars["--blob-1"] = blob.blobs[0];
      edition.vars["--blob-2"] = blob.blobs[1];
      edition.vars["--blob-3"] = blob.blobs[2];
      edition.vars["--blob-opacity"] = range(random, 0.18, 0.32, 2);
      edition.vars["--blob-size"] = range(random, 45, 70, 0) + "vw";
      edition.vars["--appearance-display-size"] = pick(random, ["46px", "52px", "58px"]);
      edition.vars["--appearance-display-weight"] = pick(random, [650, 700, 750]);
      edition.vars["--appearance-body-size"] = pick(random, ["15.5px", "16px", "17px"]);
      edition.vars["--page-max"] = pick(random, ["1000px", "1060px", "1120px"]);
      edition.vars["--grain-opacity"] = range(random, 0.018, 0.038, 3);
      edition.attrs["data-blob-layout"] = pick(random, ["diagonal", "orbit", "horizon", "scatter"]);
      edition.attrs["data-blob-count"] = pick(random, ["2", "3", "3"]);
      edition.blobSpeeds = [
        range(random, 0.45, 0.85, 2),
        range(random, 0.45, 0.85, 2),
        range(random, 0.45, 0.85, 2)
      ];
    }

    if (look === "crt") {
      var crtPalettes = [
        { bg: "#020502", ink: "#b9efb1", bright: "#dcffd6", muted: "#83b77d", faint: "#628b5e", foot: "#5d8759", accent: "#91df8b", hair: "#274426", rule: "#172b17", border: "#234022", chip: "#071007" },
        { bg: "#070401", ink: "#f0c58d", bright: "#ffe3b7", muted: "#b28b5d", faint: "#98764d", foot: "#98764d", accent: "#e4aa65", hair: "#4a3320", rule: "#302012", border: "#432d1a", chip: "#120b04" },
        { bg: "#020407", ink: "#b9d8ee", bright: "#dceeff", muted: "#809fb7", faint: "#607c92", foot: "#607c92", accent: "#8fc3e5", hair: "#273b4b", rule: "#172633", border: "#223747", chip: "#071019" }
      ];
      edition.vars = paletteVars(pick(random, crtPalettes));
      edition.vars["--appearance-display-size"] = pick(random, ["44px", "48px", "52px"]);
      edition.vars["--appearance-body-size"] = pick(random, ["15.5px", "16px", "16.5px"]);
      edition.vars["--appearance-line-height"] = pick(random, [1.5, 1.58, 1.65]);
      edition.vars["--page-max"] = pick(random, ["900px", "1000px", "1100px"]);
      edition.vars["--scanline-opacity"] = range(random, 0.06, 0.12, 3);
      edition.vars["--crt-glow"] = range(random, 0.25, 0.7, 2) + "px";
      edition.vars["--grain-opacity"] = range(random, 0.018, 0.035, 3);
      edition.vars["--photo-gray"] = range(random, 0.65, 1, 2);
    }

    if (look === "terminal") {
      var terminalPalettes = [
        { bg: "#0a0b0a", ink: "#d5d8d3", bright: "#f0f3ed", muted: "#92978f", faint: "#757b73", foot: "#757b73", accent: "#9fc59b", hair: "#343934", rule: "#252925", border: "#303530", chip: "#111411" },
        { bg: "#080c10", ink: "#d2d9df", bright: "#edf3f7", muted: "#8e9aa3", faint: "#707e89", foot: "#707e89", accent: "#8bb6d1", hair: "#303b43", rule: "#212a31", border: "#2c363e", chip: "#0e1418" },
        { bg: "#0b0a06", ink: "#ddd7c8", bright: "#f5efdf", muted: "#9e9581", faint: "#837860", foot: "#837860", accent: "#d0ae69", hair: "#403927", rule: "#2c281b", border: "#393321", chip: "#15130c" }
      ];
      edition.vars = paletteVars(pick(random, terminalPalettes));
      edition.vars["--appearance-display-size"] = pick(random, ["36px", "40px", "44px"]);
      edition.vars["--appearance-body-size"] = pick(random, ["15px", "15.5px", "16px"]);
      edition.vars["--appearance-line-height"] = pick(random, [1.6, 1.68, 1.75]);
      edition.vars["--page-max"] = pick(random, ["760px", "860px", "960px"]);
      edition.vars["--grain-opacity"] = range(random, 0.02, 0.04, 3);
      edition.attrs["data-terminal-prompt"] = pick(random, ["tilde", "dot", "chevron"]);
      edition.vars["--photo-gray"] = range(random, 0.65, 1, 2);
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
    updateParallax();
  }

  function updateControls() {
    var control = document.querySelector("[data-appearance-control]");
    if (!control || !currentEdition) return;
    control.querySelectorAll("[data-choose-look]").forEach(function (button) {
      button.setAttribute("aria-pressed", button.dataset.chooseLook === currentEdition.look ? "true" : "false");
    });
    var status = control.querySelector("[data-appearance-status]");
    if (status) status.textContent = currentEdition.look + " · " + currentEdition.seed.slice(0, 7);
  }

  function clearPinnedUrl() {
    if (!window.history || !window.history.replaceState) return;
    var url = new URL(window.location.href);
    url.searchParams.delete("look");
    url.searchParams.delete("seed");
    window.history.replaceState({}, "", url.pathname + (url.search ? url.search : "") + url.hash);
  }

  var parallaxFrame;
  function updateParallax() {
    if (parallaxFrame) window.cancelAnimationFrame(parallaxFrame);
    parallaxFrame = window.requestAnimationFrame(function () {
      parallaxFrame = null;
      var blobs = document.querySelectorAll("[data-parallax-blob]");
      var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      blobs.forEach(function (blob, index) {
        var speed = currentEdition && currentEdition.blobSpeeds[index];
        var offset = currentEdition && currentEdition.look === "blobs" && !reduceMotion && speed
          ? -window.scrollY * speed
          : 0;
        blob.style.transform = "translate3d(0," + offset.toFixed(1) + "px,0)";
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
    updateParallax();
    window.addEventListener("scroll", updateParallax, { passive: true });
    window.addEventListener("resize", updateParallax);
  });
})();

/* Generative homepage appearance composer.
   Runs before CSS paints, so every edition arrives fully composed. */
(function () {
  var root = document.documentElement;
  var fontSans = 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  var fontEno = '"Montserrat", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  var fontSerif = "var(--serif)";
  var fontMono = "var(--mono)";
  var filmSerifs = [
    '"Source Serif 4", Georgia, serif',
    '"Cormorant Garamond", Georgia, serif',
    'Georgia, "Times New Roman", serif'
  ];
  var filmMonos = [
    '"IBM Plex Mono", monospace',
    '"Courier Prime", "Courier New", monospace',
    '"Roboto Mono", monospace'
  ];
  /* Each CRT phosphor family anchors a hue; every edition jitters it and draws
     independent saturation/lightness per token role so no two editions of the
     same family render identically. coolBias lifts text-role lightness for
     hues whose WCAG luminance-per-lightness runs low (blue/violet/rose/magenta). */
  var crtPhosphorFamilies = [
    { name: "green", hue: 118, hueJitter: 13, satMul: 1.15, coolBias: false },
    { name: "amber", hue: 34, hueJitter: 13, satMul: 1.15, coolBias: false },
    { name: "blue", hue: 207, hueJitter: 13, satMul: 1.15, coolBias: true },
    { name: "violet", hue: 274, hueJitter: 13, satMul: 1.15, coolBias: true },
    { name: "rose", hue: 343, hueJitter: 13, satMul: 1.15, coolBias: true },
    { name: "cyan", hue: 165, hueJitter: 12, satMul: 1.15, coolBias: false },
    { name: "mono", hue: 210, hueJitter: 14, satMul: 0.3, coolBias: true },
    { name: "magenta", hue: 322, hueJitter: 13, satMul: 1.6, coolBias: true },
    { name: "acid-lime", hue: 80, hueJitter: 12, satMul: 1.45, coolBias: false }
  ];
  var crtRoleBands = {
    bg: { sat: [35, 70], light: [1, 2.5], coolLight: [1, 2.5] },
    ink: { sat: [38, 80], light: [78, 85], coolLight: [85, 90] },
    bright: { sat: [72, 100], light: [90, 94], coolLight: [90, 94] },
    muted: { sat: [20, 40], light: [58, 64], coolLight: [66, 70] },
    faint: { sat: [12, 36], light: [45, 49], coolLight: [56, 60] },
    foot: { sat: [12, 36], light: [42, 46], coolLight: [53, 57] },
    accent: { sat: [32, 78], light: [60, 74], coolLight: [74, 82] },
    hair: { sat: [20, 44], light: [18, 24], coolLight: [18, 24] },
    rule: { sat: [20, 48], light: [11, 16], coolLight: [11, 16] },
    border: { sat: [22, 48], light: [16, 22], coolLight: [16, 22] },
    chip: { sat: [26, 68], light: [3, 7], coolLight: [3, 7] }
  };
  var looks = ["simple", "paper", "blobs", "eno", "70mm", "crt", "terminal"];
  var lookLabels = { simple: "smpl", paper: "paper", blobs: "blob", eno: "eno", "70mm": "70mm", crt: "crt", terminal: ">..." };
  var lookAliases = {
    simple: "simple", smpl: "simple", paper: "paper", blobs: "blobs", blob: "blobs",
    eno: "eno", "70mm": "70mm", film: "70mm", crt: "crt", terminal: "terminal", ">...": "terminal"
  };
  var appearanceAttributes = [
    "data-look", "data-edition-seed", "data-paper-rule", "data-paper-heading", "data-paper-texture", "data-blob-layout",
    "data-blob-count", "data-blob-mobile-extra", "data-eno-composition", "data-eno-contrast",
    "data-film-tone", "data-terminal-prompt"
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

  function hslToRgb(h, s, l) {
    var hue = ((h % 360) + 360) % 360;
    var sat = Math.min(Math.max(s, 0), 100) / 100;
    var light = Math.min(Math.max(l, 0), 100) / 100;
    var c = (1 - Math.abs(2 * light - 1)) * sat;
    var x = c * (1 - Math.abs((hue / 60) % 2 - 1));
    var m = light - c / 2;
    var r, g, b;
    if (hue < 60) { r = c; g = x; b = 0; }
    else if (hue < 120) { r = x; g = c; b = 0; }
    else if (hue < 180) { r = 0; g = c; b = x; }
    else if (hue < 240) { r = 0; g = x; b = c; }
    else if (hue < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    return [
      Math.round((r + m) * 255),
      Math.round((g + m) * 255),
      Math.round((b + m) * 255)
    ];
  }

  function hslToHex(h, s, l) {
    var rgb = hslToRgb(h, s, l);
    return "#" + rgb.map(function (channel) {
      return Math.min(Math.max(channel, 0), 255).toString(16).padStart(2, "0");
    }).join("");
  }

  function inverseHex(hex) {
    var value = String(hex || "").replace("#", "");
    if (!/^[0-9a-f]{6}$/i.test(value)) return "#7d8f5c";
    var red = 255 - parseInt(value.slice(0, 2), 16);
    var green = 255 - parseInt(value.slice(2, 4), 16);
    var blue = 255 - parseInt(value.slice(4, 6), 16);
    return "#" + [red, green, blue].map(function (channel) {
      return channel.toString(16).padStart(2, "0");
    }).join("");
  }

  function mixHex(hexA, hexB, weightA) {
    var a = String(hexA || "").replace("#", "");
    var b = String(hexB || "").replace("#", "");
    var w = Math.min(100, Math.max(0, weightA)) / 100;
    var channels = [0, 2, 4].map(function (i) {
      var av = parseInt(a.slice(i, i + 2), 16);
      var bv = parseInt(b.slice(i, i + 2), 16);
      return Math.round(av * w + bv * (1 - w));
    });
    return "#" + channels.map(function (c) { return c.toString(16).padStart(2, "0"); }).join("");
  }

  /* 70mm perforation geometry, derived from one seeded pitch instead of three
     independent randoms, so hole/pitch and width/height ratios always match a
     real perforation standard. Rendered as a colored SVG tile (not a
     repeating-gradient) so corners can be genuinely rounded. */
  function perfHoleVars(random, edgeColor) {
    var pitch = range(random, 38, 52, 0);
    var holeWidth = Math.round(pitch * 0.59 * 10) / 10;
    var holeHeight = Math.round(holeWidth * 0.71 * 10) / 10;
    var radius = Math.round(holeWidth * 0.18 * 10) / 10;
    var bandHeight = Math.ceil(holeHeight * range(random, 2.8, 3.1, 2));
    var rasterScale = 4;
    var holeX = Math.round((pitch - holeWidth) / 2 * 10) / 10;
    var holeY = Math.round((bandHeight - holeHeight) / 2 * 10) / 10;
    var fill = mixHex(edgeColor, "#000000", range(random, 18, 30, 0));
    var highlight = mixHex(edgeColor, "#000000", 78);
    var highlightHeight = Math.max(1, Math.round(holeHeight * 0.08 * 10) / 10);
    var svg = "<svg xmlns='http://www.w3.org/2000/svg' width='" + (pitch * rasterScale) + "' height='" + (bandHeight * rasterScale) +
      "' viewBox='0 0 " + pitch + " " + bandHeight + "'>" +
      "<rect x='" + holeX + "' y='" + holeY + "' width='" + holeWidth + "' height='" + holeHeight + "' rx='" + radius + "' fill='" + fill + "'/>" +
      "<rect x='" + holeX + "' y='" + holeY + "' width='" + holeWidth + "' height='" + highlightHeight + "' rx='" + radius + "' fill='" + highlight + "'/>" +
      "</svg>";
    return {
      "--film-perf-pitch": pitch + "px",
      "--film-perf-hole-width": holeWidth + "px",
      "--film-perf-hole-height": holeHeight + "px",
      "--film-perf-radius": radius + "px",
      "--film-perf-height": bandHeight + "px",
      "--film-perf-hole-url": 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")'
    };
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

  function grainVars(random, bounds) {
    var tile = range(random, bounds.tile[0], bounds.tile[1], 0);
    var rasterScale = 4;
    var rasterTile = tile * rasterScale;
    var frequency = range(random, bounds.frequency[0], bounds.frequency[1], 3);
    var octaves = range(random, bounds.octaves[0], bounds.octaves[1], 0);
    var noiseSeed = range(random, 1, 9999, 0);
    var svg = "<svg xmlns='http://www.w3.org/2000/svg' width='" + rasterTile + "' height='" + rasterTile +
      "' viewBox='0 0 " + tile + " " + tile + "' preserveAspectRatio='none'>" +
      "<filter id='n' x='0' y='0' width='" + tile + "' height='" + tile +
      "' filterUnits='userSpaceOnUse' filterRes='" + rasterTile + " " + rasterTile +
      "' color-interpolation-filters='sRGB'><feTurbulence type='fractalNoise' " +
      "baseFrequency='" + frequency + "' numOctaves='" + octaves +
      "' seed='" + noiseSeed + "' stitchTiles='stitch' result='noise'/><feColorMatrix in='noise' type='saturate' values='0'/></filter>" +
      "<rect width='" + tile + "' height='" + tile + "' filter='url(#n)'/></svg>";
    var vars = {
      "--grain-url": 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")',
      "--grain-size": tile + "px",
      "--grain-raster-scale": rasterScale,
      "--grain-frequency": frequency,
      "--grain-octaves": octaves,
      "--grain-seed": noiseSeed,
      "--grain-contrast": range(random, bounds.contrast[0], bounds.contrast[1], 2),
      "--grain-brightness": range(random, bounds.brightness[0], bounds.brightness[1], 2),
      "--grain-rate": range(random, bounds.rate[0], bounds.rate[1], 0) + "ms"
    };
    vars["--grain-opacity"] = range(random, bounds.opacity[0], bounds.opacity[1], 3);
    return vars;
  }

  /* Louppe's crisp grain is the shared centre point. Individual appearances
     can nudge physical scale and strength without falling back into cloudy,
     low-contrast noise. */
  function grainBounds(overrides) {
    var bounds = {
      tile: [512, 560],
      frequency: [0.6, 0.72],
      octaves: [4, 5],
      contrast: [2.2, 2.6],
      brightness: [0.68, 0.78],
      rate: [720, 960]
    };
    Object.keys(overrides || {}).forEach(function (key) {
      bounds[key] = overrides[key];
    });
    return bounds;
  }

  function paperTextureVars(random) {
    var type = pick(random, ["laid", "vellum", "watercolour"]);
    var tile = type === "watercolour"
      ? range(random, 820, 1080, 0)
      : range(random, 720, 960, 0);
    var rasterScale = 2;
    var rasterTile = tile * rasterScale;
    var primarySeed = range(random, 1, 9999, 0);
    var secondarySeed = range(random, 1, 9999, 0);
    var filterNodes;
    var opacity;
    var contrast;
    var brightness;
    var blend;
    var textureExponent;

    if (type === "laid") {
      var fibreX = range(random, 0.008, 0.014, 3);
      var fibreY = range(random, 0.07, 0.12, 3);
      var pulpFrequency = range(random, 0.018, 0.035, 3);
      filterNodes = "<feTurbulence type='fractalNoise' baseFrequency='" + fibreX + " " + fibreY +
        "' numOctaves='3' seed='" + primarySeed + "' stitchTiles='stitch' result='primary'/>" +
        "<feTurbulence type='fractalNoise' baseFrequency='" + pulpFrequency + "' numOctaves='2' seed='" + secondarySeed +
        "' stitchTiles='stitch' result='secondary'/><feBlend in='primary' in2='secondary' mode='multiply' result='paper'/>";
      opacity = range(random, 0.1, 0.145, 3);
      contrast = range(random, 1.04, 1.14, 2);
      brightness = range(random, 0.98, 1.03, 2);
      blend = "multiply";
      textureExponent = range(random, 0.42, 0.48, 2);
    } else if (type === "vellum") {
      var vellumFrequency = range(random, 0.018, 0.035, 3);
      var vellumFleck = range(random, 0.08, 0.14, 3);
      filterNodes = "<feTurbulence type='fractalNoise' baseFrequency='" + vellumFrequency +
        "' numOctaves='3' seed='" + primarySeed + "' stitchTiles='stitch' result='primary'/>" +
        "<feTurbulence type='fractalNoise' baseFrequency='" + vellumFleck + "' numOctaves='1' seed='" + secondarySeed +
        "' stitchTiles='stitch' result='secondary'/><feBlend in='primary' in2='secondary' mode='soft-light' result='paper'/>";
      opacity = range(random, 0.16, 0.22, 3);
      contrast = range(random, 1.1, 1.2, 2);
      brightness = range(random, 0.99, 1.04, 2);
      blend = "multiply";
      textureExponent = range(random, 0.52, 0.6, 2);
    } else {
      var toothFrequency = range(random, 0.012, 0.026, 3);
      var fineFrequency = range(random, 0.06, 0.11, 3);
      var surfaceScale = range(random, 2, 3.6, 2);
      var azimuth = range(random, 25, 155, 0);
      var elevation = range(random, 48, 64, 0);
      filterNodes = "<feTurbulence type='fractalNoise' baseFrequency='" + toothFrequency +
        "' numOctaves='4' seed='" + primarySeed + "' stitchTiles='stitch' result='primary'/>" +
        "<feTurbulence type='fractalNoise' baseFrequency='" + fineFrequency + "' numOctaves='2' seed='" + secondarySeed +
        "' stitchTiles='stitch' result='secondary'/><feBlend in='primary' in2='secondary' mode='multiply' result='tooth'/>" +
        "<feDiffuseLighting in='tooth' surfaceScale='" + surfaceScale + "' diffuseConstant='0.86' lighting-color='white' result='paper'>" +
        "<feDistantLight azimuth='" + azimuth + "' elevation='" + elevation + "'/></feDiffuseLighting>";
      opacity = range(random, 0.16, 0.23, 3);
      contrast = range(random, 1.08, 1.18, 2);
      brightness = range(random, 0.99, 1.04, 2);
      blend = "multiply";
      textureExponent = range(random, 0.56, 0.64, 2);
    }

    var svg = "<svg xmlns='http://www.w3.org/2000/svg' width='" + rasterTile + "' height='" + rasterTile +
      "' viewBox='0 0 " + tile + " " + tile + "' preserveAspectRatio='none'>" +
      "<filter id='p' x='0' y='0' width='" + tile + "' height='" + tile +
      "' filterUnits='userSpaceOnUse' filterRes='" + rasterTile + " " + rasterTile +
      "' color-interpolation-filters='sRGB'>" + filterNodes +
      "<feColorMatrix in='paper' type='saturate' values='0' result='mono'/>" +
      "<feComponentTransfer in='mono'><feFuncR type='gamma' amplitude='0.92' exponent='" + textureExponent + "' offset='0.08'/>" +
      "<feFuncG type='gamma' amplitude='0.92' exponent='" + textureExponent + "' offset='0.08'/>" +
      "<feFuncB type='gamma' amplitude='0.92' exponent='" + textureExponent + "' offset='0.08'/></feComponentTransfer></filter>" +
      "<rect width='" + tile + "' height='" + tile + "' filter='url(#p)'/></svg>";
    return { type: type, vars: {
      "--paper-texture-url": 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")',
      "--paper-texture-size": tile + "px",
      "--paper-texture-opacity": opacity,
      "--paper-texture-contrast": contrast,
      "--paper-texture-brightness": brightness,
      "--paper-texture-blend": blend
    } };
  }

  function imageVars(random, bounds) {
    return {
      "--image-contrast": range(random, bounds.contrast[0], bounds.contrast[1], 2),
      "--image-brightness": range(random, bounds.brightness[0], bounds.brightness[1], 2),
      "--image-opacity": range(random, bounds.opacity[0], bounds.opacity[1], 2)
    };
  }

  function enoColor(random, hue, contrast) {
    var adjustedHue = Math.round((hue + range(random, -8, 8, 0) + 360) % 360);
    var saturation = range(random, contrast === "light" ? 64 : 56, 80, 0);
    var lightness = range(random, contrast === "light" ? 64 : 18, contrast === "light" ? 80 : 30, 0);
    return "hsl(" + adjustedHue + " " + saturation + "% " + lightness + "%)";
  }

  function enoColors(random, hues, contrast, phase) {
    return hues.map(function (hue) {
      return enoColor(random, hue + phase, contrast);
    });
  }

  function enoGradient(mode, colors, geometry, contrast) {
    if (mode === "vertical" || mode === "horizontal") {
      var angle = mode === "vertical" ? "90deg" : "180deg";
      return "linear-gradient(" + angle + ", " + colors[0] + " 0%, " + colors[0] + " " + geometry.s1 +
        "%, " + colors[1] + " " + geometry.s1 + "%, " + colors[1] + " " + geometry.s2 +
        "%, " + colors[2] + " " + geometry.s2 + "%, " + colors[2] + " " + geometry.s3 +
        "%, " + colors[3] + " " + geometry.s3 + "%, " + colors[3] + " 100%)";
    }
    if (mode === "quarters") {
      return "conic-gradient(from 90deg at " + geometry.x + "% " + geometry.y + "%, " + colors[0] +
        " 0deg 90deg, " + colors[1] + " 90deg 180deg, " + colors[2] +
        " 180deg 270deg, " + colors[3] + " 270deg 360deg)";
    }
    if (mode === "window") {
      return "radial-gradient(ellipse at " + geometry.x + "% " + geometry.y + "%, " + colors[0] +
        " 0%, " + colors[0] + " 14%, " + colors[1] + " 25%, transparent 48%), " +
        "linear-gradient(135deg, " + colors[2] + ", " + colors[3] + ")";
    }
    var enoCore = contrast === "light" ? "color-mix(in srgb, " + colors[0] + " 72%, black)" : colors[0];
    var enoRing = contrast === "light" ? "color-mix(in srgb, " + colors[1] + " 76%, white)" : colors[1];
    return "radial-gradient(circle at " + geometry.x + "% " + geometry.y + "%, " + enoCore +
      " 0%, " + enoCore + " 16%, " + enoRing + " 19%, " + enoRing + " 36%, " +
      colors[2] + " 46%, " + colors[3] + " 62%, " + colors[3] + " 100%)";
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
      Object.assign(edition.vars, grainVars(random, grainBounds({
        tile: [512, 576], frequency: [0.5, 0.62], opacity: [0.1, 0.17]
      })));
      var paperTexture = paperTextureVars(random);
      Object.assign(edition.vars, paperTexture.vars);
      edition.attrs["data-paper-texture"] = paperTexture.type;
      edition.attrs["data-paper-rule"] = pick(random, ["solid", "dotted"]);
      edition.attrs["data-paper-heading"] = pick(random, ["small-caps", "italic", "roman"]);
      Object.assign(edition.vars, imageVars(random, {
        contrast: [1.1, 1.28], brightness: [0.98, 1.08], opacity: [0.86, 0.95]
      }));
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
      edition.vars["--blob-link-bloom-near"] = range(random, 56, 78, 0) + "%";
      edition.vars["--blob-link-bloom-far"] = range(random, 24, 42, 0) + "%";
      edition.vars["--blob-link-bloom-radius"] = range(random, 7, 12, 0) + "px";
      var blobType = pick(random, [
        { body: fontSans, display: fontSans, annotation: fontMono, displayWeight: 700, headingWeight: 700, nameSpacing: "-0.045em", nameLine: 0.96, lineHeight: 1.55 },
        { body: fontSerif, display: fontSans, annotation: fontSerif, displayWeight: 700, headingWeight: 700, nameSpacing: "-0.04em", nameLine: 0.97, lineHeight: 1.62 },
        { body: fontSans, display: fontMono, annotation: fontMono, displayWeight: 600, headingWeight: 600, nameSpacing: "-0.025em", nameLine: 1, lineHeight: 1.58 },
        { body: fontSerif, display: fontMono, annotation: fontMono, displayWeight: 600, headingWeight: 600, nameSpacing: "-0.02em", nameLine: 1, lineHeight: 1.64 },
        { body: fontMono, display: fontSerif, annotation: fontMono, displayWeight: 600, headingWeight: 600, nameSpacing: "-0.025em", nameLine: 0.98, lineHeight: 1.68 }
      ]);
      edition.vars["--appearance-body-family"] = blobType.body;
      edition.vars["--appearance-display-family"] = blobType.display;
      edition.vars["--appearance-annotation-family"] = blobType.annotation;
      edition.vars["--appearance-display-weight"] = blobType.displayWeight;
      edition.vars["--blob-heading-weight"] = blobType.headingWeight;
      edition.vars["--blob-name-spacing"] = blobType.nameSpacing;
      edition.vars["--blob-name-line"] = blobType.nameLine;
      edition.vars["--appearance-line-height"] = blobType.lineHeight;
      for (var b = 0; b < 7; b++) {
        edition.vars["--blob-" + (b + 1) + "-color"] = blobColor(random, blob.blobHues[b % blob.blobHues.length]);
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
      edition.vars["--appearance-body-size"] = pick(random, blobType.body === fontMono ? ["16px", "16.5px"] : ["15.5px", "16px", "17px"]);
      edition.vars["--page-max"] = pick(random, ["1060px", "1120px", "1180px"]);
      edition.vars["--col-min"] = pick(random, ["360px", "390px"]);
      edition.vars["--gap-col"] = pick(random, ["48px", "56px"]);
      Object.assign(edition.vars, grainVars(random, grainBounds({
        frequency: [0.62, 0.74], opacity: [0.08, 0.14]
      })));
      edition.attrs["data-blob-layout"] = pick(random, ["diagonal", "orbit", "horizon", "scatter"]);
      edition.attrs["data-blob-count"] = pick(random, ["3", "4", "4", "5"]);
      edition.attrs["data-blob-mobile-extra"] = pick(random, ["1", "2"]);
      Object.assign(edition.vars, imageVars(random, {
        contrast: [0.96, 1.12], brightness: [0.94, 1.08], opacity: [0.88, 0.96]
      }));
    }

    if (look === "eno") {
      var enoFamilies = [
        [348, 337, 174, 184],
        [2, 27, 44, 52],
        [186, 72, 150, 160],
        [220, 270, 318, 48],
        [195, 222, 292, 330],
        [188, 238, 350, 165]
      ];
      var enoHues = pick(random, enoFamilies);
      var enoContrast = pick(random, ["light", "light", "light", "dark"]);
      var enoMode = pick(random, ["vertical", "horizontal", "quarters", "window", "halo"]);
      var enoGeometry = {
        s1: range(random, 20, 32, 0),
        s2: range(random, 44, 58, 0),
        s3: range(random, 70, 84, 0),
        x: range(random, 35, 65, 0),
        y: range(random, 32, 68, 0)
      };
      var enoPhaseB = range(random, -24, 24, 0);
      var enoPhaseC = range(random, -24, 24, 0);
      var enoA = enoColors(random, enoHues, enoContrast, 0);
      var enoB = enoColors(random, enoHues, enoContrast, enoPhaseB);
      var enoC = enoColors(random, enoHues, enoContrast, enoPhaseC);
      var enoPalette = enoContrast === "light"
        ? { bg: enoA[3], ink: "#191522", bright: "#09070d", muted: "#403748", faint: "#53475d", foot: "#53475d", accent: "hsl(" + enoHues[1] + " 55% 28%)", hair: "rgb(25 20 34 / 0.34)", rule: "rgb(25 20 34 / 0.28)", border: "rgb(25 20 34 / 0.38)", chip: "rgb(255 255 255 / 0.18)" }
        : { bg: enoA[3], ink: "#ece9f1", bright: "#ffffff", muted: "#d5cfdb", faint: "#bdb4c5", foot: "#bdb4c5", accent: "hsl(" + enoHues[1] + " 74% 80%)", hair: "rgb(255 255 255 / 0.30)", rule: "rgb(255 255 255 / 0.24)", border: "rgb(255 255 255 / 0.36)", chip: "rgb(0 0 0 / 0.16)" };
      edition.vars = paletteVars(enoPalette);
      edition.vars["--appearance-body-family"] = fontEno;
      edition.vars["--appearance-display-family"] = fontEno;
      edition.vars["--appearance-annotation-family"] = fontEno;
      edition.vars["--appearance-display-size"] = pick(random, ["42px", "46px", "50px"]);
      edition.vars["--appearance-display-weight"] = pick(random, [500, 600]);
      edition.vars["--appearance-body-size"] = pick(random, ["15.5px", "16px", "16.5px"]);
      edition.vars["--appearance-line-height"] = pick(random, [1.58, 1.64, 1.7]);
      edition.vars["--page-max"] = pick(random, ["1100px", "1160px", "1200px"]);
      edition.vars["--col-min"] = pick(random, ["360px", "380px"]);
      edition.vars["--gap-col"] = pick(random, ["48px", "56px", "64px"]);
      edition.vars["--eno-gradient-a"] = enoGradient(enoMode, enoA, enoGeometry, enoContrast);
      edition.vars["--eno-gradient-b"] = enoGradient(enoMode, enoB, enoGeometry, enoContrast);
      edition.vars["--eno-gradient-c"] = enoGradient(enoMode, enoC, enoGeometry, enoContrast);
      var enoCycle = range(random, 180, 480, 0);
      edition.vars["--eno-cycle"] = enoCycle + "s";
      edition.vars["--eno-phase"] = -range(random, 0, enoCycle, 0) + "s";
      edition.vars["--eno-softness"] = range(random, 14, 46, 0) + "px";
      edition.vars["--eno-saturation"] = range(random, 0.88, 1, 2);
      edition.vars["--eno-diffusion"] = range(random, 0.05, 0.12, 2);
      Object.assign(edition.vars, grainVars(random, grainBounds({
        frequency: [0.65, 0.76], opacity: [0.035, 0.06], rate: [780, 1080]
      })));
      edition.attrs["data-eno-composition"] = enoMode;
      edition.attrs["data-eno-contrast"] = enoContrast;
      Object.assign(edition.vars, imageVars(random, {
        contrast: [0.88, 1.06], brightness: [1.02, 1.16], opacity: [0.86, 0.95]
      }));
    }

    if (look === "70mm") {
      var filmPalettes = [
        { tone: "tungsten", bg: "#000000", base: "#100f12", ink: "#d8d2c6", bright: "#fff9ea", muted: "#aaa093", faint: "#81786e", foot: "#81786e", accent: "#ead6ac", hair: "#403a35", rule: "#292623", border: "#3b3530", chip: "#141210", halation: "#ff493d", edge: "#d8bd90", lights: ["#9f382e", "#365d72", "#bf7641"] },
        { tone: "warm", bg: "#000000", base: "#130d09", ink: "#ddd2bd", bright: "#fff4d9", muted: "#aa987f", faint: "#84725c", foot: "#84725c", accent: "#e0bd7a", hair: "#463827", rule: "#2f251a", border: "#413222", chip: "#17110b", halation: "#f43d32", edge: "#d7b57a", lights: ["#b9522d", "#d3944b", "#684260"] },
        { tone: "silver", bg: "#000000", base: "#101010", ink: "#d5d5d1", bright: "#fffefa", muted: "#a09e98", faint: "#797770", foot: "#797770", accent: "#d8d1c2", hair: "#3d3c39", rule: "#272624", border: "#373633", chip: "#131312", halation: "#ef4037", edge: "#d1cbc0", lights: ["#8a302b", "#66645e", "#876b4f"] }
      ];
      var film = pick(random, filmPalettes);
      var filmSerif = pick(random, filmSerifs);
      var filmMono = pick(random, filmMonos);
      var filmType = pick(random, [
        { body: filmSerif, display: filmMono, annotation: filmMono, displayWeight: 500, bodyWeight: 400, nameSpacing: "0.012em", lineHeight: 1.62 },
        { body: filmMono, display: filmSerif, annotation: filmMono, displayWeight: 600, bodyWeight: 400, nameSpacing: "-0.025em", lineHeight: 1.66 },
        { body: filmSerif, display: filmSerif, annotation: filmMono, displayWeight: 600, bodyWeight: 400, nameSpacing: "-0.03em", lineHeight: 1.64 }
      ]);
      edition.vars = paletteVars(film);
      edition.vars["--appearance-body-family"] = filmType.body;
      edition.vars["--appearance-display-family"] = filmType.display;
      edition.vars["--appearance-annotation-family"] = filmType.annotation;
      edition.vars["--appearance-display-weight"] = filmType.displayWeight;
      edition.vars["--appearance-body-weight"] = filmType.bodyWeight;
      edition.vars["--appearance-display-size"] = pick(random, ["46px", "50px", "54px"]);
      edition.vars["--appearance-body-size"] = pick(random, filmType.body === filmMono ? ["16px", "16.5px", "17px"] : ["16.5px", "17px", "17.5px"]);
      edition.vars["--appearance-line-height"] = filmType.lineHeight;
      edition.vars["--film-name-spacing"] = filmType.nameSpacing;
      edition.vars["--page-max"] = pick(random, ["1040px", "1120px", "1200px"]);
      edition.vars["--col-min"] = pick(random, ["370px", "390px"]);
      edition.vars["--gap-col"] = pick(random, ["48px", "56px", "64px"]);
      edition.vars["--gap-row"] = pick(random, ["42px", "46px", "50px"]);
      edition.vars["--film-halation"] = film.halation;
      edition.vars["--film-bloom-radius"] = range(random, 3, 7, 1) + "px";
      edition.vars["--film-halation-radius"] = range(random, 8, 15, 0) + "px";
      edition.vars["--film-halation-strength"] = range(random, 48, 72, 0) + "%";
      edition.vars["--film-vignette"] = range(random, 0.18, 0.34, 2);
      edition.vars["--film-base"] = film.base;
      edition.vars["--film-stock"] = "#000000";
      edition.vars["--film-perf-stock"] = "#000000";
      edition.vars["--film-perf-edge"] = film.edge;
      edition.vars["--film-gate-fall"] = range(random, 96, 160, 0) + "px";
      edition.vars["--film-gate-fall-x"] = range(random, 40, 88, 0) + "px";
      Object.assign(edition.vars, perfHoleVars(random, film.edge));
      edition.vars["--film-perf-halo-blur"] = range(random, 5, 9, 1) + "px";
      edition.vars["--film-perf-halo-opacity"] = range(random, 0.1, 0.24, 2);
      edition.vars["--film-perf-bleed-opacity"] = range(random, 0.05, 0.09, 3);
      edition.vars["--film-perf-bleed-blur"] = range(random, 10, 18, 0) + "px";
      var filmLightEdges = ["top", "bottom", pick(random, ["top", "bottom"])];
      for (var f = 0; f < 3; f++) {
        var filmLightOffset = range(random, -10, 22, 0) + "vh";
        edition.vars["--film-light-" + (f + 1) + "-color"] = film.lights[f];
        edition.vars["--film-light-" + (f + 1) + "-size"] = range(random, 34, 68, 0) + "vw";
        edition.vars["--film-light-" + (f + 1) + "-ratio"] = range(random, 1.6, 3.2, 2);
        edition.vars["--film-light-" + (f + 1) + "-x"] = range(random, 4, 88, 0) + "%";
        edition.vars["--film-light-" + (f + 1) + "-blur"] = range(random, 44, 92, 0) + "px";
        edition.vars["--film-light-" + (f + 1) + "-opacity"] = range(random, 0.12, 0.24, 2);
        edition.vars["--film-light-" + (f + 1) + "-top"] = filmLightEdges[f] === "top" ? filmLightOffset : "auto";
        edition.vars["--film-light-" + (f + 1) + "-bottom"] = filmLightEdges[f] === "bottom" ? filmLightOffset : "auto";
      }
      var filmEdgeStocks = ["kodak 5219", "kodak vision3", "kodak 2383", "fuji 8552"];
      var filmFrameNumber = String(range(random, 1, 96, 0)).padStart(2, "0");
      var filmExpNumber = String(range(random, 12, 47, 0)).padStart(2, "0");
      edition.vars["--film-edge-header"] = '"' + filmFrameNumber + pick(random, ["a", "b", "k"]) + '"';
      edition.vars["--film-edge-footer"] = '"' + pick(random, filmEdgeStocks) + " · 70mm · ex " + filmExpNumber + '"';
      edition.vars["--film-edge-print-opacity"] = range(random, 0.5, 0.75, 2);
      Object.assign(edition.vars, grainVars(random, grainBounds({
        tile: [520, 580], frequency: [0.54, 0.68], opacity: [0.1, 0.16], rate: [680, 940]
      })));
      edition.attrs["data-film-tone"] = film.tone;
      Object.assign(edition.vars, imageVars(random, {
        contrast: [1.08, 1.28], brightness: [0.94, 1.06], opacity: [0.9, 0.98]
      }));
    }

    if (look === "crt") {
      var crtFamily = pick(random, crtPhosphorFamilies);
      var crtPalette = crtPhosphorPalette(random, crtFamily);
      var crtConvergence = pick(random, [
        { redX: -1, redY: 0, blueX: 1, blueY: 0 },
        { redX: -1, redY: 0, blueX: 0, blueY: -1 },
        { redX: 0, redY: 1, blueX: 1, blueY: 0 },
        { redX: -1, redY: 1, blueX: 1, blueY: -1 },
        { redX: -2, redY: 0, blueX: 1, blueY: 0 },
        { redX: -1, redY: 0, blueX: 2, blueY: -1 },
        { redX: 1, redY: 0, blueX: -1, blueY: 0 },
        { redX: 0, redY: -1, blueX: 0, blueY: 1 },
        { redX: 1, redY: 1, blueX: -1, blueY: -1 },
        { redX: 2, redY: -1, blueX: -1, blueY: 0 }
      ]);
      edition.vars = paletteVars(crtPalette);
      edition.vars["--crt-selection"] = inverseHex(crtPalette.accent);
      edition.vars["--crt-fringe-red"] = hslToRgb(2 + range(random, -8, 12, 0), range(random, 88, 100, 0), range(random, 58, 70, 0)).join(" ");
      edition.vars["--crt-fringe-blue"] = hslToRgb(223 + range(random, -12, 12, 0), range(random, 88, 100, 0), range(random, 58, 70, 0)).join(" ");
      edition.vars["--crt-grille-red"] = hslToHex(0 + range(random, -8, 8, 0), range(random, 90, 100, 0), range(random, 60, 70, 0));
      edition.vars["--crt-grille-green"] = hslToHex(120 + range(random, -10, 10, 0), range(random, 90, 100, 0), range(random, 58, 70, 0));
      edition.vars["--crt-grille-blue"] = hslToHex(240 + range(random, -10, 10, 0), range(random, 90, 100, 0), range(random, 60, 72, 0));
      edition.vars["--crt-cursor-url"] = crtCursorUrl(crtPalette.bright);
      edition.vars["--crt-flecks"] = crtPhosphorFlecks(random, crtPalette.accent);
      /* The CRT is a physical-pixel treatment, so its source geometry stays on
         whole CSS pixels before the one-device-pixel grille is applied. */
      edition.vars["--appearance-display-size"] = "60px";
      edition.vars["--appearance-body-size"] = "22px";
      edition.vars["--appearance-line-height"] = 1.25;
      edition.vars["--page-max"] = pick(random, ["1000px", "1100px", "1180px"]);
      edition.vars["--col-min"] = pick(random, ["390px", "410px"]);
      edition.vars["--gap-col"] = pick(random, ["44px", "52px"]);
      /* One CSS pixel on a standard display (or one device pixel on a dense
         display) is the indivisible phosphor cell. A minority of editions
         double it for a cheaper, coarser low-res monitor, echoing how a
         minority of editions already extend convergence to two cells. */
      var crtCellScale = pick(random, [1, 1, 1, 1, 2]);
      edition.vars["--crt-cell"] = (crtCellScale / Math.min(Math.max(window.devicePixelRatio || 1, 1), 2)).toFixed(3) + "px";
      edition.vars["--crt-depth"] = range(random, 38, 54, 0);
      edition.vars["--crt-grille"] = range(random, 0.24, 0.34, 2);
      edition.vars["--crt-halo-red"] = range(random, 33, 43, 0) + "%";
      edition.vars["--crt-halo-blue"] = range(random, 29, 39, 0) + "%";
      edition.vars["--crt-halo-strength"] = range(random, 42, 56, 0) + "%";
      edition.vars["--crt-halo-radius"] = range(random, 1.8, 2.7, 1);
      edition.vars["--crt-image-halo"] = range(random, 26, 38, 0) + "%";
      edition.vars["--crt-red-x"] = crtConvergence.redX;
      edition.vars["--crt-red-y"] = crtConvergence.redY;
      edition.vars["--crt-blue-x"] = crtConvergence.blueX;
      edition.vars["--crt-blue-y"] = crtConvergence.blueY;
      edition.vars["--crt-triad-phase"] = pick(random, [0, 1, 2]);
      edition.vars["--crt-vignette"] = range(random, 0.38, 0.62, 2);
      edition.vars["--crt-roll-period"] = range(random, 6.5, 12.5, 1) + "s";
      edition.vars["--crt-roll-height"] = range(random, 20, 32, 0) + "vh";
      edition.vars["--crt-roll-dir"] = pick(random, [1, -1]);
      edition.vars["--crt-glare-angle"] = range(random, 95, 145, 0) + "deg";
      edition.vars["--crt-glare-center"] = range(random, 42, 58, 0) + "%";
      edition.vars["--crt-tube-x"] = range(random, 115, 135, 0) + "%";
      edition.vars["--crt-tube-y"] = range(random, 95, 115, 0) + "%";
      Object.assign(edition.vars, grainVars(random, grainBounds({
        frequency: [0.62, 0.76], opacity: [0.034, 0.052], rate: [620, 900]
      })));
      Object.assign(edition.vars, imageVars(random, {
        contrast: [1.1, 1.28], brightness: [0.98, 1.08], opacity: [0.98, 1]
      }));
    }

    if (look === "terminal") {
      var terminalPalettes = [
        { bg: "#0a0b0a", ink: "#d5d8d3", bright: "#f0f3ed", muted: "#92978f", faint: "#757b73", foot: "#757b73", accent: "#9fc59b", hair: "#343934", rule: "#252925", border: "#303530", chip: "#111411" },
        { bg: "#080c10", ink: "#d2d9df", bright: "#edf3f7", muted: "#8e9aa3", faint: "#707e89", foot: "#707e89", accent: "#8bb6d1", hair: "#303b43", rule: "#212a31", border: "#2c363e", chip: "#0e1418" },
        { bg: "#0b0a06", ink: "#ddd7c8", bright: "#f5efdf", muted: "#9e9581", faint: "#837860", foot: "#837860", accent: "#d0ae69", hair: "#403927", rule: "#2c281b", border: "#393321", chip: "#15130c" }
      ];
      edition.vars = paletteVars(pick(random, terminalPalettes));
      var terminalType = pick(random, [
        {
          family: '"VT323", "Roboto Mono", monospace',
          displaySize: ["54px", "58px", "62px"],
          bodySize: ["20px", "21px", "22px"],
          lineHeight: [1.4, 1.46, 1.52],
          displayWeight: 400,
          nameSpacing: "0.005em",
          headingSpacing: "0.055em"
        },
        {
          family: '"Fira Mono", "Roboto Mono", monospace',
          displaySize: ["44px", "46px", "48px"],
          bodySize: ["18px", "18.5px", "19px"],
          lineHeight: [1.54, 1.6, 1.66],
          displayWeight: pick(random, [400, 500]),
          nameSpacing: "-0.018em",
          headingSpacing: "0.035em"
        },
        {
          family: '"Roboto Mono", "Fira Mono", monospace',
          displaySize: ["44px", "46px", "48px"],
          bodySize: ["18px", "18.5px", "19px"],
          lineHeight: [1.58, 1.64, 1.7],
          displayWeight: pick(random, [400, 500]),
          nameSpacing: "-0.014em",
          headingSpacing: "0.045em"
        }
      ]);
      edition.vars["--terminal-font-family"] = terminalType.family;
      edition.vars["--appearance-display-size"] = pick(random, terminalType.displaySize);
      edition.vars["--appearance-body-size"] = pick(random, terminalType.bodySize);
      edition.vars["--appearance-line-height"] = pick(random, terminalType.lineHeight);
      edition.vars["--terminal-display-weight"] = terminalType.displayWeight;
      edition.vars["--terminal-name-spacing"] = terminalType.nameSpacing;
      edition.vars["--terminal-heading-spacing"] = terminalType.headingSpacing;
      edition.vars["--page-max"] = pick(random, ["900px", "1000px", "1100px"]);
      edition.vars["--col-min"] = pick(random, ["390px", "410px"]);
      edition.vars["--gap-col"] = pick(random, ["44px", "52px"]);
      Object.assign(edition.vars, grainVars(random, grainBounds({
        frequency: [0.58, 0.72], opacity: [0.03, 0.055]
      })));
      edition.attrs["data-terminal-prompt"] = pick(random, ["tilde", "dot", "chevron"]);
      Object.assign(edition.vars, imageVars(random, {
        contrast: [1.08, 1.24], brightness: [0.92, 1.04], opacity: [0.9, 0.97]
      }));
    }

    return edition;
  }

  function crtCursorUrl(fillHex) {
    var svg = "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' shape-rendering='crispEdges'>" +
      "<path fill='#000' d='M1 0h3v2h2v2h2v2h2v2H6v2H4v2H2V8H0V6h1z'/>" +
      "<path fill='" + fillHex + "' d='M2 1h1v2h2v2h2v2h2v1H5v2H3V7H1V6h1z'/></svg>";
    return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
  }

  /* A worn tube's phosphor coating always carries a handful of dead (unlit)
     or stuck (permanently lit) dots. These are fixed to the viewport, like
     the vignette and grille, rather than the scrolling document. */
  function crtPhosphorFlecks(random, accentHex) {
    var count = Math.round(range(random, 5, 9, 0));
    var layers = [];
    for (var i = 0; i < count; i++) {
      var x = range(random, 4, 96, 1);
      var y = range(random, 4, 96, 1);
      var size = range(random, 1, 2, 1);
      var isDead = random() < 0.7;
      var color = isDead
        ? "rgb(0 0 0 / " + range(random, 0.5, 0.8, 2) + ")"
        : "color-mix(in srgb, " + accentHex + " " + range(random, 35, 60, 0) + "%, transparent)";
      layers.push("radial-gradient(" + size + "px " + size + "px at " + x + "% " + y + "%, " + color + " 100%, transparent 100%)");
    }
    return layers.join(", ");
  }

  function crtPhosphorPalette(random, family) {
    var hue = Math.round((family.hue + range(random, -family.hueJitter, family.hueJitter, 0) + 360) % 360);
    var palette = {};
    Object.keys(crtRoleBands).forEach(function (role) {
      var band = crtRoleBands[role];
      var lightBand = family.coolBias ? band.coolLight : band.light;
      var sat = Math.min(100, Math.max(4, range(random, band.sat[0], band.sat[1], 0) * family.satMul));
      var light = range(random, lightBand[0], lightBand[1], 1);
      palette[role] = hslToHex(hue, sat, light);
    });
    return palette;
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
  var documentLayerFrame;
  var documentLayerObserver;

  function updateDocumentLayerSize() {
    if (documentLayerFrame) window.cancelAnimationFrame(documentLayerFrame);
    documentLayerFrame = window.requestAnimationFrame(function () {
      documentLayerFrame = null;
      if (!document.body) return;
      var page = document.querySelector(".page");
      var pageBottom = page ? page.offsetTop + page.offsetHeight : 0;
      var height = Math.max(
        window.innerHeight,
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        pageBottom
      );
      root.style.setProperty("--appearance-document-height", height + "px");
    });
  }

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
    updateDocumentLayerSize();
    window.addEventListener("scroll", updateParallax, { passive: true });
    window.addEventListener("resize", function () {
      updateParallax();
      updateDocumentLayerSize();
    });
    window.addEventListener("load", updateDocumentLayerSize);
    if (window.ResizeObserver) {
      documentLayerObserver = new ResizeObserver(updateDocumentLayerSize);
      documentLayerObserver.observe(document.body);
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(updateDocumentLayerSize);
    }
  });
})();

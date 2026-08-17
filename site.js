/* Shared behaviour for every page on alex-markin.com.
   Each block no-ops when its elements are absent, so the same file can be
   loaded by any page. See DESIGN-SYSTEM.md before editing. */
(function () {
  function ago(iso) {
    var s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
    var units = [
      [31536000, "year"], [2592000, "month"], [604800, "week"],
      [86400, "day"], [3600, "hour"], [60, "min"]
    ];
    for (var i = 0; i < units.length; i++) {
      var n = Math.floor(s / units[i][0]);
      if (n >= 1) {
        var plural = n > 1 && units[i][1] !== "min" ? "s" : "";
        return n + " " + units[i][1] + plural + " ago";
      }
    }
    return "just now";
  }

  function cacheKey(el) {
    if (el.dataset.repo) return "alex-markin:ago:repo:" + el.dataset.repo;
    if (el.dataset.user) return "alex-markin:ago:user:" + el.dataset.user;
    return "";
  }

  function readCachedTime(key) {
    if (!key) return null;
    try { return window.localStorage.getItem(key); }
    catch (error) { return null; }
  }

  function writeCachedTime(key, value) {
    if (!key || !value) return;
    try { window.localStorage.setItem(key, value); }
    catch (error) { /* storage may be disabled; the authored fallback remains */ }
  }

  function showTime(el, prefix, value) {
    if (value && !Number.isNaN(new Date(value).getTime())) {
      el.textContent = prefix + ago(value);
    }
  }

  function fill(el, url, prefix, pick) {
    var key = cacheKey(el);
    showTime(el, prefix, readCachedTime(key) || el.dataset.fallbackUpdated);
    fetch(url)
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (data) {
        var ts = pick(data);
        if (ts) {
          showTime(el, prefix, ts);
          writeCachedTime(key, ts);
        }
      })
      .catch(function () { /* keep the cached or authored fallback visible */ });
  }

  document.querySelectorAll(".ago").forEach(function (el) {
    if (el.dataset.repo) {
      fill(el, "https://api.github.com/repos/" + el.dataset.repo,
        "upd ", function (d) { return d.pushed_at; });
    } else if (el.dataset.user) {
      fill(el, "https://api.github.com/users/" + el.dataset.user + "/events/public?per_page=1",
        "upd ", function (d) { return d.length ? d[0].created_at : null; });
    }
  });

  // live local clock — copenhagen and berlin share one timezone
  var clock = document.querySelector(".clock");
  if (clock && window.Intl) {
    var fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "Europe/Copenhagen", hour: "numeric", minute: "2-digit", hour12: true
    });
    var tick = function () {
      clock.textContent = " · " + fmt.format(new Date()).toLowerCase().replace(" ", "");
    };
    tick();
    setInterval(tick, 30000);
  }

  // General Flickr photostream update time via JSONP. This deliberately
  // remains independent from the curated album used for the photo below.
  var flickrAgo = document.getElementById("flickr-ago");
  if (flickrAgo && flickrAgo.dataset.flickr) {
    window.jsonFlickrFeed = function (data) {
      var item = data && data.items && data.items[0];
      if (item && item.published) flickrAgo.textContent = "upd " + ago(item.published);
    };
    var streamFeed = document.createElement("script");
    streamFeed.src = "https://www.flickr.com/services/feeds/photos_public.gne?id=" +
      encodeURIComponent(flickrAgo.dataset.flickr) + "&format=json&lang=en-us";
    document.body.appendChild(streamFeed);
  }

  // Latest photo from the curated Flickr album via a separate JSONP callback.
  var flickrLatest = document.querySelector("[data-flickr-set]");
  if (flickrLatest) {
    window.jsonFlickrAlbumFeed = function (data) {
      var item = data && data.items && data.items[0];
      if (!item || !item.media || !item.media.m || !item.link) return;

      var title = item.title || "untitled";
      var photo = flickrLatest.querySelector("[data-flickr-photo]");
      var links = flickrLatest.querySelectorAll("[data-flickr-photo-link], [data-flickr-photo-title]");
      var photoTitle = flickrLatest.querySelector("[data-flickr-photo-title]");
      var largePhoto = item.media.m.replace(/_m(\.[a-z]+)$/i, "_z$1");

      photo.src = largePhoto;
      photo.alt = title;
      photoTitle.textContent = title;
      links.forEach(function (link) { link.href = item.link; });
      flickrLatest.hidden = false;
    };
    var albumFeed = document.createElement("script");
    albumFeed.src = "https://www.flickr.com/services/feeds/photoset.gne?set=" +
      encodeURIComponent(flickrLatest.dataset.flickrSet) + "&nsid=" +
      encodeURIComponent(flickrLatest.dataset.flickrNsid) +
      "&format=json&lang=en-us&jsoncallback=jsonFlickrAlbumFeed";
    document.body.appendChild(albumFeed);
  }

  // Selected internal routes carry the active generated edition with them.
  // Watching the root keeps their URLs current after the homepage control
  // composes a new look without reloading the document.
  function syncAppearanceLinks() {
    var root = document.documentElement;
    var look = root.getAttribute("data-look");
    var seed = root.getAttribute("data-edition-seed");
    if (!look || !seed) return;
    document.querySelectorAll("a[data-preserve-appearance]").forEach(function (link) {
      var url = new URL(link.getAttribute("href"), window.location.href);
      url.searchParams.set("look", look);
      url.searchParams.set("seed", seed);
      link.href = url.pathname + url.search + url.hash;
    });
  }

  syncAppearanceLinks();
  if (window.MutationObserver) {
    new MutationObserver(syncAppearanceLinks).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-look", "data-edition-seed"]
    });
  }

  // execCommand copies whatever is currently selected, so text the visitor has
  // highlighted on the page wins over the textarea unless we drop that selection
  // first and take focus. Without this a copy control can report success while
  // the clipboard still holds the visitor's own selection.
  function fallbackCopy(text) {
    var area = document.createElement("textarea");
    var previous = document.activeElement;
    area.value = text;
    area.setAttribute("readonly", "");
    area.className = "copy-source";
    document.body.appendChild(area);
    var selection = document.getSelection();
    if (selection) selection.removeAllRanges();
    // the textarea sits off-screen, so focus must not scroll to it
    area.focus({ preventScroll: true });
    area.select();
    // .select() alone is unreliable on ios safari
    area.setSelectionRange(0, area.value.length);
    var copied = false;
    try {
      copied = document.execCommand("copy");
    } finally {
      area.remove();
      if (previous && previous.focus) previous.focus({ preventScroll: true });
    }
    return copied ? Promise.resolve() : Promise.reject();
  }

  function writeClipboard(text) {
    if (!navigator.clipboard || !window.isSecureContext) return fallbackCopy(text);
    return navigator.clipboard.writeText(text).catch(function () {
      return fallbackCopy(text);
    });
  }

  // Build the Markdown from the page's semantic HTML at click time, so edits
  // to the page content are automatically reflected in the copied version.
  var copyButton = document.querySelector("[data-copy-markdown]");
  if (copyButton) {
    function inlineMarkdown(el) {
      return Array.from(el.childNodes).map(function (node) {
        if (node.nodeType === Node.TEXT_NODE) return node.textContent;
        if (node.nodeType !== Node.ELEMENT_NODE) return "";
        // timed steps and note labels stay in the sentence with a real gap
        if (node.matches(".recipe-time, .recipe-note-label")) {
          return node.textContent.trim() + " ";
        }
        // machine-voice annotations are re-attached by the caller, never inlined
        if (node.matches(".leader, .ago, .clock, .tag, .dates, .measure")) return "";
        if (node.tagName === "A") {
          var label = node.textContent.trim();
          // an anchor without href resolves to the current page, which would
          // silently link the row to itself
          return node.getAttribute("href") ? "[" + label + "](" + node.href + ")" : label;
        }
        if (node.tagName === "BR") return "  \n";
        return inlineMarkdown(node);
      }).join("").replace(/\s+/g, " ").trim();
    }

    // an element that renders as nothing (empty, or only machine-voice spans)
    // must not leave a bullet or an indented blank behind
    function push(lines, prefix, text) {
      if (text) lines.push(prefix + text);
    }

    function pageMarkdown() {
      var lines = [];
      var intro = document.querySelector(".intro, .catalogue-header");
      var title = intro ? intro.querySelector(".name") : document.querySelector(".columns h1");
      var tagline = intro && intro.querySelector(".tagline");
      var meta = intro && intro.querySelector(".meta");

      if (title) push(lines, "# ", title.textContent.trim());
      if (tagline) push(lines, "\n", tagline.textContent.trim());
      if (meta) {
        var metaCopy = meta.cloneNode(true);
        metaCopy.querySelectorAll(".clock").forEach(function (el) { el.remove(); });
        push(lines, "", metaCopy.textContent.trim());
      }

      document.querySelectorAll(".columns section:not([hidden]):not([data-copy-page-ignore])").forEach(function (section) {
        // Product landing sections may use the display-sized .name treatment
        // for their subject instead of the smaller machine-voice heading.
        var heading = section.querySelector(".heading, .name");
        if (!heading) return;
        if (heading !== title) lines.push("", "## " + heading.textContent.trim(), "");

        var flickrPhoto = section.querySelector("[data-flickr-photo]");
        var flickrPhotoLink = section.querySelector("[data-flickr-photo-link]");
        if (flickrPhoto && flickrPhoto.src && flickrPhotoLink && flickrPhotoLink.getAttribute("href")) {
          // the feed can hand us an untitled photo, so alt may still be empty
          lines.push("[![" + (flickrPhoto.alt || "photo") + "](" + flickrPhoto.src + ")]" +
            "(" + flickrPhotoLink.href + ")");
          return;
        }

        // standalone prose (e.g. the cv profile) has no list to walk
        section.querySelectorAll(":scope > .tagline, :scope > .meta, :scope > .desc").forEach(function (prose) {
          push(lines, "", inlineMarkdown(prose));
        });

        section.querySelectorAll(":scope > ul > li").forEach(function (item) {
          var row = item.matches(".row") ? item : item.querySelector(":scope > .row");
          if (!row) return;
          var link = row.querySelector("a");
          // rows may be annotated by a category, date range, or recipe measure
          var tag = row.querySelector(".tag") || row.querySelector(".dates") || row.querySelector(".measure");
          var desc = item.querySelector(":scope > .desc");
          var notes = item.querySelector(":scope > .notes");
          var text = link && link.getAttribute("href")
            ? "[" + link.textContent.trim() + "](" + link.href + ")"
            : inlineMarkdown(row);
          if (!text) return;
          if (tag && tag.textContent.trim()) text += " — " + tag.textContent.trim();
          lines.push("- " + text);
          if (desc) push(lines, "  ", inlineMarkdown(desc));
          if (notes) {
            notes.querySelectorAll("li").forEach(function (note) {
              push(lines, "  - ", inlineMarkdown(note));
            });
          }
        });

        var recipeMethod = section.querySelector(":scope > .recipe-method");
        if (recipeMethod) {
          lines.push("", "### method", "");
          recipeMethod.querySelectorAll(":scope > li").forEach(function (step, index) {
            push(lines, (index + 1) + ". ", inlineMarkdown(step));
          });
        }

        var recipeNote = section.querySelector(":scope > .recipe-note");
        if (recipeNote) push(lines, "", inlineMarkdown(recipeNote));
      });

      var updated = document.querySelector(".footer > .footer-date");
      lines.push("", "---", "", "source: " + location.href);
      if (updated) lines.push(updated.textContent.trim());
      return lines.join("\n").replace(/\n{3,}/g, "\n\n") + "\n";
    }

    // the label is the only confirmation, so each click owns the full 1800ms:
    // an earlier click's pending timer would otherwise clear a later click's
    // "copied" while the visitor is still reading it
    var defaultLabel = copyButton.getAttribute("aria-label") || copyButton.textContent.trim();
    var feedback = copyButton.querySelector(".copy-markdown-feedback");
    var resetTimer;

    function flash(label, spokenLabel) {
      if (feedback) {
        feedback.textContent = label;
        copyButton.classList.add("is-feedback");
      } else {
        copyButton.textContent = label;
      }
      copyButton.setAttribute("aria-label", spokenLabel || label);
      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(function () {
        if (feedback) {
          feedback.textContent = "";
          copyButton.classList.remove("is-feedback");
        } else {
          copyButton.textContent = defaultLabel;
        }
        copyButton.setAttribute("aria-label", defaultLabel);
      }, 1800);
    }

    copyButton.addEventListener("click", function () {
      var text = pageMarkdown();
      writeClipboard(text).then(function () {
        flash("copied", "copied as markdown");
      }).catch(function () {
        flash("failed", "copy failed");
      });
    });
  }

  // The coffee calculator reads its defaults and copy from the authored recipe
  // sections below it. Selecting a recipe therefore cannot drift away from the
  // visible source content.
  var calculator = document.querySelector("[data-recipe-calculator]");
  if (calculator) {
    var recipeSections = {};
    document.querySelectorAll("[data-recipe-key]").forEach(function (section) {
      recipeSections[section.dataset.recipeKey] = section;
    });

    var recipeSelect = calculator.querySelector("[data-calculator-recipe]");
    var coffeeInput = calculator.querySelector("[data-calculator-coffee]");
    var waterInput = calculator.querySelector("[data-calculator-water]");
    var iceInput = calculator.querySelector("[data-calculator-ice]");
    var waterRatioInput = calculator.querySelector("[data-calculator-water-ratio]");
    var iceRatioInput = calculator.querySelector("[data-calculator-ice-ratio]");
    var temperatureInput = calculator.querySelector("[data-calculator-temperature]");
    var iceRow = calculator.querySelector("[data-calculator-ice-row]");
    var iceRatioPart = calculator.querySelector("[data-calculator-ice-ratio-part]");
    var selectedNote = calculator.querySelector("[data-calculator-note]");
    var brewerOutput = calculator.querySelector("[data-calculator-brewer]");
    var grindOutput = calculator.querySelector("[data-calculator-grind]");
    var grindRow = calculator.querySelector("[data-calculator-grind-row]");
    var liveSummary = calculator.querySelector("[data-calculator-live]");
    var copyRecipeButton = calculator.querySelector("[data-copy-recipe]");
    var copyRecipeFeedback = copyRecipeButton.querySelector(".copy-recipe-feedback");
    var copyRecipeTimer;
    var calculatorState;

    function recipeValue(section, name) {
      var value = section.querySelector("[data-recipe-spec=\"" + name + "\"] [data-recipe-value]");
      return value ? value.dataset.recipeValue : "";
    }

    function amount(value) {
      var rounded = Math.round(value * 10) / 10;
      return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
    }

    function initialRatio(value) {
      return (Math.round(value * 10) / 10).toFixed(1);
    }

    function readPositive(input) {
      var value = Number(input.value);
      return Number.isFinite(value) && value > 0 ? value : null;
    }

    function setInput(input, value, skipped) {
      if (input !== skipped) input.value = value;
    }

    // Keep the native arrows moving by 0.5 from whatever value was typed.
    // Aligning the step base to that value preserves arbitrary direct entry
    // instead of forcing ratios onto a fixed half-number grid.
    function alignRatioStep(input, value) {
      var offset = ((value % 0.5) + 0.5) % 0.5;
      if (offset < 0.000001 || 0.5 - offset < 0.000001) offset = 0.5;
      input.min = String(Math.round(offset * 1000000) / 1000000);
    }

    function temperatureWithUnit(value) {
      var text = String(value).trim();
      return /(?:℃|°c)$/i.test(text) ? text : text + "℃";
    }

    function announceCalculator() {
      var text = amount(calculatorState.coffee) + " grams coffee, " +
        amount(calculatorState.water) + " grams water";
      if (calculatorState.ice !== null) {
        text += ", " + amount(calculatorState.ice) + " grams ice";
      }
      liveSummary.textContent = text + ".";
    }

    function renderCalculator(skipped) {
      setInput(coffeeInput, amount(calculatorState.coffee), skipped);
      setInput(waterInput, amount(calculatorState.water), skipped);
      setInput(waterRatioInput, calculatorState.waterRatioDisplay, skipped);
      setInput(temperatureInput, calculatorState.temperature, skipped);
      alignRatioStep(waterRatioInput, Number(calculatorState.waterRatioDisplay));

      var hasIce = calculatorState.ice !== null;
      iceRow.hidden = !hasIce;
      iceRatioPart.hidden = !hasIce;
      iceInput.disabled = !hasIce;
      iceRatioInput.disabled = !hasIce;
      if (hasIce) {
        setInput(iceInput, amount(calculatorState.ice), skipped);
        setInput(iceRatioInput, calculatorState.iceRatioDisplay, skipped);
        alignRatioStep(iceRatioInput, Number(calculatorState.iceRatioDisplay));
      }

      selectedNote.textContent = calculatorState.tagline;
      selectedNote.hidden = !calculatorState.tagline;
      brewerOutput.textContent = calculatorState.brewer;
      grindOutput.textContent = calculatorState.grind;
      grindRow.hidden = !calculatorState.grind;
      announceCalculator();
    }

    function selectRecipe(key) {
      var section = recipeSections[key];
      if (!section) return;

      var coffee = Number(recipeValue(section, "coffee"));
      var water = Number(recipeValue(section, "water"));
      var iceValue = recipeValue(section, "ice");
      var ice = iceValue ? Number(iceValue) : null;
      var tagline = section.querySelector(":scope > .tagline");

      calculatorState = {
        section: section,
        title: section.querySelector(":scope > .heading").textContent.trim(),
        tagline: tagline ? tagline.textContent.trim() : "",
        coffee: coffee,
        water: water,
        ice: ice,
        waterRatio: water / coffee,
        waterRatioDisplay: initialRatio(water / coffee),
        iceRatio: ice === null ? null : ice / coffee,
        iceRatioDisplay: ice === null ? "" : initialRatio(ice / coffee),
        temperature: recipeValue(section, "temperature"),
        brewer: recipeValue(section, "brewer"),
        grind: recipeValue(section, "grind"),
        original: {
          coffee: coffee,
          water: water,
          temperature: recipeValue(section, "temperature")
        }
      };
      renderCalculator(null);
    }

    function restoreInvalid(input) {
      input.addEventListener("blur", function () {
        if (input.type === "number" && readPositive(input) === null) {
          renderCalculator(null);
        }
      });
    }

    recipeSelect.addEventListener("change", function () {
      selectRecipe(recipeSelect.value);
    });

    coffeeInput.addEventListener("input", function () {
      var next = readPositive(coffeeInput);
      if (next === null) return;
      calculatorState.coffee = next;
      calculatorState.water = next * calculatorState.waterRatio;
      if (calculatorState.ice !== null) {
        calculatorState.ice = next * calculatorState.iceRatio;
      }
      renderCalculator(coffeeInput);
    });

    waterInput.addEventListener("input", function () {
      var next = readPositive(waterInput);
      if (next === null) return;
      var scale = next / calculatorState.water;
      calculatorState.water = next;
      calculatorState.coffee *= scale;
      if (calculatorState.ice !== null) calculatorState.ice *= scale;
      renderCalculator(waterInput);
    });

    iceInput.addEventListener("input", function () {
      var next = readPositive(iceInput);
      if (next === null || calculatorState.ice === null) return;
      var scale = next / calculatorState.ice;
      calculatorState.ice = next;
      calculatorState.coffee *= scale;
      calculatorState.water *= scale;
      renderCalculator(iceInput);
    });

    waterRatioInput.addEventListener("input", function () {
      var next = readPositive(waterRatioInput);
      if (next === null) return;
      calculatorState.waterRatio = next;
      calculatorState.waterRatioDisplay = waterRatioInput.value;
      calculatorState.water = calculatorState.coffee * next;
      renderCalculator(waterRatioInput);
    });

    iceRatioInput.addEventListener("input", function () {
      var next = readPositive(iceRatioInput);
      if (next === null || calculatorState.ice === null) return;
      calculatorState.iceRatio = next;
      calculatorState.iceRatioDisplay = iceRatioInput.value;
      calculatorState.ice = calculatorState.coffee * next;
      renderCalculator(iceRatioInput);
    });

    temperatureInput.addEventListener("input", function () {
      calculatorState.temperature = temperatureInput.value;
    });

    [coffeeInput, waterInput, iceInput, waterRatioInput, iceRatioInput].forEach(restoreInvalid);

    function replaceLiteral(text, search, replacement) {
      return search ? text.split(search).join(replacement) : text;
    }

    function adjustedMethodStep(step) {
      var text = step.textContent.trim();
      var time = step.querySelector(".recipe-time");
      if (time) {
        var timeText = time.textContent.trim();
        text = timeText + " " + text.slice(timeText.length).trim();
      }
      text = replaceLiteral(text,
        amount(calculatorState.original.coffee) + "g",
        amount(calculatorState.coffee) + "g");
      text = replaceLiteral(text,
        amount(calculatorState.original.water) + "g",
        amount(calculatorState.water) + "g");
      text = replaceLiteral(text,
        temperatureWithUnit(calculatorState.original.temperature),
        temperatureWithUnit(calculatorState.temperature));
      return text;
    }

    function recipeText() {
      var lines = [calculatorState.title];
      if (calculatorState.tagline) lines.push(calculatorState.tagline);
      lines.push("", "brewer: " + calculatorState.brewer);
      lines.push("coffee: " + amount(calculatorState.coffee) + "g");
      lines.push("water: " + amount(calculatorState.water) + "g");
      if (calculatorState.ice !== null) {
        lines.push("ice: " + amount(calculatorState.ice) + "g");
      }
      var ratioText = "ratio: 1:" + calculatorState.waterRatioDisplay;
      if (calculatorState.ice !== null) ratioText += ":" + calculatorState.iceRatioDisplay;
      lines.push(ratioText);
      lines.push("water temperature: " + temperatureWithUnit(calculatorState.temperature));
      if (calculatorState.grind) lines.push("grind: " + calculatorState.grind);

      var method = calculatorState.section.querySelector(":scope > .recipe-method");
      if (method) {
        lines.push("", "method");
        method.querySelectorAll(":scope > li").forEach(function (step, index) {
          lines.push((index + 1) + ". " + adjustedMethodStep(step));
        });
      }

      var note = calculatorState.section.querySelector(":scope > .recipe-note");
      if (note) {
        var noteCopy = note.cloneNode(true);
        noteCopy.querySelectorAll(".recipe-note-label").forEach(function (label) { label.remove(); });
        lines.push("", "note: " + noteCopy.textContent.trim());
      }

      lines.push("", "from: alex-markin.com/coffee");
      return lines.join("\n") + "\n";
    }

    function flashRecipeCopy(label, spokenLabel) {
      copyRecipeFeedback.textContent = label;
      copyRecipeButton.classList.add("is-feedback");
      copyRecipeButton.setAttribute("aria-label", spokenLabel || label);
      window.clearTimeout(copyRecipeTimer);
      copyRecipeTimer = window.setTimeout(function () {
        copyRecipeFeedback.textContent = "";
        copyRecipeButton.classList.remove("is-feedback");
        copyRecipeButton.setAttribute("aria-label", "copy recipe");
      }, 1800);
    }

    copyRecipeButton.addEventListener("click", function () {
      writeClipboard(recipeText()).then(function () {
        flashRecipeCopy("copied", "recipe copied");
      }).catch(function () {
        flashRecipeCopy("failed", "copy failed");
      });
    });

    selectRecipe(recipeSelect.value);
  }
})();

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

  function fill(el, url, prefix, pick) {
    fetch(url)
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (data) {
        var ts = pick(data);
        if (ts) el.textContent = prefix + ago(ts);
      })
      .catch(function () { /* leave empty → hidden */ });
  }

  document.querySelectorAll(".ago").forEach(function (el) {
    if (el.dataset.repo) {
      fill(el, "https://api.github.com/repos/" + el.dataset.repo,
        "upd ", function (d) { return d.pushed_at; });
    } else if (el.dataset.user) {
      fill(el, "https://api.github.com/users/" + el.dataset.user + "/events/public?per_page=1",
        "active ", function (d) { return d.length ? d[0].created_at : null; });
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

  // Build the Markdown from the page's semantic HTML at click time, so edits
  // to the page content are automatically reflected in the copied version.
  var copyButton = document.querySelector("[data-copy-markdown]");
  if (copyButton) {
    function inlineMarkdown(el) {
      return Array.from(el.childNodes).map(function (node) {
        if (node.nodeType === Node.TEXT_NODE) return node.textContent;
        if (node.nodeType !== Node.ELEMENT_NODE) return "";
        // machine-voice annotations are re-attached by the caller, never inlined
        if (node.matches(".leader, .ago, .clock, .tag, .dates")) return "";
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
      var intro = document.querySelector(".intro");
      var title = intro && intro.querySelector(".name");
      var tagline = intro && intro.querySelector(".tagline");
      var meta = intro && intro.querySelector(".meta");

      if (title) push(lines, "# ", title.textContent.trim());
      if (tagline) push(lines, "\n", tagline.textContent.trim());
      if (meta) {
        var metaCopy = meta.cloneNode(true);
        metaCopy.querySelectorAll(".clock").forEach(function (el) { el.remove(); });
        push(lines, "", metaCopy.textContent.trim());
      }

      document.querySelectorAll(".columns section:not([hidden])").forEach(function (section) {
        var heading = section.querySelector(".heading");
        if (!heading) return;
        lines.push("", "## " + heading.textContent.trim(), "");

        var flickrPhoto = section.querySelector("[data-flickr-photo]");
        var flickrPhotoLink = section.querySelector("[data-flickr-photo-link]");
        if (flickrPhoto && flickrPhoto.src && flickrPhotoLink && flickrPhotoLink.getAttribute("href")) {
          // the feed can hand us an untitled photo, so alt may still be empty
          lines.push("[![" + (flickrPhoto.alt || "photo") + "](" + flickrPhoto.src + ")]" +
            "(" + flickrPhotoLink.href + ")");
          return;
        }

        // standalone prose (e.g. the cv profile) has no list to walk
        section.querySelectorAll(":scope > .desc").forEach(function (prose) {
          push(lines, "", inlineMarkdown(prose));
        });

        section.querySelectorAll(":scope > ul > li").forEach(function (item) {
          var row = item.matches(".row") ? item : item.querySelector(":scope > .row");
          if (!row) return;
          var link = row.querySelector("a");
          // a row is annotated on the right by either a tag or a date range
          var tag = row.querySelector(".tag") || row.querySelector(".dates");
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
      });

      var updated = document.querySelector(".footer > span:first-child");
      lines.push("", "---", "", "source: " + location.href);
      if (updated) lines.push(updated.textContent.trim());
      return lines.join("\n").replace(/\n{3,}/g, "\n\n") + "\n";
    }

    // execCommand copies whatever is currently selected, so text the visitor has
    // highlighted on the page wins over the textarea unless we drop that selection
    // first and take focus. Without this the button reports success while the
    // clipboard holds the visitor's own selection.
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

    // the label is the only confirmation, so each click owns the full 1800ms:
    // an earlier click's pending timer would otherwise clear a later click's
    // "copied" while the visitor is still reading it
    var defaultLabel = copyButton.textContent;
    var resetTimer;

    function flash(label) {
      copyButton.textContent = label;
      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(function () {
        copyButton.textContent = defaultLabel;
      }, 1800);
    }

    copyButton.addEventListener("click", function () {
      var text = pageMarkdown();
      writeClipboard(text).then(function () {
        flash("copied as markdown");
      }).catch(function () {
        flash("copy failed");
      });
    });
  }
})();

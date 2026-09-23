(function () {
  var key = "alex-markin:analytics-consent";
  var maxAge = 180 * 24 * 60 * 60 * 1000;
  var measurementId = "G-6JZ3GQEVFL";
  var choice = null;
  try {
    choice = JSON.parse(localStorage.getItem(key));
    if (!choice || choice.version !== 1 || typeof choice.at !== "number" ||
        choice.at > Date.now() || Date.now() - choice.at > maxAge) choice = null;
  } catch (error) { choice = null; }

  function loadAnalytics() {
    if (document.querySelector("script[data-analytics]")) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "default", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      cookie_expires: 15552000,
      cookie_update: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    var script = document.createElement("script");
    script.async = true;
    script.dataset.analytics = "";
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + measurementId;
    document.head.appendChild(script);
  }

  function clearAnalyticsCookies() {
    document.cookie.split(";").forEach(function (part) {
      var name = part.trim().split("=")[0];
      if (!/^_ga(?:_|$)/.test(name)) return;
      var host = location.hostname;
      ["", "; domain=" + host, "; domain=." + host].forEach(function (domain) {
        document.cookie = name + "=; Max-Age=0; path=/" + domain + "; SameSite=Lax";
      });
    });
  }

  if (!choice || !choice.allowed) clearAnalyticsCookies();

  function save(allowed) {
    var wasAllowed = !!(choice && choice.allowed);
    choice = { version: 1, allowed: allowed, at: Date.now() };
    try { localStorage.setItem(key, JSON.stringify(choice)); }
    catch (error) { /* no durable choice; ask again on a later visit */ }
    panel.hidden = true;
    control.setAttribute("aria-expanded", "false");
    if (allowed) {
      off.hidden = false;
      loadAnalytics();
    } else {
      clearAnalyticsCookies();
      off.hidden = true;
      if (wasAllowed) location.reload();
    }
  }

  var showPanel = !choice || new URLSearchParams(location.search).has("privacy");
  var control = document.createElement("button");
  control.type = "button";
  control.className = "privacy-control copy-markdown";
  control.setAttribute("aria-controls", "analytics-choice");
  control.setAttribute("aria-expanded", String(showPanel));
  control.textContent = "privacy";

  var off = document.createElement("button");
  off.type = "button";
  off.className = "privacy-off copy-markdown";
  off.textContent = "analytics off";
  off.setAttribute("aria-label", "turn off analytics");
  off.hidden = !(choice && choice.allowed);

  var copy = document.querySelector(".footer [data-copy-markdown]");
  if (copy) {
    var utilities = document.createElement("div");
    utilities.className = "footer-utilities";
    copy.parentNode.insertBefore(utilities, copy);
    utilities.appendChild(copy);
    utilities.appendChild(control);
    utilities.appendChild(off);
    document.body.classList.add("privacy-has-footer");
  } else {
    var tools = document.createElement("div");
    tools.className = "privacy-tools";
    tools.appendChild(control);
    tools.appendChild(off);
    document.body.appendChild(tools);
  }

  var panel = document.createElement("section");
  panel.id = "analytics-choice";
  panel.className = "privacy-panel";
  panel.setAttribute("aria-label", "privacy and analytics");
  panel.innerHTML = '<p>may google analytics count visits? if yes, google gets the page, ip and device details and sets <code>_ga</code> and <code>_ga_*</code> cookies for visits and sessions (six months).</p>' +
    '<details class="privacy-more"><summary>details</summary><p>alex markin · <a href="mailto:a@alex-markin.com">a@alex-markin.com</a> is responsible. github pages logs ip addresses for security (legitimate interest; <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">policy</a>). your browser keeps this choice for 180 days and the site look for this session.</p><p>analytics uses your consent; no ads. raw data may be held up to 14 months. google may process it outside the eea (<a href="https://policies.google.com/privacy/frameworks">safeguards</a>). turn it off anytime. email for access, correction, deletion, restriction, objection or portability; you can complain to <a href="https://www.datatilsynet.dk/borger/klage">datatilsynet</a>.</p></details>' +
    '<div class="privacy-actions"><button type="button" data-choice="no">no thanks</button><button type="button" data-choice="yes">allow analytics</button></div>';
  panel.hidden = !showPanel;
  document.body.appendChild(panel);

  control.addEventListener("click", function () {
    panel.hidden = !panel.hidden;
    control.setAttribute("aria-expanded", String(!panel.hidden));
  });
  off.addEventListener("click", function () { save(false); });
  panel.querySelector('[data-choice="no"]').addEventListener("click", function () { save(false); });
  panel.querySelector('[data-choice="yes"]').addEventListener("click", function () { save(true); });

  if (choice && choice.allowed) loadAnalytics();
})();

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
      control.textContent = "turn off analytics";
      loadAnalytics();
    } else {
      clearAnalyticsCookies();
      control.textContent = "privacy choices";
      if (wasAllowed) location.reload();
    }
  }

  var tools = document.createElement("div");
  tools.className = "privacy-tools";
  var control = document.createElement("button");
  control.type = "button";
  control.className = "privacy-control";
  control.setAttribute("aria-controls", "analytics-choice");
  control.setAttribute("aria-expanded", String(!choice));
  control.textContent = choice && choice.allowed ? "turn off analytics" : "privacy choices";
  tools.appendChild(control);
  if (!location.pathname.endsWith("/privacy.html")) {
    var details = document.createElement("a");
    details.href = "/privacy.html";
    details.textContent = "privacy details";
    tools.appendChild(details);
  }
  document.body.appendChild(tools);

  var panel = document.createElement("section");
  panel.id = "analytics-choice";
  panel.className = "privacy-panel";
  panel.setAttribute("aria-label", "analytics choice");
  panel.innerHTML = '<p>may i use google analytics to count visits? if you agree, google gets your page, device and ip address and sets cookies for up to six months. <a href="/privacy.html">privacy details</a></p><div class="privacy-actions"><button type="button" data-choice="no">no thanks</button><button type="button" data-choice="yes">allow analytics</button></div>';
  panel.hidden = !!choice;
  document.body.appendChild(panel);

  control.addEventListener("click", function () {
    if (choice && choice.allowed) save(false);
    else {
      panel.hidden = !panel.hidden;
      control.setAttribute("aria-expanded", String(!panel.hidden));
    }
  });
  panel.querySelector('[data-choice="no"]').addEventListener("click", function () { save(false); });
  panel.querySelector('[data-choice="yes"]').addEventListener("click", function () { save(true); });

  if (choice && choice.allowed) loadAnalytics();
})();

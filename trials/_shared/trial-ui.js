(() => {
  "use strict";

  function formatValue(param, value) {
    const formatted = param.step < 1
      ? Number(value).toFixed(2).replace(/\.?0+$/, "")
      : String(value);
    return formatted + (param.u || "");
  }

  function addGroup(container, label, className = "group") {
    const heading = document.createElement("h2");
    heading.className = className;
    heading.textContent = label;
    container.appendChild(heading);
    return heading;
  }

  function addRange(container, param, onInput, ariaPrefix = "") {
    const wrap = document.createElement("div");
    wrap.className = "ctrl";

    const row = document.createElement("div");
    row.className = "row";

    const label = document.createElement("label");
    label.htmlFor = "c_" + param.k;
    label.textContent = param.l;

    const output = document.createElement("output");
    output.setAttribute("for", label.htmlFor);

    const input = document.createElement("input");
    input.id = label.htmlFor;
    input.type = "range";
    input.autocomplete = "off";
    input.min = param.min;
    input.max = param.max;
    input.step = param.step;
    input.value = param.def;
    if (ariaPrefix) input.setAttribute("aria-label", ariaPrefix + " " + param.l);

    row.append(label, output);
    wrap.append(row, input);
    container.appendChild(wrap);

    const control = { input, out: output, param, wrap };
    setRange(control, param.def);
    input.addEventListener("input", () => {
      const value = Number(input.value);
      setRange(control, value);
      onInput(value, control);
    });
    return control;
  }

  function setRange(control, value) {
    control.input.value = value;
    control.out.value = formatValue(control.param, value);
  }

  function addColor(container, config, onInput, ariaPrefix = "") {
    const wrap = document.createElement("div");
    wrap.className = "ctrl";

    const row = document.createElement("div");
    row.className = "row";

    const label = document.createElement("label");
    label.htmlFor = "c_" + config.k;
    label.textContent = config.l;

    const input = document.createElement("input");
    input.id = label.htmlFor;
    input.type = "color";
    input.autocomplete = "off";
    input.value = config.def;
    if (ariaPrefix) input.setAttribute("aria-label", ariaPrefix + " " + config.l);

    row.appendChild(label);
    wrap.append(row, input);
    container.appendChild(wrap);

    const control = { input, config, wrap };
    input.addEventListener("input", () => onInput(input.value, control));
    return control;
  }

  function setColor(control, value) {
    control.input.value = value;
  }

  function addToggle(container, config, onInput, ariaPrefix = "") {
    const wrap = document.createElement("div");
    wrap.className = "ctrl";

    const row = document.createElement("div");
    row.className = "row";

    const label = document.createElement("label");
    label.htmlFor = "c_" + config.k;
    label.textContent = config.l;

    const input = document.createElement("input");
    input.id = label.htmlFor;
    input.type = "checkbox";
    input.autocomplete = "off";
    input.checked = config.def;
    if (ariaPrefix) input.setAttribute("aria-label", ariaPrefix + " " + config.l);

    row.append(label, input);
    wrap.appendChild(row);
    container.appendChild(wrap);

    const control = { input, config, wrap };
    input.addEventListener("input", () => onInput(input.checked, control));
    return control;
  }

  function setToggle(control, value) {
    control.input.checked = value;
  }

  function addText(container, config, onInput, ariaPrefix = "") {
    const wrap = document.createElement("div");
    wrap.className = "ctrl";

    const row = document.createElement("div");
    row.className = "row";

    const label = document.createElement("label");
    label.htmlFor = "c_" + config.k;
    label.textContent = config.l;

    const input = document.createElement("input");
    input.id = label.htmlFor;
    input.type = "text";
    input.autocomplete = "off";
    input.maxLength = config.maxLength || 2;
    input.value = config.def;
    if (ariaPrefix) input.setAttribute("aria-label", ariaPrefix + " " + config.l);

    row.append(label, input);
    wrap.appendChild(row);
    container.appendChild(wrap);

    const control = { input, config, wrap };
    input.addEventListener("input", () => onInput(input.value, control));
    return control;
  }

  function setText(control, value) {
    control.input.value = value;
  }

  function bindPanelFold(panel, button) {
    button.addEventListener("click", () => {
      const folded = panel.toggleAttribute("data-folded");
      button.textContent = folded ? "show" : "hide";
      button.setAttribute("aria-expanded", String(!folded));
    });
  }

  window.TrialUI = Object.freeze({
    addColor,
    addGroup,
    addRange,
    addText,
    addToggle,
    bindPanelFold,
    formatValue,
    setColor,
    setRange,
    setText,
    setToggle
  });
})();

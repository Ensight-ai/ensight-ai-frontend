(function () {
  "use strict";

  // If the host application itself is EnsightLabs, its root layout may also
  // contain the embed script. Never inject a widget inside the public widget
  // route, or the iframe will recursively contain another iframe.
  if (window.location.pathname.indexOf("/w/") === 0) return;

  var script = document.currentScript || document.querySelector(
    'script[src*="/widget.js"][data-agent-key]:not([data-ensight-loaded])'
  );
  if (!script || script.getAttribute("data-ensight-loaded") === "true") return;
  script.setAttribute("data-ensight-loaded", "true");

  var key = script.getAttribute("data-agent-key");
  if (!key) {
    console.error("EnsightLabs widget: data-agent-key is missing.");
    return;
  }

  var host = new URL(script.src).origin;
  var params = new URLSearchParams();
  ["color", "name", "position", "capability", "greeting"].forEach(function (name) {
    var value = script.getAttribute("data-" + name);
    if (value) params.set(name, value);
  });

  function mount() {
    if (document.querySelector('iframe[data-ensight-widget="true"]')) return;

    var iframe = document.createElement("iframe");
    var closedSize = "96px";
    var openWidth = "min(420px,100vw)";
    var openHeight = "min(600px,100vh)";
    iframe.title = "EnsightLabs chat widget";
    iframe.setAttribute("data-ensight-widget", "true");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("scrolling", "no");
    iframe.src = host + "/w/" + encodeURIComponent(key) + "?" + params.toString();
    iframe.style.cssText =
      "position:fixed;bottom:0;" +
      (params.get("position") === "bottom-left" ? "left:0;" : "right:0;") +
      "width:" + closedSize + ";height:" + closedSize + ";border:0;" +
      "background:transparent;z-index:2147483647;display:block;" +
      "pointer-events:auto";
    iframe.allow = params.get("capability") === "chat"
      ? "clipboard-write"
      : "microphone; clipboard-write";
    iframe.loading = "eager";

    // Keep the iframe's clickable area no larger than the launcher while the
    // chat is closed. The widget page tells us when its panel opens/closes.
    window.addEventListener("message", function (event) {
      if (
        event.origin !== host ||
        event.source !== iframe.contentWindow ||
        !event.data ||
        event.data.type !== "ensight:widget-resize"
      ) {
        return;
      }

      var open = event.data.open === true;
      iframe.style.width = open ? openWidth : closedSize;
      iframe.style.height = open ? openHeight : closedSize;
    });

    document.body.appendChild(iframe);
  }

  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount, { once: true });
})();

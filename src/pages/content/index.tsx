import { createRoot } from "react-dom/client";
import App from "./App";

function init() {
  if (document.getElementById("browser-find-top-layer")) return;

  const topLayerContainer = document.createElement("div");
  topLayerContainer.id = "browser-find-top-layer";
  topLayerContainer.popover = "manual";
  document.body.appendChild(topLayerContainer);

  const root = createRoot(topLayerContainer);
  root.render(<App />);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}

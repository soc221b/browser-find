import { createRoot } from "react-dom/client";
import App from "./App";

function init() {
  console.log("Initializing browser find UI...");
  if (document.getElementById("browser-find-top-layer")) {
    return;
  }
  console.log("Creating browser find UI container...");
  const topLayerContainer = document.createElement("div");
  topLayerContainer.id = "browser-find-top-layer";
  topLayerContainer.popover = "manual";
  console.log("Appending browser find UI container to body...");
  document.body.appendChild(topLayerContainer);

  console.log("Rendering browser find UI...");
  const root = createRoot(topLayerContainer);
  root.render(<App />);
}

if (document.readyState === "loading") {
  console.log('loading state, waiting for DOMContentLoaded...');
  document.addEventListener("DOMContentLoaded", init);
} else {
  console.log('document already loaded, initializing immediately...');
  init();
}

import { createRoot } from "react-dom/client";
import App from "./App";
import useStore from "./store";

async function init() {
  if (document.getElementById("browser-find-top-layer")) return;

  const { defaultUseRegularExpression } = await chrome.storage.sync.get({
    defaultUseRegularExpression: false,
  });

  if (defaultUseRegularExpression) {
    useStore.getState().dispatch({
      type: "ToggleShouldUseRegularExpression",
      value: true,
    });
  }

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

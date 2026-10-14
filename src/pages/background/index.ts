const states = new Map<number, unknown>();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const tabId = sender.tab?.id;
  if (tabId === undefined) return;

  if (message.type === "Load") {
    sendResponse(states.get(tabId));
  }

  if (message.type === "Save") {
    states.set(tabId, message.value);
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  states.delete(tabId);
});

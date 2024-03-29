toggleIcon(window.matchMedia(`(prefers-color-scheme: dark)`).matches)

window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', (e) => {
    toggleIcon(e.matches)
  })

function toggleIcon(matches: boolean) {
  if (matches) {
    chrome.runtime.sendMessage({ action: 'toggle-icon', scheme: 'dark' })
  } else {
    chrome.runtime.sendMessage({ action: 'toggle-icon', scheme: 'default' })
  }
}

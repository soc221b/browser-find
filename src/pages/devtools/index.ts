try {
  chrome.devtools.panels.create(
    'Dev Tools',
    'logo-32.png',
    'src/pages/panel/index.html',
  )
} catch (e) {
  console.error(e)
}

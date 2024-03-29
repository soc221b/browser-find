chrome.runtime.onMessage.addListener((req) => {
  if (req.action === 'toggle-icon') {
    if (req.scheme === 'dark') {
      chrome.action.setIcon({
        path: {
          '16': '../public/logo-dark-16.png',
          '32': '../public/logo-dark-32.png',
          '48': '../public/logo-dark-48.png',
          '128': '../public/logo-dark-128.png',
        },
      })
    } else {
      chrome.action.setIcon({
        path: {
          '16': '../public/logo-16.png',
          '32': '../public/logo-32.png',
          '48': '../public/logo-48.png',
          '128': '../public/logo-128.png',
        },
      })
    }
  }
})

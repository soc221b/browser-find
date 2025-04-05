import { createRoot } from 'react-dom/client'
import App from './App'

function init() {
  const topLayerContainer = document.createElement('div')
  topLayerContainer.id = 'browser-find-top-layer'
  topLayerContainer.popover = 'manual'
  document.body.appendChild(topLayerContainer)

  const root = createRoot(topLayerContainer)
  root.render(<App />)
}

document.addEventListener('DOMContentLoaded', init)

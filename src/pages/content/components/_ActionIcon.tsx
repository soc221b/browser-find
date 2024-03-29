import usePrefersColorScheme from '../hooks/use-prefers-color-scheme'

export default function _ActionIcon(): JSX.Element {
  const prefersColorScheme = usePrefersColorScheme()

  if (prefersColorScheme === 'dark') {
    chrome.runtime.sendMessage({ action: 'toggle-icon', scheme: 'dark' })
  } else {
    chrome.runtime.sendMessage({ action: 'toggle-icon', scheme: 'default' })
  }

  return <></>
}

import usePrefersColorScheme from '../hooks/use-prefers-color-scheme'

export default function _ActionIcon(): JSX.Element {
  const prefersColorScheme = usePrefersColorScheme()

  chrome.runtime.sendMessage({ action: 'toggle-icon', scheme: prefersColorScheme })

  return <></>
}

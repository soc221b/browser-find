import { useEffect, useState } from 'react'

const query = '(prefers-color-scheme: dark)'

export default function usePrefersColorScheme() {
  const [prefersColorScheme, setPrefersColorScheme] = useState<'dark' | 'light'>(
    convertMatchesToColorScheme(window.matchMedia(query).matches),
  )
  useEffect(() => {
    const mediaQueryList = window.matchMedia(query)
    mediaQueryList.addEventListener('change', handleChange)
    return () => {
      mediaQueryList.removeEventListener('change', handleChange)
    }

    function handleChange(event: MediaQueryListEvent) {
      setPrefersColorScheme(convertMatchesToColorScheme(event.matches))
    }
  }, [])

  return prefersColorScheme
}

function convertMatchesToColorScheme(matches: boolean) {
  return matches ? 'dark' : 'light'
}

import { useEffect, useState } from 'react'

const query = '(prefers-color-scheme: dark)'

type PrefersColorScheme = 'dark' | 'light'

export default function usePrefersColorScheme() {
  const [prefersColorScheme, setPrefersColorScheme] = useState<PrefersColorScheme>(
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

function convertMatchesToColorScheme(matches: boolean): PrefersColorScheme {
  return matches ? 'dark' : 'light'
}

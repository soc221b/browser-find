import { useEffect, useState } from 'react'

export default function usePrefersColorScheme() {
  const [prefersColorScheme, setPrefersColorScheme] = useState<
    'dark' | 'light'
  >(
    convertMatchesToColorScheme(
      window.matchMedia('(prefers-color-scheme: dark)').matches,
    ),
  )
  useEffect(() => {
    const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')
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

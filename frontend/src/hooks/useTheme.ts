import { useState, useCallback, useEffect } from 'react'

export type Theme = 'dark' | 'light'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('oc_theme') as Theme | null
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('oc_theme', theme)
  }, [theme])

  const toggle = useCallback(() => setTheme(t => t === 'dark' ? 'light' : 'dark'), [])

  return { theme, toggle }
}

'use client'

import { useSyncExternalStore, useCallback } from 'react'

type Theme = 'light' | 'dark'

function getSnapshot(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

function getServerSnapshot(): Theme {
  return 'light'
}

function subscribe(callback: () => void): () => void {
  const observer = new MutationObserver(callback)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })

  window.addEventListener('storage', callback)

  return () => {
    observer.disconnect()
    window.removeEventListener('storage', callback)
  }
}

export function useTheme(): {
  theme: Theme
  toggle: () => void
  setTheme: (t: Theme) => void
} {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const setTheme = useCallback((t: Theme) => {
    if (t === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('tema', t)
  }, [])

  const toggle = useCallback(() => {
    const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    setTheme(current === 'dark' ? 'light' : 'dark')
  }, [setTheme])

  return { theme, toggle, setTheme }
}

'use client'

import { useSyncExternalStore, useCallback } from 'react'

const STORAGE_KEY = 'sidebar-colapsado'
const EVENT_NAME = 'sidebar-colapsado-change'

function readStorage(): boolean {
  return localStorage.getItem(STORAGE_KEY) === '1'
}

function writeStorage(value: boolean): void {
  localStorage.setItem(STORAGE_KEY, value ? '1' : '0')
  window.dispatchEvent(new CustomEvent(EVENT_NAME))
}

function subscribe(callback: () => void): () => void {
  window.addEventListener('storage', callback)
  window.addEventListener(EVENT_NAME, callback)
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener(EVENT_NAME, callback)
  }
}

function getSnapshot(): boolean {
  return readStorage()
}

function getServerSnapshot(): boolean {
  return false
}

export function useSidebarColapsado(): {
  colapsado: boolean
  toggle: () => void
  setColapsado: (v: boolean) => void
} {
  const colapsado = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const setColapsado = useCallback((v: boolean) => {
    writeStorage(v)
  }, [])

  const toggle = useCallback(() => {
    writeStorage(!readStorage())
  }, [])

  return { colapsado, toggle, setColapsado }
}

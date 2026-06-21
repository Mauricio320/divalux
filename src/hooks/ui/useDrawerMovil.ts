import { useCallback, useSyncExternalStore } from 'react'

let abierto = false
const listeners = new Set<() => void>()

function emitir() {
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot() {
  return abierto
}

function getServerSnapshot() {
  return false
}

export function useDrawerMovil() {
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const abrir = useCallback(() => {
    if (!abierto) {
      abierto = true
      emitir()
    }
  }, [])

  const cerrar = useCallback(() => {
    if (abierto) {
      abierto = false
      emitir()
    }
  }, [])

  const toggle = useCallback(() => {
    abierto = !abierto
    emitir()
  }, [])

  return { abierto: value, abrir, cerrar, toggle }
}

'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import { cn } from '@/lib/cn'
import { ACCEPT_IMAGEN, validarArchivoImagen } from '@/lib/validations/upload'

type Props = {
  value: string | null
  onChange: (img: { url: string; publicId: string } | null) => void
  subir: (file: File) => Promise<{ url: string; publicId: string }>
  onUploadingChange?: (subiendo: boolean) => void
  disabled?: boolean
}

function IconoImagen() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  )
}

export default function ImageUploader({ value, onChange, subir, onUploadingChange, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [subiendo, setSubiendo] = useState(false)
  const [arrastrando, setArrastrando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const interactivo = !disabled && !subiendo

  async function procesar(file: File) {
    const err = validarArchivoImagen(file)
    if (err) {
      setError(err)
      return
    }
    setError(null)
    setSubiendo(true)
    onUploadingChange?.(true)
    try {
      const img = await subir(file)
      onChange(img)
    } catch {
      setError('No se pudo subir la imagen. Inténtalo de nuevo.')
    } finally {
      setSubiendo(false)
      onUploadingChange?.(false)
    }
  }

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (file) await procesar(file)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setArrastrando(false)
    if (!interactivo) return
    const file = e.dataTransfer.files?.[0]
    if (file) void procesar(file)
  }

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => {
          e.preventDefault()
          if (interactivo) setArrastrando(true)
        }}
        onDragLeave={() => setArrastrando(false)}
        onDrop={onDrop}
        className={cn(
          'flex items-center gap-4 rounded-xl border border-dashed p-4 transition-colors duration-150',
          arrastrando ? 'border-primary bg-primary/5' : 'border-border bg-surface-2/40',
        )}
      >
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-border bg-surface">
          {value ? (
            <Image src={value} alt="Imagen del producto" fill sizes="96px" className="object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-fg-subtle">
              <IconoImagen />
            </span>
          )}
          {subiendo && (
            <div className="absolute inset-0 flex items-center justify-center bg-surface/70" aria-busy="true">
              <Spinner size="md" />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-sm font-medium text-fg">
            {value ? 'Imagen cargada' : 'Arrastra una imagen o súbela'}
          </p>
          <p className="text-xs text-fg-subtle">JPG, PNG o WEBP · máx 5 MB</p>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={!interactivo}
              onClick={() => inputRef.current?.click()}
            >
              {value ? 'Reemplazar' : 'Subir imagen'}
            </Button>
            {value && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={!interactivo}
                onClick={() => {
                  setError(null)
                  onChange(null)
                }}
              >
                Quitar
              </Button>
            )}
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_IMAGEN}
          aria-label="Subir imagen del producto"
          tabIndex={-1}
          className="sr-only"
          onChange={onPick}
          disabled={!interactivo}
        />
      </div>
      {error && <p role="alert" className="text-sm text-danger">{error}</p>}
    </div>
  )
}

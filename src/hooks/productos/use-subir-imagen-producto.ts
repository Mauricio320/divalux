'use client'

import { useMutation } from '@tanstack/react-query'
import { unwrap } from '@/lib/unwrapResult'
import { firmarSubidaImagenProducto } from '@/actions/productos'
import { respuestaCloudinarySchema } from '@/lib/validations/upload'

export type ImagenSubida = { url: string; publicId: string }

export function useSubirImagenProducto() {
  return useMutation({
    mutationFn: async (file: File): Promise<ImagenSubida> => {
      const firma = await unwrap(firmarSubidaImagenProducto())

      const form = new FormData()
      form.append('file', file)
      form.append('api_key', firma.apiKey)
      form.append('timestamp', String(firma.timestamp))
      form.append('signature', firma.signature)
      form.append('folder', firma.folder)

      const res = await fetch(`https://api.cloudinary.com/v1_1/${firma.cloudName}/image/upload`, {
        method: 'POST',
        body: form,
      })
      if (!res.ok) throw new Error('No se pudo subir la imagen')

      const parsed = respuestaCloudinarySchema.parse(await res.json())
      return { url: parsed.secure_url, publicId: parsed.public_id }
    },
  })
}

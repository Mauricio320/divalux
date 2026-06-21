import { z } from 'zod'

export const MAX_IMAGEN_BYTES = 5 * 1024 * 1024
export const FORMATOS_IMAGEN = ['image/jpeg', 'image/png', 'image/webp'] as const
export const ACCEPT_IMAGEN = 'image/jpeg,image/png,image/webp'

export function validarArchivoImagen(file: File): string | null {
  const formatos: readonly string[] = FORMATOS_IMAGEN
  if (!formatos.includes(file.type)) {
    return 'Formato no permitido. Usa JPG, PNG o WEBP.'
  }
  if (file.size > MAX_IMAGEN_BYTES) {
    return 'La imagen no puede superar 5 MB.'
  }
  return null
}

export const respuestaCloudinarySchema = z.object({
  secure_url: z.string().url(),
  public_id: z.string().min(1),
})

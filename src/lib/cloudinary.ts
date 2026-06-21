import 'server-only'
import { v2 as cloudinary } from 'cloudinary'

export type FirmaSubida = {
  signature: string
  timestamp: number
  folder: string
  apiKey: string
  cloudName: string
}

function getConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Configuración de Cloudinary incompleta')
  }
  return { cloudName, apiKey, apiSecret }
}

export function firmarSubidaImagen(folder: string): FirmaSubida {
  const { cloudName, apiKey, apiSecret } = getConfig()
  const timestamp = Math.floor(Date.now() / 1000)
  const signature = cloudinary.utils.api_sign_request({ folder, timestamp }, apiSecret)
  return { signature, timestamp, folder, apiKey, cloudName }
}

export async function eliminarImagen(publicId: string): Promise<void> {
  const { cloudName, apiKey, apiSecret } = getConfig()
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true })
  await cloudinary.uploader.destroy(publicId, { resource_type: 'image', invalidate: true })
}

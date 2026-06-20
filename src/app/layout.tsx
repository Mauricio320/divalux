import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Fraunces, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Providers from '@/components/providers'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans-src',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif-src',
  display: 'swap',
  weight: 'variable',
  axes: ['opsz'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono-src',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Divailux',
  description: 'Divailux - Poder Natural. Facturación electrónica e inventario multi-empresa.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.webmanifest',
}

const antiFlashScript = `(function(){try{var t=localStorage.getItem('tema');if(t==='dark'){document.documentElement.classList.add('dark')}else if(t==='light'){document.documentElement.classList.remove('dark')}else if(window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.classList.add('dark')}}catch(e){}})();`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${fraunces.variable} ${jetbrainsMono.variable} h-full`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: antiFlashScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-fg antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

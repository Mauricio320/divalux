'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import Fireflies from './Fireflies'

export default function LoginBrandPanel() {
  const reduced = useReducedMotion()

  return (
    <div className="relative flex h-[38vh] items-end justify-center overflow-hidden lg:h-auto">
      <div
        aria-hidden
        className="absolute left-1/2 top-[40%] h-[42vw] max-h-[560px] w-[42vw] max-w-[560px] -translate-x-1/2 -translate-y-1/2 blur-[6px]"
        style={{ background: 'var(--login-halo)' }}
      />

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24 }}
        animate={reduced ? false : { opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative -mb-[1%] w-[82%] max-w-[600px]"
      >
        <Image
          src="/images/romero.webp"
          alt="Línea Romero"
          width={1024}
          height={1024}
          priority
          className="h-auto w-full object-contain drop-shadow-[0_26px_36px_rgba(0,0,0,0.55)]"
        />
      </motion.div>

      <Fireflies reduced={!!reduced} />

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={reduced ? false : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-8 left-10 z-[2] max-w-[300px] text-neutro-50 [text-shadow:0_2px_16px_rgba(0,0,0,0.7)]"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-login-gold/60 bg-login-badge-bg px-3.5 py-1.5 font-sans text-[11px] tracking-[0.2em] text-login-gold">
          LÍNEA ROMERO · SIN PARABENOS
        </span>
        <p className="mt-3.5 text-balance font-serif text-3xl italic leading-tight">
          Su ritual favorito, con romero.
        </p>
      </motion.div>
    </div>
  )
}

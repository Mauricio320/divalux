'use client'

import { motion, useReducedMotion } from 'framer-motion'
import BrandPanel from './BrandPanel'
import LoginForm from './LoginForm'

export default function LoginScreen() {
  const reduced = useReducedMotion()

  return (
    <div className="min-h-svh w-full lg:grid lg:grid-cols-2">
      <motion.aside
        initial={reduced ? false : { x: -48, opacity: 0 }}
        animate={reduced ? false : { x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:block"
      >
        <BrandPanel />
      </motion.aside>

      <motion.div
        initial={reduced ? false : { x: 48, opacity: 0 }}
        animate={reduced ? false : { x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex min-h-svh flex-col bg-bg"
      >
        <div className="lg:hidden">
          <BrandPanel compact />
        </div>

        <main className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <LoginForm />
        </main>
      </motion.div>
    </div>
  )
}

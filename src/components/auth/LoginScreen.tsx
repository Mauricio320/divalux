'use client'

import { motion, useReducedMotion } from 'framer-motion'
import LoginBrandPanel from './LoginBrandPanel'
import FallingLeaves from './FallingLeaves'
import LoginForm from './LoginForm'

export default function LoginScreen() {
  const reduced = useReducedMotion()

  return (
    <div
      className="relative flex min-h-svh w-full flex-col overflow-hidden lg:grid lg:grid-cols-[55fr_45fr]"
      style={{ background: 'var(--login-bg)' }}
    >
      <LoginBrandPanel />

      <section
        className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-12 lg:px-[5%]"
        style={{ background: 'var(--login-panel)' }}
      >
        <FallingLeaves reduced={!!reduced} />

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={reduced ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-sm rounded-3xl border border-login-card-border bg-login-card-bg p-10 shadow-2xl backdrop-blur-xl"
        >
          <LoginForm />
        </motion.div>
      </section>
    </div>
  )
}

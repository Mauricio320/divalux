'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, useAnimationControls, useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'
import { loginSchema, type LoginInput } from '@/lib/validations/login'
import { shake, staggerContainer, staggerItem } from '@/lib/motion'
import Input from '@/components/ui/Input'
import PasswordInput from '@/components/ui/PasswordInput'
import Button from '@/components/ui/Button'
import Logo from '@/components/ui/Logo'
import { useToast } from '@/components/ui/ToastProvider'

const inputClass =
  'rounded-xl border-login-input-border bg-login-input-bg px-4 py-3 text-neutro-50 placeholder:text-login-fg-subtle focus-visible:border-login-gold focus-visible:ring-2 focus-visible:ring-login-gold/25 focus-visible:ring-offset-0'
const labelClass = 'font-sans text-[11px] uppercase tracking-[0.14em] text-login-fg-muted'

export default function LoginForm() {
  const router = useRouter()
  const reduced = useReducedMotion()
  const controls = useAnimationControls()
  const { toast } = useToast()
  const [success, setSuccess] = useState(false)
  const { register, handleSubmit, formState } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', recordarme: false },
  })

  function fallar(message: string) {
    if (!reduced) controls.start('shake')
    toast({ type: 'error', message })
  }

  async function onSubmit(data: LoginInput) {
    try {
      const res = await signIn('credentials', {
        email: data.email,
        password: data.password,
        recordarme: 'false',
        redirect: false,
      })
      if (res?.error) {
        fallar('Correo o contraseña inválidos')
        return
      }
      setSuccess(true)
      const irAlInicio = () => {
        router.push('/')
        router.refresh()
      }
      if (reduced) irAlInicio()
      else setTimeout(irAlInicio, 220)
    } catch {
      fallar('No se pudo iniciar sesión. Intenta de nuevo.')
    }
  }

  return (
    <motion.div variants={shake} initial="idle" animate={controls}>
      <motion.div
        variants={staggerContainer}
        initial={reduced ? false : 'hidden'}
        animate={reduced ? false : 'visible'}
      >
        <motion.div variants={staggerItem} className="mb-6 flex items-center gap-3">
          <Logo variant="full-white" height={34} priority />
          <span className="font-sans text-[8px] uppercase tracking-[0.4em] text-login-gold">
            Poder Natural
          </span>
        </motion.div>

        <motion.h1 variants={staggerItem} className="font-serif text-3xl font-medium text-neutro-50">
          Bienvenida de nuevo
        </motion.h1>
        <motion.p variants={staggerItem} className="mt-1 font-sans text-sm text-login-fg-muted">
          Ingresa y consiente tu cabello con romero
        </motion.p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 flex flex-col gap-4">
          <motion.label variants={staggerItem} className="flex flex-col gap-2">
            <span className={labelClass}>Correo electrónico</span>
            <Input
              type="email"
              autoComplete="email"
              placeholder="tucorreo@email.com"
              error={!!formState.errors.email}
              className={inputClass}
              {...register('email')}
            />
            {formState.errors.email && (
              <span className="font-sans text-xs text-login-error">
                {formState.errors.email.message}
              </span>
            )}
          </motion.label>

          <motion.label variants={staggerItem} className="flex flex-col gap-2">
            <span className={labelClass}>Contraseña</span>
            <PasswordInput
              autoComplete="current-password"
              placeholder="••••••••"
              error={!!formState.errors.password}
              className={inputClass}
              toggleClassName="text-login-gold hover:text-login-firefly"
              {...register('password')}
            />
            {formState.errors.password && (
              <span className="font-sans text-xs text-login-error">
                {formState.errors.password.message}
              </span>
            )}
          </motion.label>

          <motion.div variants={staggerItem} className="-mt-1 text-right">
            <button
              type="button"
              disabled
              title="Próximamente"
              className="cursor-not-allowed font-sans text-[12.5px] text-login-gold disabled:opacity-100"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Button
              type="submit"
              variant="cta"
              size="lg"
              fullWidth
              isLoading={formState.isSubmitting && !success}
              disabled={success || formState.isSubmitting}
              leftIcon={success ? <Check size={18} aria-hidden /> : undefined}
              style={{ backgroundImage: 'var(--login-cta)' }}
              className="mt-1 shadow-(--login-cta-shadow) transition-[transform,box-shadow,filter] hover:-translate-y-0.5 hover:shadow-(--login-cta-glow) hover:brightness-110"
            >
              {success ? 'Sesión iniciada' : 'Iniciar sesión'}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  )
}

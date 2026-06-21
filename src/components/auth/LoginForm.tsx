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
import Field from '@/components/ui/Field'
import Input from '@/components/ui/Input'
import PasswordInput from '@/components/ui/PasswordInput'
import Button from '@/components/ui/Button'
import Logo from '@/components/ui/Logo'
import { useToast } from '@/components/ui/ToastProvider'

const focusInput =
  'transition-colors duration-200 focus-visible:border-primary motion-reduce:transition-none'

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
        recordarme: data.recordarme ? 'true' : 'false',
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
    <motion.div variants={shake} initial="idle" animate={controls} className="w-full max-w-sm">
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        variants={staggerContainer}
        initial={reduced ? false : 'hidden'}
        animate={reduced ? false : 'visible'}
        noValidate
        className="flex flex-col gap-5"
      >
        <motion.div variants={staggerItem} className="mb-2 flex flex-col items-center gap-2 lg:items-start">
          <span className="dark:hidden">
            <Logo variant="full" height={48} priority />
          </span>
          <span className="hidden dark:block">
            <Logo variant="full-white" height={48} priority />
          </span>
        </motion.div>

        <motion.div variants={staggerItem} className="text-center lg:text-left">
          <h1 className="font-serif text-3xl font-semibold text-fg">Iniciar sesión</h1>
          <p className="mt-1 text-sm text-fg-muted">Bienvenido de nuevo a Divailux</p>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Field label="Correo" htmlFor="email" error={formState.errors.email?.message}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="tucorreo@empresa.com"
              error={!!formState.errors.email}
              className={focusInput}
              {...register('email')}
            />
          </Field>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Field label="Contraseña" htmlFor="password" error={formState.errors.password?.message}>
            <PasswordInput
              id="password"
              autoComplete="current-password"
              placeholder="••••••••"
              error={!!formState.errors.password}
              className={focusInput}
              {...register('password')}
            />
          </Field>
        </motion.div>

        <motion.div variants={staggerItem} className="flex items-center justify-between gap-3">
          <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-fg-muted">
            <input
              type="checkbox"
              {...register('recordarme')}
              className="h-4 w-4 rounded border-border-strong accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            />
            Recordarme
          </label>
          <span
            role="link"
            aria-disabled="true"
            title="Próximamente"
            className="cursor-not-allowed text-sm text-fg-subtle"
          >
            ¿Olvidaste tu contraseña?
          </span>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={formState.isSubmitting && !success}
            disabled={success}
            leftIcon={success ? <Check size={18} aria-hidden /> : undefined}
          >
            {success ? 'Sesión iniciada' : 'Iniciar sesión'}
          </Button>
        </motion.div>
      </motion.form>
    </motion.div>
  )
}

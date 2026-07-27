import {
  Activity,
  ArrowLeft,
  Loader2,
  Mail,
} from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { authService } from '../../../services/auth.service'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] =
    useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setError('')
    setSuccessMessage('')

    const normalizedEmail = email.trim()

    if (!normalizedEmail) {
      setError('Informe seu endereço de e-mail.')
      return
    }

    setLoading(true)

    try {
      const result =
        await authService.forgotPassword({
          email: normalizedEmail,
        })

      setSuccessMessage(
        result?.message ??
          'Se o e-mail estiver cadastrado, enviaremos as instruções para redefinição da senha.',
      )
    } catch (error) {
      console.error(
        'Erro ao solicitar redefinição da senha:',
        error,
      )

      setError(
        'Não foi possível solicitar a redefinição da senha. Tente novamente.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white">
            <Activity />
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Redefinir senha
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Informe o e-mail utilizado no Cuidar+ para
            receber as instruções de recuperação.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800">
            {successMessage}
          </div>
        )}

        {!successMessage && (
          <form onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">
                E-mail
              </span>

              <div className="relative">
                <Mail
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  required
                  autoFocus
                  autoComplete="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="nome@exemplo.com"
                  className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading && (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              )}

              {loading
                ? 'Enviando...'
                : 'Enviar instruções'}
            </button>
          </form>
        )}

        <Link
          to="/login"
          className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-700"
        >
          <ArrowLeft size={16} />
          Voltar para o login
        </Link>
      </section>
    </main>
  )
}
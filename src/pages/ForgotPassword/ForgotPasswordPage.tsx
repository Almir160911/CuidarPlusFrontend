import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  HeartPulse,
  LoaderCircle,
  Mail,
} from 'lucide-react'

import authService from '../../services/auth.service'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    const normalizedEmail = email.trim()

    if (!normalizedEmail) {
      setError('Informe o e-mail.')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setMessage(null)

      const result = await authService.forgotPassword({
        email: normalizedEmail,
      })

      setMessage(result)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível solicitar a recuperação da senha.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/60">
        <header className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
            <HeartPulse
              className="text-emerald-700"
              size={34}
            />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Recuperar senha
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Informe seu e-mail para receber as instruções.
          </p>
        </header>

        <form
          className="space-y-5"
          onSubmit={handleSubmit}
        >
          <div>
            <label
              className="mb-2 block text-sm font-semibold text-slate-700"
              htmlFor="email"
            >
              E-mail
            </label>

            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={19}
              />

              <input
                autoComplete="email"
                className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                disabled={loading}
                id="email"
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="seu@email.com"
                type="email"
                value={email}
              />
            </div>
          </div>

          {error && (
            <div
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              {error}
            </div>
          )}

          {message && (
            <div
              className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
              role="status"
            >
              {message}
            </div>
          )}

          <button
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading && (
              <LoaderCircle
                className="animate-spin"
                size={19}
              />
            )}

            {loading
              ? 'Enviando...'
              : 'Enviar instruções'}
          </button>

          <Link
            className="flex items-center justify-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-800"
            to="/login"
          >
            <ArrowLeft size={16} />
            Voltar para o login
          </Link>
        </form>
      </section>
    </main>
  )
}

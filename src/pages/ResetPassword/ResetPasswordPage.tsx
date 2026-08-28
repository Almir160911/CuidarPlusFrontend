import { type FormEvent, useState } from 'react'
import {
  Link,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import {
  ArrowLeft,
  HeartPulse,
  LoaderCircle,
  LockKeyhole,
} from 'lucide-react'

import authService from '../../services/auth.service'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [email, setEmail] = useState(
    searchParams.get('email') ?? '',
  )
  const [token, setToken] = useState(
    searchParams.get('token') ?? '',
  )
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] =
    useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (!email.trim() || !token.trim()) {
      setError(
        'O link de recuperação é inválido ou está incompleto.',
      )
      return
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não conferem.')
      return
    }

    try {
      setLoading(true)
      setError(null)

      await authService.resetPassword({
        email: email.trim(),
        token: token.trim(),
        newPassword,
        confirmPassword,
      })

      navigate('/login', {
        replace: true,
        state: {
          message:
            'Senha redefinida com sucesso. Faça login com a nova senha.',
        },
      })
    } catch (resetError) {
      setError(
        resetError instanceof Error
          ? resetError.message
          : 'Não foi possível redefinir a senha.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/60">
        <header className="mb-7 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
            <HeartPulse
              className="text-emerald-700"
              size={34}
            />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Definir nova senha
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Escolha uma nova senha para sua conta.
          </p>
        </header>

        <form
          className="space-y-4"
          onSubmit={handleSubmit}
        >
          <input
            onChange={(event) =>
              setEmail(event.target.value)
            }
            type="hidden"
            value={email}
          />

          <input
            onChange={(event) =>
              setToken(event.target.value)
            }
            type="hidden"
            value={token}
          />

          <div>
            <label
              className="mb-2 block text-sm font-semibold text-slate-700"
              htmlFor="newPassword"
            >
              Nova senha
            </label>

            <div className="relative">
              <LockKeyhole
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={19}
              />

              <input
                autoComplete="new-password"
                className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                id="newPassword"
                onChange={(event) =>
                  setNewPassword(event.target.value)
                }
                required
                type="password"
                value={newPassword}
              />
            </div>
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-semibold text-slate-700"
              htmlFor="confirmPassword"
            >
              Confirmar nova senha
            </label>

            <input
              autoComplete="new-password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              id="confirmPassword"
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              required
              type="password"
              value={confirmPassword}
            />
          </div>

          <p className="text-xs leading-5 text-slate-500">
            Use pelo menos 8 caracteres, incluindo
            maiúscula, minúscula, número e caractere especial.
          </p>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading && (
              <LoaderCircle
                className="animate-spin"
                size={19}
              />
            )}
            {loading ? 'Salvando...' : 'Redefinir senha'}
          </button>

          <Link
            className="flex items-center justify-center gap-2 text-sm font-medium text-emerald-700"
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

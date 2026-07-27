import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  Link,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import { authService } from '../../../services/auth.service'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const email = searchParams.get('email')?.trim() ?? ''

  const token = useMemo(() => {
    const tokenFromUrl = searchParams.get('token') ?? ''

    // Evita corrupção de tokens Base64 quando "+" vira espaço.
    return tokenFromUrl.replaceAll(' ', '+')
  }, [searchParams])

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] =
    useState('')
  const [showPassword, setShowPassword] =
    useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const invalidLink = !email || !token

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setError('')

    if (invalidLink) {
      setError(
        'O link de redefinição é inválido ou está incompleto.',
      )
      return
    }

    if (newPassword.length < 6) {
      setError(
        'A nova senha deve possuir pelo menos 6 caracteres.',
      )
      return
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas informadas não são iguais.')
      return
    }

    setLoading(true)

    try {
      await authService.resetPassword({
        email,
        token,
        newPassword,
        confirmPassword,
      })

      setSuccess(true)

      window.setTimeout(() => {
        navigate('/login', { replace: true })
      }, 2500)
    } catch {
      setError(
        'Não foi possível redefinir a senha. O link pode estar inválido ou expirado.',
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
            Criar nova senha
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Escolha uma nova senha para acessar sua conta
            no Cuidar+.
          </p>
        </div>

        {invalidLink && (
          <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
            O link de redefinição não contém o e-mail ou
            token necessário. Solicite um novo link.
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
            {error}
          </div>
        )}

        {success ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
            <CheckCircle2
              size={40}
              className="mx-auto text-emerald-600"
            />

            <h2 className="mt-3 font-semibold text-emerald-900">
              Senha redefinida com sucesso
            </h2>

            <p className="mt-2 text-sm text-emerald-700">
              Você será encaminhado para a tela de login.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Nova senha
                </span>

                <div className="relative">
                  <input
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(event) =>
                      setNewPassword(
                        event.target.value,
                      )
                    }
                    className="w-full rounded-2xl border border-slate-200 py-3 pl-4 pr-12 text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current,
                      )
                    }
                    aria-label={
                      showPassword
                        ? 'Ocultar senha'
                        : 'Mostrar senha'
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Confirmar nova senha
                </span>

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value,
                    )
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || invalidLink}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading && (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              )}

              Redefinir senha
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
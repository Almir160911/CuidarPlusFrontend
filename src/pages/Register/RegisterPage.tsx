import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Building2,
  HeartPulse,
  LoaderCircle,
  LockKeyhole,
  Mail,
  User,
} from 'lucide-react'

import api from '../../services/api'
import { getApiErrorMessage } from '../../utils/api-error'

interface RegisterResponse {
  success: boolean
  message?: string
}

export function RegisterPage() {
  const navigate = useNavigate()

  const [organizationName, setOrganizationName] =
    useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] =
    useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (password !== confirmPassword) {
      setError('As senhas não conferem.')
      return
    }

    try {
      setLoading(true)
      setError(null)

      await api.post<RegisterResponse>(
        '/api/auth/register-organization-admin',
        {
          organizationName: organizationName.trim(),
          fullName: fullName.trim(),
          email: email.trim(),
          password,
        },
      )

      navigate('/login', {
        replace: true,
        state: {
          message:
            'Conta criada com sucesso. Agora faça seu login.',
        },
      })
    } catch (registerError) {
      setError(
        getApiErrorMessage(
          registerError,
          'Não foi possível criar a conta.',
        ),
      )
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
      <section className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-8">
        <header className="mb-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
            <HeartPulse
              className="text-emerald-700"
              size={30}
            />
          </div>

          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            Criar conta Cuidar+
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Cadastre sua família ou organização.
          </p>
        </header>

        <form
          className="space-y-4"
          onSubmit={handleSubmit}
        >
          <Field
            icon={<Building2 size={19} />}
            id="organizationName"
            label="Nome da família ou organização"
            onChange={setOrganizationName}
            value={organizationName}
            className={inputClass}
          />

          <Field
            icon={<User size={19} />}
            id="fullName"
            label="Seu nome completo"
            onChange={setFullName}
            value={fullName}
            className={inputClass}
          />

          <Field
            icon={<Mail size={19} />}
            id="email"
            label="E-mail"
            onChange={setEmail}
            type="email"
            value={email}
            className={inputClass}
          />

          <Field
            icon={<LockKeyhole size={19} />}
            id="password"
            label="Senha"
            onChange={setPassword}
            type="password"
            value={password}
            className={inputClass}
          />

          <Field
            icon={<LockKeyhole size={19} />}
            id="confirmPassword"
            label="Confirmar senha"
            onChange={setConfirmPassword}
            type="password"
            value={confirmPassword}
            className={inputClass}
          />

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

            {loading ? 'Criando...' : 'Criar conta'}
          </button>

          <Link
            className="flex items-center justify-center gap-2 text-sm font-medium text-emerald-700"
            to="/login"
          >
            <ArrowLeft size={16} />
            Já tenho uma conta
          </Link>
        </form>
      </section>
    </main>
  )
}

interface FieldProps {
  className: string
  icon: React.ReactNode
  id: string
  label: string
  onChange: (value: string) => void
  type?: string
  value: string
}

function Field({
  className,
  icon,
  id,
  label,
  onChange,
  type = 'text',
  value,
}: FieldProps) {
  return (
    <div>
      <label
        className="mb-2 block text-sm font-semibold text-slate-700"
        htmlFor={id}
      >
        {label}
      </label>

      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>

        <input
          className={className}
          id={id}
          onChange={(event) =>
            onChange(event.target.value)
          }
          required
          type={type}
          value={value}
        />
      </div>
    </div>
  )
}

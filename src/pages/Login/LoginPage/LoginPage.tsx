import { Activity, Loader2 } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../../../services/auth.service'

export function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('admin@cuidarplus.com')
  const [password, setPassword] = useState('123456')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await authService.login({ email, password })

      const token = result.token || result.accessToken || result.jwt

      if (!token) {
        throw new Error('Token JWT não retornado pela API.')
      }

      localStorage.setItem('cuidarplus_token', token)
      localStorage.setItem('cuidarplus_user', JSON.stringify(result.user ?? result))

      navigate('/')
    } catch {
      setError('Não foi possível entrar. Verifique o e-mail, senha ou se a API está rodando.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen grid-cols-1 bg-slate-950 lg:grid-cols-2">
      <section className="hidden bg-gradient-to-br from-emerald-500 via-teal-600 to-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
            <Activity />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Cuidar+</h1>
            <p className="text-sm text-emerald-50">Plataforma inteligente de cuidados</p>
          </div>
        </div>

        <div>
          <h2 className="max-w-xl text-5xl font-bold leading-tight">
            Gestão moderna para idosos, cuidadores, medicamentos e alertas.
          </h2>
          <p className="mt-6 max-w-lg text-lg text-emerald-50">
            Centralize cuidados, consultas, sinais vitais e registros diários em uma única plataforma.
          </p>
        </div>

        <p className="text-sm text-emerald-50">© Cuidar+ — Portal Administrativo</p>
      </section>

      <section className="flex items-center justify-center px-6 py-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-8 shadow-2xl"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white">
              <Activity />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Entrar no Cuidar+</h1>
            <p className="mt-2 text-sm text-slate-500">Acesse o painel administrativo</p>
          </div>

          {error && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">E-mail</span>
              <input
                type="email"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Senha</span>
              <input
                type="password"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
          </div>

          <button
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            Entrar
          </button>
        </form>
      </section>
    </main>
  )
}
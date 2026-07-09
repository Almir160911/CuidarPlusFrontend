import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Loader2, Plus, Search, Users, X } from 'lucide-react'
import { elderlyService } from '../../services/elderly.service'
import type { CreateElderlyPersonRequest, ElderlyPerson } from '../../types/elderly'

const initialForm: CreateElderlyPersonRequest = {
  fullName: '',
  birthDate: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  allergies: '',
  knownDiseases: '',
  doctorName: '',
  healthInsurance: '',
}

export function ElderlyPage() {
  const [items, setItems] = useState<ElderlyPerson[]>([])
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<CreateElderlyPersonRequest>(initialForm)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function loadData() {
    setLoading(true)
    setError('')

    try {
      const result = await elderlyService.list({page: 1,pageSize: 50, search, })

    setItems(result.items)
    } catch {
      setError('Não foi possível carregar os idosos.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      await elderlyService.create({
        ...form,
        birthDate: new Date(form.birthDate).toISOString(),
      })

      setForm(initialForm)
      setShowForm(false)
      await loadData()
    } catch {
      setError('Não foi possível cadastrar o idoso.')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-emerald-700">Cadastro</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Idosos</h1>
          <p className="mt-2 text-slate-500">Gerencie as pessoas acompanhadas pelo Cuidar+.</p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
        >
          <Plus size={18} />
          Novo idoso
        </button>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Novo idoso</h2>
              <p className="text-sm text-slate-500">Preencha os dados principais do acompanhamento.</p>
            </div>

            <button
              onClick={() => setShowForm(false)}
              className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="mb-1 block text-sm font-medium text-slate-700">Nome completo</span>
              <input
                required
                value={form.fullName}
                onChange={(event) => setForm({ ...form, fullName: event.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Data de nascimento</span>
              <input
                required
                type="date"
                value={form.birthDate}
                onChange={(event) => setForm({ ...form, birthDate: event.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Convênio</span>
              <input
                value={form.healthInsurance}
                onChange={(event) => setForm({ ...form, healthInsurance: event.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Contato de emergência</span>
              <input
                value={form.emergencyContactName}
                onChange={(event) => setForm({ ...form, emergencyContactName: event.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Telefone de emergência</span>
              <input
                value={form.emergencyContactPhone}
                onChange={(event) => setForm({ ...form, emergencyContactPhone: event.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Médico responsável</span>
              <input
                value={form.doctorName}
                onChange={(event) => setForm({ ...form, doctorName: event.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Alergias</span>
              <input
                value={form.allergies}
                onChange={(event) => setForm({ ...form, allergies: event.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-1 block text-sm font-medium text-slate-700">Doenças conhecidas</span>
              <textarea
                rows={3}
                value={form.knownDiseases}
                onChange={(event) => setForm({ ...form, knownDiseases: event.target.value })}
                className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            <div className="flex gap-3 md:col-span-2">
              <button
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-70"
              >
                {saving && <Loader2 className="animate-spin" size={18} />}
                Salvar
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Search size={18} className="text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full bg-transparent text-sm outline-none"
              placeholder="Pesquisar por nome..."
            />
          </div>

          <button
            onClick={loadData}
            className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Pesquisar
          </button>
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[780px] border-collapse bg-white text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Nome</th>
                <th className="px-5 py-4 font-semibold">Nascimento</th>
                <th className="px-5 py-4 font-semibold">Emergência</th>
                <th className="px-5 py-4 font-semibold">Médico</th>
                <th className="px-5 py-4 font-semibold">Convênio</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-500">
                    Carregando...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <div className="mb-3 rounded-2xl bg-slate-100 p-3 text-slate-500">
                        <Users />
                      </div>
                      <p className="font-semibold text-slate-700">Nenhum idoso encontrado</p>
                      <p className="mt-1 text-sm text-slate-500">
                        Cadastre o primeiro idoso para iniciar o acompanhamento.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id ?? item.fullName} className="border-t border-slate-100">
                    <td className="px-5 py-4 font-medium text-slate-900">{item.fullName}</td>
                    <td className="px-5 py-4 text-slate-600">
                      {item.birthDate ? new Date(item.birthDate).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {item.emergencyContactName || '-'}
                      {item.emergencyContactPhone ? ` — ${item.emergencyContactPhone}` : ''}
                    </td>
                    <td className="px-5 py-4 text-slate-600">{item.doctorName || '-'}</td>
                    <td className="px-5 py-4 text-slate-600">{item.healthInsurance || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

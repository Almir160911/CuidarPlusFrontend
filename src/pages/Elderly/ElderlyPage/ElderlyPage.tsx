import { useEffect, useState } from 'react'
import { Plus, Search, Users } from 'lucide-react'
import { api } from '../../../services/api'

interface ElderlyPerson {
  id?: string
  fullName?: string
  birthDate?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  healthInsurance?: string
}

export function ElderlyPage() {
  const [items, setItems] = useState<ElderlyPerson[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  async function loadData() {
    setLoading(true)

    try {
      const response = await api.get('/api/elderly-people', {
        params: {
          Page: 1,
          PageSize: 20,
          Search: search || undefined,
        },
      })

      const data = response.data

      if (Array.isArray(data)) {
        setItems(data)
      } else if (Array.isArray(data.items)) {
        setItems(data.items)
      } else if (Array.isArray(data.data)) {
        setItems(data.data)
      } else {
        setItems([])
      }
    } catch {
      setItems([])
    } finally {
      setLoading(false)
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

        <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700">
          <Plus size={18} />
          Novo idoso
        </button>
      </section>

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

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full border-collapse bg-white text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Nome</th>
                <th className="px-5 py-4 font-semibold">Data nascimento</th>
                <th className="px-5 py-4 font-semibold">Contato emergência</th>
                <th className="px-5 py-4 font-semibold">Convênio</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-slate-500">
                    Carregando...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center">
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
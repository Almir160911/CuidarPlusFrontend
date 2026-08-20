import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Eye,
  HeartPulse,
  RefreshCw,
  Search,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { useOrganizationCareLogs } from '../../hooks/useOrganizationCareLogs'
import type { CareLog } from '../../types/care-log'

import { CareLogDetails } from '../../components/care-logs/CareLogDetails'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { LoadingList } from '../../components/ui/LoadingList'
import { Modal } from '../../components/ui/Modal'
import { PageHeader } from '../../components/ui/PageHeader'
import { StatsCard } from '../../components/ui/StatsCard'

function formatDate(value: string) {
  return new Date(value).toLocaleString('pt-BR')
}

function getSummary(item: CareLog) {
  const values: string[] = []

  if (item.hadMeal) {
    values.push('Alimentação')
  }

  if (item.hadBath) {
    values.push('Banho')
  }

  if (item.hadPain) {
    values.push('Dor')
  }

  if (item.hadFall) {
    values.push('Queda')
  }

  return values.length > 0
    ? values.join(' • ')
    : 'Registro de rotina'
}

export function CareLogsPage() {
  const {
    items,
    selected,
    latest,
    totalFalls,
    totalPainReports,
    search,
    page,
    pageSize,
    totalItems,
    totalPages,
    loading,
    error,
    setPage,
    setSelected,
    changeSearch,
    changePageSize,
    load,
  } = useOrganizationCareLogs()

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Rotina de cuidados"
        title="Diário de Cuidados"
        description="Acompanhe os registros de cuidados de todos os idosos da organização."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          label="Total de registros"
          value={totalItems}
          icon={<ClipboardList size={20} />}
        />

        <StatsCard
          label="Relatos de dor nesta página"
          value={totalPainReports}
          icon={<HeartPulse size={20} />}
        />

        <StatsCard
          label="Quedas nesta página"
          value={totalFalls}
          icon={<AlertTriangle size={20} />}
        />

        <StatsCard
          label="Último humor"
          value={latest?.mood || '-'}
        />
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card className="p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Search
              size={18}
              className="text-slate-400"
            />

            <input
              value={search}
              onChange={(event) =>
                changeSearch(event.target.value)
              }
              placeholder="Pesquisar observações, humor ou qualidade do sono..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            Itens

            <select
              value={pageSize}
              onChange={(event) =>
                changePageSize(
                  Number(event.target.value),
                )
              }
              className="rounded-xl border border-slate-200 bg-white px-3 py-2"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </label>

          <Button
            type="button"
            variant="secondary"
            disabled={loading}
            onClick={() => void load()}
          >
            <RefreshCw
              size={17}
              className={
                loading ? 'animate-spin' : ''
              }
            />
            Atualizar
          </Button>
        </div>
      </Card>

      {loading ? (
        <LoadingList rows={6} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={32} />}
          title="Nenhum cuidado registrado"
          description="Não existem registros correspondentes à pesquisa atual."
        />
      ) : (
        <>
          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-4">
                    Registro
                  </th>
                  <th className="px-5 py-4">
                    Humor
                  </th>
                  <th className="px-5 py-4">
                    Sono
                  </th>
                  <th className="px-5 py-4">
                    Data
                  </th>
                  <th className="px-5 py-4">
                    Ocorrências
                  </th>
                  <th className="px-5 py-4">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-slate-100"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">
                        {getSummary(item)}
                      </p>

                      {item.notes && (
                        <p className="mt-1 max-w-md truncate text-xs text-slate-400">
                          {item.notes}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {item.mood || '-'}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {item.sleepQuality || '-'}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(item.registeredAt)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        {item.hadPain && (
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                            Dor
                          </span>
                        )}

                        {item.hadFall && (
                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                            Queda
                          </span>
                        )}

                        {!item.hadPain &&
                          !item.hadFall && (
                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                              Sem ocorrência
                            </span>
                          )}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          title="Ver detalhes"
                          onClick={() =>
                            setSelected(item)
                          }
                          className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                        >
                          <Eye size={16} />
                        </button>

                        <Link
                          to={`/idosos/${item.elderlyPersonId}?tab=care`}
                          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                        >
                          Prontuário
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Card className="p-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <p className="text-sm text-slate-500">
                Exibindo {items.length} de {totalItems}{' '}
                registros.
              </p>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft size={17} />
                  Anterior
                </Button>

                <span className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold">
                  Página {page} de {totalPages}
                </span>

                <Button
                  type="button"
                  variant="secondary"
                  disabled={
                    page >= totalPages || loading
                  }
                  onClick={() => setPage(page + 1)}
                >
                  Próxima
                  <ChevronRight size={17} />
                </Button>
              </div>
            </div>
          </Card>
        </>
      )}

      <Modal
        open={Boolean(selected)}
        title="Detalhes do cuidado"
        description="Informações completas do registro."
        maxWidth="max-w-3xl"
        onClose={() => setSelected(null)}
      >
        {selected && (
          <CareLogDetails item={selected} />
        )}
      </Modal>
    </div>
  )
}

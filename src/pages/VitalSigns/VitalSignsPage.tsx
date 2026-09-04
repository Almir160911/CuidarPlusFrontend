import {
  Activity,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  RefreshCw,
  Search,
  Thermometer,
} from 'lucide-react'

import { Link } from 'react-router-dom'

import { useOrganizationVitalSigns } from '../../hooks/useOrganizationVitalSigns'

import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { LoadingList } from '../../components/ui/LoadingList'
import { PageHeader } from '../../components/ui/PageHeader'
import { StatsCard } from '../../components/ui/StatsCard'
import { DeviceSyncCard } from '../../components/vital-signs/DeviceSyncCard'

function formatDate(
  value: string,
) {
  return new Date(
    value,
  ).toLocaleString('pt-BR')
}

export function VitalSignsPage() {
  const {
    items,
    latest,
    alteredOxygen,
    feverRecords,

    search,
    page,
    pageSize,
    totalItems,
    totalPages,

    loading,
    error,

    setPage,
    changeSearch,
    changePageSize,
    load,
  } = useOrganizationVitalSigns()

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Monitoramento clínico"
        title="Sinais Vitais"
        description="Acompanhe as medições registradas para as pessoas assistidas pela organização."
      />
      {import.meta.env.DEV && (
        <DeviceSyncCard
          onSynchronized={load}
        />
      )}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          label="Total de registros"
          value={totalItems}
          icon={
            <HeartPulse size={20} />
          }
        />

        <StatsCard
          label="Última pressão"
          value={
            latest?.bloodPressure ||
            '-'
          }
        />

        <StatsCard
          label="Saturação abaixo de 95%"
          value={alteredOxygen}
          icon={
            <Activity size={20} />
          }
        />

        <StatsCard
          label="Febre nesta página"
          value={feverRecords}
          icon={
            <Thermometer size={20} />
          }
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
                changeSearch(
                  event.target.value,
                )
              }
              placeholder="Pesquisar pressão arterial..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            Itens

            <select
              value={pageSize}
              onChange={(event) =>
                changePageSize(
                  Number(
                    event.target.value,
                  ),
                )
              }
              className="rounded-xl border border-slate-200 bg-white px-3 py-2"
            >
              <option value={10}>
                10
              </option>

              <option value={20}>
                20
              </option>

              <option value={50}>
                50
              </option>
            </select>
          </label>

          <Button
            type="button"
            variant="secondary"
            disabled={loading}
            onClick={() =>
              void load()
            }
          >
            <RefreshCw
              size={17}
              className={
                loading
                  ? 'animate-spin'
                  : ''
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
          icon={
            <HeartPulse
              size={32}
            />
          }
          title="Nenhum sinal vital encontrado"
          description="Não existem medições correspondentes à pesquisa atual."
        />
      ) : (
        <>
          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-4">
                    Data
                  </th>

                  <th className="px-5 py-4">
                    Pressão
                  </th>

                  <th className="px-5 py-4">
                    Glicemia
                  </th>

                  <th className="px-5 py-4">
                    Temperatura
                  </th>

                  <th className="px-5 py-4">
                    Frequência
                  </th>

                  <th className="px-5 py-4">
                    Saturação
                  </th>

                  <th className="px-5 py-4">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {items.map(
                  (item) => (
                    <tr
                      key={item.id}
                      className="border-t border-slate-100"
                    >
                      <td className="px-5 py-4 text-slate-600">
                        {formatDate(
                          item.registeredAt,
                        )}
                      </td>

                      <td className="px-5 py-4 font-semibold text-slate-900">
                        {item.bloodPressure ||
                          '-'}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {item.bloodGlucose ??
                          '-'}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {item.temperature != null
                          ? `${item.temperature} °C`
                          : '-'}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {item.heartRate != null
                          ? `${item.heartRate} bpm`
                          : '-'}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={[
                            'rounded-full px-3 py-1 text-xs font-semibold',
                            item.oxygenSaturation != null &&
                            item.oxygenSaturation < 95
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700',
                          ].join(
                            ' ',
                          )}
                        >
                          {item.oxygenSaturation != null
                            ? `${item.oxygenSaturation}%`
                            : '-'}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <Link
                          to={`/idosos/${item.elderlyPersonId}?tab=vital-signs`}
                          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                        >
                          Prontuário
                        </Link>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>

          <Card className="p-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <p className="text-sm text-slate-500">
                Exibindo{' '}
                {items.length} de{' '}
                {totalItems}{' '}
                registros.
              </p>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={
                    page <= 1 ||
                    loading
                  }
                  onClick={() =>
                    setPage(
                      page - 1,
                    )
                  }
                >
                  <ChevronLeft
                    size={17}
                  />
                  Anterior
                </Button>

                <span className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold">
                  Página {page} de{' '}
                  {totalPages}
                </span>

                <Button
                  type="button"
                  variant="secondary"
                  disabled={
                    page >=
                      totalPages ||
                    loading
                  }
                  onClick={() =>
                    setPage(
                      page + 1,
                    )
                  }
                >
                  Próxima
                  <ChevronRight
                    size={17}
                  />
                </Button>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}

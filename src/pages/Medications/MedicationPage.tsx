import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Pill,
  RefreshCw,
  Search,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { useOrganizationMedications } from '../../hooks/useOrganizationMedications'
import type { Medication } from '../../types/medication'

import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { LoadingList } from '../../components/ui/LoadingList'
import { Modal } from '../../components/ui/Modal'
import { PageHeader } from '../../components/ui/PageHeader'
import { StatsCard } from '../../components/ui/StatsCard'

function formatDate(value?: string | null) {
  if (!value) {
    return '-'
  }

  return new Date(value).toLocaleDateString('pt-BR')
}

function MedicationDetails({
  medication,
}: {
  medication: Medication
}) {
  return (
    <div className="space-y-4">
      <Card className="p-5">
        <p className="text-sm text-slate-500">
          Medicamento
        </p>

        <h3 className="mt-1 text-xl font-bold text-slate-900">
          {medication.name}
        </h3>

        <span
          className={[
            'mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold',
            medication.isActive
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-slate-200 text-slate-600',
          ].join(' ')}
        >
          {medication.isActive ? 'Ativo' : 'Inativo'}
        </span>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <p className="text-sm text-slate-500">
            Dosagem
          </p>
          <p className="mt-2 font-semibold text-slate-900">
            {medication.dosage || 'Não informada'}
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-slate-500">
            Frequência
          </p>
          <p className="mt-2 font-semibold text-slate-900">
            {medication.frequency || 'Não informada'}
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-slate-500">
            Início
          </p>
          <p className="mt-2 font-semibold text-slate-900">
            {formatDate(medication.startDate)}
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-slate-500">
            Término
          </p>
          <p className="mt-2 font-semibold text-slate-900">
            {formatDate(medication.endDate)}
          </p>
        </Card>
      </div>

      <Card className="p-5">
        <p className="text-sm text-slate-500">
          Observações
        </p>

        <p className="mt-2 whitespace-pre-wrap text-slate-700">
          {medication.notes ||
            'Nenhuma observação cadastrada.'}
        </p>
      </Card>
    </div>
  )
}

export function MedicationsPage() {
  const {
    items,
    selected,

    activeItems,
    inactiveItems,

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
  } = useOrganizationMedications()

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Tratamentos"
        title="Medicamentos"
        description="Visualize os medicamentos cadastrados para as pessoas assistidas pela organização."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          label="Total"
          value={totalItems}
          icon={<Pill size={20} />}
        />

        <StatsCard
          label="Ativos nesta página"
          value={activeItems.length}
        />

        <StatsCard
          label="Inativos nesta página"
          value={inactiveItems.length}
        />

        <StatsCard
          label="Página"
          value={`${page}/${totalPages}`}
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
              placeholder="Pesquisar medicamento, dosagem ou frequência..."
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
              className={loading ? 'animate-spin' : ''}
            />
            Atualizar
          </Button>
        </div>
      </Card>

      {loading ? (
        <LoadingList rows={6} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<Pill size={32} />}
          title="Nenhum medicamento encontrado"
          description="Não existem medicamentos correspondentes à pesquisa atual."
        />
      ) : (
        <>
          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-4">
                    Medicamento
                  </th>
                  <th className="px-5 py-4">
                    Dosagem
                  </th>
                  <th className="px-5 py-4">
                    Frequência
                  </th>
                  <th className="px-5 py-4">
                    Período
                  </th>
                  <th className="px-5 py-4">
                    Situação
                  </th>
                  <th className="px-5 py-4">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {items.map((medication) => (
                  <tr
                    key={medication.id}
                    className="border-t border-slate-100"
                  >
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {medication.name}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {medication.dosage || '-'}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {medication.frequency || '-'}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(medication.startDate)}
                      {' → '}
                      {formatDate(medication.endDate)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={[
                          'rounded-full px-3 py-1 text-xs font-semibold',
                          medication.isActive
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-200 text-slate-600',
                        ].join(' ')}
                      >
                        {medication.isActive
                          ? 'Ativo'
                          : 'Inativo'}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          title="Ver detalhes"
                          onClick={() =>
                            setSelected(medication)
                          }
                          className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                        >
                          <Eye size={16} />
                        </button>

                        <Link
                          to={`/idosos/${medication.elderlyPersonId}?tab=medications`}
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
                medicamentos.
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
        title={selected?.name || 'Medicamento'}
        description="Informações completas do tratamento."
        maxWidth="max-w-3xl"
        onClose={() => setSelected(null)}
      >
        {selected && (
          <MedicationDetails
            medication={selected}
          />
        )}
      </Modal>
    </div>
  )
}

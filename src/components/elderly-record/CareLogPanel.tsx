import { useState } from 'react'
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  HeartPulse,
  Plus,
  RefreshCw,
  Search,
} from 'lucide-react'
import { useCareLogs } from '../../hooks/useCareLogs'
import type {
  CareLog,
  CreateCareLogRequest,
} from '../../types/care-log'
import { CareLogDetails } from '../care-logs/CareLogDetails'
import { CareLogForm } from '../care-logs/CareLogForm'
import { CareLogTable } from '../care-logs/CareLogTable'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import { LoadingList } from '../ui/LoadingList'
import { Modal } from '../ui/Modal'
import { StatsCard } from '../ui/StatsCard'

interface CareLogPanelProps {
  elderlyPersonId: string
}

export function CareLogPanel({
  elderlyPersonId,
}: CareLogPanelProps) {
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
    saving,
    error,

    setPage,
    setSelected,
    changeSearch,
    changePageSize,

    load,
    create,
  } = useCareLogs(elderlyPersonId)

  const [formOpen, setFormOpen] = useState(false)

  async function handleCreate(
    payload: CreateCareLogRequest,
  ) {
    await create(payload)
    setFormOpen(false)
  }

  function handleView(item: CareLog) {
    setSelected(item)
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium text-emerald-700">
          Rotina de cuidados
        </p>

        <h2 className="mt-1 text-2xl font-bold text-slate-900">
          Diário de Cuidados
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Registre alimentação, banho, sono, humor, dor,
          quedas e outras ocorrências.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          label="Total de registros"
          value={totalItems}
          icon={<ClipboardList size={20} />}
        />

        <StatsCard
          label="Relatos de dor"
          value={totalPainReports}
          icon={<HeartPulse size={20} />}
        />

        <StatsCard
          label="Ocorrências de queda"
          value={totalFalls}
          icon={<AlertTriangle size={20} />}
        />

        <StatsCard
          label="Último humor"
          value={latest?.mood || '-'}
        />
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card className="p-5">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Search
              size={18}
              className="shrink-0 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) =>
                changeSearch(event.target.value)
              }
              placeholder="Pesquisar observações ou humor..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              Itens por página

              <select
                value={pageSize}
                onChange={(event) =>
                  changePageSize(Number(event.target.value))
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </label>

            <Button
              variant="secondary"
              disabled={loading}
              onClick={load}
            >
              <RefreshCw
                size={17}
                className={loading ? 'animate-spin' : ''}
              />
              Atualizar
            </Button>

            <Button onClick={() => setFormOpen(true)}>
              <Plus size={17} />
              Novo registro
            </Button>
          </div>
        </div>
      </Card>

      {loading ? (
        <LoadingList rows={6} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={32} />}
          title="Nenhum cuidado registrado"
          description="Cadastre o primeiro registro do diário de cuidados."
        />
      ) : (
        <>
          <CareLogTable
            items={items}
            onView={handleView}
          />

          <Card className="p-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <p className="text-sm text-slate-500">
                Exibindo {items.length} de {totalItems} registros.
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  className="px-3 py-2"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft size={17} />
                  Anterior
                </Button>

                <span className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                  Página {page} de {totalPages}
                </span>

                <Button
                  variant="secondary"
                  className="px-3 py-2"
                  disabled={page >= totalPages || loading}
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
        open={formOpen}
        title="Novo registro de cuidados"
        description="Registre as informações da rotina do idoso."
        maxWidth="max-w-4xl"
        onClose={() => setFormOpen(false)}
      >
        <CareLogForm
          elderlyPersonId={elderlyPersonId}
          saving={saving}
          onSubmit={handleCreate}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>

      <Modal
        open={Boolean(selected)}
        title="Detalhes do cuidado"
        description="Informações completas do registro."
        maxWidth="max-w-3xl"
        onClose={() => setSelected(null)}
      >
        {selected && <CareLogDetails item={selected} />}
      </Modal>
    </section>
  )
}

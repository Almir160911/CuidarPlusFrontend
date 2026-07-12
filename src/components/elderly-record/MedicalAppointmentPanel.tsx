import { useState } from 'react'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  RefreshCw,
  Search,
  Stethoscope,
} from 'lucide-react'
import { useMedicalAppointments } from '../../hooks/useMedicalAppointments'
import type {
  CreateMedicalAppointmentRequest,
  MedicalAppointment,
} from '../../types/medical-appointment'
import { MedicalAppointmentDetails } from '../medical-appointments/MedicalAppointmentDetails'
import { MedicalAppointmentForm } from '../medical-appointments/MedicalAppointmentForm'
import { MedicalAppointmentTable } from '../medical-appointments/MedicalAppointmentTable'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import { LoadingList } from '../ui/LoadingList'
import { Modal } from '../ui/Modal'
import { StatsCard } from '../ui/StatsCard'

interface MedicalAppointmentPanelProps {
  elderlyPersonId: string
}

export function MedicalAppointmentPanel({
  elderlyPersonId,
}: MedicalAppointmentPanelProps) {
  const {
    items,
    selected,
    upcomingAppointments,
    pastAppointments,
    nextAppointment,

    search,
    page,
    pageSize,
    totalItems,
    totalPages,

    loading,
    saving,
    detailsLoading,
    error,

    setPage,
    changeSearch,
    changePageSize,
    clearSelected,

    load,
    create,
    loadDetails,
  } = useMedicalAppointments(elderlyPersonId)

  const [formOpen, setFormOpen] = useState(false)

  async function handleCreate(
    payload: CreateMedicalAppointmentRequest,
  ) {
    await create(payload)
    setFormOpen(false)
  }

  async function handleView(
    appointment: MedicalAppointment,
  ) {
    await loadDetails(appointment.id)
  }

  function handlePreviousPage() {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  function handleNextPage() {
    if (page < totalPages) {
      setPage(page + 1)
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium text-emerald-700">
          Acompanhamento médico
        </p>

        <h2 className="mt-1 text-2xl font-bold text-slate-900">
          Consultas Médicas
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Cadastre consultas, acompanhe compromissos futuros e
          consulte o histórico médico.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          label="Total de consultas"
          value={totalItems}
          icon={<Stethoscope size={20} />}
        />

        <StatsCard
          label="Próximas consultas"
          value={upcomingAppointments.length}
          icon={<CalendarDays size={20} />}
        />

        <StatsCard
          label="Consultas anteriores"
          value={pastAppointments.length}
          icon={<Clock size={20} />}
        />

        <StatsCard
          label="Página atual"
          value={`${page}/${totalPages}`}
        />
      </div>

      {nextAppointment && (
        <Card className="border-emerald-200 bg-emerald-50 p-5">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Próxima consulta
              </p>

              <h3 className="mt-1 text-xl font-bold text-slate-900">
                {nextAppointment.title}
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                {nextAppointment.doctorName ||
                  'Médico não informado'}
                {nextAppointment.specialty
                  ? ` • ${nextAppointment.specialty}`
                  : ''}
              </p>

              <p className="mt-2 text-sm font-semibold text-emerald-700">
                {new Date(
                  nextAppointment.appointmentDate,
                ).toLocaleString('pt-BR')}
              </p>
            </div>

            <Button
              variant="secondary"
              onClick={() => handleView(nextAppointment)}
            >
              Ver detalhes
            </Button>
          </div>
        </Card>
      )}

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
              placeholder="Pesquisar por consulta, médico, especialidade ou local..."
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
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
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-emerald-500"
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
              onClick={load}
            >
              <RefreshCw
                size={17}
                className={loading ? 'animate-spin' : ''}
              />
              Atualizar
            </Button>

            <Button
              type="button"
              onClick={() => setFormOpen(true)}
            >
              <Plus size={17} />
              Nova consulta
            </Button>
          </div>
        </div>
      </Card>

      {loading ? (
        <LoadingList rows={6} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<Stethoscope size={32} />}
          title="Nenhuma consulta encontrada"
          description="Cadastre a primeira consulta médica ou ajuste os termos da pesquisa."
        />
      ) : (
        <>
          <MedicalAppointmentTable
            items={items}
            onView={handleView}
          />

          <Card className="p-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <p className="text-sm text-slate-500">
                Exibindo {items.length} de {totalItems}{' '}
                consultas.
              </p>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="px-3 py-2"
                  disabled={page <= 1 || loading}
                  onClick={handlePreviousPage}
                >
                  <ChevronLeft size={17} />
                  Anterior
                </Button>

                <span className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                  Página {page} de {totalPages}
                </span>

                <Button
                  type="button"
                  variant="secondary"
                  className="px-3 py-2"
                  disabled={page >= totalPages || loading}
                  onClick={handleNextPage}
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
        title="Nova consulta médica"
        description="Cadastre uma consulta no prontuário do idoso."
        maxWidth="max-w-3xl"
        onClose={() => setFormOpen(false)}
      >
        <MedicalAppointmentForm
          elderlyPersonId={elderlyPersonId}
          saving={saving}
          onSubmit={handleCreate}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>

      <Modal
        open={Boolean(selected)}
        title={selected?.title || 'Detalhes da consulta'}
        description="Informações completas da consulta médica."
        maxWidth="max-w-3xl"
        onClose={clearSelected}
      >
        {detailsLoading ? (
          <LoadingList rows={4} />
        ) : selected ? (
          <MedicalAppointmentDetails
            appointment={selected}
          />
        ) : null}
      </Modal>
    </section>
  )
}
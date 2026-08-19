import { useState } from 'react'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Eye,
  MapPin,
  RefreshCw,
  Search,
  Stethoscope,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { useOrganizationMedicalAppointments } from '../../hooks/useOrganizationMedicalAppointments'
import type { MedicalAppointment } from '../../types/medical-appointment'

import { MedicalAppointmentDetails } from '../../components/medical-appointments/MedicalAppointmentDetails'
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

function getStatus(
  appointmentDate: string,
) {
  const appointmentTime =
    new Date(appointmentDate).getTime()

  const now = Date.now()

  if (appointmentTime >= now) {
    return {
      label: 'Agendada',
      className:
        'bg-emerald-100 text-emerald-700',
    }
  }

  return {
    label: 'Realizada',
    className:
      'bg-slate-200 text-slate-600',
  }
}

interface AppointmentRowProps {
  appointment: MedicalAppointment
  onView: (
    appointment: MedicalAppointment,
  ) => void
}

function AppointmentRow({
  appointment,
  onView,
}: AppointmentRowProps) {
  const status =
    getStatus(
      appointment.appointmentDate,
    )

  return (
    <tr className="border-t border-slate-100">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-50 p-2 text-emerald-700">
            <CalendarDays size={18} />
          </div>

          <div className="min-w-0">
            <p className="font-semibold text-slate-900">
              {appointment.title}
            </p>

            {appointment.notes && (
              <p className="mt-1 max-w-xs truncate text-xs text-slate-400">
                {appointment.notes}
              </p>
            )}
          </div>
        </div>
      </td>

      <td className="px-5 py-4 text-slate-600">
        {appointment.doctorName || '-'}
      </td>

      <td className="px-5 py-4 text-slate-600">
        {appointment.specialty || '-'}
      </td>

      <td className="px-5 py-4 text-slate-600">
        {formatDate(
          appointment.appointmentDate,
        )}
      </td>

      <td className="px-5 py-4 text-slate-600">
        <span className="inline-flex items-center gap-2">
          <MapPin size={15} />

          {appointment.location || '-'}
        </span>
      </td>

      <td className="px-5 py-4">
        <span
          className={[
            'rounded-full px-3 py-1 text-xs font-semibold',
            status.className,
          ].join(' ')}
        >
          {status.label}
        </span>
      </td>

      <td className="px-5 py-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            title="Ver detalhes e anexos"
            onClick={() =>
              onView(appointment)
            }
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
          >
            <Eye size={16} />
            Detalhes
          </button>

          <Link
            to={`/idosos/${appointment.elderlyPersonId}?tab=appointments`}
            title="Abrir prontuário"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            <ExternalLink size={16} />
            Prontuário
          </Link>
        </div>
      </td>
    </tr>
  )
}

export function MedicalAppointmentsPage() {
  const {
    items,
    upcomingAppointments,
    pastAppointments,

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
  } = useOrganizationMedicalAppointments()

  const [
    selectedAppointment,
    setSelectedAppointment,
  ] = useState<MedicalAppointment | null>(
    null,
  )

  function previousPage() {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  function nextPage() {
    if (page < totalPages) {
      setPage(page + 1)
    }
  }

  function handleView(
    appointment: MedicalAppointment,
  ) {
    setSelectedAppointment(
      appointment,
    )
  }

  function handleCloseDetails() {
    setSelectedAppointment(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Acompanhamento médico"
        title="Consultas Médicas"
        description="Visualize consultas, exames e documentos médicos de todos os idosos da organização."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          label="Total de consultas"
          value={totalItems}
          icon={
            <Stethoscope size={20} />
          }
        />

        <StatsCard
          label="Próximas"
          value={
            upcomingAppointments.length
          }
          icon={
            <CalendarDays size={20} />
          }
        />

        <StatsCard
          label="Realizadas"
          value={
            pastAppointments.length
          }
          icon={<Clock size={20} />}
        />

        <StatsCard
          label="Página"
          value={`${page}/${totalPages}`}
        />
      </section>

      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
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
                changeSearch(
                  event.target.value,
                )
              }
              placeholder="Pesquisar consulta, médico, especialidade ou local..."
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none"
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
        </div>
      </Card>

      {loading ? (
        <LoadingList rows={6} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={
            <Stethoscope size={32} />
          }
          title="Nenhuma consulta encontrada"
          description="Não existem consultas correspondentes à pesquisa atual."
        />
      ) : (
        <>
          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[1150px] border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">
                    Consulta
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Médico
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Especialidade
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Data
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Local
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Situação
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {items.map(
                  (appointment) => (
                    <AppointmentRow
                      key={appointment.id}
                      appointment={
                        appointment
                      }
                      onView={
                        handleView
                      }
                    />
                  ),
                )}
              </tbody>
            </table>
          </div>

          <Card className="p-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <p className="text-sm text-slate-500">
                Exibindo {items.length}{' '}
                de {totalItems} consultas.
              </p>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={
                    page <= 1 ||
                    loading
                  }
                  onClick={
                    previousPage
                  }
                >
                  <ChevronLeft
                    size={17}
                  />
                  Anterior
                </Button>

                <span className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
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
                  onClick={
                    nextPage
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

      <Modal
        open={Boolean(
          selectedAppointment,
        )}
        title={
          selectedAppointment?.title ??
          'Detalhes da consulta'
        }
        description="Informações da consulta médica e documentos relacionados."
        maxWidth="max-w-5xl"
        onClose={
          handleCloseDetails
        }
      >
        {selectedAppointment && (
          <MedicalAppointmentDetails
            appointment={
              selectedAppointment
            }
          />
        )}
      </Modal>
    </div>
  )
}

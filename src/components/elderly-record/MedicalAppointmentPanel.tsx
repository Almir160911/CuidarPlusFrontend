import { useState } from 'react'
import {
  CalendarDays,
  Clock,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Stethoscope,
} from 'lucide-react'
import { useMedicalAppointments } from '../../hooks/useMedicalAppointments'
import type { CreateMedicalAppointmentRequest } from '../../types/medical-appointment'
import { MedicalAppointmentForm } from '../medical-appointments/MedicalAppointmentForm'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import { LoadingList } from '../ui/LoadingList'
import { Modal } from '../ui/Modal'
import { StatsCard } from '../ui/StatsCard'

interface MedicalAppointmentPanelProps {
  elderlyPersonId: string
}

function formatDate(value: string) {
  return new Date(value).toLocaleString('pt-BR')
}

export function MedicalAppointmentPanel({
  elderlyPersonId,
}: MedicalAppointmentPanelProps) {
  const {
    items,
    upcomingAppointments,
    pastAppointments,
    search,
    loading,
    saving,
    error,
    setSearch,
    load,
    create,
  } = useMedicalAppointments(elderlyPersonId)

  const [formOpen, setFormOpen] = useState(false)

  async function handleCreate(
    payload: CreateMedicalAppointmentRequest,
  ) {
    await create(payload)
    setFormOpen(false)
  }

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm font-medium text-emerald-700">
          Acompanhamento médico
        </p>

        <h2 className="mt-1 text-2xl font-bold text-slate-900">
          Consultas Médicas
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Gerencie consultas futuras e o histórico médico do
          idoso.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard
          label="Total de consultas"
          value={items.length}
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
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card className="p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Search size={18} className="text-slate-400" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Pesquisar médico, especialidade, local..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <div className="flex gap-3">
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
          description="Cadastre a primeira consulta médica deste idoso."
        />
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Próximas consultas
            </h3>

            {upcomingAppointments.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">
                Nenhuma consulta futura cadastrada.
              </p>
            ) : (
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {upcomingAppointments.map((appointment) => (
                  <Card key={appointment.id} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-bold text-slate-900">
                          {appointment.title}
                        </p>

                        <p className="mt-1 text-sm text-slate-600">
                          {appointment.doctorName ||
                            'Médico não informado'}
                        </p>

                        <p className="text-sm text-slate-500">
                          {appointment.specialty ||
                            'Especialidade não informada'}
                        </p>
                      </div>

                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Próxima
                      </span>
                    </div>

                    <div className="mt-5 space-y-2 text-sm">
                      <p className="flex items-center gap-2 text-slate-700">
                        <CalendarDays size={16} />
                        {formatDate(
                          appointment.appointmentDate,
                        )}
                      </p>

                      <p className="flex items-center gap-2 text-slate-500">
                        <MapPin size={16} />
                        {appointment.location ||
                          'Local não informado'}
                      </p>
                    </div>

                    {appointment.notes && (
                      <p className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
                        {appointment.notes}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Histórico
            </h3>

            {pastAppointments.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">
                Nenhuma consulta anterior registrada.
              </p>
            ) : (
              <div className="mt-4 overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full min-w-[820px] text-left text-sm">
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
                    </tr>
                  </thead>

                  <tbody>
                    {pastAppointments.map((appointment) => (
                      <tr
                        key={appointment.id}
                        className="border-t border-slate-100"
                      >
                        <td className="px-5 py-4 font-semibold text-slate-900">
                          {appointment.title}
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
                          {appointment.location || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      <Modal
        open={formOpen}
        title="Nova consulta"
        description="Cadastre uma consulta médica no prontuário."
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
    </section>
  )
}

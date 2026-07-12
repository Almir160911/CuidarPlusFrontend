import {
  CalendarDays,
  Eye,
  MapPin,
  Stethoscope,
} from 'lucide-react'
import type { MedicalAppointment } from '../../types/medical-appointment'

interface MedicalAppointmentTableProps {
  items: MedicalAppointment[]
  onView: (appointment: MedicalAppointment) => void
}

function formatDate(value: string) {
  return new Date(value).toLocaleString('pt-BR')
}

function getStatus(appointmentDate: string) {
  const appointmentTime = new Date(
    appointmentDate,
  ).getTime()

  const now = Date.now()

  if (appointmentTime >= now) {
    return {
      label: 'Agendada',
      className: 'bg-emerald-100 text-emerald-700',
    }
  }

  return {
    label: 'Realizada',
    className: 'bg-slate-200 text-slate-600',
  }
}

export function MedicalAppointmentTable({
  items,
  onView,
}: MedicalAppointmentTableProps) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[960px] border-collapse text-left text-sm">
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
          {items.map((appointment) => {
            const status = getStatus(
              appointment.appointmentDate,
            )

            return (
              <tr
                key={appointment.id}
                className="border-t border-slate-100"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-emerald-50 p-2 text-emerald-700">
                      <CalendarDays size={18} />
                    </div>

                    <div>
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
                  <span className="inline-flex items-center gap-2">
                    <Stethoscope size={15} />
                    {appointment.doctorName || '-'}
                  </span>
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {appointment.specialty || '-'}
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {formatDate(appointment.appointmentDate)}
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
                  <button
                    type="button"
                    title="Visualizar consulta"
                    onClick={() => onView(appointment)}
                    className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

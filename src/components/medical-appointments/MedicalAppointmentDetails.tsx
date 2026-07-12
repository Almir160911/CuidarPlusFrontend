import {
  CalendarDays,
  MapPin,
  Stethoscope,
} from 'lucide-react'
import type { MedicalAppointment } from '../../types/medical-appointment'
import { Card } from '../ui/Card'

interface MedicalAppointmentDetailsProps {
  appointment: MedicalAppointment
}

function formatDate(value: string) {
  return new Date(value).toLocaleString('pt-BR')
}

export function MedicalAppointmentDetails({
  appointment,
}: MedicalAppointmentDetailsProps) {
  const isUpcoming =
    new Date(appointment.appointmentDate).getTime() >=
    Date.now()

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-medium text-emerald-700">
              Consulta médica
            </p>

            <h3 className="mt-1 text-2xl font-bold text-slate-900">
              {appointment.title}
            </h3>
          </div>

          <span
            className={[
              'w-fit rounded-full px-3 py-1 text-xs font-semibold',
              isUpcoming
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-slate-200 text-slate-600',
            ].join(' ')}
          >
            {isUpcoming ? 'Agendada' : 'Realizada'}
          </span>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center gap-3 text-emerald-700">
            <Stethoscope size={20} />

            <p className="text-sm font-semibold">
              Médico
            </p>
          </div>

          <p className="mt-3 font-semibold text-slate-900">
            {appointment.doctorName || 'Não informado'}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {appointment.specialty ||
              'Especialidade não informada'}
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 text-emerald-700">
            <CalendarDays size={20} />

            <p className="text-sm font-semibold">
              Data e horário
            </p>
          </div>

          <p className="mt-3 font-semibold text-slate-900">
            {formatDate(appointment.appointmentDate)}
          </p>
        </Card>

        <Card className="p-5 sm:col-span-2">
          <div className="flex items-center gap-3 text-emerald-700">
            <MapPin size={20} />

            <p className="text-sm font-semibold">
              Local
            </p>
          </div>

          <p className="mt-3 text-slate-900">
            {appointment.location || 'Não informado'}
          </p>
        </Card>
      </div>

      <Card className="p-5">
        <p className="text-sm font-semibold text-slate-700">
          Observações
        </p>

        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
          {appointment.notes ||
            'Nenhuma observação cadastrada.'}
        </p>
      </Card>
    </div>
  )
}

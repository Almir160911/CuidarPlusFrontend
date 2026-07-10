import { CalendarClock, Eye, Pill } from 'lucide-react'
import type { Medication } from '../../types/medication'

interface MedicationTableProps {
  items: Medication[]
  onView?: (medication: Medication) => void
  onOpenSchedule?: (medication: Medication) => void
}

function formatDate(value?: string | null) {
  if (!value) return '-'

  return new Date(value).toLocaleDateString('pt-BR')
}

function getTreatmentStatus(medication: Medication) {
  const today = new Date()
  const startDate = medication.startDate
    ? new Date(medication.startDate)
    : null
  const endDate = medication.endDate
    ? new Date(medication.endDate)
    : null

  if (startDate && startDate > today) {
    return {
      label: 'Agendado',
      className: 'bg-amber-100 text-amber-700',
    }
  }

  if (endDate && endDate < today) {
    return {
      label: 'Encerrado',
      className: 'bg-slate-200 text-slate-600',
    }
  }

  return {
    label: 'Ativo',
    className: 'bg-emerald-100 text-emerald-700',
  }
}

export function MedicationTable({
  items,
  onView,
  onOpenSchedule,
}: MedicationTableProps) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[880px] border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-5 py-4 font-semibold">Medicamento</th>
            <th className="px-5 py-4 font-semibold">Dosagem</th>
            <th className="px-5 py-4 font-semibold">Frequência</th>
            <th className="px-5 py-4 font-semibold">Período</th>
            <th className="px-5 py-4 font-semibold">Situação</th>
            <th className="px-5 py-4 font-semibold">Ações</th>
          </tr>
        </thead>

        <tbody>
          {items.map((medication) => {
            const status = getTreatmentStatus(medication)

            return (
              <tr
                key={medication.id ?? medication.name}
                className="border-t border-slate-100"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-emerald-50 p-2 text-emerald-700">
                      <Pill size={18} />
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">
                        {medication.name || '-'}
                      </p>

                      {medication.notes && (
                        <p className="mt-1 max-w-xs truncate text-xs text-slate-400">
                          {medication.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {medication.dosage || '-'}
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {medication.frequency || '-'}
                </td>

                <td className="px-5 py-4 text-slate-600">
                  <p>{formatDate(medication.startDate)}</p>
                  <p className="text-xs text-slate-400">
                    até {formatDate(medication.endDate)}
                  </p>
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
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      title="Visualizar medicamento"
                      onClick={() => onView?.(medication)}
                      className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      type="button"
                      title="Abrir agenda do medicamento"
                      onClick={() => onOpenSchedule?.(medication)}
                      className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                    >
                      <CalendarClock size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

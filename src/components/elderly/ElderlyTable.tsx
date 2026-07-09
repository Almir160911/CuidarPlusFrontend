import { CalendarDays, Eye, HeartPulse, Pill, Stethoscope } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ElderlyPerson } from '../../types/elderly'

interface ElderlyTableProps {
  items: ElderlyPerson[]
}

function calculateAge(birthDate?: string) {
  if (!birthDate) return '-'

  const birth = new Date(birthDate)
  const today = new Date()

  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return `${age} anos`
}

export function ElderlyTable({ items }: ElderlyTableProps) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[980px] border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-5 py-4 font-semibold">Nome</th>
            <th className="px-5 py-4 font-semibold">Idade</th>
            <th className="px-5 py-4 font-semibold">Médico</th>
            <th className="px-5 py-4 font-semibold">Convênio</th>
            <th className="px-5 py-4 font-semibold">Emergência</th>
            <th className="px-5 py-4 font-semibold">Ações</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id ?? item.fullName} className="border-t border-slate-100">
              <td className="px-5 py-4">
                <p className="font-semibold text-slate-900">{item.fullName || '-'}</p>
                <p className="text-xs text-slate-500">
                  Nascimento:{' '}
                  {item.birthDate ? new Date(item.birthDate).toLocaleDateString('pt-BR') : '-'}
                </p>
              </td>

              <td className="px-5 py-4 text-slate-600">{calculateAge(item.birthDate)}</td>
              <td className="px-5 py-4 text-slate-600">{item.doctorName || '-'}</td>
              <td className="px-5 py-4 text-slate-600">{item.healthInsurance || '-'}</td>

              <td className="px-5 py-4 text-slate-600">
                <p>{item.emergencyContactName || '-'}</p>
                <p className="text-xs text-slate-400">{item.emergencyContactPhone || ''}</p>
              </td>

              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/idosos/${item.id}`}
                    title="Abrir prontuário"
                    className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                  >
                    <Eye size={16} />
                  </Link>

                  <button
                    title="Medicamentos"
                    className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                  >
                    <Pill size={16} />
                  </button>

                  <button
                    title="Sinais vitais"
                    className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                  >
                    <HeartPulse size={16} />
                  </button>

                  <button
                    title="Consultas"
                    className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                  >
                    <Stethoscope size={16} />
                  </button>

                  <button
                    title="Agenda"
                    className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                  >
                    <CalendarDays size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
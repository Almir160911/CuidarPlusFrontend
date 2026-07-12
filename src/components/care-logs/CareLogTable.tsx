import {
  AlertTriangle,
  Bath,
  Eye,
  HeartPulse,
  Moon,
  Utensils,
} from 'lucide-react'
import type { CareLog } from '../../types/care-log'

interface CareLogTableProps {
  items: CareLog[]
  onView: (item: CareLog) => void
}

function formatDate(value: string) {
  return new Date(value).toLocaleString('pt-BR')
}

function StatusBadge({
  value,
  positiveLabel,
  negativeLabel,
}: {
  value: boolean
  positiveLabel: string
  negativeLabel: string
}) {
  return (
    <span
      className={[
        'rounded-full px-3 py-1 text-xs font-semibold',
        value
          ? 'bg-emerald-100 text-emerald-700'
          : 'bg-slate-200 text-slate-600',
      ].join(' ')}
    >
      {value ? positiveLabel : negativeLabel}
    </span>
  )
}

export function CareLogTable({
  items,
  onView,
}: CareLogTableProps) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[980px] border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-5 py-4 font-semibold">Data</th>
            <th className="px-5 py-4 font-semibold">Alimentação</th>
            <th className="px-5 py-4 font-semibold">Banho</th>
            <th className="px-5 py-4 font-semibold">Sono</th>
            <th className="px-5 py-4 font-semibold">Humor</th>
            <th className="px-5 py-4 font-semibold">Ocorrências</th>
            <th className="px-5 py-4 font-semibold">Ações</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="border-t border-slate-100"
            >
              <td className="px-5 py-4 font-medium text-slate-900">
                {formatDate(item.registeredAt)}
              </td>

              <td className="px-5 py-4">
                <span className="inline-flex items-center gap-2">
                  <Utensils size={16} className="text-slate-400" />
                  <StatusBadge
                    value={item.hadMeal}
                    positiveLabel="Realizada"
                    negativeLabel="Não realizada"
                  />
                </span>
              </td>

              <td className="px-5 py-4">
                <span className="inline-flex items-center gap-2">
                  <Bath size={16} className="text-slate-400" />
                  <StatusBadge
                    value={item.hadBath}
                    positiveLabel="Realizado"
                    negativeLabel="Não realizado"
                  />
                </span>
              </td>

              <td className="px-5 py-4 text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <Moon size={16} />
                  {item.sleepQuality || '-'}
                </span>
              </td>

              <td className="px-5 py-4 text-slate-600">
                {item.mood || '-'}
              </td>

              <td className="px-5 py-4">
                <div className="flex flex-wrap gap-2">
                  {item.hadPain && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                      <HeartPulse size={13} />
                      Dor
                    </span>
                  )}

                  {item.hadFall && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                      <AlertTriangle size={13} />
                      Queda
                    </span>
                  )}

                  {!item.hadPain && !item.hadFall && (
                    <span className="text-xs text-slate-400">
                      Sem ocorrências
                    </span>
                  )}
                </div>
              </td>

              <td className="px-5 py-4">
                <button
                  type="button"
                  title="Visualizar registro"
                  onClick={() => onView(item)}
                  className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                >
                  <Eye size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

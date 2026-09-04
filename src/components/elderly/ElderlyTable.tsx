import { Archive, Eye, Pencil, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ElderlyPerson } from '../../types/elderly'

interface ElderlyTableProps {
  items: ElderlyPerson[]
  busy?: boolean
  onEdit: (item: ElderlyPerson) => void
  onStatusChange: (item: ElderlyPerson) => void
}

function calculateAge(birthDate?: string) {
  if (!birthDate) return '-'

  const birth = new Date(birthDate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birth.getDate())
  ) {
    age--
  }

  return `${age} anos`
}

function ActionButtons({
  item,
  busy,
  onEdit,
  onStatusChange,
}: {
  item: ElderlyPerson
  busy: boolean
  onEdit: (item: ElderlyPerson) => void
  onStatusChange: (item: ElderlyPerson) => void
}) {
  const active = item.isActive !== false

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        to={`/idosos/${item.id}`}
        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
      >
        <Eye size={16} />
        Prontuário
      </Link>

      <button
        type="button"
        disabled={busy}
        onClick={() => onEdit(item)}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
      >
        <Pencil size={16} />
        Editar
      </button>

      <button
        type="button"
        disabled={busy}
        onClick={() => onStatusChange(item)}
        className={[
          'inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold disabled:opacity-60',
          active
            ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
            : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50',
        ].join(' ')}
      >
        {active ? <Archive size={16} /> : <RotateCcw size={16} />}
        {active ? 'Arquivar' : 'Reativar'}
      </button>
    </div>
  )
}

export function ElderlyTable({
  items,
  busy = false,
  onEdit,
  onStatusChange,
}: ElderlyTableProps) {
  return (
    <>
      <div className="grid gap-4 md:hidden">
        {items.map((item) => {
          const active = item.isActive !== false

          return (
            <article
              key={item.id ?? item.fullName}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-bold text-slate-900">
                    {item.fullName || '-'}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {calculateAge(item.birthDate)}
                  </p>
                </div>
                <span className={[
                  'rounded-full px-3 py-1 text-xs font-semibold',
                  active
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-200 text-slate-600',
                ].join(' ')}>
                  {active ? 'Ativo' : 'Arquivado'}
                </span>
              </div>

              <dl className="my-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-slate-400">Médico</dt>
                  <dd className="mt-1 text-slate-700">{item.doctorName || '-'}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Convênio</dt>
                  <dd className="mt-1 text-slate-700">{item.healthInsurance || '-'}</dd>
                </div>
              </dl>

              <ActionButtons
                item={item}
                busy={busy}
                onEdit={onEdit}
                onStatusChange={onStatusChange}
              />
            </article>
          )
        })}
      </div>

      <div className="hidden overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm md:block">
        <table className="w-full min-w-[880px] border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-5 py-4 font-semibold">Nome</th>
              <th className="px-5 py-4 font-semibold">Idade</th>
              <th className="px-5 py-4 font-semibold">Médico</th>
              <th className="px-5 py-4 font-semibold">Convênio</th>
              <th className="px-5 py-4 font-semibold">Situação</th>
              <th className="px-5 py-4 font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const active = item.isActive !== false

              return (
                <tr key={item.id ?? item.fullName} className="border-t border-slate-100">
                  <td className="px-5 py-4 font-semibold text-slate-900">{item.fullName || '-'}</td>
                  <td className="px-5 py-4 text-slate-600">{calculateAge(item.birthDate)}</td>
                  <td className="px-5 py-4 text-slate-600">{item.doctorName || '-'}</td>
                  <td className="px-5 py-4 text-slate-600">{item.healthInsurance || '-'}</td>
                  <td className="px-5 py-4">
                    <span className={active ? 'text-emerald-700' : 'text-slate-500'}>
                      {active ? 'Ativo' : 'Arquivado'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <ActionButtons
                      item={item}
                      busy={busy}
                      onEdit={onEdit}
                      onStatusChange={onStatusChange}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

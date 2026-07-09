import { Plus, RefreshCw, Search } from 'lucide-react'

interface MedicationToolbarProps {
  search: string
  loading?: boolean
  disabled?: boolean
  onSearchChange: (value: string) => void
  onRefresh: () => void
  onCreate: () => void
}

export function MedicationToolbar({
  search,
  loading = false,
  disabled = false,
  onSearchChange,
  onRefresh,
  onCreate,
}: MedicationToolbarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <Search size={18} className="text-slate-400" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          disabled={disabled}
          className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-60"
          placeholder="Pesquisar medicamento, dosagem ou frequência..."
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading || disabled}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
          Atualizar
        </button>

        <button
          type="button"
          onClick={onCreate}
          disabled={disabled}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          <Plus size={17} />
          Novo medicamento
        </button>
      </div>
    </div>
  )
}
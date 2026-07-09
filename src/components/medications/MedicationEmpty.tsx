import { Pill } from 'lucide-react'

export function MedicationEmpty() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <div className="mb-4 rounded-2xl bg-slate-100 p-4 text-slate-500">
        <Pill size={32} />
      </div>
      <h3 className="text-lg font-bold text-slate-900">Nenhum medicamento encontrado</h3>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        Selecione um idoso e cadastre os medicamentos utilizados no acompanhamento.
      </p>
    </div>
  )
}
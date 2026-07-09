import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import type { CreateElderlyPersonRequest } from '../../types/elderly'

const initialForm: CreateElderlyPersonRequest = {
  fullName: '',
  birthDate: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  allergies: '',
  knownDiseases: '',
  doctorName: '',
  healthInsurance: '',
}

interface ElderlyFormProps {
  saving?: boolean
  onSubmit: (data: CreateElderlyPersonRequest) => Promise<void>
  onCancel: () => void
}

export function ElderlyForm({ saving = false, onSubmit, onCancel }: ElderlyFormProps) {
  const [form, setForm] = useState<CreateElderlyPersonRequest>(initialForm)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    await onSubmit({
      ...form,
      birthDate: new Date(form.birthDate).toISOString(),
    })

    setForm(initialForm)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
      <label className="block md:col-span-2">
        <span className="mb-1 block text-sm font-medium text-slate-700">Nome completo</span>
        <input
          required
          value={form.fullName}
          onChange={(event) => setForm({ ...form, fullName: event.target.value })}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Data de nascimento</span>
        <input
          required
          type="date"
          value={form.birthDate}
          onChange={(event) => setForm({ ...form, birthDate: event.target.value })}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Convênio</span>
        <input
          value={form.healthInsurance}
          onChange={(event) => setForm({ ...form, healthInsurance: event.target.value })}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Médico responsável</span>
        <input
          value={form.doctorName}
          onChange={(event) => setForm({ ...form, doctorName: event.target.value })}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Contato de emergência</span>
        <input
          value={form.emergencyContactName}
          onChange={(event) => setForm({ ...form, emergencyContactName: event.target.value })}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Telefone de emergência</span>
        <input
          value={form.emergencyContactPhone}
          onChange={(event) => setForm({ ...form, emergencyContactPhone: event.target.value })}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Alergias</span>
        <input
          value={form.allergies}
          onChange={(event) => setForm({ ...form, allergies: event.target.value })}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <label className="block md:col-span-2">
        <span className="mb-1 block text-sm font-medium text-slate-700">Doenças conhecidas</span>
        <textarea
          rows={3}
          value={form.knownDiseases}
          onChange={(event) => setForm({ ...form, knownDiseases: event.target.value })}
          className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <div className="flex gap-3 md:col-span-2">
        <button
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-70"
        >
          {saving && <Loader2 className="animate-spin" size={18} />}
          Salvar
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
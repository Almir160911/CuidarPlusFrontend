import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type {
  CreateElderlyPersonRequest,
  ElderlyPerson,
} from '../../types/elderly'

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

function formatLocalDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

interface ElderlyFormProps {
  saving?: boolean
  initialData?: ElderlyPerson | null
  onSubmit: (data: CreateElderlyPersonRequest) => Promise<void>
  onCancel: () => void
}

function toForm(data?: ElderlyPerson | null): CreateElderlyPersonRequest {
  if (!data) return initialForm

  return {
    fullName: data.fullName ?? '',
    birthDate: data.birthDate?.slice(0, 10) ?? '',
    emergencyContactName: data.emergencyContactName ?? '',
    emergencyContactPhone: data.emergencyContactPhone ?? '',
    allergies: data.allergies ?? '',
    knownDiseases: data.knownDiseases ?? '',
    doctorName: data.doctorName ?? '',
    healthInsurance: data.healthInsurance ?? '',
  }
}

export function ElderlyForm({
  saving = false,
  initialData,
  onSubmit,
  onCancel,
}: ElderlyFormProps) {
  const [form, setForm] = useState<CreateElderlyPersonRequest>(initialForm)
  const [error, setError] = useState('')

  const maximumBirthDate = new Date()
  maximumBirthDate.setDate(maximumBirthDate.getDate() - 1)
  const maximumBirthDateValue = formatLocalDate(maximumBirthDate)

  useEffect(() => {
    setForm(toForm(initialData))
    setError('')
  }, [initialData])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!form.fullName.trim()) {
      setError('Informe o nome completo.')
      return
    }

    if (!form.birthDate || form.birthDate > maximumBirthDateValue) {
      setError('A data de nascimento deve ser anterior à data atual.')
      return
    }

    await onSubmit({
      fullName: form.fullName.trim(),
      birthDate: new Date(form.birthDate).toISOString(),
      emergencyContactName: form.emergencyContactName?.trim() || undefined,
      emergencyContactPhone: form.emergencyContactPhone?.trim() || undefined,
      allergies: form.allergies?.trim() || undefined,
      knownDiseases: form.knownDiseases?.trim() || undefined,
      doctorName: form.doctorName?.trim() || undefined,
      healthInsurance: form.healthInsurance?.trim() || undefined,
    })

    setForm(initialForm)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 md:col-span-2">
          {error}
        </div>
      )}

      <label className="block md:col-span-2">
        <span className="mb-1 block text-sm font-medium text-slate-700">Nome completo</span>
        <input
          required
          maxLength={150}
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
          max={maximumBirthDateValue}
          value={form.birthDate}
          onChange={(event) => setForm({ ...form, birthDate: event.target.value })}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Convênio</span>
        <input
          maxLength={100}
          value={form.healthInsurance}
          onChange={(event) => setForm({ ...form, healthInsurance: event.target.value })}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Médico responsável</span>
        <input
          maxLength={150}
          value={form.doctorName}
          onChange={(event) => setForm({ ...form, doctorName: event.target.value })}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Contato de emergência</span>
        <input
          maxLength={150}
          value={form.emergencyContactName}
          onChange={(event) => setForm({ ...form, emergencyContactName: event.target.value })}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Telefone de emergência</span>
        <input
          maxLength={30}
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

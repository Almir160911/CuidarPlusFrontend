import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import type { CreateMedicationRequest } from '../../types/medication'
import { Button } from '../ui/Button'

interface MedicationFormProps {
  elderlyPersonId: string
  saving?: boolean
  onSubmit: (data: CreateMedicationRequest) => Promise<void>
  onCancel: () => void
}

interface MedicationFormState {
  name: string
  dosage: string
  frequency: string
  notes: string
  startDate: string
  endDate: string
}

const initialForm: MedicationFormState = {
  name: '',
  dosage: '',
  frequency: '',
  notes: '',
  startDate: '',
  endDate: '',
}

function toIsoDate(value: string): string | null {
  if (!value) return null

  return new Date(`${value}T00:00:00`).toISOString()
}

export function MedicationForm({
  elderlyPersonId,
  saving = false,
  onSubmit,
  onCancel,
}: MedicationFormProps) {
  const [form, setForm] = useState<MedicationFormState>(initialForm)
  const [validationError, setValidationError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setValidationError('')

    if (!form.name.trim()) {
      setValidationError('Informe o nome do medicamento.')
      return
    }

    if (!form.dosage.trim()) {
      setValidationError('Informe a dosagem.')
      return
    }

    if (!form.frequency.trim()) {
      setValidationError('Informe a frequência.')
      return
    }

    if (
      form.startDate &&
      form.endDate &&
      new Date(form.endDate) < new Date(form.startDate)
    ) {
      setValidationError(
        'A data final não pode ser anterior à data inicial.',
      )
      return
    }

    await onSubmit({
      elderlyPersonId,
      name: form.name.trim(),
      dosage: form.dosage.trim(),
      frequency: form.frequency.trim(),
      notes: form.notes.trim() || undefined,
      startDate: toIsoDate(form.startDate),
      endDate: toIsoDate(form.endDate),
    })

    setForm(initialForm)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
      {validationError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 md:col-span-2">
          {validationError}
        </div>
      )}

      <label className="block md:col-span-2">
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Nome do medicamento
        </span>

        <input
          required
          value={form.name}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              name: event.target.value,
            }))
          }
          placeholder="Ex.: Losartana"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Dosagem
        </span>

        <input
          required
          value={form.dosage}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              dosage: event.target.value,
            }))
          }
          placeholder="Ex.: 50 mg"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Frequência
        </span>

        <input
          required
          value={form.frequency}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              frequency: event.target.value,
            }))
          }
          placeholder="Ex.: Uma vez ao dia"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Início do tratamento
        </span>

        <input
          type="date"
          value={form.startDate}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              startDate: event.target.value,
            }))
          }
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Término do tratamento
        </span>

        <input
          type="date"
          value={form.endDate}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              endDate: event.target.value,
            }))
          }
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <label className="block md:col-span-2">
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Observações
        </span>

        <textarea
          rows={4}
          value={form.notes}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              notes: event.target.value,
            }))
          }
          placeholder="Orientações, cuidados e informações adicionais."
          className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <div className="flex flex-wrap gap-3 md:col-span-2">
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 size={18} className="animate-spin" />}
          Salvar medicamento
        </Button>

        <Button
          type="button"
          variant="secondary"
          disabled={saving}
          onClick={onCancel}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}

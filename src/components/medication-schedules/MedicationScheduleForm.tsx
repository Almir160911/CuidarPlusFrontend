import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import type { CreateMedicationScheduleRequest } from '../../types/medication-schedule'
import { Button } from '../ui/Button'

interface MedicationScheduleFormProps {
  medicationId: string
  saving?: boolean
  onSubmit: (
    payload: CreateMedicationScheduleRequest,
  ) => Promise<void>
  onCancel: () => void
}

export function MedicationScheduleForm({
  medicationId,
  saving = false,
  onSubmit,
  onCancel,
}: MedicationScheduleFormProps) {
  const [scheduledTime, setScheduledTime] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    setError('')

    if (!scheduledTime) {
      setError('Informe o horário do medicamento.')
      return
    }

    await onSubmit({
      medicationId,
      scheduledTime,
    })

    setScheduledTime('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Horário
        </span>

        <input
          type="time"
          required
          value={scheduledTime}
          onChange={(event) =>
            setScheduledTime(event.target.value)
          }
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving && (
            <Loader2 size={18} className="animate-spin" />
          )}
          Salvar horário
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

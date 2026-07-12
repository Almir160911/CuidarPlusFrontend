import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import type { CreateCareLogRequest } from '../../types/care-log'
import { Button } from '../ui/Button'

interface CareLogFormProps {
  elderlyPersonId: string
  saving?: boolean
  onSubmit: (payload: CreateCareLogRequest) => Promise<void>
  onCancel: () => void
}

interface CareLogFormState {
  hadMeal: boolean
  hadBath: boolean
  sleepQuality: string
  mood: string
  hadPain: boolean
  hadFall: boolean
  notes: string
}

const initialForm: CareLogFormState = {
  hadMeal: false,
  hadBath: false,
  sleepQuality: '',
  mood: '',
  hadPain: false,
  hadFall: false,
  notes: '',
}

export function CareLogForm({
  elderlyPersonId,
  saving = false,
  onSubmit,
  onCancel,
}: CareLogFormProps) {
  const [form, setForm] = useState<CareLogFormState>(initialForm)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!form.sleepQuality.trim()) {
      setError('Informe a qualidade do sono.')
      return
    }

    if (!form.mood.trim()) {
      setError('Informe o humor do idoso.')
      return
    }

    await onSubmit({
      elderlyPersonId,
      hadMeal: form.hadMeal,
      hadBath: form.hadBath,
      sleepQuality: form.sleepQuality.trim(),
      mood: form.mood.trim(),
      hadPain: form.hadPain,
      hadFall: form.hadFall,
      notes: form.notes.trim() || undefined,
    })

    setForm(initialForm)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 md:col-span-2">
          {error}
        </div>
      )}

      <label className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
        <div>
          <p className="font-medium text-slate-900">
            Alimentação realizada
          </p>
          <p className="text-sm text-slate-500">
            O idoso realizou a refeição prevista.
          </p>
        </div>

        <input
          type="checkbox"
          checked={form.hadMeal}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              hadMeal: event.target.checked,
            }))
          }
          className="h-5 w-5 accent-emerald-600"
        />
      </label>

      <label className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
        <div>
          <p className="font-medium text-slate-900">
            Banho realizado
          </p>
          <p className="text-sm text-slate-500">
            O banho foi realizado normalmente.
          </p>
        </div>

        <input
          type="checkbox"
          checked={form.hadBath}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              hadBath: event.target.checked,
            }))
          }
          className="h-5 w-5 accent-emerald-600"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Qualidade do sono
        </span>

        <select
          required
          value={form.sleepQuality}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              sleepQuality: event.target.value,
            }))
          }
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        >
          <option value="">Selecione</option>
          <option value="Excelente">Excelente</option>
          <option value="Boa">Boa</option>
          <option value="Regular">Regular</option>
          <option value="Ruim">Ruim</option>
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Humor
        </span>

        <select
          required
          value={form.mood}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              mood: event.target.value,
            }))
          }
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        >
          <option value="">Selecione</option>
          <option value="Muito bem">Muito bem</option>
          <option value="Bem">Bem</option>
          <option value="Calmo">Calmo</option>
          <option value="Ansioso">Ansioso</option>
          <option value="Triste">Triste</option>
          <option value="Agitado">Agitado</option>
        </select>
      </label>

      <label className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
        <div>
          <p className="font-medium text-slate-900">
            Relatou dor
          </p>
          <p className="text-sm text-slate-500">
            Houve relato ou percepção de dor.
          </p>
        </div>

        <input
          type="checkbox"
          checked={form.hadPain}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              hadPain: event.target.checked,
            }))
          }
          className="h-5 w-5 accent-red-600"
        />
      </label>

      <label className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
        <div>
          <p className="font-medium text-slate-900">
            Houve queda
          </p>
          <p className="text-sm text-slate-500">
            Registre qualquer ocorrência de queda.
          </p>
        </div>

        <input
          type="checkbox"
          checked={form.hadFall}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              hadFall: event.target.checked,
            }))
          }
          className="h-5 w-5 accent-red-600"
        />
      </label>

      <label className="block md:col-span-2">
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Observações
        </span>

        <textarea
          rows={5}
          value={form.notes}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              notes: event.target.value,
            }))
          }
          placeholder="Descreva ocorrências, comportamento, alimentação, dor ou outras informações relevantes."
          className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <div className="flex flex-wrap gap-3 md:col-span-2">
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 size={18} className="animate-spin" />}
          Salvar cuidado
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

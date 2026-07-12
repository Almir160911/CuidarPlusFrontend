import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import type { CreateMedicalAppointmentRequest } from '../../types/medical-appointment'
import { Button } from '../ui/Button'

interface MedicalAppointmentFormProps {
  elderlyPersonId: string
  saving?: boolean
  onSubmit: (
    payload: CreateMedicalAppointmentRequest,
  ) => Promise<void>
  onCancel: () => void
}

interface AppointmentFormState {
  title: string
  doctorName: string
  specialty: string
  appointmentDate: string
  location: string
  notes: string
}

const initialForm: AppointmentFormState = {
  title: '',
  doctorName: '',
  specialty: '',
  appointmentDate: '',
  location: '',
  notes: '',
}

export function MedicalAppointmentForm({
  elderlyPersonId,
  saving = false,
  onSubmit,
  onCancel,
}: MedicalAppointmentFormProps) {
  const [form, setForm] =
    useState<AppointmentFormState>(initialForm)

  const [error, setError] = useState('')

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    setError('')

    if (!form.title.trim()) {
      setError('Informe o título da consulta.')
      return
    }

    if (!form.appointmentDate) {
      setError('Informe a data e o horário da consulta.')
      return
    }

    const appointmentDate = new Date(
      form.appointmentDate,
    )

    if (Number.isNaN(appointmentDate.getTime())) {
      setError('A data da consulta é inválida.')
      return
    }

    await onSubmit({
      elderlyPersonId,
      title: form.title.trim(),
      doctorName: form.doctorName.trim() || undefined,
      specialty: form.specialty.trim() || undefined,
      appointmentDate: appointmentDate.toISOString(),
      location: form.location.trim() || undefined,
      notes: form.notes.trim() || undefined,
    })

    setForm(initialForm)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 md:grid-cols-2"
    >
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 md:col-span-2">
          {error}
        </div>
      )}

      <label className="block md:col-span-2">
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Título da consulta
        </span>

        <input
          required
          value={form.title}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              title: event.target.value,
            }))
          }
          placeholder="Ex.: Consulta cardiológica"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Médico
        </span>

        <input
          value={form.doctorName}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              doctorName: event.target.value,
            }))
          }
          placeholder="Ex.: Dr. Carlos Silva"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Especialidade
        </span>

        <input
          value={form.specialty}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              specialty: event.target.value,
            }))
          }
          placeholder="Ex.: Cardiologia"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Data e horário
        </span>

        <input
          required
          type="datetime-local"
          value={form.appointmentDate}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              appointmentDate: event.target.value,
            }))
          }
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Local
        </span>

        <input
          value={form.location}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              location: event.target.value,
            }))
          }
          placeholder="Ex.: Clínica Central"
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
          placeholder="Orientações e informações adicionais."
          className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <div className="flex flex-wrap gap-3 md:col-span-2">
        <Button type="submit" disabled={saving}>
          {saving && (
            <Loader2 size={18} className="animate-spin" />
          )}
          Salvar consulta
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
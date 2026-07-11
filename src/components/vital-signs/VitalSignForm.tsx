import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import type { CreateVitalSignRequest } from '../../types/vital-sign'
import { Button } from '../ui/Button'

interface VitalSignFormProps {
  elderlyPersonId: string
  saving?: boolean
  onSubmit: (payload: CreateVitalSignRequest) => Promise<void>
  onCancel: () => void
}

export function VitalSignForm({
  elderlyPersonId,
  saving = false,
  onSubmit,
  onCancel,
}: VitalSignFormProps) {
  const [bloodPressure, setBloodPressure] = useState('')
  const [bloodGlucose, setBloodGlucose] = useState('')
  const [temperature, setTemperature] = useState('')
  const [heartRate, setHeartRate] = useState('')
  const [oxygenSaturation, setOxygenSaturation] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    await onSubmit({
      elderlyPersonId,
      bloodPressure: bloodPressure.trim() || undefined,
      bloodGlucose: bloodGlucose ? Number(bloodGlucose) : null,
      temperature: temperature ? Number(temperature) : null,
      heartRate: heartRate ? Number(heartRate) : null,
      oxygenSaturation: oxygenSaturation
        ? Number(oxygenSaturation)
        : null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Pressão arterial
        </span>
        <input
          value={bloodPressure}
          onChange={(event) => setBloodPressure(event.target.value)}
          placeholder="Ex.: 12/8"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Glicemia
        </span>
        <input
          type="number"
          step="0.1"
          value={bloodGlucose}
          onChange={(event) => setBloodGlucose(event.target.value)}
          placeholder="mg/dL"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Temperatura
        </span>
        <input
          type="number"
          step="0.1"
          value={temperature}
          onChange={(event) => setTemperature(event.target.value)}
          placeholder="°C"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Frequência cardíaca
        </span>
        <input
          type="number"
          value={heartRate}
          onChange={(event) => setHeartRate(event.target.value)}
          placeholder="bpm"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <label className="block md:col-span-2">
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Saturação de oxigênio
        </span>
        <input
          type="number"
          value={oxygenSaturation}
          onChange={(event) => setOxygenSaturation(event.target.value)}
          placeholder="%"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <div className="flex gap-3 md:col-span-2">
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 size={18} className="animate-spin" />}
          Salvar registro
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

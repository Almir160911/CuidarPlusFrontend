import {
  useState,
  type FormEvent,
} from 'react'

import { Button } from '../ui/Button'

import type { ElderlyPerson } from '../../types/elderly'

import {
  ConnectedDeviceType,
  connectedDeviceTypeLabels,
  type CreateConnectedDeviceRequest,
} from '../../types/connected-device'

import { getApiErrorMessage } from '../../utils/api-error'

interface ConnectedDeviceFormProps {
  elderlyPeople: ElderlyPerson[]
  submitting: boolean
  onCancel: () => void
  onSubmit: (
    payload: CreateConnectedDeviceRequest,
  ) => Promise<void>
}

interface FormState {
  elderlyPersonId: string
  type: ConnectedDeviceType
  name: string
  manufacturer: string
  model: string
  provider: string
  externalDeviceId: string
}

const initialState: FormState = {
  elderlyPersonId: '',
  type: ConnectedDeviceType.SmartWatch,
  name: '',
  manufacturer: '',
  model: '',
  provider: 'Mock',
  externalDeviceId: '',
}

const inputClassName =
  'mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100'

export function ConnectedDeviceForm({
  elderlyPeople,
  submitting,
  onCancel,
  onSubmit,
}: ConnectedDeviceFormProps) {
  const [form, setForm] =
    useState<FormState>(initialState)

  const [validationError, setValidationError] =
    useState('')

  function updateField<K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    setValidationError('')

    if (!form.elderlyPersonId) {
      setValidationError(
        'Selecione a pessoa assistida que utilizará o dispositivo.',
      )
      return
    }

    if (
      !form.name.trim() ||
      !form.manufacturer.trim()
    ) {
      setValidationError(
        'Informe o nome e o fabricante do dispositivo.',
      )
      return
    }

    const payload: CreateConnectedDeviceRequest = {
      elderlyPersonId: form.elderlyPersonId,
      type: form.type,
      name: form.name.trim(),
      manufacturer: form.manufacturer.trim(),
      provider: form.provider,
      model: form.model.trim() || null,
      externalDeviceId:
        form.externalDeviceId.trim() || null,
    }

  try {
    await onSubmit(payload)
    setForm(initialState)
      } catch (error) {
        setValidationError(
          getApiErrorMessage(
            error,
            'Não foi possível cadastrar o dispositivo.',
          ),
        )
    }
  }

  const deviceTypes = Object.entries(
    connectedDeviceTypeLabels,
  ).map(([value, label]) => ({
    value: Number(value) as ConnectedDeviceType,
    label,
  }))

  return (
    <form
      className="space-y-5"
      onSubmit={handleSubmit}
    >
      {validationError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {validationError}
        </div>
      )}

      {elderlyPeople.length === 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Cadastre uma pessoa assistida antes de adicionar um dispositivo.
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">
          Pessoa assistida

          <select
            required
            value={form.elderlyPersonId}
            disabled={
              submitting ||
              elderlyPeople.length === 0
            }
            onChange={(event) =>
              updateField(
                'elderlyPersonId',
                event.target.value,
              )
            }
            className={inputClassName}
          >
            <option value="">
              Selecione a pessoa assistida
            </option>

            {elderlyPeople
              .filter(
                (
                  elderly,
                ): elderly is ElderlyPerson & {
                  id: string
                } => Boolean(elderly.id),
              )
              .map((elderly) => (
                <option
                  key={elderly.id}
                  value={elderly.id}
                >
                  {elderly.fullName ??
                    'Pessoa sem nome'}
                </option>
              ))}
          </select>
        </label>

        <label className="text-sm font-medium text-slate-700">
          Tipo de dispositivo

          <select
            value={form.type}
            disabled={submitting}
            onChange={(event) =>
              updateField(
                'type',
                Number(
                  event.target.value,
                ) as ConnectedDeviceType,
              )
            }
            className={inputClassName}
          >
            {deviceTypes.map((item) => (
              <option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium text-slate-700">
          Nome do dispositivo

          <input
            required
            value={form.name}
            disabled={submitting}
            placeholder="Ex.: Smartwatch de Almir"
            onChange={(event) =>
              updateField(
                'name',
                event.target.value,
              )
            }
            className={inputClassName}
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          Fabricante

          <input
            required
            value={form.manufacturer}
            disabled={submitting}
            placeholder="Ex.: Samsung"
            onChange={(event) =>
              updateField(
                'manufacturer',
                event.target.value,
              )
            }
            className={inputClassName}
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          Modelo

          <input
            value={form.model}
            disabled={submitting}
            placeholder="Ex.: Galaxy Watch"
            onChange={(event) =>
              updateField(
                'model',
                event.target.value,
              )
            }
            className={inputClassName}
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          Identificador externo

          <input
            value={form.externalDeviceId}
            disabled={submitting}
            placeholder="Ex.: galaxy-watch-001"
            onChange={(event) =>
              updateField(
                'externalDeviceId',
                event.target.value,
              )
            }
            className={inputClassName}
          />
        </label>

        <label className="text-sm font-medium text-slate-700 md:col-span-2">
          Provedor

          <input
            value={form.provider}
            disabled
            className={inputClassName}
          />

          <span className="mt-2 block text-xs text-slate-500">
            Nesta versão, somente o provedor de demonstração está disponível.
          </span>
        </label>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
        <Button
          type="button"
          variant="secondary"
          disabled={submitting}
          onClick={onCancel}
        >
          Cancelar
        </Button>

        <Button
          type="submit"
          disabled={
            submitting ||
            elderlyPeople.length === 0
          }
        >
          {submitting
            ? 'Cadastrando...'
            : 'Cadastrar dispositivo'}
        </Button>
      </div>
    </form>
  )
}

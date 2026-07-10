import { useCallback, useEffect, useState } from 'react'
import { medicationScheduleService } from '../services/medication-schedule.service'
import type {
  CreateMedicationScheduleRequest,
  MedicationSchedule,
} from '../types/medication-schedule'

export function useMedicationSchedules(
  medicationId?: string,
) {
  const [items, setItems] = useState<MedicationSchedule[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!medicationId) {
      setItems([])
      return
    }

    setLoading(true)
    setError('')

    try {
      const result =
        await medicationScheduleService.listByMedication(
          medicationId,
        )

      setItems(result.items)
    } catch {
      setItems([])
      setError(
        'Não foi possível carregar a agenda do medicamento.',
      )
    } finally {
      setLoading(false)
    }
  }, [medicationId])

  async function create(
    payload: CreateMedicationScheduleRequest,
  ) {
    setSaving(true)
    setError('')

    try {
      await medicationScheduleService.create(payload)
      await load()
    } catch {
      setError('Não foi possível cadastrar o horário.')
      throw new Error('Erro ao cadastrar horário.')
    } finally {
      setSaving(false)
    }
  }

  async function confirmTaken(
    scheduleId: string,
    registeredByUserId: string,
  ) {
    setSaving(true)
    setError('')

    try {
      await medicationScheduleService.confirmTaken(
        scheduleId,
        { registeredByUserId },
      )

      await load()
    } catch {
      setError(
        'Não foi possível confirmar o medicamento como tomado.',
      )
    } finally {
      setSaving(false)
    }
  }

  async function confirmNotTaken(
    scheduleId: string,
    registeredByUserId: string,
  ) {
    setSaving(true)
    setError('')

    try {
      await medicationScheduleService.confirmNotTaken(
        scheduleId,
        { registeredByUserId },
      )

      await load()
    } catch {
      setError(
        'Não foi possível registrar o medicamento como não tomado.',
      )
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    load()
  }, [load])

  return {
    items,
    loading,
    saving,
    error,
    load,
    create,
    confirmTaken,
    confirmNotTaken,
  }
}

import { useCallback, useEffect, useMemo, useState } from 'react'
import { medicalAppointmentService } from '../services/medical-appointment.service'
import type {
  CreateMedicalAppointmentRequest,
  MedicalAppointment,
} from '../types/medical-appointment'

export function useMedicalAppointments(
  elderlyPersonId?: string,
) {
  const [items, setItems] = useState<MedicalAppointment[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!elderlyPersonId) {
      setItems([])
      return
    }

    setLoading(true)
    setError('')

    try {
      const result =
        await medicalAppointmentService.listByElderly({
          elderlyPersonId,
          page: 1,
          pageSize: 100,
          search,
        })

      setItems(result.items)
    } catch {
      setItems([])
      setError('Não foi possível carregar as consultas.')
    } finally {
      setLoading(false)
    }
  }, [elderlyPersonId, search])

  async function create(
    payload: CreateMedicalAppointmentRequest,
  ) {
    setSaving(true)
    setError('')

    try {
      await medicalAppointmentService.create(payload)
      await load()
    } catch {
      setError('Não foi possível cadastrar a consulta.')
      throw new Error('Erro ao cadastrar consulta.')
    } finally {
      setSaving(false)
    }
  }

  const upcomingAppointments = useMemo(() => {
    const now = new Date()

    return items
      .filter(
        (appointment) =>
          new Date(appointment.appointmentDate) >= now,
      )
      .sort(
        (a, b) =>
          new Date(a.appointmentDate).getTime() -
          new Date(b.appointmentDate).getTime(),
      )
  }, [items])

  const pastAppointments = useMemo(() => {
    const now = new Date()

    return items
      .filter(
        (appointment) =>
          new Date(appointment.appointmentDate) < now,
      )
      .sort(
        (a, b) =>
          new Date(b.appointmentDate).getTime() -
          new Date(a.appointmentDate).getTime(),
      )
  }, [items])

  useEffect(() => {
    load()
  }, [load])

  return {
    items,
    upcomingAppointments,
    pastAppointments,
    search,
    loading,
    saving,
    error,
    setSearch,
    load,
    create,
  }
}

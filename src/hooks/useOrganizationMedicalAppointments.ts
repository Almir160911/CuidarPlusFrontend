import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { medicalAppointmentService } from '../services/medical-appointment.service'
import { getApiErrorMessage } from '../utils/api-error'
import type { CreateMedicalAppointmentRequest, MedicalAppointment } from '../types/medical-appointment'

const DEFAULT_PAGE_SIZE = 20

export function useOrganizationMedicalAppointments() {
  const [items, setItems] =
    useState<MedicalAppointment[]>([])

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] =
    useState(DEFAULT_PAGE_SIZE)
  const [totalItems, setTotalItems] =
    useState(0)

  const [loading, setLoading] =
    useState(false)
  const [saving, setSaving] =
    useState(false)
  const [error, setError] =
    useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const result =
        await medicalAppointmentService.list({
          page,
          pageSize,
          search,
        })

      setItems(result.items)
      setTotalItems(result.totalItems)
    } catch (error) {
      setItems([])
      setTotalItems(0)
      setError(
        getApiErrorMessage(
          error,
          'Não foi possível carregar as consultas médicas.',
        ),
      )
    } finally {
      setLoading(false)
    }
  }, [
    page,
    pageSize,
    search,
  ])

  useEffect(() => {
    void load()
  }, [load])

  const upcomingAppointments = useMemo(
    () =>
      items.filter(
        (item) =>
          new Date(
            item.appointmentDate,
          ).getTime() >= Date.now(),
      ),
    [items],
  )

  const pastAppointments = useMemo(
    () =>
      items.filter(
        (item) =>
          new Date(
            item.appointmentDate,
          ).getTime() < Date.now(),
      ),
    [items],
  )

  const totalPages = Math.max(
    1,
    Math.ceil(
      totalItems / pageSize,
    ),
  )

  function changeSearch(
    value: string,
  ) {
    setSearch(value)
    setPage(1)
  }

  function changePageSize(
    value: number,
  ) {
    setPageSize(value)
    setPage(1)
  }

  async function update(id: string, payload: CreateMedicalAppointmentRequest) {
    setSaving(true)
    setError('')
    try {
      await medicalAppointmentService.update(id, payload)
      await load()
    } catch (error) {
      const message = getApiErrorMessage(error, 'Não foi possível alterar a consulta médica.')
      setError(message)
      throw new Error(message)
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    setSaving(true)
    setError('')
    try {
      await medicalAppointmentService.remove(id)
      await load()
    } catch (error) {
      const message = getApiErrorMessage(error, 'Não foi possível excluir a consulta médica.')
      setError(message)
      throw new Error(message)
    } finally {
      setSaving(false)
    }
  }

  return {
    items,
    upcomingAppointments,
    pastAppointments,

    search,
    page,
    pageSize,
    totalItems,
    totalPages,

    loading,
    saving,
    error,

    setPage,
    changeSearch,
    changePageSize,

    load,
    update,
    remove,
  }
}

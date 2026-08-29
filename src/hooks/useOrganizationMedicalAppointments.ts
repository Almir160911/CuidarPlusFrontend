import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { medicalAppointmentService } from '../services/medical-appointment.service'
import { getApiErrorMessage } from '../utils/api-error'
import type { MedicalAppointment } from '../types/medical-appointment'

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
    error,

    setPage,
    changeSearch,
    changePageSize,

    load,
  }
}
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { medicalAppointmentService } from '../services/medical-appointment.service'
import type {
  CreateMedicalAppointmentRequest,
  MedicalAppointment,
} from '../types/medical-appointment'

const DEFAULT_PAGE_SIZE = 20

export function useMedicalAppointments(
  elderlyPersonId?: string,
) {
  const [items, setItems] = useState<MedicalAppointment[]>([])
  const [selected, setSelected] =
    useState<MedicalAppointment | null>(null)

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] =
    useState(DEFAULT_PAGE_SIZE)
  const [totalItems, setTotalItems] = useState(0)

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [detailsLoading, setDetailsLoading] =
    useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!elderlyPersonId) {
      setItems([])
      setTotalItems(0)
      return
    }

    setLoading(true)
    setError('')

    try {
      const result =
        await medicalAppointmentService.listByElderly(
          elderlyPersonId,
          {
            page,
            pageSize,
            search,
          },
        )

      setItems(result.items)
      setTotalItems(result.totalItems)
    } catch {
      setItems([])
      setTotalItems(0)
      setError(
        'Não foi possível carregar as consultas médicas.',
      )
    } finally {
      setLoading(false)
    }
  }, [
    elderlyPersonId,
    page,
    pageSize,
    search,
  ])

  async function create(
    payload: CreateMedicalAppointmentRequest,
  ) {
    setSaving(true)
    setError('')

    try {
      const appointment =
        await medicalAppointmentService.create(payload)

      await load()

      return appointment
    } catch {
      setError(
        'Não foi possível cadastrar a consulta médica.',
      )

      throw new Error(
        'Erro ao cadastrar consulta médica.',
      )
    } finally {
      setSaving(false)
    }
  }

  async function loadDetails(id: string) {
    setDetailsLoading(true)
    setError('')

    try {
      const appointment =
        await medicalAppointmentService.getById(id)

      setSelected(appointment)

      return appointment
    } catch {
      setError(
        'Não foi possível carregar os detalhes da consulta.',
      )

      return null
    } finally {
      setDetailsLoading(false)
    }
  }

  function clearSelected() {
    setSelected(null)
  }

  function changeSearch(value: string) {
    setSearch(value)
    setPage(1)
  }

  function changePageSize(value: number) {
    setPageSize(value)
    setPage(1)
  }

  const sortedItems = useMemo(() => {
    return [...items].sort(
      (a, b) =>
        new Date(a.appointmentDate).getTime() -
        new Date(b.appointmentDate).getTime(),
    )
  }, [items])

  const upcomingAppointments = useMemo(() => {
    const now = Date.now()

    return sortedItems.filter(
      (appointment) =>
        new Date(appointment.appointmentDate).getTime() >=
        now,
    )
  }, [sortedItems])

  const pastAppointments = useMemo(() => {
    const now = Date.now()

    return sortedItems
      .filter(
        (appointment) =>
          new Date(
            appointment.appointmentDate,
          ).getTime() < now,
      )
      .reverse()
  }, [sortedItems])

  const nextAppointment =
    upcomingAppointments[0] ?? null

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / pageSize),
  )

  useEffect(() => {
    load()
  }, [load])

  return {
    items,
    selected,
    upcomingAppointments,
    pastAppointments,
    nextAppointment,

    search,
    page,
    pageSize,
    totalItems,
    totalPages,

    loading,
    saving,
    detailsLoading,
    error,

    setPage,
    setSelected,
    changeSearch,
    changePageSize,
    clearSelected,

    load,
    create,
    loadDetails,
  }
}
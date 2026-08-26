import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { calendarService } from '../services/calendar.service'
import { getApiErrorMessage } from '../utils/api-error'
import type {
  CalendarEvent,
  CalendarEventType,
} from '../types/calendar'

export type CalendarTypeFilter =
  | 'all'
  | CalendarEventType

function formatDateForApi(
  date: Date,
): string {
  const year = date.getFullYear()
  const month = String(
    date.getMonth() + 1,
  ).padStart(2, '0')
  const day = String(
    date.getDate(),
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getMonthPeriod(
  referenceDate: Date,
) {
  const firstDay = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    1,
  )

  const lastDay = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth() + 1,
    0,
  )

  return {
    from: formatDateForApi(firstDay),
    to: formatDateForApi(lastDay),
  }
}

export function useUnifiedCalendar() {
  const [referenceDate, setReferenceDate] =
    useState(() => new Date())

  const [items, setItems] =
    useState<CalendarEvent[]>([])

  const [search, setSearch] =
    useState('')

  const [typeFilter, setTypeFilter] =
    useState<CalendarTypeFilter>('all')

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const period = useMemo(
    () => getMonthPeriod(referenceDate),
    [referenceDate],
  )

  const load = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const result =
        await calendarService.get(
          period.from,
          period.to,
        )

      setItems(result.events)
    } catch (error) {
      setItems([])
      setError(
        getApiErrorMessage(
          error,
          'Não foi possível carregar o calendário.',
        ),
      )
    } finally {
      setLoading(false)
    }
  }, [period.from, period.to])

  useEffect(() => {
    void load()
  }, [load])

  const events = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase()

    return items.filter((event) => {
      const matchesType =
        typeFilter === 'all' ||
        event.type === typeFilter

      const searchableText = [
        event.title,
        event.elderlyPersonName,
        event.description ?? '',
        event.location ?? '',
      ]
        .join(' ')
        .toLowerCase()

      const matchesSearch =
        normalizedSearch.length === 0 ||
        searchableText.includes(
          normalizedSearch,
        )

      return matchesType && matchesSearch
    })
  }, [
    items,
    search,
    typeFilter,
  ])

  const appointmentCount = useMemo(
    () =>
      items.filter(
        (event) =>
          event.type === 'appointment',
      ).length,
    [items],
  )

  const medicationCount = useMemo(
    () =>
      items.filter(
        (event) =>
          event.type === 'medication',
      ).length,
    [items],
  )

  const pendingCount = useMemo(
    () =>
      items.filter((event) =>
        ['pending', 'scheduled'].includes(
          event.status.toLowerCase(),
        ),
      ).length,
    [items],
  )

  const lateCount = useMemo(
    () =>
      items.filter(
        (event) =>
          event.status.toLowerCase() ===
          'late',
      ).length,
    [items],
  )

  function previousMonth() {
    setReferenceDate((current) =>
      new Date(
        current.getFullYear(),
        current.getMonth() - 1,
        1,
      ),
    )
  }

  function nextMonth() {
    setReferenceDate((current) =>
      new Date(
        current.getFullYear(),
        current.getMonth() + 1,
        1,
      ),
    )
  }

  function goToCurrentMonth() {
    setReferenceDate(new Date())
  }

  return {
    referenceDate,
    events,

    search,
    typeFilter,

    loading,
    error,

    appointmentCount,
    medicationCount,
    pendingCount,
    lateCount,

    setSearch,
    setTypeFilter,

    previousMonth,
    nextMonth,
    goToCurrentMonth,

    load,
  }
}

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { alertService } from '../services/alert.service'
import { getApiErrorMessage } from '../utils/api-error'
import type { Alert } from '../types/alert'

const DEFAULT_PAGE_SIZE = 20

export type AlertReadFilter =
  | 'all'
  | 'read'
  | 'unread'

export function useOrganizationAlerts() {
  const [items, setItems] =
    useState<Alert[]>([])

  const [search, setSearch] =
    useState('')

  const [severity, setSeverity] =
    useState('')

  const [readFilter, setReadFilter] =
    useState<AlertReadFilter>('all')

  const [fromDate, setFromDate] =
    useState('')

  const [toDate, setToDate] =
    useState('')

  const [page, setPage] =
    useState(1)

  const [pageSize, setPageSize] =
    useState(DEFAULT_PAGE_SIZE)

  const [totalItems, setTotalItems] =
    useState(0)

  const [loading, setLoading] =
    useState(false)

  const [updatingId, setUpdatingId] =
    useState('')

  const [error, setError] =
    useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const result =
        await alertService.list({
          page,
          pageSize,
          search,
          severity,
          isRead:
            readFilter === 'all'
              ? undefined
              : readFilter === 'read',
          fromDate: fromDate || undefined,
          toDate: toDate || undefined,
        })

      setItems(result.items)
      setTotalItems(result.totalItems)
    } catch (error) {
      setItems([])
      setTotalItems(0)
      setError(
        getApiErrorMessage(
          error,
          'Não foi possível carregar os alertas da organização.',
        ),
      )
    } finally {
      setLoading(false)
    }
  }, [
    page,
    pageSize,
    search,
    severity,
    readFilter,
    fromDate,
    toDate,
  ])

  async function markAsRead(
    id: string,
  ) {
    setUpdatingId(id)
    setError('')

    try {
      await alertService.markAsRead(id)

      setItems((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                isRead: true,
                readAt:
                  new Date().toISOString(),
              }
            : item,
        ),
      )
    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          'Não foi possível marcar o alerta como lido.',
        ),
      )
    } finally {
      setUpdatingId('')
    }
  }

  function changeSearch(
    value: string,
  ) {
    setSearch(value)
    setPage(1)
  }

  function changeSeverity(
    value: string,
  ) {
    setSeverity(value)
    setPage(1)
  }

  function changeReadFilter(
    value: AlertReadFilter,
  ) {
    setReadFilter(value)
    setPage(1)
  }

  function changeFromDate(
    value: string,
  ) {
    setFromDate(value)
    setPage(1)
  }

  function changeToDate(
    value: string,
  ) {
    setToDate(value)
    setPage(1)
  }

  function changePageSize(
    value: number,
  ) {
    setPageSize(value)
    setPage(1)
  }

  function clearFilters() {
    setSearch('')
    setSeverity('')
    setReadFilter('all')
    setFromDate('')
    setToDate('')
    setPage(1)
  }

  const unreadCount = useMemo(
    () =>
      items.filter(
        (item) => !item.isRead,
      ).length,
    [items],
  )

  const highCount = useMemo(
    () =>
      items.filter(
        (item) =>
          item.severity
            .toLowerCase() === 'high',
      ).length,
    [items],
  )

  const totalPages = Math.max(
    1,
    Math.ceil(
      totalItems / pageSize,
    ),
  )

  useEffect(() => {
    void load()
  }, [load])

  return {
    items,
    unreadCount,
    highCount,

    search,
    severity,
    readFilter,
    fromDate,
    toDate,

    page,
    pageSize,
    totalItems,
    totalPages,

    loading,
    updatingId,
    error,

    setPage,
    changeSearch,
    changeSeverity,
    changeReadFilter,
    changeFromDate,
    changeToDate,
    changePageSize,
    clearFilters,

    load,
    markAsRead,
  }
}
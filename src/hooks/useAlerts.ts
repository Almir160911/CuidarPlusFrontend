import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { alertService } from '../services/alert.service'
import type { Alert } from '../types/alert'

const DEFAULT_PAGE_SIZE = 20

export function useAlerts(elderlyPersonId?: string) {
  const [items, setItems] = useState<Alert[]>([])
  const [search, setSearch] = useState('')
  const [severity, setSeverity] = useState('')
  const [readFilter, setReadFilter] = useState<
    'all' | 'read' | 'unread'
  >('all')

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] =
    useState(DEFAULT_PAGE_SIZE)
  const [totalItems, setTotalItems] = useState(0)

  const [loading, setLoading] = useState(false)
  const [updatingId, setUpdatingId] = useState('')
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
      const result = await alertService.listByElderly({
        elderlyPersonId,
        page,
        pageSize,
        search,
        severity,
        isRead:
          readFilter === 'all'
            ? undefined
            : readFilter === 'read',
      })

      setItems(result.items)
      setTotalItems(result.totalItems)
    } catch {
      setItems([])
      setTotalItems(0)
      setError('Não foi possível carregar os alertas.')
    } finally {
      setLoading(false)
    }
  }, [
    elderlyPersonId,
    page,
    pageSize,
    search,
    severity,
    readFilter,
  ])

  async function markAsRead(id: string) {
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
                readAt: new Date().toISOString(),
              }
            : item,
        ),
      )
    } catch {
      setError(
        'Não foi possível marcar o alerta como lido.',
      )
    } finally {
      setUpdatingId('')
    }
  }

  function changeSearch(value: string) {
    setSearch(value)
    setPage(1)
  }

  function changeSeverity(value: string) {
    setSeverity(value)
    setPage(1)
  }

  function changeReadFilter(
    value: 'all' | 'read' | 'unread',
  ) {
    setReadFilter(value)
    setPage(1)
  }

  function changePageSize(value: number) {
    setPageSize(value)
    setPage(1)
  }

  const unreadCount = useMemo(
    () => items.filter((item) => !item.isRead).length,
    [items],
  )

  const highCount = useMemo(
    () =>
      items.filter(
        (item) =>
          item.severity.toLowerCase() === 'high',
      ).length,
    [items],
  )

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / pageSize),
  )

  useEffect(() => {
    load()
  }, [load])

  return {
    items,
    unreadCount,
    highCount,

    search,
    severity,
    readFilter,

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
    changePageSize,

    load,
    markAsRead,
  }
}

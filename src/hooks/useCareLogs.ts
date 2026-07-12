import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { careLogService } from '../services/care-log.service'
import type {
  CareLog,
  CreateCareLogRequest,
} from '../types/care-log'

const DEFAULT_PAGE_SIZE = 20

export function useCareLogs(
  elderlyPersonId?: string,
) {
  const [items, setItems] = useState<CareLog[]>([])
  const [selected, setSelected] =
    useState<CareLog | null>(null)

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] =
    useState(DEFAULT_PAGE_SIZE)
  const [totalItems, setTotalItems] = useState(0)

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
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
      const result = await careLogService.listByElderly(
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
        'Não foi possível carregar o diário de cuidados.',
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
    payload: CreateCareLogRequest,
  ) {
    setSaving(true)
    setError('')

    try {
      const careLog =
        await careLogService.create(payload)

      await load()

      return careLog
    } catch {
      setError(
        'Não foi possível registrar o cuidado.',
      )

      throw new Error(
        'Erro ao registrar cuidado.',
      )
    } finally {
      setSaving(false)
    }
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
        new Date(b.registeredAt).getTime() -
        new Date(a.registeredAt).getTime(),
    )
  }, [items])

  const latest = sortedItems[0] ?? null

  const totalFalls = useMemo(
    () => items.filter((item) => item.hadFall).length,
    [items],
  )

  const totalPainReports = useMemo(
    () => items.filter((item) => item.hadPain).length,
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
    items: sortedItems,
    selected,
    latest,

    totalFalls,
    totalPainReports,

    search,
    page,
    pageSize,
    totalItems,
    totalPages,

    loading,
    saving,
    error,

    setPage,
    setSelected,
    changeSearch,
    changePageSize,

    load,
    create,
  }
}

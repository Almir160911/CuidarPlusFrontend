import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { vitalSignService } from '../services/vital-sign.service'
import type { VitalSign } from '../types/vital-sign'

const DEFAULT_PAGE_SIZE = 20

export function useOrganizationVitalSigns() {
  const [items, setItems] = useState<VitalSign[]>([])

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] =
    useState(DEFAULT_PAGE_SIZE)
  const [totalItems, setTotalItems] = useState(0)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const result =
        await vitalSignService.listByOrganization({
          page,
          pageSize,
          search,
        })

      setItems(result.items)
      setTotalItems(result.totalItems)
    } catch {
      setItems([])
      setTotalItems(0)

      setError(
        'Não foi possível carregar os sinais vitais.',
      )
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, search])

  function changeSearch(value: string) {
    setSearch(value)
    setPage(1)
  }

  function changePageSize(value: number) {
    setPageSize(value)
    setPage(1)
  }

  const sortedItems = useMemo(
    () =>
      [...items].sort(
        (a, b) =>
          new Date(b.registeredAt).getTime() -
          new Date(a.registeredAt).getTime(),
      ),
    [items],
  )

  const latest = sortedItems[0] ?? null

  const alteredOxygen = useMemo(
    () =>
      items.filter(
        (item) =>
          item.oxygenSaturation != null &&
          item.oxygenSaturation < 95,
      ).length,
    [items],
  )

  const feverRecords = useMemo(
    () =>
      items.filter(
        (item) =>
          item.temperature != null &&
          item.temperature >= 37.8,
      ).length,
    [items],
  )

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / pageSize),
  )

  useEffect(() => {
    void load()
  }, [load])

  return {
    items: sortedItems,
    latest,
    alteredOxygen,
    feverRecords,

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

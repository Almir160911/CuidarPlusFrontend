import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { medicationService } from '../services/medication.service'
import type { Medication } from '../types/medication'

const DEFAULT_PAGE_SIZE = 20

export function useOrganizationMedications() {
  const [items, setItems] = useState<Medication[]>([])
  const [selected, setSelected] =
    useState<Medication | null>(null)

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
        await medicationService.listByOrganization({
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
        'Não foi possível carregar os medicamentos.',
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

  const activeItems = useMemo(
    () => items.filter((item) => item.isActive),
    [items],
  )

  const inactiveItems = useMemo(
    () => items.filter((item) => !item.isActive),
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
    items,
    selected,
    activeItems,
    inactiveItems,
    search,
    page,
    pageSize,
    totalItems,
    totalPages,
    loading,
    error,
    setPage,
    setSelected,
    changeSearch,
    changePageSize,
    load,
  }
}

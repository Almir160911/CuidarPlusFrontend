import { useCallback, useEffect, useState } from 'react'
import { elderlyService } from '../services/elderly.service'
import type {
  CreateElderlyPersonRequest,
  ElderlyListResult,
  ElderlyPerson,
} from '../types/elderly'

export function useElderly() {
  const [items, setItems] = useState<ElderlyPerson[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<ElderlyPerson | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const result: ElderlyListResult = await elderlyService.list({
        page,
        pageSize,
        search,
      })

      setItems(result.items)
      setTotalItems(result.totalItems)
    } catch {
      setError('Não foi possível carregar os idosos.')
      setItems([])
      setTotalItems(0)
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, search])

  async function create(payload: CreateElderlyPersonRequest) {
    setSaving(true)
    setError('')

    try {
      await elderlyService.create(payload)
      await load()
    } catch {
      setError('Não foi possível cadastrar o idoso.')
      throw new Error('Erro ao cadastrar idoso.')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    load()
  }, [load])

  return {
    items,
    totalItems,
    page,
    pageSize,
    search,
    selected,
    loading,
    saving,
    error,
    setPage,
    setPageSize,
    setSearch,
    setSelected,
    load,
    create,
  }
}
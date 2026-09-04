import { useCallback, useEffect, useState } from 'react'
import { elderlyService } from '../services/elderly.service'
import { getApiErrorMessage } from '../utils/api-error'
import type {
  CreateElderlyPersonRequest,
  ElderlyListResult,
  ElderlyPerson,
  UpdateElderlyPersonRequest,
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
    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          'Não foi possível carregar as pessoas assistidas.',
        ),
      )
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
    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          'Não foi possível cadastrar a pessoa assistida.',
        ),
      )
      throw new Error(
        getApiErrorMessage(
          error,
          'Não foi possível cadastrar a pessoa assistida.',
        ),
      )
    } finally {
      setSaving(false)
    }
  }

  async function update(
    id: string,
    payload: UpdateElderlyPersonRequest,
  ) {
    setSaving(true)
    setError('')

    try {
      await elderlyService.update(id, payload)
      await load()
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        'Não foi possível atualizar o cadastro.',
      )
      setError(message)
      throw new Error(message)
    } finally {
      setSaving(false)
    }
  }

  async function setStatus(id: string, isActive: boolean) {
    setSaving(true)
    setError('')

    try {
      await elderlyService.setStatus(id, isActive)
      await load()
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        isActive
          ? 'Não foi possível reativar a pessoa assistida.'
          : 'Não foi possível arquivar a pessoa assistida.',
      )
      setError(message)
      throw new Error(message)
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
    update,
    setStatus,
  }
}

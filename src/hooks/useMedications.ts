import { useCallback, useEffect, useState } from 'react'
import { medicationService } from '../services/medication.service'
import type {
  CreateMedicationRequest,
  Medication,
  MedicationListResult,
} from '../types/medication'

export function useMedications(elderlyPersonId?: string) {
  const [items, setItems] = useState<Medication[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Medication | null>(null)
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
      const result: MedicationListResult = await medicationService.listByElderly({
        elderlyPersonId,
        page,
        pageSize,
        search,
      })

      setItems(result.items)
      setTotalItems(result.totalItems)
    } catch {
      setError('Não foi possível carregar os medicamentos.')
      setItems([])
      setTotalItems(0)
    } finally {
      setLoading(false)
    }
  }, [elderlyPersonId, page, pageSize, search])

  async function create(payload: CreateMedicationRequest) {
    setSaving(true)
    setError('')

    try {
      await medicationService.create(payload)
      await load()
    } catch {
      setError('Não foi possível cadastrar o medicamento.')
      throw new Error('Erro ao cadastrar medicamento.')
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
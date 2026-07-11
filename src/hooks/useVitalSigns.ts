import { useCallback, useEffect, useMemo, useState } from 'react'
import { vitalSignService } from '../services/vital-sign.service'
import type {
  CreateVitalSignRequest,
  VitalSign,
} from '../types/vital-sign'

export function useVitalSigns(elderlyPersonId?: string) {
  const [items, setItems] = useState<VitalSign[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!elderlyPersonId) {
      setItems([])
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await vitalSignService.listByElderly({
        elderlyPersonId,
      })

      setItems(result.items)
    } catch {
      setItems([])
      setError('Não foi possível carregar os sinais vitais.')
    } finally {
      setLoading(false)
    }
  }, [elderlyPersonId])

  async function create(payload: CreateVitalSignRequest) {
    setSaving(true)
    setError('')

    try {
      await vitalSignService.create(payload)
      await load()
    } catch {
      setError('Não foi possível registrar os sinais vitais.')
      throw new Error('Erro ao registrar sinais vitais.')
    } finally {
      setSaving(false)
    }
  }

  const latest = useMemo(() => {
    return [...items].sort(
      (a, b) =>
        new Date(b.registeredAt).getTime() -
        new Date(a.registeredAt).getTime(),
    )[0]
  }, [items])

  useEffect(() => {
    load()
  }, [load])

  return {
    items,
    latest,
    loading,
    saving,
    error,
    load,
    create,
  }
}

import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { authService } from '../services/auth.service'
import { careShiftService } from '../services/care-shift.service'
import { elderlyService } from '../services/elderly.service'
import type { CareShift, CompleteCareShiftRequest, CreateCareShiftRequest, CreateCaregiverRequest, OrganizationUser } from '../types/care-shift'
import type { ElderlyPerson } from '../types/elderly'

function message(error: unknown) {
  if (axios.isAxiosError(error)) return error.response?.data?.errors?.[0] ?? error.response?.data?.message ?? 'Não foi possível concluir a operação.'
  return error instanceof Error ? error.message : 'Não foi possível concluir a operação.'
}

export function useCareShifts() {
  const role = authService.getUser()?.role?.toLowerCase()
  const isAdmin = role === 'familyadmin' || role === 'systemadmin'
  const [items, setItems] = useState<CareShift[]>([])
  const [people, setPeople] = useState<ElderlyPerson[]>([])
  const [caregivers, setCaregivers] = useState<OrganizationUser[]>([])
  const [selectedPersonId, setSelectedPersonId] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async (personId?: string) => {
    setLoading(true); setError('')
    try {
      if (!isAdmin) {
        setItems(await careShiftService.listMine())
        return
      }
      const [personResult, users] = await Promise.all([
        elderlyService.list({ page: 1, pageSize: 100 }), careShiftService.listUsers(),
      ])
      setPeople(personResult.items.filter((x) => x.isActive !== false))
      setCaregivers(users)
      const chosen = personId || selectedPersonId || personResult.items[0]?.id || ''
      setSelectedPersonId(chosen)
      setItems(chosen ? await careShiftService.listByElderly(chosen) : [])
    } catch (e) { setError(message(e)) } finally { setLoading(false) }
  }, [isAdmin, selectedPersonId])

  useEffect(() => { void load() }, [])

  async function run(action: () => Promise<unknown>) {
    setSaving(true); setError('')
    try { await action(); await load(selectedPersonId) }
    catch (e) { setError(message(e)); throw e }
    finally { setSaving(false) }
  }

  return {
    items, people, caregivers, selectedPersonId, loading, saving, error, isAdmin,
    selectPerson: (id: string) => { setSelectedPersonId(id); void load(id) },
    create: (payload: CreateCareShiftRequest) => run(() => careShiftService.create(payload)),
    start: (id: string) => run(() => careShiftService.start(id)),
    complete: (id: string, payload: CompleteCareShiftRequest) => run(() => careShiftService.complete(id, payload)),
    cancel: (id: string) => run(() => careShiftService.cancel(id)),
    createCaregiver: async (payload: CreateCaregiverRequest) => {
      setSaving(true); setError('')
      try {
        const created = await careShiftService.createCaregiver(payload)
        setCaregivers((current) => [...current, created].sort((a, b) => a.fullName.localeCompare(b.fullName)))
        return created
      } catch (e) { setError(message(e)); throw e }
      finally { setSaving(false) }
    },
    refresh: () => load(selectedPersonId),
  }
}

import { useCallback, useEffect, useState } from 'react'
import { dailyAgendaService } from '../services/daily-agenda.service'
import type { DailyAgenda } from '../types/daily-agenda'

interface UseDailyAgendaResult {
  agenda: DailyAgenda | null
  selectedDate: Date
  loading: boolean
  updatingMedicationId: string | null
  error: string | null
  setSelectedDate: (date: Date) => void
  reload: () => Promise<void>
  confirmTaken: (
    administrationId: string,
    notes?: string,
  ) => Promise<boolean>
  confirmNotTaken: (
    administrationId: string,
    notes?: string,
  ) => Promise<boolean>
}

function getErrorMessage(error: unknown): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  ) {
    const responseError = error as {
      response?: {
        data?: {
          message?: string
        }
      }
    }

    return (
      responseError.response?.data?.message ??
      'Não foi possível carregar a agenda diária.'
    )
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Ocorreu um erro inesperado.'
}

export function useDailyAgenda(
  elderlyPersonId: string | undefined,
): UseDailyAgendaResult {
  const [agenda, setAgenda] = useState<DailyAgenda | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [loading, setLoading] = useState(false)
  const [updatingMedicationId, setUpdatingMedicationId] =
    useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async (): Promise<void> => {
    if (!elderlyPersonId) {
      setAgenda(null)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const result = await dailyAgendaService.getByElderlyPerson(
        elderlyPersonId,
        selectedDate,
      )

      setAgenda(result)
    } catch (loadError) {
      setAgenda(null)
      setError(getErrorMessage(loadError))
    } finally {
      setLoading(false)
    }
  }, [elderlyPersonId, selectedDate])

  useEffect(() => {
    void reload()
  }, [reload])

  const confirmTaken = useCallback(
    async (
      administrationId: string,
      notes?: string,
    ): Promise<boolean> => {
      try {
        setUpdatingMedicationId(administrationId)
        setError(null)

        await dailyAgendaService.confirmMedicationTaken(
          administrationId,
          {
            notes: notes?.trim() || null,
          },
        )

        await reload()

        return true
      } catch (updateError) {
        setError(getErrorMessage(updateError))
        return false
      } finally {
        setUpdatingMedicationId(null)
      }
    },
    [reload],
  )

  const confirmNotTaken = useCallback(
    async (
      administrationId: string,
      notes?: string,
    ): Promise<boolean> => {
      try {
        setUpdatingMedicationId(administrationId)
        setError(null)

        await dailyAgendaService.confirmMedicationNotTaken(
          administrationId,
          {
            notes: notes?.trim() || null,
          },
        )

        await reload()

        return true
      } catch (updateError) {
        setError(getErrorMessage(updateError))
        return false
      } finally {
        setUpdatingMedicationId(null)
      }
    },
    [reload],
  )

  return {
    agenda,
    selectedDate,
    loading,
    updatingMedicationId,
    error,
    setSelectedDate,
    reload,
    confirmTaken,
    confirmNotTaken,
  }
}

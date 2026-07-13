import { api } from './api'
import type {
  ConfirmMedicationScheduleRequest,
  CreateMedicationScheduleRequest,
  MedicationSchedule,
  MedicationScheduleListResult,
} from '../types/medication-schedule'

interface ApiEnvelope<T> {
  success?: boolean
  message?: string
  data?: T
}

interface ApiPagedResponse<T> {
  items?: T[]
  totalItems?: number
}

function unwrapData(data: unknown): unknown {
  if (!data || typeof data !== 'object') {
    return data
  }

  const envelope = data as ApiEnvelope<unknown>

  return envelope.data ?? data
}

function normalizeList(
  responseData: unknown,
): MedicationScheduleListResult {
  const data = unwrapData(responseData)

  if (Array.isArray(data)) {
    return {
      items: data as MedicationSchedule[],
      totalItems: data.length,
    }
  }

  if (!data || typeof data !== 'object') {
    return {
      items: [],
      totalItems: 0,
    }
  }

  const response = data as ApiPagedResponse<MedicationSchedule>
  const items = Array.isArray(response.items)
    ? response.items
    : []

  return {
    items,
    totalItems: response.totalItems ?? items.length,
  }
}

function normalizeSchedule(
  responseData: unknown,
): MedicationSchedule {
  const data = unwrapData(responseData)

  return data as MedicationSchedule
}

export const medicationScheduleService = {
  async listByMedication(
    medicationId: string,
  ): Promise<MedicationScheduleListResult> {
    const response = await api.get(
      `/api/medication-schedules/medication/${medicationId}`,
      {
        params: {
          Page: 1,
          PageSize: 100,
        },
      },
    )

    return normalizeList(response.data)
  },

  async create(
    payload: CreateMedicationScheduleRequest,
  ): Promise<MedicationSchedule> {
    const response = await api.post(
      '/api/medication-schedules',
      payload,
    )

    return normalizeSchedule(response.data)
  },

  async confirmTaken(
    id: string,
    payload: ConfirmMedicationScheduleRequest,
  ): Promise<MedicationSchedule> {
    const response = await api.patch(
      `/api/medication-schedules/${id}/taken`,
      payload,
    )

    return normalizeSchedule(response.data)
  },

  async confirmNotTaken(
    id: string,
    payload: ConfirmMedicationScheduleRequest,
  ): Promise<MedicationSchedule> {
    const response = await api.patch(
      `/api/medication-schedules/${id}/not-taken`,
      payload,
    )

    return normalizeSchedule(response.data)
  },
}
import { api } from './api'
import type {
  ConfirmMedicationScheduleRequest,
  CreateMedicationScheduleRequest,
  MedicationSchedule,
  MedicationScheduleListResult,
} from '../types/medication-schedule'

function normalizeList(data: unknown): MedicationScheduleListResult {
  if (Array.isArray(data)) {
    return {
      items: data as MedicationSchedule[],
      totalItems: data.length,
    }
  }

  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>

    const items =
      Array.isArray(obj.items)
        ? obj.items
        : Array.isArray(obj.data)
          ? obj.data
          : Array.isArray(obj.results)
            ? obj.results
            : []

    const totalItems =
      typeof obj.totalItems === 'number'
        ? obj.totalItems
        : typeof obj.total === 'number'
          ? obj.total
          : items.length

    return {
      items: items as MedicationSchedule[],
      totalItems,
    }
  }

  return {
    items: [],
    totalItems: 0,
  }
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
    const response = await api.post<MedicationSchedule>(
      '/api/medication-schedules',
      payload,
    )

    return response.data
  },

  async confirmTaken(
    id: string,
    payload: ConfirmMedicationScheduleRequest,
  ): Promise<MedicationSchedule> {
    const response = await api.patch<MedicationSchedule>(
      `/api/medication-schedules/${id}/taken`,
      payload,
    )

    return response.data
  },

  async confirmNotTaken(
    id: string,
    payload: ConfirmMedicationScheduleRequest,
  ): Promise<MedicationSchedule> {
    const response = await api.patch<MedicationSchedule>(
      `/api/medication-schedules/${id}/not-taken`,
      payload,
    )

    return response.data
  },
}
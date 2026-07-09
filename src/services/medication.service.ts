import { api } from './api'
import type {
  CreateMedicationRequest,
  Medication,
  MedicationListParams,
  MedicationListResult,
} from '../types/medication'

function normalizeMedicationListResponse(
  data: unknown,
  page: number,
  pageSize: number,
): MedicationListResult {
  if (Array.isArray(data)) {
    return {
      items: data as Medication[],
      totalItems: data.length,
      page,
      pageSize,
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
      items: items as Medication[],
      totalItems,
      page,
      pageSize,
    }
  }

  return {
    items: [],
    totalItems: 0,
    page,
    pageSize,
  }
}

export const medicationService = {
  async listByElderly(params: MedicationListParams): Promise<MedicationListResult> {
    const page = params.page ?? 1
    const pageSize = params.pageSize ?? 10

    const response = await api.get(`/api/medications/elderly/${params.elderlyPersonId}`, {
      params: {
        Page: page,
        PageSize: pageSize,
        Search: params.search || undefined,
      },
    })

    return normalizeMedicationListResponse(response.data, page, pageSize)
  },

  async getById(id: string): Promise<Medication> {
    const response = await api.get<Medication>(`/api/medications/${id}`)
    return response.data
  },

  async create(payload: CreateMedicationRequest): Promise<Medication> {
    const response = await api.post<Medication>('/api/medications', payload)
    return response.data
  },
}
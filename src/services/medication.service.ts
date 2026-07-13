import { api } from './api'
import type {
  CreateMedicationRequest,
  Medication,
  MedicationListParams,
  MedicationListResult,
} from '../types/medication'

interface ApiEnvelope<T> {
  success?: boolean
  message?: string
  data?: T
}

interface ApiPagedResponse<T> {
  items?: T[]
  totalItems?: number
  page?: number
  pageNumber?: number
  pageSize?: number
  totalPages?: number
}

function unwrapData(data: unknown): unknown {
  if (!data || typeof data !== 'object') {
    return data
  }

  const envelope = data as ApiEnvelope<unknown>

  return envelope.data ?? data
}

function normalizeMedicationListResponse(
  responseData: unknown,
  requestedPage: number,
  requestedPageSize: number,
): MedicationListResult {
  const data = unwrapData(responseData)

  if (Array.isArray(data)) {
    return {
      items: data as Medication[],
      totalItems: data.length,
      page: requestedPage,
      pageSize: requestedPageSize,
    }
  }

  if (!data || typeof data !== 'object') {
    return {
      items: [],
      totalItems: 0,
      page: requestedPage,
      pageSize: requestedPageSize,
    }
  }

  const response = data as ApiPagedResponse<Medication>
  const items = Array.isArray(response.items)
    ? response.items
    : []

  return {
    items,
    totalItems: response.totalItems ?? items.length,
    page: response.page ?? response.pageNumber ?? requestedPage,
    pageSize: response.pageSize ?? requestedPageSize,
  }
}

function normalizeMedicationResponse(
  responseData: unknown,
): Medication {
  const data = unwrapData(responseData)

  return data as Medication
}

export const medicationService = {
  async listByElderly(
    params: MedicationListParams,
  ): Promise<MedicationListResult> {
    const page = params.page ?? 1
    const pageSize = params.pageSize ?? 10

    const response = await api.get(
      `/api/medications/elderly/${params.elderlyPersonId}`,
      {
        params: {
          Page: page,
          PageSize: pageSize,
          Search: params.search?.trim() || undefined,
        },
      },
    )

    return normalizeMedicationListResponse(
      response.data,
      page,
      pageSize,
    )
  },

  async getById(id: string): Promise<Medication> {
    const response = await api.get(
      `/api/medications/${id}`,
    )

    return normalizeMedicationResponse(response.data)
  },

  async create(
    payload: CreateMedicationRequest,
  ): Promise<Medication> {
    const response = await api.post(
      '/api/medications',
      payload,
    )

    return normalizeMedicationResponse(response.data)
  },
}
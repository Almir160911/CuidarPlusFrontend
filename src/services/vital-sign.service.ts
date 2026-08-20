
import { api } from './api'

import type {
  CreateVitalSignRequest,
  VitalSign,
  VitalSignListParams,
  VitalSignListResult,
} from '../types/vital-sign'

interface ApiEnvelope<T> {
  success?: boolean
  message?: string
  data?: T
}

interface ApiPagedResponse<T> {
  items?: T[]
  totalItems?: number
  total?: number
  page?: number
  pageNumber?: number
  pageSize?: number
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
): VitalSignListResult {
  const data = unwrapData(responseData)

  if (Array.isArray(data)) {
    return {
      items: data as VitalSign[],
      totalItems: data.length,
    }
  }

  if (!data || typeof data !== 'object') {
    return {
      items: [],
      totalItems: 0,
    }
  }

  const response =
    data as ApiPagedResponse<VitalSign>

  const items =
    Array.isArray(response.items)
      ? response.items
      : []

  return {
    items,
    totalItems:
      response.totalItems ??
      response.total ??
      items.length,
  }
}

function normalizeItem(
  responseData: unknown,
): VitalSign {
  return unwrapData(responseData) as VitalSign
}

export const vitalSignService = {
  async listByElderly(
    params: VitalSignListParams,
  ): Promise<VitalSignListResult> {
    const response = await api.get(
      `/api/vital-signs/elderly/${params.elderlyPersonId}`,
      {
        params: {
          Page: params.page ?? 1,
          PageSize: params.pageSize ?? 100,
          Search:
            params.search?.trim() || undefined,
          FromDate:
            params.fromDate || undefined,
          ToDate:
            params.toDate || undefined,
        },
      },
    )

    return normalizeList(response.data)
  },

  async listByOrganization(
    params: Omit<
      VitalSignListParams,
      'elderlyPersonId'
    > = {},
  ): Promise<VitalSignListResult> {
    const response = await api.get(
      '/api/vital-signs',
      {
        params: {
          Page: params.page ?? 1,
          PageSize: params.pageSize ?? 20,
          Search:
            params.search?.trim() || undefined,
          FromDate:
            params.fromDate || undefined,
          ToDate:
            params.toDate || undefined,
        },
      },
    )

    return normalizeList(response.data)
  },

  async create(
    payload: CreateVitalSignRequest,
  ): Promise<VitalSign> {
    const response = await api.post(
      '/api/vital-signs',
      payload,
    )

    return normalizeItem(response.data)
  },
}

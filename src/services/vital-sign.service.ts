import { api } from './api'
import type {
  CreateVitalSignRequest,
  VitalSign,
  VitalSignListParams,
  VitalSignListResult,
} from '../types/vital-sign'

function normalizeList(data: unknown): VitalSignListResult {
  if (Array.isArray(data)) {
    return {
      items: data as VitalSign[],
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
      items: items as VitalSign[],
      totalItems,
    }
  }

  return {
    items: [],
    totalItems: 0,
  }
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
          Search: params.search || undefined,
          FromDate: params.fromDate || undefined,
          ToDate: params.toDate || undefined,
        },
      },
    )

    return normalizeList(response.data)
  },

  async create(
    payload: CreateVitalSignRequest,
  ): Promise<VitalSign> {
    const response = await api.post<VitalSign>(
      '/api/vital-signs',
      payload,
    )

    return response.data
  },
}

import { api } from './api'
import type {
  Alert,
  AlertListParams,
  AlertListResult,
} from '../types/alert'

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
}

function unwrapData(value: unknown): unknown {
  if (!value || typeof value !== 'object') {
    return value
  }

  const envelope = value as ApiEnvelope<unknown>

  return envelope.data ?? value
}

function normalizeList(
  value: unknown,
  requestedPage: number,
  requestedPageSize: number,
): AlertListResult {
  const data = unwrapData(value)

  if (Array.isArray(data)) {
    return {
      items: data as Alert[],
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

  const response = data as ApiPagedResponse<Alert>
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

export const alertService = {
  async listByElderly(
    params: AlertListParams,
  ): Promise<AlertListResult> {
    const page = params.page ?? 1
    const pageSize = params.pageSize ?? 20

    const response = await api.get(
      `/api/alerts/elderly/${params.elderlyPersonId}`,
      {
        params: {
          Page: page,
          PageSize: pageSize,
          Search: params.search?.trim() || undefined,
          Severity: params.severity || undefined,
          IsRead: params.isRead,
        },
      },
    )

    return normalizeList(
      response.data,
      page,
      pageSize,
    )
  },

    async markAsRead(id: string): Promise<void> {
    await api.patch(`/api/alerts/${id}/read`)
    },

}
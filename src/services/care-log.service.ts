import { api } from './api'
import type {
  CareLog,
  CareLogFilters,
  CareLogListResult,
  CreateCareLogRequest,
} from '../types/care-log'

interface ApiPagedResponse<T> {
  items?: T[]
  data?: T[]
  results?: T[]
  totalItems?: number
  total?: number
  page?: number
  pageNumber?: number
  pageSize?: number
}

function normalizeListResponse(
  data: unknown,
  requestedPage: number,
  requestedPageSize: number,
): CareLogListResult {
  if (Array.isArray(data)) {
    return {
      items: data as CareLog[],
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

  const response = data as ApiPagedResponse<CareLog>

  const items =
    response.items ??
    response.data ??
    response.results ??
    []

  return {
    items,
    totalItems:
      response.totalItems ??
      response.total ??
      items.length,
    page:
      response.page ??
      response.pageNumber ??
      requestedPage,
    pageSize:
      response.pageSize ??
      requestedPageSize,
  }
}

export const careLogService = {
  async listByElderly(
    elderlyPersonId: string,
    filters: CareLogFilters = {},
  ): Promise<CareLogListResult> {
    const page = filters.page ?? 1
    const pageSize = filters.pageSize ?? 20

    const response = await api.get(
      `/api/care-logs/elderly/${elderlyPersonId}`,
      {
        params: {
          Page: page,
          PageSize: pageSize,
          Search: filters.search?.trim() || undefined,
          FromDate: filters.fromDate || undefined,
          ToDate: filters.toDate || undefined,
          Mood: filters.mood?.trim() || undefined,
          HadPain: filters.hadPain,
          HadFall: filters.hadFall,
        },
      },
    )

    return normalizeListResponse(
      response.data,
      page,
      pageSize,
    )
  },

  async create(
    payload: CreateCareLogRequest,
  ): Promise<CareLog> {
    const response = await api.post<CareLog>(
      '/api/care-logs',
      payload,
    )

    return response.data
  },
}

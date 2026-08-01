import { api } from './api'
import type {
  CreateElderlyPersonRequest,
  ElderlyListParams,
  ElderlyListResult,
  ElderlyPerson,
} from '../types/elderly'

function normalizeListResponse(
  data: unknown,
  page: number,
  pageSize: number,
): ElderlyListResult {
  if (Array.isArray(data)) {
    return {
      items: data as ElderlyPerson[],
      totalItems: data.length,
      page,
      pageSize,
    }
  }

  if (!data || typeof data !== 'object') {
    return {
      items: [],
      totalItems: 0,
      page,
      pageSize,
    }
  }

  const responseObject = data as Record<string, unknown>

  const unwrappedData =
    responseObject.data &&
    typeof responseObject.data === 'object' &&
    !Array.isArray(responseObject.data)
      ? (responseObject.data as Record<string, unknown>)
      : responseObject

  const items =
    Array.isArray(unwrappedData.items)
      ? unwrappedData.items
      : Array.isArray(unwrappedData.data)
        ? unwrappedData.data
        : Array.isArray(unwrappedData.results)
          ? unwrappedData.results
          : []

  const totalItems =
    typeof unwrappedData.totalItems === 'number'
      ? unwrappedData.totalItems
      : typeof unwrappedData.total === 'number'
        ? unwrappedData.total
        : typeof unwrappedData.totalCount === 'number'
          ? unwrappedData.totalCount
          : items.length

  const normalizedPage =
    typeof unwrappedData.page === 'number'
      ? unwrappedData.page
      : page

  const normalizedPageSize =
    typeof unwrappedData.pageSize === 'number'
      ? unwrappedData.pageSize
      : pageSize

  return {
    items: items as ElderlyPerson[],
    totalItems,
    page: normalizedPage,
    pageSize: normalizedPageSize,
  }
}

export const elderlyService = {
  async list(
    params: ElderlyListParams = {},
  ): Promise<ElderlyListResult> {
    const page = params.page ?? 1
    const pageSize = params.pageSize ?? 10

    const response = await api.get(
      '/api/elderly-people',
      {
        params: {
          Page: page,
          PageSize: pageSize,
          Search: params.search || undefined,
        },
      },
    )

    return normalizeListResponse(
      response.data,
      page,
      pageSize,
    )
  },

  async getById(
    id: string,
  ): Promise<ElderlyPerson> {
    const response = await api.get<
      ElderlyPerson
    >(`/api/elderly-people/${id}`)

    return response.data
  },

  async create(
    payload: CreateElderlyPersonRequest,
  ): Promise<ElderlyPerson> {
    const response = await api.post<
      ElderlyPerson
    >(
      '/api/elderly-people',
      payload,
    )

    return response.data
  },
}
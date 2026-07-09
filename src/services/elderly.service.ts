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
      items: items as ElderlyPerson[],
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

export const elderlyService = {
  async list(params: ElderlyListParams = {}): Promise<ElderlyListResult> {
    const page = params.page ?? 1
    const pageSize = params.pageSize ?? 10

    const response = await api.get('/api/elderly-people', {
      params: {
        Page: page,
        PageSize: pageSize,
        Search: params.search || undefined,
      },
    })

    return normalizeListResponse(response.data, page, pageSize)
  },

  async getById(id: string): Promise<ElderlyPerson> {
    const response = await api.get<ElderlyPerson>(`/api/elderly-people/${id}`)
    return response.data
  },

  async create(payload: CreateElderlyPersonRequest): Promise<ElderlyPerson> {
    const response = await api.post<ElderlyPerson>('/api/elderly-people', payload)
    return response.data
  },
}
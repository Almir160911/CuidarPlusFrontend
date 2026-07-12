import { api } from './api'
import type {
  ElderlyDocument,
  ElderlyDocumentListResult,
  UploadElderlyDocumentRequest,
} from '../types/elderly-document'

function normalizeList(data: unknown): ElderlyDocumentListResult {
  if (Array.isArray(data)) {
    return {
      items: data as ElderlyDocument[],
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
      items: items as ElderlyDocument[],
      totalItems,
    }
  }

  return {
    items: [],
    totalItems: 0,
  }
}

export const elderlyDocumentService = {
  async listByElderly(
    elderlyPersonId: string,
  ): Promise<ElderlyDocumentListResult> {
    const response = await api.get(
      `/api/documents/elderly/${elderlyPersonId}`,
    )

    return normalizeList(response.data)
  },

  async upload(
    payload: UploadElderlyDocumentRequest,
  ): Promise<ElderlyDocument> {
    const formData = new FormData()

    formData.append(
      'elderlyPersonId',
      payload.elderlyPersonId,
    )

    formData.append(
      'type',
      String(payload.type),
    )

    if (payload.description?.trim()) {
      formData.append(
        'description',
        payload.description.trim(),
      )
    }

    formData.append('file', payload.file)

    const response = await api.post<ElderlyDocument>(
      '/api/documents/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )

    return response.data
  },

  buildFileUrl(document: ElderlyDocument): string {
    const apiBaseUrl =
      api.defaults.baseURL?.replace(/\/$/, '') ?? ''

    const normalizedPath = document.filePath
      .replace(/^\/+/, '')
      .replace(/\\/g, '/')

    return `${apiBaseUrl}/${normalizedPath}`
  },
}

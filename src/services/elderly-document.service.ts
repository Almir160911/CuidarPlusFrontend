import { api } from './api'
import type {
  ElderlyDocument,
  ElderlyDocumentListResult,
  UploadElderlyDocumentRequest,
} from '../types/elderly-document'

function normalizeList(
  data: unknown,
): ElderlyDocumentListResult {
  if (Array.isArray(data)) {
    return {
      items: data as ElderlyDocument[],
      totalItems: data.length,
    }
  }

  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>

    const rawData =
      obj.data &&
      typeof obj.data === 'object' &&
      !Array.isArray(obj.data)
        ? (obj.data as Record<string, unknown>)
        : null

    const items =
      Array.isArray(obj.items)
        ? obj.items
        : Array.isArray(obj.data)
          ? obj.data
          : Array.isArray(obj.results)
            ? obj.results
            : rawData &&
                Array.isArray(rawData.items)
              ? rawData.items
              : []

    const totalItems =
      typeof obj.totalItems === 'number'
        ? obj.totalItems
        : typeof obj.total === 'number'
          ? obj.total
          : rawData &&
              typeof rawData.totalItems === 'number'
            ? rawData.totalItems
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

  async listByMedicalAppointment(
    medicalAppointmentId: string,
  ): Promise<ElderlyDocumentListResult> {
    const response = await api.get(
      `/api/documents/appointment/${medicalAppointmentId}`,
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

    if (payload.medicalAppointmentId) {
      formData.append(
        'medicalAppointmentId',
        payload.medicalAppointmentId,
      )
    }

    formData.append(
      'file',
      payload.file,
    )

    const response =
      await api.post<ElderlyDocument>(
        '/api/documents/upload',
        formData,
      )

    return response.data
  },
  async openDocument(
    document: ElderlyDocument,
  ): Promise<void> {
    // Abre a nova aba imediatamente, ainda dentro
    // da ação do clique do usuário.
    const newWindow = window.open(
      '',
      '_blank',
    )

    if (!newWindow) {
      throw new Error(
        'O navegador bloqueou a abertura do documento.',
      )
    }

    // Impede acesso à janela de origem.
    newWindow.opener = null

    try {
      const response = await api.get(
        `/api/documents/${document.id}/file`,
        {
          responseType: 'blob',
        },
      )

      const responseContentType =
        response.headers['content-type']

      const contentType =
        typeof responseContentType === 'string'
          ? responseContentType
          : document.contentType ||
            'application/octet-stream'

      const blob = new Blob(
        [response.data],
        {
          type: contentType,
        },
      )

      const url =
        window.URL.createObjectURL(blob)

      newWindow.location.href = url

      window.setTimeout(() => {
        window.URL.revokeObjectURL(url)
      }, 60_000)
    } catch (error) {
      newWindow.close()
      throw error
    }
  },

}
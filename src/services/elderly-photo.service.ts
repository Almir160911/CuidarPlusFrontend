import { api } from './api'
import type { ApiResponse } from '../types/api-response'
import type { ElderlyPhotoMetadata } from '../types/elderly-photo'

const photoObjectUrls = new Map<string, string>()

function unwrapResponse<T>(
  value: T | ApiResponse<T>,
): T {
  if (
    value &&
    typeof value === 'object' &&
    'data' in value
  ) {
    return (value as ApiResponse<T>).data
  }

  return value as T
}

export const elderlyPhotoService = {
  async getMetadata(
    elderlyPersonId: string,
  ): Promise<ElderlyPhotoMetadata> {
    const response = await api.get<
      ElderlyPhotoMetadata |
      ApiResponse<ElderlyPhotoMetadata>
    >(
      `/api/elderly-people/${elderlyPersonId}/photo/metadata`,
    )

    return unwrapResponse(response.data)
  },

  async loadPhotoUrl(
    elderlyPersonId: string,
  ): Promise<string | null> {
    this.releasePhotoUrl(elderlyPersonId)

    const metadata =
      await this.getMetadata(elderlyPersonId)

    if (!metadata.hasPhoto) {
      return null
    }

    const response = await api.get(
      `/api/elderly-people/${elderlyPersonId}/photo`,
      {
        responseType: 'blob',
      },
    )

    const blob = response.data as Blob

    if (!blob || blob.size === 0) {
      return null
    }

    const objectUrl =
      URL.createObjectURL(blob)

    photoObjectUrls.set(
      elderlyPersonId,
      objectUrl,
    )

    return objectUrl
  },

  async upload(
    elderlyPersonId: string,
    photo: File,
    consentConfirmed: boolean,
  ): Promise<ElderlyPhotoMetadata> {
    const formData = new FormData()

    formData.append(
      'Photo',
      photo,
      photo.name,
    )

    formData.append(
      'ConsentConfirmed',
      consentConfirmed ? 'true' : 'false',
    )

    const response = await api.post<
      ElderlyPhotoMetadata |
      ApiResponse<ElderlyPhotoMetadata>
    >(
      `/api/elderly-people/${elderlyPersonId}/photo`,
      formData,
    )

    this.releasePhotoUrl(elderlyPersonId)

    return unwrapResponse(response.data)
  },

  async remove(
    elderlyPersonId: string,
    revokeConsent = false,
  ): Promise<void> {
    await api.delete(
      `/api/elderly-people/${elderlyPersonId}/photo`,
      {
        params: {
          revokeConsent,
        },
      },
    )

    this.releasePhotoUrl(elderlyPersonId)
  },

  releasePhotoUrl(
    elderlyPersonId: string,
  ): void {
    const objectUrl =
      photoObjectUrls.get(elderlyPersonId)

    if (!objectUrl) {
      return
    }

    URL.revokeObjectURL(objectUrl)

    photoObjectUrls.delete(
      elderlyPersonId,
    )
  },
}

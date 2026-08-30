import { api } from './api'

import {
  unwrapApiResponse,
  type ApiResponse,
} from '../types/api-response'

export interface UserPhotoMetadata {
  userId: string
  hasPhoto: boolean
  contentType?: string | null
  sizeInBytes?: number | null
  uploadedAt?: string | null
}

export const userPhotoService = {
  async getMetadata():
    Promise<UserPhotoMetadata> {
    const response = await api.get<
      | ApiResponse<UserPhotoMetadata>
      | UserPhotoMetadata
    >('/api/users/me/photo/metadata')

    return unwrapApiResponse(
      response.data,
    )
  },

  async download(): Promise<Blob> {
    const response = await api.get(
      '/api/users/me/photo',
      {
        responseType: 'blob',
      },
    )

    return response.data as Blob
  },

  async upload(
    file: File,
  ): Promise<UserPhotoMetadata> {
    const formData = new FormData()
    formData.append('Photo', file)

    const response = await api.post<
      | ApiResponse<UserPhotoMetadata>
      | UserPhotoMetadata
    >(
      '/api/users/me/photo',
      formData,
    )

    return unwrapApiResponse(
      response.data,
    )
  },

  async remove(): Promise<void> {
    await api.delete(
      '/api/users/me/photo',
    )
  },
}
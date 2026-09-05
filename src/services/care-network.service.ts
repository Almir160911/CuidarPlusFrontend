import { api } from './api'
import { unwrapApiResponse } from '../types/api-response'
import type { CareNetwork } from '../types/care-network'

export const careNetworkService = {
  async get(): Promise<CareNetwork> {
    const response = await api.get('/api/care-network')
    return unwrapApiResponse<CareNetwork>(response.data)
  },

  async downloadMemberPhoto(userId: string): Promise<Blob> {
    const response = await api.get(
      `/api/care-network/members/${userId}/photo`,
      { responseType: 'blob' },
    )
    return response.data as Blob
  },
}

import { api } from './api'
import {
  unwrapApiResponse,
} from '../types/api-response'
import type {
  MyElderlyPersonAccess,
} from '../types/elderly-access'

export const elderlyAccessService = {
  async getMyAccesses(): Promise<
    MyElderlyPersonAccess[]
  > {
    const response = await api.get(
      '/api/elderly-access/me',
    )

    return unwrapApiResponse<
      MyElderlyPersonAccess[]
    >(response.data)
  },
}

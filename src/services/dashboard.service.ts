import { api } from './api'
import type { ApiResponse } from '../types/api-response'
import type { ElderlyDashboard } from '../types/elderly-dashboard'
import type { GeneralDashboard } from '../types/general-dashboard'

function isApiResponse<T>(
  value: unknown,
): value is ApiResponse<T> {
  if (!value || typeof value !== 'object') {
    return false
  }

  return 'data' in value
}

export const dashboardService = {
  async getGeneralDashboard(): Promise<GeneralDashboard> {
    const response = await api.get<
      GeneralDashboard | ApiResponse<GeneralDashboard>
    >('/api/dashboard')

    if (isApiResponse<GeneralDashboard>(response.data)) {
      return response.data.data
    }

    return response.data
  },

  async getElderlyDashboard(
    elderlyPersonId: string,
  ): Promise<ElderlyDashboard> {
    const response = await api.get<
      ElderlyDashboard | ApiResponse<ElderlyDashboard>
    >(`/api/dashboard/elderly/${elderlyPersonId}`)

    if (isApiResponse<ElderlyDashboard>(response.data)) {
      return response.data.data
    }

    return response.data
  },
}
import { api } from './api'
import type { ElderlyDashboard } from '../types/elderly-dashboard'

export const dashboardService = {
  async getElderlyDashboard(elderlyPersonId: string): Promise<ElderlyDashboard> {
    const response = await api.get<ElderlyDashboard>(
      `/api/dashboard/elderly/${elderlyPersonId}`,
    )

    return response.data
  },
}

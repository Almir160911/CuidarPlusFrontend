import { api } from './api'
import type { ApiResponse } from '../types/api-response'
import type {
  ElderlyDetailedReport,
  ElderlySummaryReport,
} from '../types/report'

export const reportService = {
  async getSummary(
    elderlyPersonId: string,
  ): Promise<ElderlySummaryReport> {
    const response = await api.get<
      ApiResponse<ElderlySummaryReport>
    >(
      `/api/reports/elderly/${elderlyPersonId}/summary`,
    )

    return response.data.data
  },

  async getDetailed(
    elderlyPersonId: string,
  ): Promise<ElderlyDetailedReport> {
    const response = await api.get<
      ApiResponse<ElderlyDetailedReport>
    >(
      `/api/reports/elderly/${elderlyPersonId}/detailed`,
    )

    return response.data.data
  },

  async downloadPdf(
    elderlyPersonId: string,
  ): Promise<Blob> {
    const response = await api.get(
      `/api/reports/elderly/${elderlyPersonId}/pdf`,
      {
        responseType: 'blob',
      },
    )

    return response.data as Blob
  },
}
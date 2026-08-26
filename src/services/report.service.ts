import { api } from './api'
import type { ApiResponse } from '../types/api-response'
import type {
  ElderlyDetailedReport,
  ElderlySummaryReport,
} from '../types/report'

function unwrapApiResponse<T>(
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

export const reportService = {
  async getSummary(
    elderlyPersonId: string,
  ): Promise<ElderlySummaryReport> {
    const response = await api.get<
      ElderlySummaryReport |
      ApiResponse<ElderlySummaryReport>
    >(
      `/api/reports/elderly/${elderlyPersonId}/summary`,
    )

    return unwrapApiResponse(response.data)
  },

  async getDetailed(
    elderlyPersonId: string,
  ): Promise<ElderlyDetailedReport> {
    const response = await api.get<
      ElderlyDetailedReport |
      ApiResponse<ElderlyDetailedReport>
    >(
      `/api/reports/elderly/${elderlyPersonId}/detailed`,
    )

    return unwrapApiResponse(response.data)
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
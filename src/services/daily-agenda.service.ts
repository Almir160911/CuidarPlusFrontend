import { api } from './api'
import type { ApiResponse } from '../types/api-response'
import type {
  ConfirmMedicationAdministrationRequest,
  DailyAgenda,
  DailyMedication,
} from '../types/daily-agenda'

function formatDateForApi(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const dailyAgendaService = {
  async getByElderlyPerson(
    elderlyPersonId: string,
    date: Date,
  ): Promise<DailyAgenda> {
    const formattedDate = formatDateForApi(date)

    const response = await api.get<ApiResponse<DailyAgenda>>(
      `/daily-agenda/elderly/${elderlyPersonId}`,
      {
        params: {
          date: formattedDate,
        },
      },
    )

    return response.data.data
  },

  async confirmMedicationTaken(
    administrationId: string,
    request: ConfirmMedicationAdministrationRequest,
  ): Promise<DailyMedication> {
    const response = await api.patch<ApiResponse<DailyMedication>>(
      `/medication-administrations/${administrationId}/taken`,
      request,
    )

    return response.data.data
  },

  async confirmMedicationNotTaken(
    administrationId: string,
    request: ConfirmMedicationAdministrationRequest,
  ): Promise<DailyMedication> {
    const response = await api.patch<ApiResponse<DailyMedication>>(
      `/medication-administrations/${administrationId}/not-taken`,
      request,
    )

    return response.data.data
  },
}
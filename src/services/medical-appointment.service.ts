import { api } from './api'
import type {
  CreateMedicalAppointmentRequest,
  MedicalAppointment,
  MedicalAppointmentListParams,
  MedicalAppointmentListResult,
} from '../types/medical-appointment'

function normalizeList(data: unknown): MedicalAppointmentListResult {
  if (Array.isArray(data)) {
    return {
      items: data as MedicalAppointment[],
      totalItems: data.length,
    }
  }

  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>

    const items =
      Array.isArray(obj.items)
        ? obj.items
        : Array.isArray(obj.data)
          ? obj.data
          : Array.isArray(obj.results)
            ? obj.results
            : []

    const totalItems =
      typeof obj.totalItems === 'number'
        ? obj.totalItems
        : typeof obj.total === 'number'
          ? obj.total
          : items.length

    return {
      items: items as MedicalAppointment[],
      totalItems,
    }
  }

  return {
    items: [],
    totalItems: 0,
  }
}

export const medicalAppointmentService = {
  async listByElderly(
    params: MedicalAppointmentListParams,
  ): Promise<MedicalAppointmentListResult> {
    const response = await api.get(
      `/api/medical-appointments/elderly/${params.elderlyPersonId}`,
      {
        params: {
          Page: params.page ?? 1,
          PageSize: params.pageSize ?? 50,
          Search: params.search || undefined,
          FromDate: params.fromDate || undefined,
          ToDate: params.toDate || undefined,
          DoctorName: params.doctorName || undefined,
          Specialty: params.specialty || undefined,
          Location: params.location || undefined,
        },
      },
    )

    return normalizeList(response.data)
  },

  async getById(id: string): Promise<MedicalAppointment> {
    const response = await api.get<MedicalAppointment>(
      `/api/medical-appointments/${id}`,
    )

    return response.data
  },

  async create(
    payload: CreateMedicalAppointmentRequest,
  ): Promise<MedicalAppointment> {
    const response = await api.post<MedicalAppointment>(
      '/api/medical-appointments',
      payload,
    )

    return response.data
  },
}

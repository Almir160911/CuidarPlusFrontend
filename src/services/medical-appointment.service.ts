import { api } from './api'
import type {
  CreateMedicalAppointmentRequest,
  MedicalAppointment,
  MedicalAppointmentFilters,
  MedicalAppointmentListResult,
} from '../types/medical-appointment'

interface ApiPagedResponse<T> {
  items?: T[]
  data?: T[]
  results?: T[]
  totalItems?: number
  total?: number
  page?: number
  pageNumber?: number
  pageSize?: number
}

function normalizeListResponse(
  data: unknown,
  requestedPage: number,
  requestedPageSize: number,
): MedicalAppointmentListResult {
  if (Array.isArray(data)) {
    return {
      items: data as MedicalAppointment[],
      totalItems: data.length,
      page: requestedPage,
      pageSize: requestedPageSize,
    }
  }

  if (!data || typeof data !== 'object') {
    return {
      items: [],
      totalItems: 0,
      page: requestedPage,
      pageSize: requestedPageSize,
    }
  }

  const response = data as ApiPagedResponse<MedicalAppointment>

  const items =
    response.items ??
    response.data ??
    response.results ??
    []

  return {
    items,
    totalItems:
      response.totalItems ??
      response.total ??
      items.length,
    page:
      response.page ??
      response.pageNumber ??
      requestedPage,
    pageSize:
      response.pageSize ??
      requestedPageSize,
  }
}

export const medicalAppointmentService = {
  async listByElderly(
    elderlyPersonId: string,
    filters: MedicalAppointmentFilters = {},
  ): Promise<MedicalAppointmentListResult> {
    const page = filters.page ?? 1
    const pageSize = filters.pageSize ?? 20

    const response = await api.get(
      `/api/medical-appointments/elderly/${elderlyPersonId}`,
      {
        params: {
          Page: page,
          PageSize: pageSize,
          Search: filters.search?.trim() || undefined,
          FromDate: filters.fromDate || undefined,
          ToDate: filters.toDate || undefined,
          DoctorName: filters.doctorName?.trim() || undefined,
          Specialty: filters.specialty?.trim() || undefined,
          Location: filters.location?.trim() || undefined,
        },
      },
    )

    return normalizeListResponse(
      response.data,
      page,
      pageSize,
    )
  },

  async getById(
    id: string,
  ): Promise<MedicalAppointment> {
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
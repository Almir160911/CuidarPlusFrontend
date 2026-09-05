import { api } from './api'
import { unwrapApiResponse } from '../types/api-response'
import type { CareShift, CompleteCareShiftRequest, CreateCareShiftRequest, CreateCaregiverRequest, OrganizationUser } from '../types/care-shift'

export const careShiftService = {
  async listByElderly(elderlyPersonId: string): Promise<CareShift[]> {
    const response = await api.get(`/api/care-shifts/elderly/${elderlyPersonId}`)
    return unwrapApiResponse<CareShift[]>(response.data)
  },
  async listMine(): Promise<CareShift[]> {
    const response = await api.get('/api/care-shifts/mine')
    return unwrapApiResponse<CareShift[]>(response.data)
  },
  async listUsers(): Promise<OrganizationUser[]> {
    const response = await api.get('/api/organization-users')
    return unwrapApiResponse<OrganizationUser[]>(response.data)
  },
  async createCaregiver(payload: CreateCaregiverRequest): Promise<OrganizationUser> {
    const response = await api.post('/api/organization-users', payload)
    return unwrapApiResponse<OrganizationUser>(response.data)
  },
  async create(payload: CreateCareShiftRequest): Promise<CareShift> {
    const response = await api.post('/api/care-shifts', payload)
    return unwrapApiResponse<CareShift>(response.data)
  },
  async start(id: string): Promise<CareShift> {
    const response = await api.patch(`/api/care-shifts/${id}/start`)
    return unwrapApiResponse<CareShift>(response.data)
  },
  async complete(id: string, payload: CompleteCareShiftRequest): Promise<CareShift> {
    const response = await api.patch(`/api/care-shifts/${id}/complete`, payload)
    return unwrapApiResponse<CareShift>(response.data)
  },
  async cancel(id: string): Promise<void> {
    await api.patch(`/api/care-shifts/${id}/cancel`)
  },
}

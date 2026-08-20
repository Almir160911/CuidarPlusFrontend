export interface Medication {
  id: string
  organizationId: string
  elderlyPersonId: string
  name: string
  dosage: string
  frequency: string
  notes?: string | null
  startDate?: string | null
  endDate?: string | null
  isActive: boolean
  createdAt: string
}

export interface CreateMedicationRequest {
  elderlyPersonId: string
  name: string
  dosage?: string
  frequency?: string
  notes?: string
  startDate?: string | null
  endDate?: string | null
}

export interface MedicationListParams {
  elderlyPersonId: string
  page?: number
  pageSize?: number
  search?: string
}

export interface OrganizationMedicationListParams {
  page?: number
  pageSize?: number
  search?: string
}

export interface MedicationListResult {
  items: Medication[]
  totalItems: number
  page: number
  pageSize: number
}
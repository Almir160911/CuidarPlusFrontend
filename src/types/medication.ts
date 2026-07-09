export interface Medication {
  id?: string
  elderlyPersonId?: string
  name?: string
  dosage?: string
  frequency?: string
  notes?: string
  startDate?: string | null
  endDate?: string | null
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

export interface MedicationListResult {
  items: Medication[]
  totalItems: number
  page: number
  pageSize: number
}
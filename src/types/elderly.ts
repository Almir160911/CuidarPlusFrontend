export interface ElderlyPerson {
  id?: string
  fullName?: string
  birthDate?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  allergies?: string
  knownDiseases?: string
  doctorName?: string
  healthInsurance?: string
  isActive?: boolean
  createdAt?: string
}

export interface CreateElderlyPersonRequest {
  fullName: string
  birthDate: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  allergies?: string
  knownDiseases?: string
  doctorName?: string
  healthInsurance?: string
}

export type UpdateElderlyPersonRequest =
  CreateElderlyPersonRequest

export interface ElderlyListParams {
  page?: number
  pageSize?: number
  search?: string
}

export interface ElderlyListResult {
  items: ElderlyPerson[]
  totalItems: number
  page: number
  pageSize: number
}

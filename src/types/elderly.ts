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
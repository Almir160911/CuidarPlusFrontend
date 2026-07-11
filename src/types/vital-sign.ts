export interface VitalSign {
  id: string
  elderlyPersonId: string
  registeredByUserId?: string
  bloodPressure?: string | null
  bloodGlucose?: number | null
  temperature?: number | null
  heartRate?: number | null
  oxygenSaturation?: number | null
  registeredAt: string
}

export interface CreateVitalSignRequest {
  elderlyPersonId: string
  bloodPressure?: string
  bloodGlucose?: number | null
  temperature?: number | null
  heartRate?: number | null
  oxygenSaturation?: number | null
}

export interface VitalSignListParams {
  elderlyPersonId: string
  page?: number
  pageSize?: number
  search?: string
  fromDate?: string
  toDate?: string
}

export interface VitalSignListResult {
  items: VitalSign[]
  totalItems: number
}

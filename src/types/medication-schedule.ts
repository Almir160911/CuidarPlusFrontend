export interface MedicationSchedule {
  id: string
  organizationId?: string
  medicationId: string
  scheduledTime: string
  createdAt?: string
}

export interface CreateMedicationScheduleRequest {
  medicationId: string
  scheduledTime: string
}

export interface MedicationScheduleListResult {
  items: MedicationSchedule[]
  totalItems: number
}

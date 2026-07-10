export interface MedicationSchedule {
  id: string
  organizationId?: string
  medicationId: string
  scheduledTime: string
  isTaken: boolean
  takenAt?: string | null
  registeredByUserId?: string | null
  createdAt?: string
}

export interface CreateMedicationScheduleRequest {
  medicationId: string
  scheduledTime: string
}

export interface ConfirmMedicationScheduleRequest {
  registeredByUserId: string
}

export interface MedicationScheduleListResult {
  items: MedicationSchedule[]
  totalItems: number
}

export type CareShiftStatus = 1 | 2 | 3 | 4

export interface CareShift {
  id: string
  elderlyPersonId: string
  elderlyPersonName: string
  caregiverUserId: string
  caregiverName: string
  scheduledStartAt: string
  scheduledEndAt: string
  startedAt?: string
  endedAt?: string
  status: CareShiftStatus
  summary?: string
  occurrences?: string
  pendingNotes?: string
  createdAt: string
}

export interface CreateCareShiftRequest {
  elderlyPersonId: string
  caregiverUserId: string
  scheduledStartAt: string
  scheduledEndAt: string
}

export interface CompleteCareShiftRequest {
  summary?: string
  occurrences?: string
  pendingNotes?: string
}

export interface OrganizationUser {
  id: string
  fullName: string
  role: number
  isActive: boolean
}

export interface CreateCaregiverRequest {
  fullName: string
  email: string
  temporaryPassword: string
  role: 2
}

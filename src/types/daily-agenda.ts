export const MedicationAdministrationStatus = {
  Pending: 1,
  Taken: 2,
  NotTaken: 3,
  Late: 4,
} as const

export type MedicationAdministrationStatus =
  (typeof MedicationAdministrationStatus)[keyof typeof MedicationAdministrationStatus]

export interface DailyAgendaSummary {
  totalMedications: number
  pendingMedications: number
  takenMedications: number
  notTakenMedications: number
  lateMedications: number
  appointments: number
  unreadAlerts: number
}

export interface DailyMedication {
  administrationId: string
  medicationId: string
  medicationScheduleId: string
  medicationName: string
  dosage: string
  frequency: string
  scheduledDate: string
  scheduledTime: string
  status: MedicationAdministrationStatus
  administeredAt: string | null
  registeredByUserId: string | null
  notes: string | null
}

export interface DailyAppointment {
  id: string
  title: string
  doctorName: string | null
  specialty: string | null
  appointmentDate: string
  location: string | null
  notes: string | null
}

export interface DailyVitalSign {
  id: string
  bloodPressure: string | null
  bloodGlucose: number | null
  temperature: number | null
  heartRate: number | null
  oxygenSaturation: number | null
  registeredAt: string
}

export interface DailyCareLog {
  id: string
  hadMeal: boolean
  hadBath: boolean
  sleepQuality: string | null
  mood: string | null
  hadPain: boolean
  hadFall: boolean
  notes: string | null
  registeredAt: string
}

export interface DailyAlert {
  id: string
  title: string
  message: string
  severity: string
  isRead: boolean
  createdAt: string
}

export interface DailyAgenda {
  elderlyPersonId: string
  elderlyPersonName: string
  date: string
  summary: DailyAgendaSummary
  medications: DailyMedication[]
  appointments: DailyAppointment[]
  latestVitalSign: DailyVitalSign | null
  latestCareLog: DailyCareLog | null
  alerts: DailyAlert[]
}

export interface ConfirmMedicationAdministrationRequest {
  notes?: string | null
}
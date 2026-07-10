export interface ElderlyDashboardAppointment {
  id: string
  title: string
  doctorName?: string | null
  specialty?: string | null
  appointmentDate: string
  location?: string | null
}

export interface ElderlyDashboardVitalSign {
  id: string
  bloodPressure?: string | null
  bloodGlucose?: number | null
  temperature?: number | null
  heartRate?: number | null
  oxygenSaturation?: number | null
  registeredAt: string
}

export interface ElderlyDashboardCareLog {
  id: string
  hadMeal: boolean
  hadBath: boolean
  sleepQuality?: string | null
  mood?: string | null
  hadPain: boolean
  hadFall: boolean
  notes?: string | null
  registeredAt: string
}

export interface ElderlyDashboardTimelineEvent {
  id: string
  type: number
  title: string
  description?: string | null
  occurredAt: string
  relatedEntityId?: string | null
  relatedEntityName?: string | null
}

export interface ElderlyDashboard {
  elderlyPersonId: string
  elderlyPersonName: string
  birthDate: string
  age: number

  healthInsurance?: string | null
  doctorName?: string | null
  emergencyContactName?: string | null
  emergencyContactPhone?: string | null
  allergies?: string | null
  knownDiseases?: string | null
  isActive: boolean

  activeMedications: number
  pendingMedicationSchedules: number
  unreadAlerts: number
  careLogsCount: number
  vitalSignsCount: number
  upcomingAppointments: number
  documentsCount: number

  nextAppointment?: ElderlyDashboardAppointment | null
  latestVitalSign?: ElderlyDashboardVitalSign | null
  latestCareLog?: ElderlyDashboardCareLog | null
  recentTimeline: ElderlyDashboardTimelineEvent[]
}

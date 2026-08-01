export interface GeneralDashboardCareLog {
  id: string
  elderlyPersonId: string
  elderlyPersonName: string
  hadMeal: boolean
  hadBath: boolean
  sleepQuality?: string | null
  mood?: string | null
  hadPain: boolean
  hadFall: boolean
  notes?: string | null
  registeredAt: string
}

export interface GeneralDashboardVitalSign {
  id: string
  elderlyPersonId: string
  elderlyPersonName: string
  bloodPressure?: string | null
  bloodGlucose?: number | null
  temperature?: number | null
  heartRate?: number | null
  oxygenSaturation?: number | null
  registeredAt: string
}

export interface GeneralDashboard {
  elderlyPeopleCount: number
  activeMedications: number
  upcomingAppointments: number
  unreadAlerts: number
  recentCareLogs: GeneralDashboardCareLog[]
  recentVitalSigns: GeneralDashboardVitalSign[]
}
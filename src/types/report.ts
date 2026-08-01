export interface ElderlySummaryReport {
  elderlyPersonId: string
  elderlyPersonName: string
  birthDate: string
  activeMedications: number
  vitalSignsLast30Days: number
  careLogsLast30Days: number
  upcomingAppointments: number
  unreadAlerts: number
  generatedAt: string
}

export interface ElderlyDetailedReport {
  elderlyPersonId: string
  elderlyPersonName: string
  birthDate: string
  activeMedications: string[]
  recentVitalSigns: string[]
  recentCareLogs: string[]
  upcomingAppointments: string[]
  unreadAlerts: string[]
  generatedAt: string
}
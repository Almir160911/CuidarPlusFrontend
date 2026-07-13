export const AlertSeverity = {
  Low: 'Low',
  Medium: 'Medium',
  High: 'High',
} as const

export type AlertSeverity =
  (typeof AlertSeverity)[keyof typeof AlertSeverity]

export interface Alert {
  id: string
  elderlyPersonId: string
  title: string
  message: string
  severity: AlertSeverity | string
  isRead: boolean
  createdAt: string
  readAt?: string | null
}

export interface AlertListResult {
  items: Alert[]
  totalItems: number
  page: number
  pageSize: number
}

export interface AlertListParams {
  elderlyPersonId: string
  page?: number
  pageSize?: number
  search?: string
  severity?: string
  isRead?: boolean
}

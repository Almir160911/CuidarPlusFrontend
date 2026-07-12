export interface CareLog {
  id: string
  elderlyPersonId: string
  registeredByUserId?: string

  hadMeal: boolean
  hadBath: boolean
  sleepQuality?: string | null
  mood?: string | null
  hadPain: boolean
  hadFall: boolean
  notes?: string | null

  registeredAt: string
}

export interface CreateCareLogRequest {
  elderlyPersonId: string
  hadMeal: boolean
  hadBath: boolean
  sleepQuality?: string
  mood?: string
  hadPain: boolean
  hadFall: boolean
  notes?: string
}

export interface CareLogFilters {
  page?: number
  pageSize?: number
  search?: string
  fromDate?: string
  toDate?: string
  mood?: string
  hadPain?: boolean
  hadFall?: boolean
}

export interface CareLogListResult {
  items: CareLog[]
  totalItems: number
  page: number
  pageSize: number
}

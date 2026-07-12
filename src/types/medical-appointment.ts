export interface MedicalAppointment {
  id: string
  elderlyPersonId: string
  title: string
  doctorName?: string | null
  specialty?: string | null
  appointmentDate: string
  location?: string | null
  notes?: string | null
  reminderSent?: boolean
  createdAt?: string
}

export interface CreateMedicalAppointmentRequest {
  elderlyPersonId: string
  title: string
  doctorName?: string
  specialty?: string
  appointmentDate: string
  location?: string
  notes?: string
}

export interface MedicalAppointmentFilters {
  page?: number
  pageSize?: number
  search?: string
  fromDate?: string
  toDate?: string
  doctorName?: string
  specialty?: string
  location?: string
}

export interface MedicalAppointmentListResult {
  items: MedicalAppointment[]
  totalItems: number
  page: number
  pageSize: number
}
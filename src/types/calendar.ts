export type CalendarEventType =
  | 'appointment'
  | 'medication'

export type CalendarEventStatus =
  | 'scheduled'
  | 'pending'
  | 'taken'
  | 'not-taken'
  | 'late'
  | string

export interface CalendarEvent {
  id: string
  elderlyPersonId: string
  elderlyPersonName: string
  type: CalendarEventType
  title: string
  description?: string | null
  startsAt: string
  status: CalendarEventStatus
  location?: string | null
  relatedEntityId?: string | null
}

export interface CalendarData {
  from: string
  to: string
  events: CalendarEvent[]
}

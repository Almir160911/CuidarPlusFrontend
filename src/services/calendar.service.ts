import { api } from './api'
import type { ApiResponse } from '../types/api-response'
import type { CalendarData } from '../types/calendar'

function isApiResponse<T>(
  value: unknown,
): value is ApiResponse<T> {
  return Boolean(
    value &&
      typeof value === 'object' &&
      'data' in value,
  )
}

function normalizeCalendar(
  value: unknown,
): CalendarData {
  const data = isApiResponse<CalendarData>(value)
    ? value.data
    : (value as CalendarData)

  return {
    from: data?.from ?? '',
    to: data?.to ?? '',
    events: Array.isArray(data?.events)
      ? data.events
      : [],
  }
}

export const calendarService = {
  async get(
    from: string,
    to: string,
  ): Promise<CalendarData> {
    const response = await api.get<
      CalendarData | ApiResponse<CalendarData>
    >('/api/calendar', {
      params: {
        from,
        to,
      },
    })

    return normalizeCalendar(response.data)
  },
}

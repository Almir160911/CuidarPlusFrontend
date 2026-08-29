export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  errors?: string[]
}

export function isApiResponse<T>(
  value: unknown,
): value is ApiResponse<T> {
  return Boolean(
    value &&
      typeof value === 'object' &&
      'data' in value,
  )
}

export function unwrapApiResponse<T>(
  value: T | ApiResponse<T>,
): T {
  if (isApiResponse<T>(value)) {
    return value.data
  }

  return value
}

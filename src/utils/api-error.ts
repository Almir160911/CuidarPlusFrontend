import axios from 'axios'

interface ApiErrorEnvelope {
  message?: string
  errors?: string[]
}

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Não foi possível concluir a operação.',
): string {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error
      ? error.message
      : fallback
  }

  if (!error.response) {
    return 'Não foi possível conectar à API.'
  }

  const data =
    error.response.data as ApiErrorEnvelope | undefined

  if (
    Array.isArray(data?.errors) &&
    data.errors.length > 0
  ) {
    return data.errors.join(' ')
  }

  if (
    data?.message &&
    typeof data.message === 'string'
  ) {
    return data.message
  }

  switch (error.response.status) {
    case 400:
      return 'Os dados informados são inválidos.'

    case 401:
      return 'Sua sessão expirou. Faça login novamente.'

    case 403:
      return 'Você não possui permissão para realizar esta operação.'

    case 404:
      return 'O recurso solicitado não foi encontrado.'

    case 500:
      return 'Ocorreu um erro interno no servidor.'

    default:
      return fallback
  }
}

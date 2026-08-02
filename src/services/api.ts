import axios from 'axios'

const TOKEN_KEY = 'cuidarplus_token'
const USER_KEY = 'cuidarplus_user'

export const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ??
    'http://localhost:5184',
})

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem(TOKEN_KEY)

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`
  }

  /*
   * Não defina Content-Type manualmente para FormData.
   * O navegador precisa acrescentar o boundary correto.
   */
  if (
    config.data instanceof FormData
  ) {
    delete config.headers['Content-Type']
  } else if (
    config.data !== undefined &&
    !config.headers['Content-Type']
  ) {
    config.headers['Content-Type'] =
      'application/json'
  }

  return config
})

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)

      if (
        window.location.pathname !==
        '/login'
      ) {
        window.location.replace('/login')
      }
    }

    return Promise.reject(error)
  },
)

export default api
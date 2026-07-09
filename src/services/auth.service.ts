import { api } from './api'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token?: string
  accessToken?: string
  jwt?: string
  user?: unknown
  fullName?: string
  email?: string
}

export const authService = {
  async login(data: LoginRequest) {
    const response = await api.post<LoginResponse>('/api/auth/login', data)
    return response.data
  },

  logout() {
    localStorage.removeItem('cuidarplus_token')
    localStorage.removeItem('cuidarplus_user')
  },

  isAuthenticated() {
    return Boolean(localStorage.getItem('cuidarplus_token'))
  },
}
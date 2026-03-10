import apiClient from './client'

export interface LoginCredentials {
  email: string
  password: string
}

export interface User {
  id: string
  name: string
  email: string
  role: string
  // Optional fields used across the UI
  full_name?: string
  phone?: string
  is_active?: boolean
  created_at?: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface RegisterData {
  email: string
  phone?: string
  full_name: string
  role: 'parent' | 'teacher' | 'admin' | 'staff' | 'driver'
  password: string
}

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
    return response.data
  },

  register: async (data: RegisterData): Promise<User> => {
    // Map frontend fields to backend expectations
    const payload = {
      name: data.full_name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      role: data.role,
    }
    const response = await apiClient.post<{ success: boolean; user: User }>('/auth/register', payload)
    return response.data.user
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<{ success: boolean; data: User }>('/auth/me')
    return response.data.data
  },
}






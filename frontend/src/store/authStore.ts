import { create } from 'zustand'
import { User } from '../api/auth'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: (() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })(),
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  setAuth: (user, token) => {
    // Normalize role to string (handle enum objects from backend)
    let normalizedRole: string
    if (typeof user.role === 'string') {
      normalizedRole = user.role
    } else if (user.role && typeof user.role === 'object' && 'value' in user.role) {
      normalizedRole = (user.role as any).value
    } else {
      normalizedRole = String(user.role)
    }
    
    const normalizedUser = {
      ...user,
      // Ensure role is always a plain string
      role: normalizedRole,
      // Provide fallbacks/aliases used across the UI
      full_name: user.full_name ?? user.name,
      phone: user.phone ?? '',
    }
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(normalizedUser))
    set({ user: normalizedUser, token, isAuthenticated: true })
  },
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, token: null, isAuthenticated: false })
  },
}))


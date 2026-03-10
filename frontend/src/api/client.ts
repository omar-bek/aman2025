import axios from 'axios'

// Normalize base URL to always point to the backend `/api` prefix
const rawBaseUrl = import.meta.env.VITE_API_URL

let API_BASE_URL: string
if (rawBaseUrl) {
  const trimmed = rawBaseUrl.replace(/\/$/, '')
  API_BASE_URL = trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`
} else {
  // Dev: Vite proxy. Production/single-server: same origin = /api (no CORS)
  API_BASE_URL = import.meta.env.DEV ? '/api' : '/api'
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    // Don't send Authorization for auth endpoints
    const url = typeof config.url === 'string' ? config.url : ''
    const isAuthPath = url.startsWith('/auth/login') || url.startsWith('/auth/register')
    if (token && !isAuthPath) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // If FormData, let axios set Content-Type automatically with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    // Log error for debugging
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data)
    } else if (error.request) {
      console.error('Network Error:', error.request)
    } else {
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

export default apiClient


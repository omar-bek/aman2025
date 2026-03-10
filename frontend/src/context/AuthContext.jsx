import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const response = await api.get('/auth/me')
        setUser(response.data.data)
      } catch (error) {
        localStorage.removeItem('token')
        setUser(null)
      }
    }
    setLoading(false)
  }

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token, user } = response.data
      localStorage.setItem('token', token)
      setUser(user)
      toast.success('تم تسجيل الدخول بنجاح')
      navigate('/')
      return { success: true }
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل تسجيل الدخول')
      return { success: false, error: error.response?.data?.message }
    }
  }

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      const { token, user } = response.data
      localStorage.setItem('token', token)
      setUser(user)
      toast.success('تم التسجيل بنجاح')
      navigate('/')
      return { success: true }
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل التسجيل')
      return { success: false, error: error.response?.data?.message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/login')
    toast.success('تم تسجيل الخروج')
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isParent: user?.role === 'parent',
    isTeacher: user?.role === 'teacher',
    isAdmin: user?.role === 'admin',
    isStaff: user?.role === 'staff',
    isDriver: user?.role === 'driver',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

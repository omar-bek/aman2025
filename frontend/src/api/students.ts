import apiClient from './client'

export interface Student {
  _id: string
  studentId: string
  name: string
  dateOfBirth?: string
  grade?: string
  class?: string
  parentIds: any[]
  busId?: string
  isActive: boolean
  createdAt: string
  // Legacy/alias fields used in many components
  id?: string | number
  full_name?: string
  student_id?: string
  class_name?: string
  is_active?: boolean
  bus_id?: string
}

export const studentsAPI = {
  getAll: async (): Promise<Student[]> => {
    try {
      const response = await apiClient.get<{ success: boolean; data: Student[] }>('/students')
      const raw = Array.isArray(response.data.data) ? response.data.data : []
      // Normalize to provide both new and legacy field names
      return raw.map((s: any, index: number) => ({
        ...s,
        id: s._id ?? index,
        full_name: s.full_name ?? s.name,
        student_id: s.student_id ?? s.studentId,
        class_name: s.class_name ?? s.class,
        is_active: typeof s.is_active === 'boolean' ? s.is_active : !!s.isActive,
        bus_id: s.bus_id ?? s.busId,
      }))
    } catch (error) {
      console.error('Error fetching all students:', error)
      return []
    }
  },

  getById: async (id: number | string): Promise<Student> => {
    const response = await apiClient.get<{ success: boolean; data: Student }>(`/students/${id}`)
    const s: any = response.data.data
    return {
      ...s,
      id: s._id ?? id,
      full_name: s.full_name ?? s.name,
      student_id: s.student_id ?? s.studentId,
      class_name: s.class_name ?? s.class,
      is_active: typeof s.is_active === 'boolean' ? s.is_active : !!s.isActive,
      bus_id: s.bus_id ?? s.busId,
    }
  },

  getByParent: async (parentId: number | string): Promise<Student[]> => {
    try {
      // Backend already filters by logged-in parent; we ignore parentId and just call /students
      const response = await apiClient.get<{ success: boolean; data: Student[] }>('/students')
      return Array.isArray(response.data.data) ? response.data.data : []
    } catch (error) {
      console.error('Error fetching students by parent:', error)
      return []
    }
  },
}






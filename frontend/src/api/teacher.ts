import apiClient from './client'

// Types
// Assignment types are exported from assignments.ts to avoid conflicts

export interface StudentEvaluation {
  id: number
  student_id: number
  teacher_id: number
  evaluation_type: string
  evaluation_date: string
  commitment_level?: string
  interaction_level?: string
  behavior_level?: string
  participation_level?: string
  performance_trend?: string
  interaction_trend?: string
  commitment_trend?: string
  educational_notes?: string
  private_notes?: string
  shared_notes?: string
  created_at: string
  updated_at?: string
}

export interface StudentEvaluationCreate {
  student_id: number
  evaluation_type: string
  evaluation_date: string
  commitment_level?: string
  interaction_level?: string
  behavior_level?: string
  participation_level?: string
  performance_trend?: string
  interaction_trend?: string
  commitment_trend?: string
  educational_notes?: string
  private_notes?: string
  shared_notes?: string
}

export interface TeacherMessage {
  id: number
  student_id: number
  teacher_id: number
  parent_id: number
  message: string
  attachment_path?: string
  is_from_teacher: boolean
  status: string
  read_at?: string
  created_at: string
}

export interface TeacherMessageCreate {
  student_id: number
  parent_id: number
  message: string
  attachment_path?: string
}

export interface TeacherDashboardStats {
  students_today: number
  assignments_today: number
  pending_evaluations: number
  unread_messages: number
}

export interface TeacherClass {
  id: number
  teacher_id: number
  class_name: string
  subject?: string
  grade: string
  academic_year?: string
  is_active: boolean
  created_at: string
}

// Assignments API is exported from assignments.ts to avoid conflicts

// Evaluations API
export const evaluationsAPI = {
  create: async (data: StudentEvaluationCreate): Promise<StudentEvaluation> => {
    const response = await apiClient.post<StudentEvaluation>('/teacher/evaluations/', data)
    return response.data
  },
  
  getAll: async (params?: { student_id?: number; evaluation_type?: string }): Promise<{ data: StudentEvaluation[] }> => {
    const response = await apiClient.get<StudentEvaluation[]>('/teacher/evaluations/', { params })
    return { data: response.data }
  },
  
  getById: (id: number) =>
    apiClient.get<StudentEvaluation>(`/teacher/evaluations/${id}`),
  
  update: (id: number, data: StudentEvaluationCreate) =>
    apiClient.put<StudentEvaluation>(`/teacher/evaluations/${id}`, data),
  
  delete: (id: number) =>
    apiClient.delete(`/teacher/evaluations/${id}`),
  
  getStudentHistory: (studentId: number, evaluationType?: string) =>
    apiClient.get<StudentEvaluation[]>(`/teacher/evaluations/student/${studentId}/history`, {
      params: { evaluation_type: evaluationType }
    }),
  
  getPendingCount: () =>
    apiClient.get<{ count: number }>('/teacher/evaluations/pending/count'),
}

// Messages API
export const teacherMessagesAPI = {
  send: (data: TeacherMessageCreate) =>
    apiClient.post<TeacherMessage>('/teacher/messages/', data),
  
  getAll: (params?: { student_id?: number; parent_id?: number; unread_only?: boolean }) =>
    apiClient.get<TeacherMessage[]>('/teacher/messages/', { params }),
  
  getStudentMessages: (studentId: number) =>
    apiClient.get<TeacherMessage[]>(`/teacher/messages/student/${studentId}`),
  
  getById: (id: number) =>
    apiClient.get<TeacherMessage>(`/teacher/messages/${id}`),
  
  markAsRead: (id: number) =>
    apiClient.put(`/teacher/messages/${id}/read`),
  
  getUnreadCount: () =>
    apiClient.get<{ count: number }>('/teacher/messages/unread/count'),
}

// Dashboard API
export const teacherDashboardAPI = {
  getStats: () =>
    apiClient.get<TeacherDashboardStats>('/teacher/dashboard/stats'),
  
  getClasses: () =>
    apiClient.get<TeacherClass[]>('/teacher/dashboard/classes'),
  
  createClass: (data: { class_name: string; subject?: string; grade: string; academic_year?: string }) =>
    apiClient.post<TeacherClass>('/teacher/dashboard/classes', data),
}


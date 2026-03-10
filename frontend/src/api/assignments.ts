import apiClient from './client'

export interface Assignment {
  id: number
  assignment_name: string
  subject: string
  description?: string
  due_date: string
  max_grade: number
  class_name?: string
  grade?: string
  academic_year?: string
  teacher_id?: number
  assignment_type: 'individual' | 'group'
  file_path?: string
  is_active: boolean
  created_at: string
}

export interface AssignmentCreate {
  assignment_name: string
  subject: string
  description?: string
  due_date: string
  max_grade: number
  class_name?: string
  grade?: string
  academic_year?: string
  assignment_type: 'individual' | 'group'
  file_path?: string
}

export interface AssignmentSubmission {
  id: number
  assignment_id: number
  student_id: number
  submission_status: 'pending' | 'submitted' | 'late' | 'graded'
  submitted_at?: string
  file_path?: string
  comment?: string
  teacher_comment?: string
  grade?: number
  created_at: string
  updated_at?: string
}

export const assignmentsAPI = {
  getAll: async (params?: { class_name?: string; grade?: string; subject?: string }): Promise<{ data: Assignment[] }> => {
    const response = await apiClient.get<Assignment[]>('/teacher/assignments/', { params })
    return { data: response.data }
  },

  getById: async (id: number): Promise<Assignment> => {
    const response = await apiClient.get<Assignment>(`/teacher/assignments/${id}`)
    return response.data
  },

  create: async (data: AssignmentCreate): Promise<Assignment> => {
    const response = await apiClient.post<Assignment>('/teacher/assignments/', data)
    return response.data
  },

  update: async (id: number, data: Partial<AssignmentCreate>): Promise<Assignment> => {
    const response = await apiClient.put<Assignment>(`/teacher/assignments/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/teacher/assignments/${id}`)
  },

  getSubmissions: async (assignmentId: number): Promise<{ data: AssignmentSubmission[] }> => {
    const response = await apiClient.get<AssignmentSubmission[]>(
      `/teacher/assignments/${assignmentId}/submissions`
    )
    return { data: response.data }
  },

  gradeSubmission: async (submissionId: number, data: { teacher_comment?: string; grade?: number; submission_status?: string }): Promise<AssignmentSubmission> => {
    const response = await apiClient.put<AssignmentSubmission>(`/teacher/assignments/submissions/${submissionId}`, data)
    return response.data
  },

  getTodayCount: async (): Promise<{ count: number }> => {
    const response = await apiClient.get<{ count: number }>('/teacher/assignments/today/count')
    return response.data
  },
}


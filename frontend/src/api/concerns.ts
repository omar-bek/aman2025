import apiClient from './client'

export type ConcernStatus = 'new' | 'in_progress' | 'resolved' | 'escalated'

export interface Concern {
  _id: string
  studentId: {
    _id: string
    name: string
    grade?: string
    class?: string
  }
  type: string
  priority: 'low' | 'medium' | 'high'
  title: string
  description: string
  status: ConcernStatus
  lastUpdateAt: string
  createdAt: string
}

export interface CreateConcernPayload {
  studentId: string
  type: string
  priority: 'low' | 'medium' | 'high'
  title: string
  description: string
}

export interface AISuggestionResponse {
  suggestion: string
}

export const concernsAPI = {
  getForParent: async (): Promise<Concern[]> => {
    const res = await apiClient.get<{ success: boolean; data: Concern[] }>('/concerns')
    return Array.isArray(res.data.data) ? res.data.data : []
  },

  create: async (payload: CreateConcernPayload) => {
    return apiClient.post('/concerns', payload)
  },

  suggestWithAI: async (studentId: string): Promise<AISuggestionResponse> => {
    const res = await apiClient.post<{ success: boolean; data: AISuggestionResponse }>('/concerns/ai/suggest', {
      studentId,
    })
    return res.data.data
  },
}


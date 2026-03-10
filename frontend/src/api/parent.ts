import apiClient from './client'

export type OverallStatus = 'safe' | 'informational' | 'action-required'

export interface ChildDailyStatus {
  id: string
  name: string
  grade?: string
  class?: string
  locationState: 'home' | 'on_route' | 'arrived' | 'in_class' | 'leaving' | 'unknown' | string
  attendanceState: 'pending' | 'present' | 'late' | 'absent' | string
  wellbeingState: 'stable' | 'watch' | 'attention' | string
  academicState: 'on_track' | 'behind' | 'needs_support' | 'unknown' | string
  readinessScore: number
  confidenceIndex: 'high' | 'medium' | 'low' | string
}

export interface ParentDashboardResponse {
  date: string
  overallStatus: OverallStatus
  children: ChildDailyStatus[]
  notificationsSummary: {
    unreadCount: number
    latest: {
      id: string
      title: string
      message: string
      type: string
      createdAt: string
    }[]
  }
}

export const parentAPI = {
  getDashboard: async (): Promise<ParentDashboardResponse> => {
    const response = await apiClient.get<{ success: boolean; data: ParentDashboardResponse }>(
      '/parent/dashboard',
    )
    return response.data.data
  },
}


import apiClient from './client'

export interface StaffDashboardStats {
  total_students: number
  students_present_today: number
  students_absent_today: number
  total_teachers: number
  teachers_active_today: number
  total_buses: number
  active_buses: number
  total_drivers: number
  active_drivers: number
  todays_pickups: number
  todays_dismissals: number
  pending_pickup_approvals: number
  pending_dismissal_approvals: number
  alerts_count: number
  incidents_count: number
}

export interface AttendanceTrend {
  date: string
  present: number
  absent: number
  attendance_rate: number
}

export interface TransportEfficiency {
  bus_number: string
  route_name: string
  students_on_route: number
  on_time_rate: number
  status: string
}

export interface TeacherWorkload {
  teacher_id: number
  full_name: string
  email: string
  total_classes: number
  total_students: number
  assignments_count: number
  pending_evaluations: number
  messages_count: number
  activity_score: number
  activity_level: string
}

export interface TeacherActivitySummary {
  date: string
  assignments_created: number
  evaluations_done: number
  messages_sent: number
}

export interface TeacherClassWithStudentCount {
  id: number
  class_name: string
  grade: string
  subject: string
  student_count: number
  is_active: boolean
}

export interface PickupRequestDetail {
  id: number
  student_id: number
  student_name: string
  parent_name: string
  recipient_name: string
  recipient_phone: string
  recipient_relation: string
  pickup_date: string
  pickup_time: string
  reason?: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  created_at: string
  approved_by_name?: string
  rejected_by_name?: string
}

export interface DismissalRequestDetail {
  id: number
  student_id: number
  student_name: string
  parent_name: string
  dismissal_date: string
  dismissal_time: string
  reason_type: 'medical' | 'family' | 'emergency' | 'other'
  reason_details?: string
  status: 'pending' | 'teacher_approved' | 'admin_approved' | 'rejected' | 'completed'
  created_at: string
  teacher_approved_by_name?: string
  admin_approved_by_name?: string
  rejected_by_name?: string
}

export interface ApprovalAction {
  action: 'approve' | 'reject'
  reason?: string
}

export interface BusDetail {
  id: number
  bus_number: string
  license_plate: string
  driver_name?: string
  driver_phone?: string
  capacity: number
  is_active: boolean
  student_count: number
  route_name?: string
  on_time_rate: number
}

export interface BusRouteDetail {
  id: number
  bus_id: number
  bus_number: string
  route_name: string
  start_location?: string
  end_location?: string
  waypoints?: string[]
  estimated_duration?: number
  is_active: boolean
  students_on_route?: number
  stops_count?: number
}

export const staffAPI = {
  // Dashboard APIs
  getDashboardStats: async (): Promise<StaffDashboardStats> => {
    const response = await apiClient.get<StaffDashboardStats>('/staff/dashboard/stats')
    return response.data
  },

  getAttendanceTrend: async (days: number = 7): Promise<AttendanceTrend[]> => {
    const response = await apiClient.get<AttendanceTrend[]>('/staff/dashboard/attendance-trend', {
      params: { days }
    })
    return response.data
  },

  getTransportEfficiency: async (): Promise<TransportEfficiency[]> => {
    const response = await apiClient.get<TransportEfficiency[]>('/staff/dashboard/transport-efficiency')
    return response.data
  },

  // Teacher Management APIs
  getAllTeachers: async (): Promise<any[]> => {
    const response = await apiClient.get<any[]>('/staff/teachers/')
    return response.data
  },

  getTeachersWorkload: async (): Promise<TeacherWorkload[]> => {
    const response = await apiClient.get<TeacherWorkload[]>('/staff/teachers/workload')
    return response.data
  },

  getTeacherActivity: async (teacherId: number, days: number = 30): Promise<TeacherActivitySummary[]> => {
    const response = await apiClient.get<TeacherActivitySummary[]>(`/staff/teachers/${teacherId}/activity`, {
      params: { days }
    })
    return response.data
  },

  getTeacherClasses: async (teacherId: number): Promise<TeacherClassWithStudentCount[]> => {
    const response = await apiClient.get<TeacherClassWithStudentCount[]>(`/staff/teachers/${teacherId}/classes`)
    return response.data
  },

  // Approvals APIs
  getPickupRequests: async (status?: 'pending' | 'approved' | 'rejected' | 'completed'): Promise<PickupRequestDetail[]> => {
    const params = status ? { status } : {}
    const response = await apiClient.get<PickupRequestDetail[]>('/staff/approvals/pickup-requests', { params })
    return response.data
  },

  performPickupAction: async (requestId: number, action: ApprovalAction): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(`/staff/approvals/pickup/${requestId}/action`, action)
    return response.data
  },

  getDismissalRequests: async (status?: 'pending' | 'teacher_approved' | 'admin_approved' | 'rejected' | 'completed'): Promise<DismissalRequestDetail[]> => {
    const params = status ? { status } : {}
    const response = await apiClient.get<DismissalRequestDetail[]>('/staff/approvals/dismissal-requests', { params })
    return response.data
  },

  performDismissalAction: async (requestId: number, action: ApprovalAction): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(`/staff/approvals/dismissal/${requestId}/action`, action)
    return response.data
  },

  // Bus Management APIs
  getAllBusesDetails: async (): Promise<BusDetail[]> => {
    const response = await apiClient.get<BusDetail[]>('/staff/buses/')
    return response.data
  },

  getBusDetails: async (busId: number): Promise<BusDetail> => {
    const response = await apiClient.get<BusDetail>(`/staff/buses/${busId}/details`)
    return response.data
  },

  getBusStudents: async (busId: number): Promise<any[]> => {
    const response = await apiClient.get<any[]>(`/staff/buses/${busId}/students`)
    return response.data
  },

  getAllBusRoutes: async (): Promise<BusRouteDetail[]> => {
    const response = await apiClient.get<BusRouteDetail[]>('/staff/buses/routes')
    return response.data
  }
}

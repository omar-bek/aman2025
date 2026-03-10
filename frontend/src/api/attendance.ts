import apiClient from './client'

export interface AttendanceLog {
  id: number
  student_id: number
  attendance_type: 'board_bus' | 'enter_school' | 'exit_school' | 'arrive_home'
  device_id: string
  location?: string
  timestamp: string
  verified: boolean
}

export interface Attendance {
  id: number
  student_id: number
  date: string
  status: 'present' | 'absent' | 'late' | 'excused'
  notes?: string
}

export const attendanceAPI = {
  logAttendance: async (data: {
    student_id: number
    attendance_type: string
    device_id: string
    location?: string
  }): Promise<AttendanceLog> => {
    const response = await apiClient.post<AttendanceLog>('/attendance/log', data)
    return response.data
  },

  getStudentAttendance: async (
    studentId: number,
    startDate?: string,
    endDate?: string
  ): Promise<Attendance[]> => {
    const params = new URLSearchParams()
    if (startDate) params.append('start_date', startDate)
    if (endDate) params.append('end_date', endDate)
    const response = await apiClient.get<Attendance[]>(
      `/attendance/student/${studentId}?${params.toString()}`
    )
    return response.data
  },

  getAttendanceLogs: async (studentId: number, limit = 50): Promise<AttendanceLog[]> => {
    const response = await apiClient.get<AttendanceLog[]>(
      `/attendance/logs/${studentId}?limit=${limit}`
    )
    return response.data
  },
}






import apiClient from './client'

export interface Bus {
  id: number
  bus_number: string
  license_plate?: string
  driver_name?: string
  driver_phone?: string
  capacity: number
  has_camera: boolean
  camera_stream_url?: string
  is_active: boolean
}

export interface BusLocation {
  id: number
  bus_id: number
  latitude: number
  longitude: number
  speed?: number
  heading?: number
  timestamp: string
}

export const busesAPI = {
  getAll: async (): Promise<Bus[]> => {
    const response = await apiClient.get<Bus[]>('/buses/')
    return response.data
  },

  getById: async (id: number): Promise<Bus> => {
    const response = await apiClient.get<Bus>(`/buses/${id}`)
    return response.data
  },

  getLocation: async (id: number): Promise<BusLocation> => {
    const response = await apiClient.get<BusLocation>(`/buses/${id}/location`)
    return response.data
  },

  getStudents: async (id: number) => {
    const response = await apiClient.get(`/buses/${id}/students`)
    return response.data
  },
}






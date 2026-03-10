import apiClient from './client'

export type RequestKind = 'pickup' | 'dismissal'

export type RequestStatus =
  | 'pending'
  | 'pending_teacher'
  | 'pending_admin'
  | 'approved'
  | 'rejected'
  | 'completed'
  | 'cancelled'

export interface ParentRequest {
  id: string
  kind: RequestKind
  childName: string
  typeLabel: string
  status: RequestStatus
  submittedAt: string
  slaDueAt?: string
  slaHoursRemaining?: number
}

export interface CreateParentRequestPayload {
  type: 'early_pickup' | 'absence' | 'early_leave'
  childId: string
  requestedDate: string
  requestedTime?: string
  reason: string
  details?: string
}

export const requestsAPI = {
  getForParent: async (): Promise<ParentRequest[]> => {
    const [pickupsRes, dismissalsRes] = await Promise.all([
      apiClient.get<{ success: boolean; data: any[] }>('/pickup'),
      apiClient.get<{ success: boolean; data: any[] }>('/dismissal'),
    ])

    const pickups = (pickupsRes.data.data || []).map((p: any) => ({
      id: String(p._id),
      kind: 'pickup' as RequestKind,
      childName: p.studentId?.name || 'Child',
      typeLabel: 'استلام مبكر',
      status: p.status as RequestStatus,
      submittedAt: p.createdAt,
      slaDueAt: undefined,
      slaHoursRemaining: undefined,
    }))

    const dismissals = (dismissalsRes.data.data || []).map((d: any) => ({
      id: String(d._id),
      kind: 'dismissal' as RequestKind,
      childName: d.studentId?.name || 'Child',
      typeLabel: 'مغادرة مبكرة',
      status: d.status as RequestStatus,
      submittedAt: d.createdAt,
      slaDueAt: undefined,
      slaHoursRemaining: undefined,
    }))

    return [...pickups, ...dismissals].sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
    )
  },

  createForParent: async (payload: CreateParentRequestPayload) => {
    if (payload.type === 'early_pickup') {
      const body = {
        studentId: payload.childId,
        pickupDate: payload.requestedDate,
        pickupTime: payload.requestedTime,
        authorizedPerson: {
          name: 'Parent', // can be enhanced later with real form fields
          relationship: 'Guardian',
          phone: '0000000000',
        },
      }
      return apiClient.post('/pickup', body)
    }

    // absence or early leave both map to dismissal for now
    const body = {
      studentId: payload.childId,
      dismissalDate: payload.requestedDate,
      dismissalTime: payload.requestedTime || '08:00',
      reason: payload.reason,
    }
    return apiClient.post('/dismissal', body)
  },
}


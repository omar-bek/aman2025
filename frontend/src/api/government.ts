import apiClient from './client'

export type AttendanceTimeframe = 'last_30_days' | 'current_term' | 'current_year' | 'custom'

export type SchoolTypeFilter = 'all' | 'public' | 'private' | 'public_private' | 'other'

export interface AttendanceTrendFilter {
  timeframe: AttendanceTimeframe
  startDate?: string
  endDate?: string
  emirateCode?: string
  regionCode?: string
  schoolType?: SchoolTypeFilter
  /**
   * Minimum number of students required for a data point
   * to be shown without suppression. The backend MUST also
   * enforce this threshold to prevent re-identification.
   */
  minCellSize: number
}

export interface AttendanceTrendPoint {
  /** ISO date (day or week start) */
  date: string
  /** Emirate code (e.g., AUH, DXB, SHJ) */
  emirateCode: string
  /** Optional sub-region code within emirate */
  regionCode?: string
  /** School type bucket, aligned with SchoolTypeFilter (except "all") */
  schoolType: Exclude<SchoolTypeFilter, 'all'>
  /**
   * Attendance rate in percent (0–100).
   * Will be null when suppressed due to privacy thresholds.
   */
  attendanceRate: number | null
  /** Number of schools contributing to this point */
  nSchools: number
  /** Number of students contributing to this point */
  nStudents: number
  /** True when this point is suppressed for privacy reasons */
  isSuppressed: boolean
}

export type RegionRiskLevel = 'low' | 'medium' | 'high'

export interface RegionAttendanceRisk {
  emirateCode: string
  regionCode?: string
  schoolType?: Exclude<SchoolTypeFilter, 'all'>
  averageAttendanceRate: number | null
  trendDirection: 'improving' | 'stable' | 'deteriorating' | 'unknown'
  riskLevel: RegionRiskLevel
}

export interface AttendanceAggregateSummary {
  timeframe: AttendanceTimeframe
  startDate?: string
  endDate?: string
  /** National average attendance rate for the current period */
  nationalAverageRate: number | null
  /** Change in percentage points vs comparable previous period */
  nationalChangeVsPrevious: number | null
  /** Emirates with highest attendance (codes only) */
  topEmirates: {
    emirateCode: string
    averageAttendanceRate: number | null
  }[]
  /** Emirates or regions with attendance below policy threshold */
  attentionRegions: RegionAttendanceRisk[]
  /** Threshold used to classify high-risk regions (e.g., 90%) */
  policyThreshold: number
}

export interface AttendanceTrendsResponse {
  points: AttendanceTrendPoint[]
  summary: AttendanceAggregateSummary
}

const DEFAULT_MIN_CELL_SIZE = 10

function buildQueryParams(filters: AttendanceTrendFilter): URLSearchParams {
  const params = new URLSearchParams()
  params.set('timeframe', filters.timeframe)
  if (filters.startDate) params.set('start_date', filters.startDate)
  if (filters.endDate) params.set('end_date', filters.endDate)
  if (filters.emirateCode) params.set('emirate_code', filters.emirateCode)
  if (filters.regionCode) params.set('region_code', filters.regionCode)
  if (filters.schoolType && filters.schoolType !== 'all') {
    params.set('school_type', filters.schoolType)
  }
  params.set('min_cell_size', String(filters.minCellSize || DEFAULT_MIN_CELL_SIZE))
  return params
}

function applyPrivacySuppression(
  data: AttendanceTrendsResponse,
  minCellSize: number
): AttendanceTrendsResponse {
  const threshold = minCellSize || DEFAULT_MIN_CELL_SIZE

  const points = (data.points || []).map((point) => {
    const shouldSuppress = point.nStudents < threshold
    return {
      ...point,
      attendanceRate: shouldSuppress ? null : point.attendanceRate,
      isSuppressed: shouldSuppress || point.isSuppressed,
    }
  })

  return {
    ...data,
    points,
  }
}

export const governmentAPI = {
  /**
   * Get anonymized, aggregated attendance trends for government/authority users.
   *
   * Backend contract (to be implemented server-side):
   *   GET /api/government/attendance-trends
   *   Query params: timeframe, start_date, end_date, emirate_code, region_code, school_type, min_cell_size
   *   Response: { points: AttendanceTrendPoint[], summary: AttendanceAggregateSummary }
   *
   * The backend MUST:
   *   - Enforce minimum cell size thresholds
   *   - Never return school-level identifiers or student-level data
   */
  async getAttendanceTrends(
    filters: AttendanceTrendFilter
  ): Promise<AttendanceTrendsResponse> {
    const effectiveFilters: AttendanceTrendFilter = {
      timeframe: filters.timeframe,
      startDate: filters.startDate,
      endDate: filters.endDate,
      emirateCode: filters.emirateCode,
      regionCode: filters.regionCode,
      schoolType: filters.schoolType,
      minCellSize: filters.minCellSize || DEFAULT_MIN_CELL_SIZE,
    }

    const params = buildQueryParams(effectiveFilters)
    const response = await apiClient.get<AttendanceTrendsResponse>(
      `/api/government/attendance-trends?${params.toString()}`
    )

    const rawData = response.data || { points: [], summary: undefined as any }
    return applyPrivacySuppression(rawData, effectiveFilters.minCellSize)
  },
}


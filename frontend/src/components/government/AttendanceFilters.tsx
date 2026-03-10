import type { AttendanceTrendFilter, AttendanceTimeframe, SchoolTypeFilter } from '../../api'

interface EmirateOption {
  code: string
  label: string
}

interface SchoolTypeOption {
  value: SchoolTypeFilter
  label: string
}

interface AttendanceFiltersProps {
  value: AttendanceTrendFilter
  onChange: (next: AttendanceTrendFilter) => void
  emirateOptions: EmirateOption[]
  schoolTypeOptions: SchoolTypeOption[]
}

const timeframeLabels: Record<AttendanceTimeframe, string> = {
  last_30_days: 'آخر 30 يوماً',
  current_term: 'الفصل الدراسي الحالي',
  current_year: 'العام الدراسي الحالي',
  custom: 'نطاق زمني مخصص',
}

export default function AttendanceFilters({
  value,
  onChange,
  emirateOptions,
  schoolTypeOptions,
}: AttendanceFiltersProps) {
  const handleTimeframeChange = (timeframe: AttendanceTimeframe) => {
    onChange({
      ...value,
      timeframe,
      // Clear custom dates when switching away from custom
      ...(timeframe !== 'custom'
        ? { startDate: undefined, endDate: undefined }
        : {}),
    })
  }

  const handleEmirateChange = (emirateCode: string | undefined) => {
    onChange({
      ...value,
      emirateCode: emirateCode || undefined,
      regionCode: undefined,
    })
  }

  const handleSchoolTypeChange = (schoolType: SchoolTypeFilter) => {
    onChange({
      ...value,
      schoolType,
    })
  }

  const handleDateChange = (field: 'startDate' | 'endDate', dateString: string) => {
    onChange({
      ...value,
      timeframe: 'custom',
      [field]: dateString || undefined,
    })
  }

  return (
    <div className="bg-white rounded-2xl p-4 border-2 border-gray-200 shadow-lg mb-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Timeframe selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            النطاق الزمني / Timeframe
          </label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(timeframeLabels) as AttendanceTimeframe[]).map((tf) => {
              const isActive = value.timeframe === tf
              return (
                <button
                  key={tf}
                  type="button"
                  onClick={() => handleTimeframeChange(tf)}
                  className={`
                    px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors
                    ${isActive
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-sand-50 text-gray-700 border-gray-200 hover:bg-sand-100'}
                  `}
                >
                  {timeframeLabels[tf]}
                </button>
              )
            })}
          </div>
          {value.timeframe === 'custom' && (
            <div className="mt-3 flex items-center gap-2">
              <input
                type="date"
                value={value.startDate ?? ''}
                onChange={(e) => handleDateChange('startDate', e.target.value)}
                className="flex-1 px-3 py-2 bg-sand-50 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <span className="text-gray-500 text-xs">إلى / To</span>
              <input
                type="date"
                value={value.endDate ?? ''}
                onChange={(e) => handleDateChange('endDate', e.target.value)}
                className="flex-1 px-3 py-2 bg-sand-50 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          )}
        </div>

        {/* Emirate selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            الإمارة / Emirate
          </label>
          <select
            value={value.emirateCode ?? ''}
            onChange={(e) => handleEmirateChange(e.target.value || undefined)}
            className="w-full px-4 py-2 bg-sand-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
          >
            <option value="">جميع الإمارات / All Emirates</option>
            {emirateOptions.map((option) => (
              <option key={option.code} value={option.code}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            يتم استخدام رموز الإمارات فقط (بدون أسماء مدارس أو طلاب).
          </p>
        </div>

        {/* School type selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            نوع المدرسة / School Type
          </label>
          <select
            value={value.schoolType ?? 'all'}
            onChange={(e) => handleSchoolTypeChange(e.target.value as SchoolTypeFilter)}
            className="w-full px-4 py-2 bg-sand-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
          >
            {schoolTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            جميع البيانات مجمعة حسب نوع المدرسة، بدون أي تعريف بمدرسة بعينها.
          </p>
        </div>
      </div>
    </div>
  )
}


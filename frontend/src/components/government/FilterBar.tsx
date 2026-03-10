import { useState, useEffect, useRef } from 'react'
import { Filter, X, Calendar } from 'lucide-react'

interface FilterBarProps {
  regions: string[]
  schoolTypes: string[]
  selectedRegions: string[]
  selectedSchoolTypes: string[]
  dateRange: { start: Date | null; end: Date | null }
  onRegionChange: (regions: string[]) => void
  onSchoolTypeChange: (types: string[]) => void
  onDateRangeChange: (range: { start: Date | null; end: Date | null }) => void
  onReset: () => void
}

export default function FilterBar({
  regions,
  schoolTypes,
  selectedRegions,
  selectedSchoolTypes,
  dateRange,
  onRegionChange,
  onSchoolTypeChange,
  onDateRangeChange,
  onReset,
}: FilterBarProps) {
  const [showRegionDropdown, setShowRegionDropdown] = useState(false)
  const [showSchoolTypeDropdown, setShowSchoolTypeDropdown] = useState(false)
  const regionDropdownRef = useRef<HTMLDivElement>(null)
  const schoolTypeDropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (regionDropdownRef.current && !regionDropdownRef.current.contains(event.target as Node)) {
        setShowRegionDropdown(false)
      }
      if (schoolTypeDropdownRef.current && !schoolTypeDropdownRef.current.contains(event.target as Node)) {
        setShowSchoolTypeDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const hasActiveFilters =
    selectedRegions.length > 0 || selectedSchoolTypes.length > 0 || dateRange.start || dateRange.end

  const toggleRegion = (region: string) => {
    if (selectedRegions.includes(region)) {
      onRegionChange(selectedRegions.filter((r) => r !== region))
    } else {
      onRegionChange([...selectedRegions, region])
    }
  }

  const toggleSchoolType = (type: string) => {
    if (selectedSchoolTypes.includes(type)) {
      onSchoolTypeChange(selectedSchoolTypes.filter((t) => t !== type))
    } else {
      onSchoolTypeChange([...selectedSchoolTypes, type])
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return date.toLocaleDateString('ar-AE', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <div className="bg-white rounded-2xl p-4 border-2 border-gray-200 shadow-lg mb-6">
      <div className="flex flex-wrap items-center gap-3">
        {/* Region Filter */}
        <div className="relative" ref={regionDropdownRef}>
          <button
            onClick={() => setShowRegionDropdown(!showRegionDropdown)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all
              ${selectedRegions.length > 0
                ? 'bg-teal-50 border-teal-500 text-teal-700'
                : 'bg-sand-50 border-gray-200 text-gray-700 hover:border-teal-300'
              }
            `}
            aria-label="Filter by region"
          >
            <Filter className="w-4 h-4" />
            <span className="font-medium">
              المنطقة {selectedRegions.length > 0 && `(${selectedRegions.length})`}
            </span>
            <span className="text-xs text-gray-500">Region</span>
          </button>

          {showRegionDropdown && (
            <div className="absolute top-full mt-2 left-0 bg-white rounded-xl border-2 border-gray-200 shadow-xl z-50 min-w-[200px] max-h-64 overflow-y-auto">
              <div className="p-2">
                <label className="flex items-center gap-2 p-2 hover:bg-sand-50 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedRegions.length === 0}
                    onChange={() => onRegionChange([])}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                  />
                  <span className="text-sm font-medium">جميع المناطق / All Regions</span>
                </label>
                {regions.map((region) => (
                  <label
                    key={region}
                    className="flex items-center gap-2 p-2 hover:bg-sand-50 rounded-lg cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedRegions.includes(region)}
                      onChange={() => toggleRegion(region)}
                      className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                    />
                    <span className="text-sm">{region}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* School Type Filter */}
        <div className="relative" ref={schoolTypeDropdownRef}>
          <button
            onClick={() => setShowSchoolTypeDropdown(!showSchoolTypeDropdown)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all
              ${selectedSchoolTypes.length > 0
                ? 'bg-teal-50 border-teal-500 text-teal-700'
                : 'bg-sand-50 border-gray-200 text-gray-700 hover:border-teal-300'
              }
            `}
            aria-label="Filter by school type"
          >
            <Filter className="w-4 h-4" />
            <span className="font-medium">
              نوع المدرسة {selectedSchoolTypes.length > 0 && `(${selectedSchoolTypes.length})`}
            </span>
            <span className="text-xs text-gray-500">School Type</span>
          </button>

          {showSchoolTypeDropdown && (
            <div className="absolute top-full mt-2 left-0 bg-white rounded-xl border-2 border-gray-200 shadow-xl z-50 min-w-[200px]">
              <div className="p-2">
                <label className="flex items-center gap-2 p-2 hover:bg-sand-50 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedSchoolTypes.length === 0}
                    onChange={() => onSchoolTypeChange([])}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                  />
                  <span className="text-sm font-medium">جميع الأنواع / All Types</span>
                </label>
                {schoolTypes.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 p-2 hover:bg-sand-50 rounded-lg cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSchoolTypes.includes(type)}
                      onChange={() => toggleSchoolType(type)}
                      className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                    />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-2">
          <button
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all
              ${dateRange.start || dateRange.end
                ? 'bg-teal-50 border-teal-500 text-teal-700'
                : 'bg-sand-50 border-gray-200 text-gray-700 hover:border-teal-300'
              }
            `}
            aria-label="Select date range"
          >
            <Calendar className="w-4 h-4" />
            <span className="font-medium text-sm">
              {dateRange.start && dateRange.end
                ? `${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}`
                : 'النطاق الزمني / Date Range'}
            </span>
          </button>
        </div>

        {/* Active Filter Badges */}
        {hasActiveFilters && (
          <>
            {selectedRegions.map((region) => (
              <div
                key={region}
                className="flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-700 rounded-lg text-sm font-medium"
              >
                {region}
                <button
                  onClick={() => toggleRegion(region)}
                  className="hover:bg-teal-200 rounded p-0.5"
                  aria-label={`Remove ${region} filter`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {selectedSchoolTypes.map((type) => (
              <div
                key={type}
                className="flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-700 rounded-lg text-sm font-medium"
              >
                {type}
                <button
                  onClick={() => toggleSchoolType(type)}
                  className="hover:bg-teal-200 rounded p-0.5"
                  aria-label={`Remove ${type} filter`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {/* Reset Button */}
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm"
            >
              <X className="w-4 h-4" />
              إعادة تعيين / Reset
            </button>
          </>
        )}
      </div>
    </div>
  )
}


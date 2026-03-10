interface SchoolTypeData {
  type: string
  percentage: number
  schools: number
  students: number
}

interface SchoolTypeDistributionProps {
  data: SchoolTypeData[]
}

export default function SchoolTypeDistribution({ data }: SchoolTypeDistributionProps) {
  const totalPercentage = data.reduce((sum, item) => sum + item.percentage, 0)

  return (
    <div className="space-y-4">
      {/* Horizontal Bar Chart */}
      <div className="space-y-3">
        {data.map((item, index) => {
          const colors = ['bg-emerald-500', 'bg-teal-500', 'bg-emerald-400']
          const color = colors[index % colors.length]
          
          return (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-gray-900">{item.type}</span>
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">{item.schools} مدارس</span>
                  <span className="text-gray-600">{item.students.toLocaleString()} طلاب</span>
                  <span className="font-bold text-gray-900">{item.percentage}%</span>
                </div>
              </div>
              <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${color} transition-all duration-500`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-sand-50 rounded-xl p-4 border-2 border-gray-200"
          >
            <div className="text-sm text-gray-600 mb-1">{item.type}</div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{item.percentage}%</div>
            <div className="text-xs text-gray-500">
              {item.schools} مدارس | {item.students.toLocaleString()} طلاب
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}



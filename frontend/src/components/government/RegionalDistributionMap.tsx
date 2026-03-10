import { MapPin } from 'lucide-react'

interface RegionalData {
  region: string
  schools: number
  students: number
  attendance: number
  safety: number
}

interface RegionalDistributionMapProps {
  data: RegionalData[]
}

export default function RegionalDistributionMap({ data }: RegionalDistributionMapProps) {
  // Simple table view for now - can be enhanced with actual map visualization later
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="text-right py-3 px-4 text-sm font-bold text-gray-700">الإمارة / Emirate</th>
            <th className="text-right py-3 px-4 text-sm font-bold text-gray-700">المدارس / Schools</th>
            <th className="text-right py-3 px-4 text-sm font-bold text-gray-700">الطلاب / Students</th>
            <th className="text-right py-3 px-4 text-sm font-bold text-gray-700">الحضور / Attendance</th>
            <th className="text-right py-3 px-4 text-sm font-bold text-gray-700">السلامة / Safety</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-100 hover:bg-sand-50 transition-colors"
            >
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-teal-600" />
                  <span className="font-medium text-gray-900">{item.region}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-gray-700">{item.schools.toLocaleString()}</td>
              <td className="py-3 px-4 text-gray-700">{item.students.toLocaleString()}</td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{item.attendance.toFixed(1)}%</span>
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500"
                      style={{ width: `${item.attendance}%` }}
                    />
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{item.safety.toFixed(1)}%</span>
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500"
                      style={{ width: `${item.safety}%` }}
                    />
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}



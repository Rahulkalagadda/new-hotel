import React from 'react'
import { formatINR } from '@/lib/utils'

const StatsCards: React.FC = () => {
  // Mocked numbers for now — replace with real data hooks later
  const stats = [
    { id: 1, title: 'Total Bookings', value: 128, delta: '+8%' },
    { id: 2, title: 'Occupancy Rate', value: '74%', delta: '+3%' },
    { id: 3, title: 'Revenue (30d)', value: formatINR(12450), delta: '+12%' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((s) => (
        <div key={s.id} className="bg-card rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">{s.title}</div>
              <div className="text-2xl font-semibold mt-1">{s.value}</div>
            </div>
            <div className="text-sm text-success font-medium">{s.delta}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsCards

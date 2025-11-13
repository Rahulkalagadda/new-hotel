import React from 'react'
import Link from 'next/link'

type Booking = {
  id: string
  guest: string
  hotel: string
  dates: string
  total: string
}

const mock: Booking[] = [
  { id: 'b1', guest: 'Alice M.', hotel: 'Cave Dwellings', dates: 'Mar 10 - Mar 12', total: '₹220' },
  { id: 'b2', guest: 'John K.', hotel: 'Coastal Retreat', dates: 'Mar 14 - Mar 18', total: '₹480' },
  { id: 'b3', guest: 'Sara P.', hotel: 'City Center Hotel', dates: 'Mar 20 - Mar 21', total: '₹120' },
]

const RecentBookings: React.FC = () => {
  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent bookings</h3>
        <Link href="/bookings" className="text-sm text-primary">View all</Link>
      </div>

      <ul className="space-y-3">
        {mock.map(b => (
          <li key={b.id} className="flex items-center justify-between">
            <div>
              <div className="font-medium">{b.guest}</div>
              <div className="text-sm text-muted-foreground">{b.hotel} • {b.dates}</div>
            </div>
            <div className="text-sm font-semibold">{b.total}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RecentBookings

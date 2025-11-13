import React from 'react'
import Link from 'next/link'

type Booking = {
  id: string
  title: string
  dates: string
  status: string
}

const mockBookings: Booking[] = [
  { id: 'u1', title: 'Cave Dwellings — Cappadocia', dates: 'Nov 20 - Nov 22', status: 'Confirmed' },
  { id: 'u2', title: 'Coastal Retreat — Santorini', dates: 'Dec 05 - Dec 09', status: 'Pending' },
]

const UserBookings: React.FC = () => {
  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Your upcoming trips</h3>
        <Link href="/bookings" className="text-sm text-primary">Manage</Link>
      </div>

      <ul className="space-y-3">
        {mockBookings.map(b => (
          <li key={b.id} className="flex items-center justify-between">
            <div>
              <div className="font-medium">{b.title}</div>
              <div className="text-sm text-muted-foreground">{b.dates}</div>
            </div>
            <div className={`text-sm font-medium ${b.status === 'Confirmed' ? 'text-green-600' : 'text-amber-600'}`}>{b.status}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UserBookings

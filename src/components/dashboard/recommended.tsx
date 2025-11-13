import React from 'react'
import Link from 'next/link'
import { HotelCard } from '@/components/hotel-card'

type Hotel = any

const Recommended: React.FC<{ hotels: Hotel[] }> = ({ hotels }) => {
  if (!hotels || hotels.length === 0) {
    return (
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Recommended for you</h3>
        <p className="text-muted-foreground">No recommendations available right now.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recommended for you</h3>
        <Link href="/hotels" className="text-sm text-primary">See all</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {hotels.map((hotel: any) => (
          <Link key={hotel.id} href={`/hotel/${hotel.id}`}>
            <HotelCard hotel={hotel} variant="compact" price={hotel.price ?? undefined} />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Recommended

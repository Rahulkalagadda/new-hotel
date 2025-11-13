import React from 'react'
import Link from 'next/link'
import { HotelCard } from '@/components/hotel-card'

type Hotel = any

type Flight = {
  id: string
  from: string
  to: string
  depart: string
  price: string
}

type Bus = {
  id: string
  from: string
  to: string
  depart: string
  price: string
}

const FlightCard: React.FC<{ f: Flight }> = ({ f }) => (
  <Link href={`#flight-${f.id}`} className="block border rounded-lg p-3 hover:shadow-sm bg-white">
    <div className="flex items-center justify-between">
      <div>
        <div className="font-medium">{f.from} → {f.to}</div>
        <div className="text-sm text-muted-foreground">{f.depart}</div>
      </div>
      <div className="text-right">
        <div className="text-lg font-semibold">{f.price}</div>
        <div className="text-sm text-muted-foreground">Flight</div>
      </div>
    </div>
  </Link>
)

const BusCard: React.FC<{ b: Bus }> = ({ b }) => (
  <Link href={`#bus-${b.id}`} className="block border rounded-lg p-3 hover:shadow-sm bg-white">
    <div className="flex items-center justify-between">
      <div>
        <div className="font-medium">{b.from} → {b.to}</div>
        <div className="text-sm text-muted-foreground">{b.depart}</div>
      </div>
      <div className="text-right">
        <div className="text-lg font-semibold">{b.price}</div>
        <div className="text-sm text-muted-foreground">Bus</div>
      </div>
    </div>
  </Link>
)

const RecommendedMixed: React.FC<{ hotels: Hotel[]; flights: Flight[]; buses: Bus[] }> = ({ hotels, flights, buses }) => {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recommended hotels</h3>
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

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Best flights</h3>
          <Link href="/flights" className="text-sm text-primary">Search flights</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {flights.map(f => <FlightCard key={f.id} f={f} />)}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Popular bus routes</h3>
          <Link href="/bus" className="text-sm text-primary">Search buses</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {buses.map(b => <BusCard key={b.id} b={b} />)}
        </div>
      </div>
    </div>
  )
}

export default RecommendedMixed

import React from 'react'
import Link from 'next/link'

const cards = [
  { id: 'hotels', title: 'Hotels', desc: 'Search and book stays', href: '/hotels', bg: 'bg-gradient-to-r from-pink-50 to-white' },
  { id: 'flights', title: 'Flights', desc: 'Find cheap flights', href: '/flights', bg: 'bg-gradient-to-r from-sky-50 to-white' },
  { id: 'bus', title: 'Bus', desc: 'Intercity bus tickets', href: '/bus', bg: 'bg-gradient-to-r from-emerald-50 to-white' },
]

const ExploreCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map(c => (
        <Link key={c.id} href={c.href} className={`block rounded-lg p-6 shadow-sm border ${c.bg} hover:scale-[1.01] transition-transform`}> 
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">{c.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{c.desc}</p>
            </div>
            <div className="ml-4 shrink-0">
              <div className="h-12 w-12 bg-white rounded-full shadow flex items-center justify-center text-primary font-bold">{c.title.charAt(0)}</div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default ExploreCards

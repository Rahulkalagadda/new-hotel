import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import FlightResultsClient from '@/components/flight-results-client'

type Flight = {
  id: string
  airline: string
  depart: string
  arrive: string
  duration: string
  price: string
  stops: string
}

const MOCK_FLIGHTS: Flight[] = [
  { id: 'f1', airline: 'Air India Express', depart: '10:30 New Delhi', arrive: '20:10 Bengaluru', duration: '09h 40m', price: '₹ 5,672', stops: '1 stop' },
  { id: 'f2', airline: 'Akasa Air', depart: '22:45 New Delhi', arrive: '01:40 Bengaluru', duration: '02h 55m', price: '₹ 6,828', stops: 'Non stop' },
  { id: 'f3', airline: 'IndiGo', depart: '14:15 New Delhi', arrive: '16:55 Bengaluru', duration: '02h 40m', price: '₹ 6,849', stops: 'Non stop' },
  { id: 'f4', airline: 'SpiceJet', depart: '22:00 New Delhi', arrive: '00:50 Bengaluru', duration: '02h 50m', price: '₹ 6,883', stops: 'Non stop' },
  { id: 'f5', airline: 'Akasa Air', depart: '14:50 New Delhi', arrive: '17:45 Bengaluru', duration: '02h 55m', price: '₹ 7,018', stops: 'Non stop' },
  { id: 'f5', airline: 'vistara', depart: '1:25 New Delhi', arrive: '17:45 Bengaluru', duration: '03h 00m', price: '₹ 8,000', stops: 'Non stop' },
]

export default function FlightResultsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="bg-orange-500 text-white rounded p-4 mb-6">
          <h2 className="text-lg font-semibold">Flights from New Delhi to Bengaluru, and back</h2>
        </div>

        <div className="lg:grid lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-3">
            <div className="border rounded p-4 mb-4 bg-white">
              <h3 className="font-semibold mb-3">Filters</h3>
              <div className="text-sm text-muted-foreground">
                <label className="flex items-center gap-2"><input type="checkbox" /> Non Stop</label>
                <label className="flex items-center gap-2 mt-2"><input type="checkbox" /> 1 Stop</label>
                <div className="mt-4">Price Range</div>
                <input type="range" min={0} max={10000} className="w-full" />
              </div>
            </div>
          </aside>

          <section className="lg:col-span-9">
            <div className="grid grid-cols-1 gap-4">
              {/* Top summary boxes */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="border rounded bg-white p-4">
                  <div className="text-sm text-muted-foreground">New Delhi → Bengaluru Wed, 12 Nov</div>
                </div>
                <div className="border rounded bg-white p-4">
                  <div className="text-sm text-muted-foreground">Bengaluru → New Delhi Fri, 14 Nov</div>
                </div>
              </div>

              {/* Highlighted cheapest options */}
              <div className="grid sm:grid-cols-2 gap-4">
                {MOCK_FLIGHTS.slice(0,2).map(f => (
                  <div key={f.id} className="p-4 rounded bg-teal-400 text-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{f.airline}</div>
                        <div className="text-sm">{f.depart} → {f.arrive}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">{f.price}</div>
                        <div className="text-sm">per adult</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <button className="bg-white text-teal-600 px-3 py-1 rounded font-semibold">VIEW ALL</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Results list (client) */}
              <FlightResultsClient />
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

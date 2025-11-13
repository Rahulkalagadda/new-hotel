import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Link from 'next/link'

export default function FlightsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero / Search */}
        <section className="bg-gradient-to-r from-orange-500 to-orange-400 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl md:text-3xl font-bold text-center">Book Domestic and International Flight Tickets</h1>
            <div className="mt-6 max-w-5xl mx-auto bg-white rounded-lg p-6 shadow-lg text-black">
              <form className="space-y-4">
                <div className="flex gap-3 items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="trip" defaultChecked className="h-4 w-4" />
                      <span className="text-sm">Oneway</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="trip" className="h-4 w-4" />
                      <span className="text-sm">Round Trip</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="trip" className="h-4 w-4" />
                      <span className="text-sm">Multi City</span>
                    </label>
                  </div>
                  <div className="text-sm text-muted-foreground">Book International and Domestic Flights</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold">From</label>
                    <input className="w-full border rounded px-3 py-2" placeholder="Delhi (DEL), Delhi Airport India" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold">To</label>
                    <input className="w-full border rounded px-3 py-2" placeholder="Bengaluru (BLR), Bengaluru International Airport" />
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-xs font-semibold">Departure</label>
                    <input type="date" className="w-full border rounded px-3 py-2" />
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-xs font-semibold">Return</label>
                    <input type="date" className="w-full border rounded px-3 py-2" />
                  </div>
                </div>

                <div className="flex items-center gap-3 md:justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <label className="text-xs font-semibold">Travellers & Class</label>
                      <select className="border rounded px-3 py-2">
                        <option>1 Traveller, Economy</option>
                        <option>2 Travellers, Economy</option>
                        <option>1 Traveller, Business</option>
                      </select>
                    </div>
                    <div className="hidden sm:block">
                      <label className="text-xs font-semibold">Special Fare</label>
                      <div className="flex gap-2 mt-1">
                        <button type="button" className="px-3 py-1 border rounded text-sm">Regular</button>
                        <button type="button" className="px-3 py-1 border rounded text-sm">Student</button>
                        <button type="button" className="px-3 py-1 border rounded text-sm">Senior</button>
                      </div>
                    </div>
                  </div>

                  <div className="ml-auto">
                    {/* Navigate to the flight results page when searching */}
                    <a href="/flights/results" className="inline-block">
                      <button type="button" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded">SEARCH</button>
                    </a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Offers row */}
        <section className="container mx-auto px-4 py-8">
          <h2 className="text-lg font-semibold mb-4">Offers For You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="#" className="block border rounded-lg p-4 shadow-sm">
              <div className="font-medium">Up to 52% OFF on Travel Bookings!</div>
              <div className="text-sm text-muted-foreground">Bus, Hotels, Cabs, Flights, Trains</div>
            </Link>
            <Link href="#" className="block border rounded-lg p-4 shadow-sm">
              <div className="font-medium">Bank Offers</div>
              <div className="text-sm text-muted-foreground">Save with partner cards</div>
            </Link>
            <Link href="#" className="block border rounded-lg p-4 shadow-sm">
              <div className="font-medium">Explore Offers</div>
              <div className="text-sm text-muted-foreground">View all</div>
            </Link>
            <Link href="#" className="block border rounded-lg p-4 shadow-sm">
              <div className="font-medium">Hotels</div>
              <div className="text-sm text-muted-foreground">Up to 52% OFF</div>
            </Link>
          </div>
        </section>

        {/* Popular routes & FAQs (short) */}
        <section className="container mx-auto px-4 py-6">
          <h3 className="font-semibold mb-3">Popular Flight Routes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div>
              <ul className="space-y-1">
                <li>Delhi Flights</li>
                <li>Mumbai Flights</li>
                <li>Bengaluru Flights</li>
              </ul>
            </div>
            <div>
              <ul className="space-y-1">
                <li>Goa Flights</li>
                <li>Hyderabad Flights</li>
                <li>Jaipur Flights</li>
              </ul>
            </div>
            <div>
              <ul className="space-y-1">
                <li>Chennai Flights</li>
                <li>Kolkata Flights</li>
                <li>Ahmedabad Flights</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}


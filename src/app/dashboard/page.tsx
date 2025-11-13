import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import ExploreCards from '@/components/dashboard/explore-cards'
import UserBookings from '@/components/dashboard/user-bookings'
import UserQuickActions from '@/components/dashboard/user-quick-actions'
import RecommendedMixed from '@/components/dashboard/recommended-mixed'
import { getApprovedHotels } from '@/lib/data'
import { formatINR } from '@/lib/utils'

export default async function DashboardPage() {
  const hotels = await getApprovedHotels();
  const recommended = hotels.slice(0, 6);
  // Mock top flights and buses until a real data source is added
  const recommendedFlights = [
    { id: 'f1', from: 'NYC', to: 'LON', depart: '2025-12-01 08:00', price: formatINR(399) },
    { id: 'f2', from: 'SFO', to: 'HKG', depart: '2025-12-05 13:30', price: formatINR(549) },
    { id: 'f3', from: 'DEL', to: 'DXB', depart: '2025-11-20 06:00', price: formatINR(199) },
  ];

  const recommendedBuses = [
    { id: 'b1', from: 'Athens', to: 'Thessaloniki', depart: '2025-11-18 09:00', price: formatINR(25) },
    { id: 'b2', from: 'Madrid', to: 'Barcelona', depart: '2025-11-19 12:30', price: formatINR(30) },
    { id: 'b3', from: 'Rome', to: 'Florence', depart: '2025-11-20 15:45', price: formatINR(20) },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">Find hotels, buses and flights — view your upcoming trips and manage bookings.</p>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 space-y-6">
            <ExploreCards />
            <RecommendedMixed hotels={recommended} flights={recommendedFlights} buses={recommendedBuses} />
          </div>

          <aside className="space-y-6">
            <UserQuickActions />
            <UserBookings />
          </aside>
        </section>

      </main>
      <Footer />
    </div>
  )
}

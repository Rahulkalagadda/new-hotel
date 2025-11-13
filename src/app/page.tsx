
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { HotelCard } from '@/components/hotel-card';
import { getApprovedHotels, getRoomsByHotelId, fromFirestore } from '@/lib/data';
import { SearchForm } from '@/components/search-form';
import { Button } from '@/components/ui/button';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Room } from '@/lib/types';

export default async function HomePage() {
  const allHotels = await getApprovedHotels();
  const hotelIds = allHotels.map(h => h.id);

  let allRooms: Room[] = [];
  if (hotelIds.length > 0) {
    const roomsQuery = query(collection(db, 'rooms'), where('hotelId', 'in', hotelIds), where('status', '==', 'approved'));
    const roomsSnapshot = await getDocs(roomsQuery);
    allRooms = roomsSnapshot.docs.map(doc => fromFirestore<Room>(doc)).filter(Boolean) as Room[];
  }

  const pricesByHotelId = allRooms.reduce((acc, room) => {
    if (!acc[room.hotelId] || room.price < acc[room.hotelId]) {
      acc[room.hotelId] = room.price;
    }
    return acc;
  }, {} as Record<string, number>);

  const hotelsWithPrices = allHotels.map(hotel => ({
    ...hotel,
    price: pricesByHotelId[hotel.id] || null,
  }));

  const popularInTurkey = hotelsWithPrices.filter(h => h.location.toLowerCase().includes('turkey')).slice(0, 6);
  const inGreece = hotelsWithPrices.filter(h => h.location.toLowerCase().includes('greece')).slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <SearchForm />
          </div>

          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold tracking-tight">Popular homes in Turkey</h2>
              <Button variant="ghost" size="sm">Show all &gt;</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {popularInTurkey.map((hotel) => (
                <Link href={`/hotel/${hotel.id}`} key={hotel.id}>
                  <HotelCard hotel={hotel} price={hotel.price ?? undefined} variant="compact" />
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold tracking-tight">Available in Greece this weekend</h2>
               <Button variant="ghost" size="sm">Show all &gt;</Button>
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {inGreece.map((hotel) => (
                <Link href={`/hotel/${hotel.id}`} key={hotel.id}>
                  <HotelCard hotel={hotel} price={hotel.price ?? undefined} variant="compact" />
                </Link>
              ))}
            </div>
          </section>
          
           <section className="mt-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold tracking-tight">All Stays</h2>
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {hotelsWithPrices.map((hotel) => (
                <Link href={`/hotel/${hotel.id}`} key={hotel.id}>
                  <HotelCard hotel={hotel} price={hotel.price ?? undefined} variant="compact" />
                </Link>
              ))}
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}

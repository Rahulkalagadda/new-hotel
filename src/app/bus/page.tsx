"use client";
import React, { useState, useEffect } from 'react';
import { BusCard, BusCardProps } from '@/components/BusCard';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { SearchBar } from '@/components/SearchBar';
import { FilterSidebar } from '@/components/FilterSidebar';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function BusPage() {
  const [buses, setBuses] = useState<BusCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'buses'));
        const busList: BusCardProps[] = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            operator: data.operator || '',
            busType: data.busType || '',
            departureTime: data.depart || '',
            arrivalTime: data.arrive || '',
            duration: data.duration || '',
            rating: typeof data.rating === 'number' ? data.rating : 4.0,
            reviews: typeof data.reviews === 'number' ? data.reviews : 0,
            price: typeof data.price === 'string' ? parseInt(data.price.replace(/[^\d]/g, '')) : (typeof data.price === 'number' ? data.price : 0),
            seatsAvailable: typeof data.seats === 'string' ? parseInt(data.seats.replace(/[^\d]/g, '')) : (typeof data.seats === 'number' ? data.seats : 0),
            amenities: Array.isArray(data.amenities) ? data.amenities : ['wifi'],
          };
        });
        setBuses(busList);
      } catch (error) {
        console.error('Error fetching buses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <SearchBar />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <FilterSidebar />
          </aside>
          <section className="lg:col-span-3 space-y-6">
            {loading ? (
              <div>Loading buses...</div>
            ) : buses.length === 0 ? (
              <div>No buses found.</div>
            ) : (
              buses.map((bus, idx) => (
                <BusCard key={idx} {...bus} />
              ))
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}


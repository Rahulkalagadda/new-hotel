"use client";
import React, { useState, useEffect, useMemo } from 'react';

type Bus = {
  id: string;
  number: string;
  route: string;
  seats: number;
  operator?: string;
  departureTime?: string;
  arrivalTime?: string;
  amenities?: string[];
};

type BusBooking = {
  id: string;
  passengerInfo?: { name?: string };
  seats: string[] | string;
};
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function AdminBusesPage() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [bookings, setBookings] = useState<BusBooking[]>([]);
  const [form, setForm] = useState<{ number: string; route: string; seats: string; operator: string; departureTime: string; arrivalTime: string; amenities: string }>({ number: '', route: '', seats: '', operator: '', departureTime: '', arrivalTime: '', amenities: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchBuses = async () => {
      const snapshot = await getDocs(collection(db, 'buses'));
      setBuses(snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = doc.data();
        const amenities: string[] = Array.isArray(data.amenities)
          ? data.amenities
          : typeof data.amenities === 'string' && data.amenities.trim()
          ? data.amenities.split(',').map((s: string) => s.trim())
          : [];
        return {
          id: doc.id,
          number: data.number || '',
          route: data.route || '',
          seats: typeof data.seats === 'number' ? data.seats : Number(data.seats || 0),
          operator: data.operator || '',
          departureTime: data.departureTime || '',
          arrivalTime: data.arrivalTime || '',
          amenities,
        } as Bus;
      }));
      setLoading(false);
    };
    fetchBuses();
  }, []);

  const filteredBuses = useMemo(() => {
    const s = search.toLowerCase().trim();
    if (!s) return buses;
    return buses.filter((b: Bus) => [b.number, b.route, b.operator].filter(Boolean).some(v => String(v).toLowerCase().includes(s)));
  }, [buses, search]);

  const handleAddBus = async () => {
    if (!form.number || !form.route || !form.seats) return;
    const docRef = await addDoc(collection(db, 'buses'), {
      number: form.number,
      route: form.route,
      seats: Number(form.seats),
      operator: form.operator,
      departureTime: form.departureTime,
      arrivalTime: form.arrivalTime,
      amenities: form.amenities
    });
    setBuses([...buses, {
      id: docRef.id,
      number: form.number,
      route: form.route,
      seats: Number(form.seats),
      operator: form.operator,
      departureTime: form.departureTime,
      arrivalTime: form.arrivalTime,
      amenities: form.amenities ? form.amenities.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
    }]);
    setForm({ number: '', route: '', seats: '', operator: '', departureTime: '', arrivalTime: '', amenities: '' });
  };

  const handleEditBus = async (bus: Bus) => {
    setForm({
      number: bus.number,
      route: bus.route,
      seats: String(bus.seats ?? ''),
      operator: bus.operator || '',
      departureTime: bus.departureTime || '',
      arrivalTime: bus.arrivalTime || '',
      amenities: (bus.amenities || []).join(', '),
    });
    setEditId(bus.id);
  };

  const handleUpdateBus = async () => {
    if (!editId) return;
    await updateDoc(doc(db, 'buses', editId), {
      number: form.number,
      route: form.route,
      seats: Number(form.seats),
      operator: form.operator,
      departureTime: form.departureTime,
      arrivalTime: form.arrivalTime,
      amenities: form.amenities
    });
    setBuses(buses.map((b: Bus) => b.id === editId ? {
      ...b,
      number: form.number,
      route: form.route,
      seats: Number(form.seats),
      operator: form.operator,
      departureTime: form.departureTime,
      arrivalTime: form.arrivalTime,
      amenities: form.amenities ? form.amenities.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
    } : b));
    setForm({ number: '', route: '', seats: '', operator: '', departureTime: '', arrivalTime: '', amenities: '' });
    setEditId(null);
  };

  const handleDeleteBus = async (busId: string) => {
    await deleteDoc(doc(db, 'buses', busId));
    setBuses(buses.filter(b => b.id !== busId));
  };

  const handleViewBookings = async (busId: string) => {
    const bus = buses.find(b => b.id === busId) || null;
    setSelectedBus(bus);
    setModalOpen(true);
    const bookingsQuery = query(collection(db, 'bus_bookings'), where('busId', '==', busId));
    const snapshot = await getDocs(bookingsQuery);
    setBookings(snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
      const data = doc.data();
      return {
        id: doc.id,
        passengerInfo: data.passengerInfo,
        seats: data.seats || [],
      } as BusBooking;
    }));
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-[#111418] dark:text-gray-200">
      <div className="flex h-screen w-full">
        <main className="w-full overflow-y-auto">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Admin Bus Management</h1>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Add New Bus</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <input className="form-input-custom" placeholder="Bus Number" type="text" value={form.number} onChange={e => setForm(f => ({ ...f, number: e.target.value }))} />
                  <input className="form-input-custom" placeholder="Operator" type="text" value={form.operator} onChange={e => setForm(f => ({ ...f, operator: e.target.value }))} />
                  <div className="relative">
                    <input className="form-input-custom w-full pr-10" placeholder="Departure Time" type="text" value={form.departureTime} onChange={e => setForm(f => ({ ...f, departureTime: e.target.value }))} />
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">schedule</span>
                  </div>
                  <div className="relative">
                    <input className="form-input-custom w-full pr-10" placeholder="Arrival Time" type="text" value={form.arrivalTime} onChange={e => setForm(f => ({ ...f, arrivalTime: e.target.value }))} />
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">schedule</span>
                  </div>
                  <input className="form-input-custom" placeholder="Available Seats" type="text" value={form.seats} onChange={e => setForm(f => ({ ...f, seats: e.target.value }))} />
                  <input className="form-input-custom md:col-span-2" placeholder="Route (e.g. City A - City B)" type="text" value={form.route} onChange={e => setForm(f => ({ ...f, route: e.target.value }))} />
                  <button onClick={editId ? handleUpdateBus : handleAddBus} className="w-full justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">{editId ? 'Update Bus' : 'Add Bus'}</button>
                </div>
              </div>
            </div>
            <div>
              <div className="mb-6">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                  <input className="form-input-custom max-w-sm pl-10" placeholder="Search buses..." type="text" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBuses.map(bus => (
                  <div key={bus.id} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden flex flex-col">
                    <img alt="Bus Image" className="w-full h-40 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7kVeNAM23NP3SnOExQ_tP1n-qJKMWZuG5yrMqMrqB03cVGHbeHsq0ajFdBa-cWceLooUnSpO9XyC6Vx_7iyVHZFg9Nn77mqMtCDA1CpDcjjfMXu6wmu_-Ht8DHSlGtuvNkBu0gqdE3cumTucjgd_pUETK-MTn6iDaub-UUnitXRJu5XEjdaE8bpj_SwFcgvHnZxD9lx4tnn9EnfxNjgIpdonYl-dUXj6xl63gJxhNNXa--Cfdu9kN66Q-zuhzIkvDA3l_HX3uor0" />
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{bus.number}</h2>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{bus.operator}</p>
                        </div>
                        <span className="rounded-full bg-green-100 dark:bg-green-900 px-3 py-1 text-xs font-medium text-green-700 dark:text-green-200">{bus.seats} Seats</span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 mb-4 space-y-1">
                        <p><span className="font-medium">Departure:</span> {bus.departureTime}</p>
                        <p><span className="font-medium">Arrival:</span> {bus.arrivalTime}</p>
                      </div>
                      <div className="mt-auto flex items-center gap-2">
                        <button onClick={() => handleEditBus(bus)} className="flex items-center justify-center gap-1.5 flex-1 rounded-md bg-gray-100 dark:bg-gray-700 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600"><span className="material-symbols-outlined text-base">edit</span>Edit</button>
                        <button onClick={() => handleViewBookings(bus.id)} className="flex items-center justify-center gap-1.5 flex-1 rounded-md bg-gray-100 dark:bg-gray-700 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600"><span className="material-symbols-outlined text-base">receipt_long</span>Bookings</button>
                        <button onClick={() => handleDeleteBus(bus.id)} className="flex items-center justify-center gap-1.5 rounded-md bg-red-500/10 dark:bg-red-500/20 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-300 shadow-sm hover:bg-red-500/20 dark:hover:bg-red-500/30"><span className="material-symbols-outlined text-base">delete</span></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bookings for Bus {selectedBus?.number}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {bookings.length === 0 ? (
              <div>No bookings found for this bus.</div>
            ) : (
              <table className="min-w-full border">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Booking ID</th>
                    <th className="border px-4 py-2">Passenger Name</th>
                    <th className="border px-4 py-2">Seats</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b: BusBooking) => (
                    <tr key={b.id}>
                      <td className="border px-4 py-2">{b.id}</td>
                      <td className="border px-4 py-2">{b.passengerInfo?.name}</td>
                      <td className="border px-4 py-2">{Array.isArray(b.seats) ? b.seats.join(', ') : b.seats}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

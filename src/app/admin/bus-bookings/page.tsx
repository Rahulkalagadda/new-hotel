"use client";
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { db } from '@/lib/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { DataTable } from '@/components/admin/data-table';
import { Button } from '@/components/ui/button';

interface BusBooking {
  id: string;
  seats: string[];
  passengerInfo: any;
  status: string;
  createdAt: any;
}

export default function AdminBusBookingsPage() {
  const columns = [
    {
      accessorKey: 'id',
      header: 'Booking ID',
    },
    {
      accessorKey: 'seats',
      header: 'Seats',
      cell: ({ row }: any) => row.original.seats.join(', '),
    },
    {
      accessorKey: 'passengerInfo',
      header: 'Passenger Name',
      cell: ({ row }: any) => row.original.passengerInfo?.name || '-',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => (
        <span className={row.original.status === 'confirmed' ? 'text-green-600' : 'text-red-600'}>
          {row.original.status}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }: any) => {
        const date = row.original.createdAt?.toDate ? row.original.createdAt.toDate() : row.original.createdAt;
        return date ? new Date(date).toLocaleString() : '-';
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        row.original.status === 'confirmed' ? (
          <Button size="sm" variant="destructive" onClick={async () => {
            await updateDoc(doc(db, 'bus_bookings', row.original.id), { status: 'cancelled' });
            window.location.reload();
          }}>
            Cancel
          </Button>
        ) : null
      ),
    },
  ];

  const [bookings, setBookings] = useState<BusBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [searchSeat, setSearchSeat] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<BusBooking | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      const snapshot = await getDocs(collection(db, 'bus_bookings'));
      setBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BusBooking)));
      setLoading(false);
    };
    fetchBookings();
  }, []);

  // Filter bookings
  const filteredBookings = bookings.filter(b => {
    const nameMatch = searchName ? (b.passengerInfo?.name || "").toLowerCase().includes(searchName.toLowerCase()) : true;
    const seatMatch = searchSeat ? b.seats.join(",").toLowerCase().includes(searchSeat.toLowerCase()) : true;
    const statusMatch = searchStatus ? b.status === searchStatus : true;
    const dateMatch = searchDate ? (b.createdAt?.toDate ? b.createdAt.toDate().toLocaleDateString() : b.createdAt) === searchDate : true;
    return nameMatch && seatMatch && statusMatch && dateMatch;
  });

  // CSV Export
  const exportCSV = () => {
    const rows = filteredBookings.map(b => ({
      BookingID: b.id,
      Seats: b.seats.join(','),
      PassengerName: b.passengerInfo?.name || '-',
      Status: b.status,
      CreatedAt: b.createdAt?.toDate ? b.createdAt.toDate().toLocaleString() : b.createdAt,
    }));
    const csv = [Object.keys(rows[0]).join(','), ...rows.map(r => Object.values(r).map(v => `"${v}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bus_bookings.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Bus Bookings Management</h1>
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by passenger name"
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Search by seat"
            value={searchSeat}
            onChange={e => setSearchSeat(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <select
            value={searchStatus}
            onChange={e => setSearchStatus(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <input
            type="date"
            value={searchDate}
            onChange={e => setSearchDate(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <button
            onClick={exportCSV}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Export CSV
          </button>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            <DataTable
              columns={columns.map(col =>
                col.header === 'Booking ID'
                  ? {
                      ...col,
                      cell: ({ row }: any) => (
                        <button
                          className="underline text-blue-600 hover:text-blue-800"
                          onClick={() => {
                            setSelectedBooking(row.original);
                            setModalOpen(true);
                          }}
                        >
                          {row.original.id}
                        </button>
                      ),
                    }
                  : col
              )}
              data={filteredBookings}
            />
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Booking Details</DialogTitle>
                </DialogHeader>
                {selectedBooking && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-lg">Booking ID:</span>
                      <span className="text-gray-700">{selectedBooking.id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Seats:</span>
                      <span>{selectedBooking.seats.join(', ')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Status:</span>
                      <span className={selectedBooking.status === 'confirmed' ? 'text-green-600' : 'text-red-600'}>{selectedBooking.status}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Created At:</span>
                      <span>{selectedBooking.createdAt?.toDate ? selectedBooking.createdAt.toDate().toLocaleString() : selectedBooking.createdAt}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Passenger Info:</span>
                      <div className="bg-gray-100 p-2 rounded text-xs mt-1">
                        <div><strong>Name:</strong> {selectedBooking.passengerInfo?.name || '-'}</div>
                        <div><strong>Email:</strong> {selectedBooking.passengerInfo?.email || '-'}</div>
                        <div><strong>Phone:</strong> {selectedBooking.passengerInfo?.phone || '-'}</div>
                        {/* Add more passenger fields as needed */}
                      </div>
                    </div>
                    {selectedBooking.status === 'confirmed' && (
                      <button
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-4 w-full"
                        onClick={async () => {
                          await updateDoc(doc(db, 'bus_bookings', selectedBooking.id), { status: 'cancelled' });
                          setModalOpen(false);
                          window.location.reload();
                        }}
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

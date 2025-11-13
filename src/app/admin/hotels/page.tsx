"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { updateDoc } from 'firebase/firestore';

type Hotel = {
  id: string;
  name: string;
  location?: string;
  ownerName?: string;
  status?: 'pending' | 'approved' | 'rejected';
};

type HotelBooking = {
  id: string;
  guestName?: string;
  checkInDate?: string;
  checkOutDate?: string;
};

export default function AdminHotelsPage() {
	const { user } = useAuth();
	const router = useRouter();
	useEffect(() => {
		if (user && user.role !== 'admin') {
			router.replace('/');
		}
	}, [user, router]);
	const [hotels, setHotels] = useState<Hotel[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
	const [bookings, setBookings] = useState<HotelBooking[]>([]);
	const [modalOpen, setModalOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [editHotel, setEditHotel] = useState<Hotel | null>(null);
	const [editForm, setEditForm] = useState<{ name: string; location: string; status: 'pending' | 'approved' | 'rejected' } | null>(null);

	// Fetch hotels
	useEffect(() => {
		const fetchHotels = async () => {
			const snapshot = await getDocs(collection(db, 'hotels'));
			setHotels(snapshot.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Hotel[]);
			setLoading(false);
		};
		fetchHotels();
	}, []);

	// Delete hotel
	const handleDeleteHotel = async (hotelId: string) => {
		await deleteDoc(doc(db, 'hotels', hotelId));
		setHotels(hotels.filter(h => h.id !== hotelId));
	};

	// View bookings for hotel
	const handleViewBookings = async (hotelId: string) => {
		setSelectedHotel(hotels.find(h => h.id === hotelId) || null);
		setModalOpen(true);
		const bookingsQuery = query(collection(db, 'bookings'), where('hotelId', '==', hotelId));
		const snapshot = await getDocs(bookingsQuery);
		setBookings(snapshot.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as HotelBooking[]);
	};

	const handleEditHotel = (hotel: Hotel) => {
		setEditHotel(hotel);
		setEditForm({ name: hotel.name || '', location: hotel.location || '', status: (hotel.status || 'pending') as 'pending' | 'approved' | 'rejected' });
		setEditOpen(true);
	};

	const handleSaveHotel = async () => {
		if (!editHotel || !editForm) return;
		await updateDoc(doc(db, 'hotels', editHotel.id), {
			name: editForm.name,
			location: editForm.location,
			status: editForm.status,
		});
		setHotels(hotels.map(h => (h.id === editHotel.id ? { ...h, ...editForm } : h)));
		setEditOpen(false);
		setEditHotel(null);
		setEditForm(null);
	};

	return (
		<div className="container mx-auto py-12">
			<h1 className="text-3xl font-bold mb-8">Admin Hotel Management</h1>
			{loading ? (
				<div>Loading...</div>
			) : (
				<table className="min-w-full border">
					<thead>
						<tr>
							<th className="border px-4 py-2">Hotel Name</th>
							<th className="border px-4 py-2">Location</th>
							<th className="border px-4 py-2">Owner</th>
							<th className="border px-4 py-2">Actions</th>
						</tr>
					</thead>
					<tbody>
						{hotels.map(hotel => (
							<tr key={hotel.id}>
								<td className="border px-4 py-2">{hotel.name}</td>
								<td className="border px-4 py-2">{hotel.location}</td>
								<td className="border px-4 py-2">{hotel.ownerName}</td>
								<td className="border px-4 py-2 space-x-2">
									<Button variant="outline" onClick={() => handleViewBookings(hotel.id)}>View Bookings</Button>
									<Button variant="outline" onClick={() => handleEditHotel(hotel)}>Edit</Button>
									<Button variant="destructive" onClick={() => handleDeleteHotel(hotel.id)}>Delete</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
					{/* Edit Hotel Modal */}
					<Dialog open={editOpen} onOpenChange={setEditOpen}>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Edit Hotel</DialogTitle>
							</DialogHeader>
							{editForm && (
								<div className="space-y-3">
									<input className="border rounded px-3 py-2 w-full" placeholder="Hotel Name" value={editForm.name} onChange={e => setEditForm({ ...(editForm as any), name: e.target.value })} />
									<input className="border rounded px-3 py-2 w-full" placeholder="Location" value={editForm.location} onChange={e => setEditForm({ ...(editForm as any), location: e.target.value })} />
									<select className="border rounded px-3 py-2 w-full" value={editForm.status} onChange={e => setEditForm({ ...(editForm as any), status: e.target.value as any })}>
										<option value="pending">Pending</option>
										<option value="approved">Approved</option>
										<option value="rejected">Rejected</option>
									</select>
									<div className="flex justify-end gap-2">
										<Button variant="outline" onClick={() => { setEditOpen(false); setEditHotel(null); setEditForm(null); }}>Cancel</Button>
										<Button onClick={handleSaveHotel}>Save</Button>
									</div>
								</div>
							)}
						</DialogContent>
					</Dialog>
			<Dialog open={modalOpen} onOpenChange={setModalOpen}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>Bookings for {selectedHotel?.name}</DialogTitle>
					</DialogHeader>
					<div className="mt-4">
						{bookings.length === 0 ? (
							<div>No bookings found for this hotel.</div>
						) : (
							<table className="min-w-full border">
								<thead>
									<tr>
										<th className="border px-4 py-2">Booking ID</th>
										<th className="border px-4 py-2">Guest Name</th>
										<th className="border px-4 py-2">Check-in</th>
										<th className="border px-4 py-2">Check-out</th>
									</tr>
								</thead>
								<tbody>
									{bookings.map(b => (
										<tr key={b.id}>
											<td className="border px-4 py-2">{b.id}</td>
											<td className="border px-4 py-2">{b.guestName}</td>
											<td className="border px-4 py-2">{b.checkInDate}</td>
											<td className="border px-4 py-2">{b.checkOutDate}</td>
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

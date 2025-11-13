
import { notFound } from 'next/navigation';
import { getHotelById, getRoomsByHotelId, getHotelsByOwner } from '@/lib/data';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { AddRoomForm } from '@/components/add-room-form';
import type { Hotel, Room } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { formatINR } from '@/lib/utils';

type HotelManagementPageProps = {
  params: {
    id: string;
  };
};

// This is a server component, but we'll fetch data and pass it to client components.
export default async function HotelManagementPage({ params }: HotelManagementPageProps) {
  const hotel = await getHotelById(params.id);

  if (!hotel || hotel.status !== 'approved') {
    // A simple check to ensure only owners can see their approved hotels.
    // In a real app, you'd have more robust role-based access control.
    notFound();
  }

  const rooms = await getRoomsByHotelId(params.id);
  const ownerHotels = await getHotelsByOwner(hotel.ownerId);

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Header />
      <main className="flex-1 py-12 md:py-24">
        <div className="container mx-auto px-4 space-y-8">
            <div>
                <h1 className="text-4xl font-headline font-bold">{hotel.name}</h1>
                <p className="text-muted-foreground">Manage your property details and rooms.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <AddRoomForm ownerHotels={ownerHotels} selectedHotelId={hotel.id} />
                </div>
                <div>
                     <Card>
                        <CardHeader>
                            <CardTitle>Your Rooms</CardTitle>
                            <CardDescription>A list of all rooms at {hotel.name}.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Room</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rooms.length > 0 ? rooms.map((room) => (
                                        <TableRow key={room.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-3">
                                                    <Image src={room.images[0]} alt={room.title} width={80} height={50} className="rounded-md object-cover" />
                                                    <div>
                                                        <p className="font-bold">{room.title}</p>
                                                        <p className="text-xs text-muted-foreground">{room.capacity} Guests</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{formatINR(room.price)}/night</TableCell>
                                            <TableCell>
                                                <Badge variant={room.status === 'approved' ? 'default' : room.status === 'pending' ? 'secondary' : 'destructive'} className="capitalize">
                                                    {room.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-24 text-center">
                                                You haven't added any rooms yet.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

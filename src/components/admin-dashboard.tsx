
"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  getAllUsers,
  updateHotelStatus,
  updateRoomStatus,
  fromFirestore,
} from "@/lib/data";
import type { Hotel, Room, Booking, User } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Loader2, Building, BedDouble, User as UserIcon, BookOpen, Calendar, Archive, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { format } from "date-fns";
import { db } from "@/lib/firebase";
import { formatINR } from '@/lib/utils';
import { collection, query, where, onSnapshot, doc, getDoc, Timestamp } from "firebase/firestore";
import { DataTable } from "./admin/data-table";
import { columns as allHotelsColumns } from "./admin/all-hotels-columns";
import { columns as allUsersColumns } from "./admin/all-users-columns";


export function AdminDashboard() {
  const [pendingHotels, setPendingHotels] = useState<Hotel[]>([]);
  const [allHotels, setAllHotels] = useState<Hotel[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [pendingRooms, setPendingRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);

    const hotelsQuery = query(collection(db, 'hotels'));
    const roomsQuery = query(collection(db, 'rooms'), where('status', '==', 'pending'));
    const bookingsQuery = query(collection(db, 'bookings'));
    const usersQuery = query(collection(db, 'users'));

    const unsubscribeHotels = onSnapshot(hotelsQuery, (snapshot) => {
        const hotelsData = snapshot.docs.map(doc => fromFirestore<Hotel>(doc)).filter(Boolean) as Hotel[];
        setAllHotels(hotelsData);
        setPendingHotels(hotelsData.filter(h => h.status === 'pending'));
        setLoading(false);
    });

    const unsubscribeRooms = onSnapshot(roomsQuery, async (snapshot) => {
        const roomsData = snapshot.docs.map(doc => fromFirestore<Room>(doc)).filter(Boolean) as Room[];
        const enrichedRooms = await Promise.all(roomsData.map(async (room) => {
             const hotelDocRef = doc(db, 'hotels', room.hotelId);
             const hotelDoc = await getDoc(hotelDocRef);
             const hotelData = hotelDoc.exists() ? fromFirestore<Hotel>(hotelDoc) : undefined;
             return { ...room, hotelName: hotelData ? hotelData.name : 'Unknown Hotel' };
        }));
        setPendingRooms(enrichedRooms);
    });

    const unsubscribeBookings = onSnapshot(bookingsQuery, (snapshot) => {
        const bookingsData = snapshot.docs.map(doc => fromFirestore<Booking>(doc)).filter(Boolean) as Booking[];
        setBookings(bookingsData);
    });

    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
        const usersData = snapshot.docs.map(doc => fromFirestore<User>(doc)).filter(Boolean) as User[];
        setAllUsers(usersData);
    });


    return () => {
        unsubscribeHotels();
        unsubscribeRooms();
        unsubscribeBookings();
        unsubscribeUsers();
    };
}, []);


  const handleHotelAction = (hotelId: string, action: 'approve' | 'reject') => {
    startTransition(async () => {
      await updateHotelStatus(hotelId, action === 'approve' ? 'approved' : 'rejected');
      toast({
        title: `Hotel ${action}d`,
        description: `The hotel has been successfully ${action}d.`,
      });
    });
  };

  const handleRoomAction = (roomId: string, action: 'approve' | 'reject') => {
     startTransition(async () => {
      await updateRoomStatus(roomId, action === 'approve' ? 'approved' : 'rejected');
      toast({
        title: `Room ${action}d`,
        description: `The room has been successfully ${action}d.`,
      });
    });
  };

  if (loading && allHotels.length === 0) { // Only show initial big loader
    return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <Tabs defaultValue="all-hotels">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="hotels">
          <Building className="mr-2 h-4 w-4" />
          Pending Hotels <Badge className="ml-2">{pendingHotels.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="all-hotels">
            <Archive className="mr-2 h-4 w-4" />
            All Hotels <Badge className="ml-2">{allHotels.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="rooms">
          <BedDouble className="mr-2 h-4 w-4" />
          Pending Rooms <Badge className="ml-2">{pendingRooms.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="bookings">
          <BookOpen className="mr-2 h-4 w-4" />
          All Bookings <Badge className="ml-2">{bookings.length}</Badge>
        </TabsTrigger>
         <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            All Users <Badge className="ml-2">{allUsers.length}</Badge>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="hotels">
        <Card>
           <CardHeader>
                <CardTitle>Hotel Approval Queue</CardTitle>
                <CardDescription>Review and approve or reject new hotel submissions.</CardDescription>
            </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[350px]">Hotel</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingHotels.length > 0 ? pendingHotels.map((hotel) => (
                  <TableRow key={hotel.id}>
                    <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                            <Image src={hotel.coverImage} alt={hotel.name} width={100} height={60} className="rounded-md object-cover" />
                            <div>
                                <p className="font-bold">{hotel.name}</p>
                                <p className="text-xs text-muted-foreground line-clamp-2">{hotel.description}</p>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>{hotel.location}</TableCell>
                    <TableCell>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="flex items-center gap-2">
                                        <UserIcon className="h-4 w-4" />
                                        <span>{hotel.ownerName}</span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{hotel.ownerEmail}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="icon" variant="outline" className="text-green-500 hover:text-green-500 hover:bg-green-500/10 border-green-500/50" disabled={isPending} onClick={() => handleHotelAction(hotel.id, 'approve')}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline" className="text-red-500 hover:text-red-500 hover:bg-red-500/10 border-red-500/50" disabled={isPending} onClick={() => handleHotelAction(hotel.id, 'reject')}>
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            No pending hotels.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
       <TabsContent value="all-hotels">
            <Card>
                <CardHeader>
                    <CardTitle>All Hotels</CardTitle>
                    <CardDescription>A complete list of all hotels on the platform.</CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable columns={allHotelsColumns} data={allHotels} />
                </CardContent>
            </Card>
       </TabsContent>
      <TabsContent value="rooms">
        <Card>
            <CardHeader>
                <CardTitle>Room Approval Queue</CardTitle>
                <CardDescription>Review and approve or reject new room submissions.</CardDescription>
            </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[350px]">Room</TableHead>
                  <TableHead>Hotel</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
            {pendingRooms.length > 0 ? pendingRooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">
                       <div className="flex items-center gap-3">
                            <Image src={room.images[0]} alt={room.title} width={100} height={60} className="rounded-md object-cover" />
                            <div>
                                <p className="font-bold">{room.title}</p>
                                <p className="text-xs text-muted-foreground line-clamp-2">{room.description}</p>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>{room.hotelName}</TableCell>
                    <TableCell>{formatINR(room.price)}</TableCell>
                    <TableCell className="text-right space-x-2">
                       <Button size="icon" variant="outline" className="text-green-500 hover:text-green-500 hover:bg-green-500/10 border-green-500/50" disabled={isPending} onClick={() => handleRoomAction(room.id, 'approve')}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline" className="text-red-500 hover:text-red-500 hover:bg-red-500/10 border-red-500/50" disabled={isPending} onClick={() => handleRoomAction(room.id, 'reject')}>
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                     <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            No pending rooms.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
       <TabsContent value="bookings">
        <Card>
            <CardHeader>
                <CardTitle>All Platform Bookings</CardTitle>
                <CardDescription>A list of all reservations across all properties.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Guest</TableHead>
                            <TableHead>Hotel &amp; Room</TableHead>
                            <TableHead>Dates</TableHead>
                            <TableHead className="text-right">Total Paid</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bookings.length > 0 ? bookings.map(booking => (
                            <TableRow key={booking.id}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <UserIcon className="h-4 w-4" />
                                        <span>{booking.userName}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <p className="font-medium">{booking.hotelName}</p>
                                    <p className="text-sm text-muted-foreground">{booking.roomTitle}</p>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            {format(booking.fromDate as Date, "LLL d")} - {format(booking.toDate as Date, "LLL d, yyyy")}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-medium">{formatINR(booking.totalPrice)}</TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    There are no bookings on the platform yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="users">
        <Card>
            <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>A complete list of all users on the platform.</CardDescription>
            </CardHeader>
            <CardContent>
                <DataTable columns={allUsersColumns} data={allUsers} />
            </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

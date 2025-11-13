
"use client"

import React, { useState, useTransition, useMemo } from 'react';
import type { Room, Hotel } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { createBooking } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { Loader2, Minus, Plus } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import type { DateRange } from "react-day-picker"
import { Calendar } from './ui/calendar';
import { format, differenceInDays } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatINR } from '@/lib/utils';
import { Separator } from './ui/separator';


interface BookingCardProps {
    rooms: Room[];
    hotel: Hotel;
}

export function BookingCard({ rooms, hotel }: BookingCardProps) {
    const { toast } = useToast();
    const { user } = useAuth();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>(rooms.length > 0 ? rooms[0].id : undefined);
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [guests, setGuests] = useState({
        adults: 1,
        children: 0,
        infants: 0
    });

    const selectedRoom = useMemo(() => {
        return rooms.find(room => room.id === selectedRoomId);
    }, [rooms, selectedRoomId]);

    const totalGuests = guests.adults + guests.children;
    const guestText = totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}` : 'Add guests';

    const numberOfNights = dateRange?.from && dateRange?.to ? differenceInDays(dateRange.to, dateRange.from) : 0;
    const totalPrice = selectedRoom && numberOfNights > 0 ? selectedRoom.price * numberOfNights : 0;
    const serviceFee = totalPrice > 0 ? Math.round(totalPrice * 0.1) : 0;
    const finalTotal = totalPrice + serviceFee;

    const handleGuestChange = (type: keyof typeof guests, operation: 'increment' | 'decrement') => {
        setGuests(prev => {
            const current_val = prev[type];
            let new_val = operation === 'increment' ? current_val + 1 : Math.max(0, current_val - 1);

            // Adults must be at least 1 if other guests are present
            if(type === 'adults' && new_val < 1 && (prev.children > 0 || prev.infants > 0)) {
                return prev;
            }

            // Cap guests to room capacity
            const currentTotalGuests = prev.adults + prev.children;
            if (operation === 'increment' && selectedRoom && (currentTotalGuests + 1 > selectedRoom.capacity)) {
                toast({
                    variant: 'destructive',
                    title: "Capacity Exceeded",
                    description: `This room can only accommodate ${selectedRoom.capacity} guests.`
                })
                return prev;
            }

            return { ...prev, [type]: new_val };
        })
    }

    const handleBooking = () => {
        if (!user) {
            toast({
                variant: "destructive",
                title: "Authentication Required",
                description: "Please sign in to book a room.",
            });
            router.push('/login');
            return;
        }

        if (!dateRange?.from || !dateRange?.to || !selectedRoomId) {
            toast({
                variant: "destructive",
                title: "Incomplete Information",
                description: "Please select a room, date range, and number of guests.",
            });
            return;
        }

        startTransition(async () => {
            try {
                await createBooking({
                    userId: user.id,
                    roomId: selectedRoomId,
                    hotelId: hotel.id,
                    fromDate: dateRange.from!,
                    toDate: dateRange.to!,
                });
                toast({
                    title: "Booking Confirmed!",
                    description: `Your stay at ${hotel.name} is booked.`,
                });
                router.push("/bookings");
            } catch (error) {
                console.error("Booking failed:", error);
                toast({
                    variant: "destructive",
                    title: "Booking Failed",
                    description: (error as Error).message || "Could not book the room at this time.",
                });
            }
        });
    };

    if (rooms.length === 0) {
        return (
             <Card className="shadow-xl rounded-2xl border p-6 sticky top-24">
                <p className="text-center text-muted-foreground">No rooms are available for booking at this hotel.</p>
            </Card>
        )
    }

    return (
        <Card className="shadow-xl rounded-2xl border p-6 sticky top-24">
            <CardHeader className="p-0 mb-4">
                <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">{formatINR(selectedRoom?.price)}</span>
                        <span className="text-muted-foreground">night</span>
                    </div>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
                 <div className="rounded-lg border">
                    <div className="grid grid-cols-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className="pr-2 py-3 text-left">
                                    <p className="text-xs font-bold pl-3">CHECK-IN</p>
                                    <p className="text-sm pl-3 text-muted-foreground">{dateRange?.from ? format(dateRange.from, "MM/dd/yyyy") : "Add date"}</p>
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={dateRange?.from}
                                    selected={dateRange}
                                    onSelect={setDateRange}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                         <Popover>
                            <PopoverTrigger asChild>
                                <button className="pl-3 py-3 text-left border-l">
                                    <p className="text-xs font-bold">CHECKOUT</p>
                                    <p className="text-sm text-muted-foreground">{dateRange?.to ? format(dateRange.to, "MM/dd/yyyy") : "Add date"}</p>
                                </button>
                            </PopoverTrigger>
                             <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={dateRange?.from}
                                    selected={dateRange}
                                    onSelect={setDateRange}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="border-t">
                        <Select onValueChange={setSelectedRoomId} defaultValue={selectedRoomId}>
                            <SelectTrigger className="w-full border-0 rounded-t-none focus:ring-0">
                                <SelectValue placeholder="Select a room" />
                            </SelectTrigger>
                            <SelectContent>
                                {rooms.map(room => (
                                     <SelectItem key={room.id} value={room.id}>{room.title} (Max: {room.capacity} guests)</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="border-t">
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className="text-left w-full p-3">
                                    <p className="text-xs font-bold">GUESTS</p>
                                    <p className="text-sm text-muted-foreground">{guestText}</p>
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80" align="end">
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <h4 className="font-medium leading-none">Guests</h4>
                                        <p className="text-sm text-muted-foreground">Select the number of guests.</p>
                                    </div>
                                    <div className="grid gap-4">
                                        {Object.entries(guests).map(([type, count]) => (
                                            <div key={type} className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium capitalize">{type}</p>
                                                    {type === 'infants' && <p className="text-xs text-muted-foreground">Under 2</p>}
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <Button variant="outline" size="icon" className="rounded-full h-8 w-8" onClick={() => handleGuestChange(type as keyof typeof guests, 'decrement')}>
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <span className="w-4 text-center">{count}</span>
                                                    <Button variant="outline" size="icon" className="rounded-full h-8 w-8" onClick={() => handleGuestChange(type as keyof typeof guests, 'increment')}>
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                 </div>

                <Button onClick={handleBooking} disabled={isPending || !dateRange?.from || !dateRange?.to || !selectedRoom} size="lg" className="w-full h-12 text-base font-bold">
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Reserve
                </Button>

                <p className="text-center text-sm text-muted-foreground">You won't be charged yet</p>

                {totalPrice > 0 && (
                     <div className="space-y-2 pt-4">
                        <div className="flex justify-between">
                            <span className="underline">{formatINR(selectedRoom?.price)} x {numberOfNights} nights</span>
                            <span>{formatINR(totalPrice)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="underline">Service fee</span>
                            <span>{formatINR(serviceFee)}</span>
                        </div>
                         <Separator className="my-2" />
                         <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>{formatINR(finalTotal)}</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

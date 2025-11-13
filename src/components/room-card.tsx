
"use client"

import React, { useState, useTransition } from "react"
import Image from "next/image"
import type { Room, Hotel } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Users, BedDouble, Wallet, Loader2 } from "lucide-react"
import { formatINR } from '@/lib/utils'
import { DateRangePicker } from "./ui/date-range-picker"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { createBooking } from "@/lib/data"
import type { DateRange } from "react-day-picker"
import { useRouter } from "next/navigation"

interface RoomCardProps {
  room: Room
  hotel: Hotel
}

// NOTE: This component is currently not used on the main hotel page, 
// as booking is handled by the BookingCard. 
// It's kept for potential future use, e.g., on a dedicated rooms page.
export function RoomCard({ room, hotel }: RoomCardProps) {
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 7)),
  });

  const handleBooking = () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to book a room.",
      })
      router.push('/login');
      return
    }

    if (!dateRange?.from || !dateRange?.to) {
        toast({
            variant: "destructive",
            title: "Invalid Dates",
            description: "Please select a valid date range.",
        })
        return
    }

    startTransition(async () => {
      try {
        await createBooking({
            userId: user.id,
            roomId: room.id,
            hotelId: hotel.id,
            fromDate: dateRange.from!,
            toDate: dateRange.to!,
        })
        toast({
          title: "Booking Confirmed!",
          description: `Your stay at ${hotel.name} is booked.`,
        })
        router.push("/bookings");
      } catch (error) {
        console.error("Booking failed:", error)
        toast({
          variant: "destructive",
          title: "Booking Failed",
          description: (error as Error).message || "Could not book the room at this time.",
        })
      }
    })
  }

  return (
    <Card className="grid grid-cols-1 md:grid-cols-12 overflow-hidden shadow-sm">
      <div className="md:col-span-5">
        <Carousel className="w-full h-full">
          <CarouselContent>
            {room.images.map((src, index) => (
              <CarouselItem key={index}>
                <div className="relative aspect-[4/3] h-full">
                  <Image
                    src={src}
                    alt={`${room.title} view ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint={(room as any)['data-ai-hint'] || 'hotel room'}
                    className="bg-muted"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {room.images.length > 1 && (
            <>
              <CarouselPrevious className="absolute left-3 bg-background/50 hover:bg-background" />
              <CarouselNext className="absolute right-3 bg-background/50 hover:bg-background" />
            </>
          )}
        </Carousel>
      </div>
      <div className="md:col-span-7 flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline">{room.title}</CardTitle>
          <CardDescription>{room.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow space-y-4">
          <div className="flex items-center text-sm text-muted-foreground gap-4">
            <span className="flex items-center gap-2"><BedDouble className="w-4 h-4" /> 1 King Bed</span>
            <span className="flex items-center gap-2"><Users className="w-4 h-4" /> {room.capacity} Guests</span>
            <span className="flex items-center gap-2"><Wallet className="w-4 h-4" /> Free cancellation</span>
          </div>
          <div>
            <DateRangePicker initialDateRange={dateRange} onSelect={setDateRange} />
          </div>
        </CardContent>
        <CardFooter className="bg-secondary/50 p-4 flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold">{formatINR(room.price)}</span>
            <span className="text-sm text-muted-foreground">/night</span>
          </div>
          <Button onClick={handleBooking} disabled={isPending || !dateRange?.from}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Book Now
          </Button>
        </CardFooter>
      </div>
    </Card>
  )
}

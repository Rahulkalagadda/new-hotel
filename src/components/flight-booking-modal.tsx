"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useAuth } from '@/hooks/use-auth'
import { db } from '@/lib/firebase'
import { addDoc, collection, serverTimestamp, Timestamp } from 'firebase/firestore'

type FlightInfo = {
  id: string
  airline: string
  depart: string
  arrive: string
  duration: string
  price: string
  stops: string
}

type Props = {
  flight: FlightInfo | null
  open: boolean
  onOpenChangeAction: (open: boolean) => void
  onBookedAction?: () => void
}

export default function FlightBookingModal({ flight, open, onOpenChangeAction, onBookedAction }: Props) {
  const [step, setStep] = useState<number>(1)
  const router = useRouter()
  const { user } = useAuth();

  const handleContinue = () => {
    if (step === 1) {
      setStep(2)
      return
    }

    // final book: create a bookings document so it appears in My Bookings
    (async () => {
      try {
        if (!user) {
          alert('Please log in to complete booking.');
          return;
        }

        const fromDate = new Date();
        const toDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const parsedPrice = flight && flight.price ? Number(String(flight.price).replace(/[^0-9.-]+/g, '')) : 0;

        const bookingsCol = collection(db, 'bookings');

        const docRef = await addDoc(bookingsCol, {
          userId: user.id,
          roomId: flight ? `flight-${flight.id}` : `flight-unknown`,
          hotelId: flight ? `flight-${flight.id}` : `flight-unknown`,
          fromDate: Timestamp.fromDate(fromDate),
          toDate: Timestamp.fromDate(toDate),
          totalPrice: parsedPrice,
          status: 'confirmed',
          createdAt: serverTimestamp(),
          hotelName: flight ? `${flight.airline} (Flight)` : 'Flight Booking',
          hotelLocation: '',
          roomTitle: 'Flight Seat',
          coverImage: '/images/flight-depart.svg',
          userName: user.name,
          hotelOwnerId: user.id,
        });

        console.log('Booking document created:', docRef.id);
        onBookedAction?.();
        onOpenChangeAction(false);
        try { router.push('/bookings') } catch (e) { /* ignore */ }
      } catch (err) {
        console.error('Failed to create booking doc:', err);
        alert('Failed to create booking: ' + (err as Error).message);
      }
    })();
  }

  const handleBack = () => {
    if (step === 1) onOpenChangeAction(false)
    else setStep(step - 1)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] p-6">
        <DialogHeader>
          <DialogTitle>Flight Details and Fare Options</DialogTitle>
          <DialogDescription>
            {step === 1 ? "DEPART: Select fare and continue" : "RETURN: Review and confirm"}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 overflow-auto max-h-[60vh]">
          {step === 1 ? (
            <img src="/images/flight-depart.svg" alt="Depart" className="w-full max-h-[60vh] object-contain rounded" />
          ) : (
            <img src="/images/flight-return.svg" alt="Return" className="w-full max-h-[60vh] object-contain rounded" />
          )}
        </div>

        <DialogFooter>
          <div className="flex w-full items-center justify-between">
            <button
              onClick={handleBack}
              className="px-4 py-2 border rounded text-sm bg-white"
            >
              {step === 1 ? "Back" : "Back"}
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => { onOpenChangeAction(false); setStep(1) }}
                className="px-4 py-2 rounded text-sm bg-gray-100"
              >
                Close
              </button>

              <button
                onClick={handleContinue}
                className="px-4 py-2 rounded text-sm bg-orange-500 text-white"
              >
                {step === 1 ? "Continue" : "Book Now"}
              </button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import React, { useState } from "react"
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
import { useRouter } from 'next/navigation'

type BusInfo = {
  id: string
  operator: string
  depart: string
  arrive: string
  duration: string
  price: string
  seats: string
}

type Props = {
  bus: BusInfo | null
  open: boolean
  onOpenChangeAction: (open: boolean) => void
  onBookedAction?: () => void
}

export default function BusBookingModal({ bus, open, onOpenChangeAction, onBookedAction }: Props) {
  const [step, setStep] = useState<number>(1)
  const { user } = useAuth()
  const router = useRouter()

  const handleContinue = () => {
    if (step < 3) {
      setStep(step + 1)
      return
    }

    // final book
    (async () => {
      if (!user) {
        alert('Please log in to complete booking.')
        return
      }

      try {
        const fromDate = new Date()
        const toDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
        const parsedPrice = bus && bus.price ? Number(String(bus.price).replace(/[^0-9.-]+/g, '')) : 0
        const bookingsCol = collection(db, 'bookings')

        const docRef = await addDoc(bookingsCol, {
          userId: user.id,
          roomId: bus ? `bus-${bus.id}` : 'bus-unknown',
          hotelId: bus ? `bus-${bus.id}` : 'bus-unknown',
          fromDate: Timestamp.fromDate(fromDate),
          toDate: Timestamp.fromDate(toDate),
          totalPrice: parsedPrice,
          status: 'confirmed',
          createdAt: serverTimestamp(),
          hotelName: bus ? `${bus.operator} (Bus)` : 'Bus Booking',
          hotelLocation: '',
          roomTitle: 'Bus Seat',
          coverImage: '/images/bus-1.svg',
          userName: user.name,
          hotelOwnerId: user.id,
        })

        console.log('Bus booking created:', docRef.id)
        onBookedAction?.()
        onOpenChangeAction(false)
        try { router.push('/bookings') } catch (e) {}
      } catch (err) {
        console.error('Failed to create booking:', err)
        alert('Failed to create booking: ' + (err as Error).message)
      }
    })()
  }

  const handleBack = () => {
    if (step === 1) onOpenChangeAction(false)
    else setStep(step - 1)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="max-w-5xl w-full max-h-[90vh] p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left: main content with step image and details */}
          <div className="md:flex-1 bg-white rounded p-4 overflow-auto max-h-[70vh]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold">{bus ? bus.operator : 'Selected Bus'}</h3>
                <div className="text-sm text-muted-foreground">{bus ? `${bus.depart} • ${bus.duration} • ${bus.arrive}` : ''}</div>
              </div>

              <div className="text-sm text-muted-foreground">Step {step} of 3</div>
            </div>

            <div className="rounded overflow-hidden bg-slate-50">
              {step === 1 && <img src="/images/bus-1.svg" alt="Search" className="w-full object-cover" />}
              {step === 2 && <img src="/images/bus-2.svg" alt="Results" className="w-full object-cover" />}
              {step === 3 && <img src="/images/bus-3.svg" alt="Review" className="w-full object-cover" />}
            </div>

            <div className="mt-4 space-y-3">
              {step === 1 && (
                <div>
                  <h4 className="font-medium">Search details</h4>
                  <p className="text-sm text-muted-foreground mt-1">Choose your route and travel date, then continue to select seats.</p>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h4 className="font-medium">Select seat</h4>
                  <p className="text-sm text-muted-foreground mt-1">Pick preferred seats (this is a demo UI — selection is illustrative).</p>
                  <div className="mt-3 grid grid-cols-6 gap-2">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <button key={i} className="px-2 py-2 bg-white border rounded text-sm">{i + 1}</button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h4 className="font-medium">Review & traveller details</h4>
                  <p className="text-sm text-muted-foreground mt-1">Enter traveller name and contact details to complete the booking.</p>
                  <div className="mt-3 grid grid-cols-1 gap-2">
                    <input placeholder="Full name" className="border rounded px-3 py-2 w-full" />
                    <input placeholder="Mobile number" className="border rounded px-3 py-2 w-full" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: price summary and actions */}
          <aside className="w-full md:w-80 bg-white border rounded p-4 h-fit">
            <div className="text-sm text-muted-foreground">Price Summary</div>
            <div className="mt-3">
              <div className="flex items-center justify-between">
                <div className="text-sm">Base Fare</div>
                <div className="font-medium">{bus ? bus.price : '—'}</div>
              </div>
              <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                <div>Discounts</div>
                <div>-₹0</div>
              </div>
              <div className="border-t my-3" />
              <div className="flex items-center justify-between text-lg font-bold">
                <div>Total</div>
                <div>{bus ? bus.price : '—'}</div>
              </div>
            </div>

              <div className="mt-4 space-y-2">
                <button onClick={handleContinue} className="w-full px-4 py-2 bg-orange-500 text-white rounded">
                  {step < 3 ? 'Continue' : 'Book Now'}
                </button>

                <button onClick={handleBack} className="w-full px-4 py-2 border rounded">
                  Back
                </button>

                <button onClick={() => { onOpenChangeAction(false); setStep(1) }} className="w-full px-4 py-2 text-sm text-muted-foreground">
                  Close
                </button>

                <button onClick={() => { onOpenChangeAction(false); try { window.location.href = '/bus/booking' } catch(e){} }} className="w-full px-4 py-2 text-sm border rounded mt-2">
                  Open full booking page
                </button>
              </div>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  )
}

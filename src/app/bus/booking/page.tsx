"use client";
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import React from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Stepper } from '@/components/bus/Stepper';
import { SeatSelection } from '@/components/bus/SeatSelection';
import { BoardDropPoint } from '@/components/bus/BoardDropPoint';
import { PassengerInfo } from '@/components/bus/PassengerInfo';
import { BusDetails } from '@/components/bus/BusDetails';
import { CheckCircle } from 'lucide-react';

export default function BusBookingPage() {
  // ...existing code...
  // Stepper-based booking flow
  // Remove BusBookingFull and use the new booking flow
  // Import required components
  // import { Stepper } from '@/components/bus/Stepper';
  // import { SeatSelection } from '@/components/bus/SeatSelection';
  // import { BoardDropPoint } from '@/components/bus/BoardDropPoint';
  // import { PassengerInfo } from '@/components/bus/PassengerInfo';
  // import { BusDetails } from '@/components/bus/BusDetails';
  // import { CheckCircle } from 'lucide-react';

  // Use React useState
  // If you want to keep Header/Footer, wrap the booking flow in main
  // Otherwise, remove them for a cleaner booking experience
  // Here, we keep them
  // ...existing code...
  // Booking flow logic
  // You may want to move this to a separate component for clarity
  // For now, inline
  // ...existing code...
  // --- Begin booking flow ---
  // Place this inside your main
  // ...existing code...
  // ---
  // Booking flow state
  const [currentStep, setCurrentStep] = React.useState(1);
  const [selectedSeats, setSelectedSeats] = React.useState<string[]>([]);
  const [passengerInfo, setPassengerInfo] = React.useState<any>(null);
  const [bookingComplete, setBookingComplete] = React.useState(false);
  const [bookingId, setBookingId] = React.useState<string>("");

  const steps = [
    { number: 1, title: 'Select seats' },
    { number: 2, title: 'Board/Drop point' },
    { number: 3, title: 'Passenger Info' }
  ];

  const handleBooking = async (info?: any) => {
    // Save booking to Firestore
    try {
      const docRef = await addDoc(collection(db, 'bus_bookings'), {
        seats: selectedSeats,
        passengerInfo: info || passengerInfo,
        createdAt: serverTimestamp(),
        status: 'confirmed',
      });
      setBookingId(docRef.id);
      setPassengerInfo(info || passengerInfo);
      setBookingComplete(true);
    } catch (error) {
      alert('Error saving booking. Please try again.');
    }
  };

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seat) => {
      const price = parseInt(seat.split('-')[1]);
      return total + price;
    }, 0);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        {bookingComplete ? (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-12 text-center max-w-md">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
              <p className="text-gray-600 mb-6">
                Your bus tickets have been confirmed. A confirmation email has been sent to your registered email address.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                <p className="text-sm text-gray-600 mb-2"><span className="font-medium text-gray-900">Booking ID:</span> {bookingId ? `#${bookingId}` : "-"}</p>
                <p className="text-sm text-gray-600 mb-2"><span className="font-medium text-gray-900">Seats:</span> {selectedSeats.join(', ')}</p>
                <p className="text-sm text-gray-600"><span className="font-medium text-gray-900">Total Amount:</span> ₹{calculateTotal()}</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-[#E53935] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#D32F2F] transition-colors"
              >
                Book Another Ticket
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {currentStep === 1 && (
                  <SeatSelection
                    selectedSeats={selectedSeats}
                    onSeatSelect={setSelectedSeats}
                  />
                )}

                {currentStep === 2 && (
                  <BoardDropPoint
                    selectedSeats={selectedSeats}
                    onContinue={() => setCurrentStep(3)}
                  />
                )}

                {currentStep === 3 && (
                  <PassengerInfo
                    selectedSeats={selectedSeats}
                    onBook={info => handleBooking(info)}
                  />
                )}
              </div>

              <div className="lg:col-span-1">
                {currentStep === 1 && <BusDetails selectedSeats={selectedSeats} />}

                {(currentStep === 2 || currentStep === 3) && (
                  <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Booking Summary</h3>

                    <div className="space-y-4 pb-4 border-b border-gray-200">
                      <div>
                        <p className="text-sm text-gray-600">Bus</p>
                        <p className="font-medium text-gray-900">IntrCity SmartBus</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Journey Date</p>
                        <p className="font-medium text-gray-900">Wed 12 Nov 2025</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Seats Selected</p>
                        <p className="font-medium text-gray-900">{selectedSeats.join(', ')}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Passengers</p>
                        <p className="font-medium text-gray-900">{selectedSeats.length}</p>
                      </div>
                    </div>

                    <div className="pt-4">
                      <div className="flex justify-between mb-3">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium text-gray-900">₹{calculateTotal()}</span>
                      </div>
                      <div className="flex justify-between mb-4">
                        <span className="text-gray-600">Taxes & Fees</span>
                        <span className="font-medium text-gray-900">₹{Math.round(calculateTotal() * 0.1)}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-4 flex justify-between">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="text-xl font-bold text-[#E53935]">₹{calculateTotal() + Math.round(calculateTotal() * 0.1)}</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200 text-xs text-gray-500">
                      <p>Cancellation allowed up to 24 hours before departure</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {currentStep === 1 && selectedSeats.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 py-4">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {selectedSeats.length} seat(s) selected
                </p>
                <p className="text-xl font-semibold text-gray-900">
                  ₹{calculateTotal()}
                </p>
              </div>
              <button
                onClick={() => setCurrentStep(2)}
                className="bg-[#E53935] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#D32F2F] transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}


"use client";
import { User, Mail, Phone } from 'lucide-react';
import { useState } from 'react';

interface PassengerInfoProps {
  selectedSeats: string[];
  onBook: (passengers: Passenger[]) => void;
}

interface Passenger {
  name: string;
  email: string;
  phone: string;
  age?: string;
}

export function PassengerInfo({ selectedSeats, onBook }: PassengerInfoProps) {
  const [passengers, setPassengers] = useState<Passenger[]>(
    selectedSeats.map(() => ({ name: '', email: '', phone: '', age: '' }))
  );

  const [agreeTerms, setAgreeTerms] = useState(false);

  const handlePassengerChange = (index: number, field: keyof Passenger, value: string) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const isFormValid =
    agreeTerms &&
    passengers.every(p => p.name.trim() && p.email.trim() && p.phone.trim());

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Passenger Information</h2>

      <div className="space-y-6">
        {passengers.map((passenger, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h3 className="font-medium text-gray-900 mb-4">Passenger {index + 1} (Seat {selectedSeats[index]})</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                <input
                  type="text"
                  value={passenger.name}
                  onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                  placeholder="Enter full name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E53935] focus:border-transparent"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  value={passenger.age}
                  onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                  placeholder="Age"
                  min="1"
                  max="120"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E53935] focus:border-transparent"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <input
                  type="email"
                  value={passenger.email}
                  onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                  placeholder="Enter email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E53935] focus:border-transparent"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={passenger.phone}
                  onChange={(e) => handlePassengerChange(index, 'phone', e.target.value)}
                  placeholder="10-digit mobile"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E53935] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-1"
          />
          <div>
            <p className="text-sm text-gray-700">
              I agree to the <a href="#" className="text-[#E53935] hover:underline">terms and conditions</a> and <a href="#" className="text-[#E53935] hover:underline">privacy policy</a>
            </p>
          </div>
        </label>
      </div>

      <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
        <button className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          Back
        </button>
        <button
          onClick={() => onBook(passengers)}
          disabled={!isFormValid}
          className={`flex-1 px-6 py-3 rounded-lg font-medium text-white transition-colors ${
            isFormValid
              ? 'bg-[#E53935] hover:bg-[#D32F2F]'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}


"use client";
import { MapPin, Clock } from 'lucide-react';
import { useState } from 'react';

interface BoardDropPointProps {
  onContinue: () => void;
  selectedSeats: string[];
}

export function BoardDropPoint({ onContinue, selectedSeats }: BoardDropPointProps) {
  const [selectedBoarding, setSelectedBoarding] = useState<string>('');
  const [selectedDropping, setSelectedDropping] = useState<string>('');

  const boardingPoints = [
    {
      id: 'sion',
      name: 'Sion, Mumbai',
      time: '15:45',
      address: 'Sion Station, Mumbai 400022'
    },
    {
      id: 'dadar',
      name: 'Dadar, Mumbai',
      time: '16:00',
      address: 'Dadar Station East, Mumbai 400014'
    },
    {
      id: 'bandra',
      name: 'Bandra, Mumbai',
      time: '16:15',
      address: 'Bandra Station, Mumbai 400050'
    },
  ];

  const droppingPoints = [
    {
      id: 'pune-central',
      name: 'Pune Central',
      time: '20:55',
      address: 'Shivaji Nagar, Pune 411005'
    },
    {
      id: 'pune-camp',
      name: 'Pune Camp',
      time: '21:05',
      address: 'Camp, Pune 411001'
    },
    {
      id: 'pune-airport',
      name: 'Pune Airport',
      time: '21:20',
      address: 'Lohegaon, Pune 411014'
    },
  ];

  const isFormValid = selectedBoarding && selectedDropping;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Select Boarding & Dropping Points</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#E53935]" />
            Boarding Point
          </h3>

          <div className="space-y-3">
            {boardingPoints.map((point) => (
              <label
                key={point.id}
                className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedBoarding === point.id
                    ? 'border-[#E53935] bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="boarding"
                  value={point.id}
                  checked={selectedBoarding === point.id}
                  onChange={(e) => setSelectedBoarding(e.target.value)}
                  className="mt-1"
                />
                <div className="ml-3 flex-1">
                  <p className="font-medium text-gray-900">{point.name}</p>
                  <p className="text-sm text-gray-600 mt-1">{point.address}</p>
                  <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {point.time}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#E53935]" />
            Dropping Point
          </h3>

          <div className="space-y-3">
            {droppingPoints.map((point) => (
              <label
                key={point.id}
                className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedDropping === point.id
                    ? 'border-[#E53935] bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="dropping"
                  value={point.id}
                  checked={selectedDropping === point.id}
                  onChange={(e) => setSelectedDropping(e.target.value)}
                  className="mt-1"
                />
                <div className="ml-3 flex-1">
                  <p className="font-medium text-gray-900">{point.name}</p>
                  <p className="text-sm text-gray-600 mt-1">{point.address}</p>
                  <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {point.time}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
        <button className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          Back
        </button>
        <button
          onClick={onContinue}
          disabled={!isFormValid}
          className={`flex-1 px-6 py-3 rounded-lg font-medium text-white transition-colors ${
            isFormValid
              ? 'bg-[#E53935] hover:bg-[#D32F2F]'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Continue to Passenger Info
        </button>
      </div>
    </div>
  );
}

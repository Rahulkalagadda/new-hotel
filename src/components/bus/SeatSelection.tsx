import { Seat } from './Seat';
import { CircleDot } from 'lucide-react';

interface SeatSelectionProps {
  selectedSeats: string[];
  onSeatSelect: (seats: string[]) => void;
}

const lowerDeckSeats = [
  [{ id: 'L1-449', price: 449, status: 'available' }],
  [{ id: 'L2', price: 0, status: 'sold' }],
  [{ id: 'L3', price: 0, status: 'sold' }],
  [{ id: 'L4', price: 0, status: 'sold' }],
  [{ id: 'L5-820', price: 820, status: 'available' }],
];

const lowerDeckRight = [
  [{ id: 'L6', price: 0, status: 'sold' }, { id: 'L7', price: 0, status: 'sold' }],
  [{ id: 'L8-799', price: 799, status: 'available' }, { id: 'L9-799', price: 799, status: 'available' }],
  [{ id: 'L10-799', price: 799, status: 'available' }, { id: 'L11-799', price: 799, status: 'available' }],
  [{ id: 'L12-799', price: 799, status: 'available' }, { id: 'L13-799', price: 799, status: 'available' }],
  [{ id: 'L14-769', price: 769, status: 'available' }, { id: 'L15-769', price: 769, status: 'available' }],
  [{ id: 'L16-609', price: 609, status: 'available' }, { id: 'L17-609', price: 609, status: 'available' }],
];

const upperDeckSeats = [
  [{ id: 'U1-729', price: 729, status: 'available' }, { id: 'U2-729', price: 729, status: 'available' }],
  [{ id: 'U3', price: 0, status: 'sold' }, { id: 'U4', price: 0, status: 'sold' }],
  [{ id: 'U5', price: 0, status: 'sold' }, { id: 'U6', price: 0, status: 'sold' }],
  [{ id: 'U7-689', price: 689, status: 'available' }],
  [{ id: 'U8', price: 0, status: 'sold' }, { id: 'U9', price: 0, status: 'sold' }],
  [{ id: 'U10-1029', price: 1029, status: 'available' }],
  [{ id: 'U11-729', price: 729, status: 'available' }, { id: 'U12-729', price: 729, status: 'available' }],
  [{ id: 'U13-779', price: 779, status: 'available' }],
  [{ id: 'U14', price: 0, status: 'sold' }, { id: 'U15', price: 0, status: 'sold' }],
];

export function SeatSelection({ selectedSeats, onSeatSelect }: SeatSelectionProps) {
  const handleSeatClick = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      onSeatSelect(selectedSeats.filter(id => id !== seatId));
    } else {
      onSeatSelect([...selectedSeats, seatId]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Seats</h2>

        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border-2 border-green-500 rounded"></div>
            <span className="text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-300 rounded"></div>
            <span className="text-gray-600">Sold</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded"></div>
            <span className="text-gray-600">Selected</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Lower deck</h3>
            <CircleDot className="w-5 h-5 text-gray-400" />
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex gap-8">
              <div className="flex flex-col gap-2">
                {lowerDeckSeats.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex gap-2">
                    {row.map((seat) => (
                      <Seat
                        key={seat.id}
                        seat={seat}
                        isSelected={selectedSeats.includes(seat.id)}
                        onSelect={handleSeatClick}
                      />
                    ))}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                {lowerDeckRight.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex gap-2">
                    {row.map((seat) => (
                      <Seat
                        key={seat.id}
                        seat={seat}
                        isSelected={selectedSeats.includes(seat.id)}
                        onSelect={handleSeatClick}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-900 mb-4">Upper deck</h3>

          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex flex-col gap-2">
              {upperDeckSeats.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-2 justify-end">
                  {row.map((seat) => (
                    <Seat
                      key={seat.id}
                      seat={seat}
                      isSelected={selectedSeats.includes(seat.id)}
                      onSelect={handleSeatClick}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Know your seat types</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Seat Types</span>
            <span className="font-medium">Seater</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600"></span>
            <span className="font-medium">Sleeper</span>
          </div>
        </div>
      </div>
    </div>
  );
}

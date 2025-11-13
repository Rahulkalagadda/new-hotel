interface SeatData {
  id: string;
  price: number;
  status: 'available' | 'sold' | 'selected';
}

interface SeatProps {
  seat: SeatData;
  isSelected: boolean;
  onSelect: (seatId: string) => void;
}

export function Seat({ seat, isSelected, onSelect }: SeatProps) {
  const isSold = seat.status === 'sold';

  const getSeatClass = () => {
    if (isSold) return 'bg-gray-300 cursor-not-allowed';
    if (isSelected) return 'bg-blue-500 border-blue-500 cursor-pointer';
    return 'border-2 border-green-500 bg-white hover:bg-green-50 cursor-pointer';
  };

  return (
    <button
      onClick={() => !isSold && onSelect(seat.id)}
      disabled={isSold}
      className={`w-12 h-16 rounded ${getSeatClass()} transition-all relative group`}
    >
      {!isSold && seat.price > 0 && (
        <span className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-gray-700'}`}>
          ₹{seat.price}
        </span>
      )}
      {isSold && (
        <span className="text-xs text-gray-500">Sold</span>
      )}
    </button>
  );
}

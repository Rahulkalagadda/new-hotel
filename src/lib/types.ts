export type Bus = {
  id: string;
  operator: string;
  depart: string;
  arrive: string;
  duration: string;
  price: string;
  seats: string;
};
export type Flight = {
  id: string;
  airline: string;
  depart: string;
  arrive: string;
  duration: string;
  price: string;
  stops: string;
};


import { Timestamp } from 'firebase/firestore';

export type User = {
  id: string;
  name: string;
  email: string;
  // In a real app, you would not store passwords in plaintext.
  // This is for demonstration purposes only.
  password?: string;
  role: 'user' | 'owner' | 'admin';
  createdAt: Date | Timestamp;
};

export type NewUser = Omit<User, 'id' | 'createdAt'>;

export type HotelDocument = {
    name: string;
    url: string;
}

export type Hotel = {
  id: string;
  name: string;
  location: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  facilities: string[];
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  isPetFriendly: boolean;
  documents: HotelDocument[];
  ownerId: string;
  status: 'pending' | 'approved' | 'rejected';
  coverImage: string;
  category?: 'Premium' | 'Eco-Friendly' | 'Ski Resort' | 'Historic' | 'Boutique';
  createdAt: Date;
  ownerName?: string; // For admin view
  ownerEmail?: string; // For admin view
  'data-ai-hint'?: string;
};

export type NewHotel = Omit<Hotel, 'id' | 'status' | 'createdAt'> & {
    coverImage?: string;
};

export type HotelSearchCriteria = {
  destination?: string;
  dateRange?: { from: Date; to: Date };
  guests?: number;
  facilities?: string[];
  minPrice?: number;
  maxPrice?: number;
}

export type Room = {
  id: string;
  title: string;
  hotelId: string;
  description: string;
  price: number;
  images: string[];
  capacity: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date | Timestamp;
  hotelName?: string; // For admin view
  'data-ai-hint'?: string;
};

export type NewRoom = Omit<Room, 'id' | 'createdAt' | 'hotelName' | 'data-ai-hint'> & {
    images: string[];
};

export type Booking = {
  id: string;
  userId: string;
  roomId: string;
  hotelId:string;
  fromDate: Date | Timestamp;
  toDate: Date | Timestamp;
  totalPrice: number;
  status: 'confirmed' | 'cancelled';
  createdAt: Date | Timestamp;
  // Denormalized data for easy display
  hotelName?: string;
  hotelLocation?: string;
  roomTitle?: string;
  coverImage?: string;
  userName?: string; // For owner view
  hotelOwnerId?: string; // For owner view filtering
};

export type NewBooking = Omit<Booking, 'id' | 'createdAt' | 'status'>

export type Review = {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    userCountry: string; // Added for UI consistency
    hotelId: string;
    rating: number;
    comment: string;
    createdAt: Date | Timestamp;
}

export type NewReview = Omit<Review, 'id' | 'createdAt'>;

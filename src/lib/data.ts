export const getFilteredFlights = async (from: string, to: string, date?: string): Promise<Flight[]> => {
        const snapshot = await getDocs(query(flightsCol));
        return snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(flight => {
                const f = flight as Flight;
                return f.depart.toLowerCase().includes(from.toLowerCase()) &&
                    f.arrive.toLowerCase().includes(to.toLowerCase());
                // Optionally filter by date if you store it in flight records
            }) as Flight[];
};
export const getFilteredBuses = async (from: string, to: string, date: string): Promise<Bus[]> => {
        const snapshot = await getDocs(query(busesCol));
        return snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(bus => {
                        const b = bus as Bus;
                        return b.depart.toLowerCase().includes(from.toLowerCase()) &&
                            b.arrive.toLowerCase().includes(to.toLowerCase());
                        // Optionally filter by date if you store it in bus records
                    }) as Bus[];
};
// Bus Functions
const busesCol = collection(db, "buses");
export const getAllBuses = async (): Promise<Bus[]> => {
    const snapshot = await getDocs(busesCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Bus[];
};

// Flight Functions
const flightsCol = collection(db, "flights");
export const getAllFlights = async (): Promise<Flight[]> => {
    const snapshot = await getDocs(flightsCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Flight[];
};


import { db } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, query, where, Timestamp, serverTimestamp, writeBatch, documentId, onSnapshot, deleteDoc, orderBy } from 'firebase/firestore';
import type { User, Hotel, Room, Booking, NewHotel, NewUser, HotelSearchCriteria, NewRoom, NewBooking, NewReview, Review, Flight, Bus } from './types';
import { differenceInDays, startOfDay } from 'date-fns';

// This file should solely interact with Firestore as the single source of truth.
// All sample data logic is now handled in firebase.ts for seeding purposes.

// Collection references
const usersCol = collection(db, "users");
const hotelsCol = collection(db, "hotels");
const roomsCol = collection(db, "rooms");
const bookingsCol = collection(db, "bookings");

// Helper to recursively convert Firestore Timestamps to JS Dates
const convertTimestamps = (data: any): any => {
    if (data instanceof Timestamp) {
        return data.toDate();
    }
    if (Array.isArray(data)) {
        return data.map(item => convertTimestamps(item));
    }
    if (data !== null && typeof data === 'object') {
        const newObj: { [key: string]: any } = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                newObj[key] = convertTimestamps(data[key]);
            }
        }
        return newObj;
    }
    return data;
};


// Helper to convert Firestore doc to our types, now correctly handling Timestamps
export const fromFirestore = <T extends { id: string }>(docSnap: any): T | undefined => {
    if (!docSnap?.exists()) {
        return undefined;
    }

    const data = docSnap.data();
    if (!data) return undefined;

    const convertedData = convertTimestamps(data);

    return {
        id: docSnap.id,
        ...convertedData
    } as T;
};


// Auth functions
export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
    try {
        const q = query(usersCol, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("No user found with that email in Firestore.");
            return null;
        }
        
        const userDoc = querySnapshot.docs[0];
        const dbUser = fromFirestore<User>(userDoc);

        if (dbUser && dbUser.password === password) {
            console.log("Authenticated via Firestore.");
            return dbUser;
        }
        
        console.log("Password does not match or user data is invalid.");
        return null;
    } catch (error) {
        console.error("Error during Firestore authentication:", error);
        return null;
    }
}

export const createUser = async (userData: NewUser): Promise<User> => {
    const q = query(usersCol, where("email", "==", userData.email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        throw new Error("User with this email already exists");
    }

    const newUserDoc = await addDoc(usersCol, { ...userData, createdAt: serverTimestamp() });

    return {
      id: newUserDoc.id,
      ...userData,
      createdAt: new Date(),
    };
};

export const getUserById = async (id: string): Promise<User | undefined> => {
    try {
        const userDoc = await getDoc(doc(usersCol, id));
        return fromFirestore<User>(userDoc);
    } catch (error) {
        console.error("Error fetching user by ID from Firestore:", error);
        return undefined;
    }
};

export const getAllUsers = async (): Promise<User[]> => {
    const snapshot = await getDocs(usersCol);
    return snapshot.docs.map(doc => fromFirestore<User>(doc)).filter(Boolean) as User[];
};


// API-like access patterns
export const getApprovedHotels = async (): Promise<Hotel[]> => {
    const q = query(hotelsCol, where('status', '==', 'approved'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => fromFirestore<Hotel>(doc)).filter(Boolean) as Hotel[];
};

export const searchHotels = async (criteria: HotelSearchCriteria): Promise<Hotel[]> => {
    let hotels = await getApprovedHotels();

    if (criteria.destination) {
        const searchLower = criteria.destination.toLowerCase();
        hotels = hotels.filter(hotel =>
            (hotel.name.toLowerCase().includes(searchLower) ||
            hotel.location.toLowerCase().includes(searchLower))
        );
    }

    if (criteria.facilities && criteria.facilities.length > 0) {
        hotels = hotels.filter(hotel =>
            criteria.facilities!.every(facility => hotel.facilities.includes(facility))
        );
    }

    if (criteria.minPrice !== undefined && criteria.maxPrice !== undefined) {
         // This is a simplified price filter. In a real app, you would query rooms
         // associated with the hotel and check if any fall within the price range.
         // For this demo, we'll just return all hotels and assume the client might do more filtering,
         // or we'll add a 'basePrice' to the hotel object in a future iteration.
         // This implementation assumes hotels have rooms that might fit the criteria.
    }

    return hotels;
};

export const getHotelById = async (id: string): Promise<Hotel | undefined> => {
    const hotelDoc = await getDoc(doc(hotelsCol, id));
    return fromFirestore<Hotel>(hotelDoc);
};

export const getRoomsByHotelId = async (hotelId: string): Promise<Room[]> => {
    const q = query(roomsCol, where('hotelId', '==', hotelId), where('status', '==', 'approved'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => fromFirestore<Room>(doc)).filter(Boolean) as Room[];
};

export const getRoomById = async (id: string): Promise<Room | undefined> => {
    const roomDoc = await getDoc(doc(roomsCol, id));
    return fromFirestore<Room>(roomDoc);
};

export const updateHotelStatus = async (id: string, status: 'approved' | 'rejected'): Promise<void> => {
    const hotelRef = doc(hotelsCol, id);
    await updateDoc(hotelRef, { status });
    console.log(`Updated hotel ${id} to ${status} in Firestore.`);
}

export const createHotel = async (hotelData: NewHotel): Promise<Hotel> => {
    const hotelWithTimestamp = {
        ...hotelData,
        status: 'pending' as const,
        coverImage: hotelData.coverImage || 'https://placehold.co/1200x800.png',
        createdAt: serverTimestamp(),
    };
    const newDocRef = await addDoc(hotelsCol, hotelWithTimestamp);
    
    return {
        id: newDocRef.id,
        ...hotelData,
        status: 'pending',
        coverImage: hotelWithTimestamp.coverImage,
        createdAt: new Date(),
    }
}

export const updateRoomStatus = async (id: string, status: 'approved' | 'rejected'): Promise<void> => {
    const roomRef = doc(roomsCol, id);
    await updateDoc(roomRef, { status });
    console.log(`Updated room ${id} to ${status} in Firestore.`);
}

export const getHotelsByOwner = async (ownerId: string): Promise<Hotel[]> => {
    const q = query(hotelsCol, where('ownerId', '==', ownerId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => fromFirestore<Hotel>(doc)).filter(Boolean) as Hotel[];
}

export const getRoomsByOwner = async (ownerId: string): Promise<Room[]> => {
    const ownerHotels = await getHotelsByOwner(ownerId);
    if(ownerHotels.length === 0) return [];
    
    const hotelIds = ownerHotels.map(h => h.id);
    const q = query(roomsCol, where('hotelId', 'in', hotelIds));
    const snapshot = await getDocs(q);
    
    const rooms = snapshot.docs.map(doc => fromFirestore<Room>(doc)).filter(Boolean) as Room[];

    return rooms.map(room => {
        const hotel = ownerHotels.find(h => h.id === room.hotelId);
        return {
            ...room,
            hotelName: hotel ? hotel.name : 'Unknown Hotel'
        }
    });
}

export const createRoom = async (roomData: NewRoom): Promise<Room> => {
    const newRoomData = {
        ...roomData,
        images: roomData.images.length > 0 ? roomData.images : ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
        status: 'pending' as const,
        createdAt: serverTimestamp(),
    };
    const newDocRef = await addDoc(roomsCol, newRoomData);
    
    return {
        id: newDocRef.id,
        ...roomData,
        status: 'pending',
        createdAt: new Date(),
        images: newRoomData.images,
    };
}


// Booking Functions
export const createBooking = async (bookingData: NewBooking): Promise<Booking> => {
    try {
        const from = bookingData.fromDate;
        const to = bookingData.toDate;

        console.debug("createBooking called with:", { bookingData });

        if (!from || !to || !bookingData.userId || !bookingData.roomId) {
            throw new Error("Missing required booking information.");
        }

        // --- Double Booking Prevention ---
        const q = query(
            bookingsCol,
            where('roomId', '==', bookingData.roomId),
            where('status', '==', 'confirmed')
        );
        const existingBookingsSnapshot = await getDocs(q);
        const existingBookings = existingBookingsSnapshot.docs.map(doc => fromFirestore<Booking>(doc));

    // Normalize potential Timestamp values to JS Date objects
    const fromDateObj: Date = (from && (from as any).toDate) ? (from as any).toDate() : (from as Date);
    const toDateObj: Date = (to && (to as any).toDate) ? (to as any).toDate() : (to as Date);

    const newBookingStart = startOfDay(fromDateObj);
    const newBookingEnd = startOfDay(toDateObj);

        const isOverlapping = existingBookings.some(booking => {
            if (!booking) return false;
            const existingStart = startOfDay(booking.fromDate as Date);
            const existingEnd = startOfDay(booking.toDate as Date);
            
            return (newBookingStart < existingEnd) && (newBookingEnd > existingStart);
        });

        if (isOverlapping) {
            throw new Error("This room is unavailable for the selected dates. Please choose different dates.");
        }
        // --- End Double Booking Prevention ---

        const room = await getRoomById(bookingData.roomId);
        if (!room) throw new Error("Room not found.");
        const hotel = await getHotelById(bookingData.hotelId);
        if (!hotel) throw new Error("Hotel not found.");
        const user = await getUserById(bookingData.userId);
        if (!user) throw new Error("User not found.");

    const numberOfNights = differenceInDays(toDateObj, fromDateObj);
        if (numberOfNights <= 0) {
            throw new Error("Booking must be for at least one night.");
        }
        
        const newBookingData = {
            ...bookingData,
            fromDate: Timestamp.fromDate(fromDateObj),
            toDate: Timestamp.fromDate(toDateObj),
            totalPrice: room.price * numberOfNights,
            status: 'confirmed' as const,
            createdAt: serverTimestamp(),
            hotelName: hotel.name,
            hotelLocation: hotel.location,
            roomTitle: room.title,
            coverImage: hotel.coverImage,
            userName: user.name,
            hotelOwnerId: hotel.ownerId,
        };
        
        const docRef = await addDoc(bookingsCol, newBookingData);
        console.log("New booking created in Firestore:", docRef.id);
        
        const finalBooking: Booking = {
            id: docRef.id,
            userId: bookingData.userId,
            roomId: bookingData.roomId,
            hotelId: bookingData.hotelId,
            fromDate: from,
            toDate: to,
            totalPrice: newBookingData.totalPrice,
            status: 'confirmed',
            createdAt: new Date(),
            hotelName: hotel.name,
            hotelLocation: hotel.location,
            roomTitle: room.title,
            coverImage: hotel.coverImage,
            userName: user.name,
            hotelOwnerId: hotel.ownerId,
        };
        return finalBooking;
    } catch (err) {
        console.error("createBooking error details:", err);
        // Re-throw so caller can handle and show toast
        throw err;
    }
};

export const getBookingsByUser = async (userId: string): Promise<Booking[]> => {
    const q = query(bookingsCol, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => fromFirestore<Booking>(doc)).filter(Boolean) as Booking[];
}

export const getBookingsByOwner = async (ownerId: string): Promise<Booking[]> => {
    const q = query(bookingsCol, where('hotelOwnerId', '==', ownerId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => fromFirestore<Booking>(doc)).filter(Boolean) as Booking[];
}

export const cancelBooking = async (bookingId: string): Promise<void> => {
    const bookingRef = doc(bookingsCol, bookingId);
    const bookingDoc = await getDoc(bookingRef);
    const booking = fromFirestore<Booking>(bookingDoc);

    if (!booking) {
        throw new Error("Booking not found.");
    }

    if (booking.status.trim().toLowerCase() === 'cancelled') {
        throw new Error("This booking has already been cancelled.");
    }

    // Ensure fromDate is a JS Date object
    const fromDate = booking.fromDate instanceof Timestamp ? booking.fromDate.toDate() : new Date(booking.fromDate);
    
    if (startOfDay(fromDate) < startOfDay(new Date())) {
        throw new Error("Cannot cancel a booking after the check-in date has passed.");
    }
    
    await updateDoc(bookingRef, {
        status: 'cancelled',
        cancelledAt: serverTimestamp()
    });
    console.log(`Booking ${bookingId} cancelled.`);
};

// Review Functions
export const createReview = async (reviewData: NewReview): Promise<Review> => {
    const reviewCol = collection(db, `hotels/${reviewData.hotelId}/reviews`);
    
    const reviewWithTimestamp = {
        ...reviewData,
        createdAt: serverTimestamp(),
    };

    const newDocRef = await addDoc(reviewCol, reviewWithTimestamp);
    
    return {
        id: newDocRef.id,
        ...reviewData,
        createdAt: new Date(),
    };
}

export const getReviewsByHotelId = async (hotelId: string): Promise<Review[]> => {
    const reviewCol = collection(db, `hotels/${hotelId}/reviews`);
    const q = query(reviewCol, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => fromFirestore<Review>(doc)).filter(Boolean) as Review[];
}

export const deleteReview = async (hotelId: string, reviewId: string): Promise<void> => {
    const reviewRef = doc(db, `hotels/${hotelId}/reviews`, reviewId);
    await deleteDoc(reviewRef);
    console.log(`Deleted review ${reviewId} from hotel ${hotelId}.`);
};


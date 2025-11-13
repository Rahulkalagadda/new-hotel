// --- Sample Bus Data ---
const sampleBusesData = [
    {
        operator: 'Sunil Tour and Travels',
        depart: '21:30 Navi Mumbai',
        arrive: '07:00 Basti',
        duration: '09h 30m',
        price: '₹ 2,210',
        seats: '8 seats',
        location: 'Navi Mumbai',
    },
    {
        operator: 'Betrawati Travels',
        depart: '21:25 Mumbai',
        arrive: '08:30 Basti',
        duration: '11h 05m',
        price: '₹ 3,199',
        seats: '4 seats',
        location: 'Mumbai',
    },
    {
        operator: 'Hans Travels',
        depart: '21:30 Mumbai',
        arrive: '12:10 Basti',
        duration: '14h 40m',
        price: '₹ 3,100',
        seats: '9 seats',
        location: 'Mumbai',
    },
];

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, getDocs, addDoc, serverTimestamp, writeBatch, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import type { NewHotel, NewUser, NewRoom, NewReview } from './types';


const firebaseConfig = {
  "projectId": "lodgify-lite-xhtha",
  "appId": "1:720826776932:web:cc195257ff975f49788e71",
  "storageBucket": "lodgify-lite-xhtha.firebasestorage.app",
  "apiKey": "AIzaSyADLyfG_gE4mtrE04Sm2Zpx5Nld1fMRG8Y",
  "authDomain": "lodgify-lite-xhtha.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "720826776932"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// --- Sample Data ---
const sampleUsersData: NewUser[] = [
    { name: 'Alice Owner', email: 'alice@example.com', password: 'password', role: 'owner' },
    { name: 'Bob Guest', email: 'bob@example.com', password: 'password', role: 'user' },
    { name: 'Admin User', email: 'admin@lodgify.lite', password: 'adminpassword', role: 'admin' },
    { name: 'Charlie Owner', email: 'charlie@example.com', password: 'password', role: 'owner' },
];

const sampleHotelsData: Omit<NewHotel, 'ownerId' | 'ownerName' | 'ownerEmail' | 'createdAt'>[] = [
    {
        name: 'The Grand Palace',
        location: 'Istanbul, Turkey',
        description: 'Experience unparalleled luxury and breathtaking views of the Bosphorus in our five-star hotel, where elegance meets comfort.',
        address: "1 Bosphorus St, Istanbul, Turkey",
        phone: "555-123-4567",
        email: "contact@grandpalace.com",
        website: "https://grandpalace.com",
        facilities: ["wifi", "pool", "spa"],
        checkInTime: "15:00",
        checkOutTime: "12:00",
        cancellationPolicy: "Full refund for cancellations made 48 hours in advance.",
        isPetFriendly: true,
        documents: [],
    // status: 'approved',
        coverImage: 'https://cf.bstatic.com/static/img/theme-index/bg_luxury/869918c9da63b2c5685fce05965700da5b0e6617.jpg',
        category: 'Premium',
        'data-ai-hint': 'luxury hotel interior'
    },
    {
        name: 'Santorini Seaside Escape',
        location: 'Oia, Greece',
        description: 'Nestled on the cliffs of Oia, our hotel offers stunning sunsets and direct access to the azure waters of the Aegean Sea.',
        address: "1 Cliffside Rd, Oia, Greece",
        phone: "555-987-6543",
        email: "reservations@santoriniescape.com",
        website: "https://santoriniescape.com",
        facilities: ["wifi", "pool"],
        checkInTime: "14:00",
        checkOutTime: "11:00",
        cancellationPolicy: "Full refund for cancellations made 7 days in advance.",
        isPetFriendly: false,
        documents: [],
    // status: 'approved',
        coverImage: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/678234743.jpg?k=acee705a06f3347cd2f3d53609a536b772a99eda3603c4eb5ef136e5e6cd6204&o=',
        category: 'Boutique',
        'data-ai-hint': 'santorini hotel'
    },
    {
        name: 'Modern City Hub',
        location: 'Ankara, Turkey',
        description: 'A stylish and contemporary hotel in the heart of the city, perfect for business travelers and urban explorers.',
        address: "123 Capital Ave, Ankara, Turkey",
        phone: "555-234-5678",
        email: "info@modernhub.com",
        website: "https://modernhub.com",
        facilities: ["wifi", "gym", "restaurant"],
        checkInTime: "15:00",
        checkOutTime: "12:00",
        cancellationPolicy: "Flexible cancellation up to 24 hours before check-in.",
        isPetFriendly: false,
        documents: [],
    // status: 'approved',
        coverImage: 'https://lux-life.digital/wp-content/uploads/2019/09/turkish-hotel.jpg',
        category: 'Boutique',
        'data-ai-hint': 'modern hotel room'
    },
    {
        name: 'Cozy Mountain Lodge',
        location: 'Aspen, USA',
        description: 'A rustic lodge offering a cozy retreat after a day on the slopes.',
        address: "456 Ski Run, Aspen, USA",
        phone: "555-345-6789",
        email: "stay@cozylodge.com",
        website: "https://cozylodge.com",
        facilities: ["wifi", "parking", "restaurant"],
        checkInTime: "16:00",
        checkOutTime: "10:00",
        cancellationPolicy: "Cancellation policy requires 14 days notice for a full refund.",
        isPetFriendly: true,
        documents: [],
    // status: 'pending',
        coverImage: 'https://images.pexels.com/photos/208333/pexels-photo-208333.jpeg',
        category: 'Boutique',
        'data-ai-hint': 'ski lodge'
    }
];

const sampleRoomsData: Omit<NewRoom, 'hotelId' | 'createdAt' | 'status'>[] = [
    // For The Grand Palace
    {
        title: 'Presidential Suite',
        description: 'A suite fit for royalty with panoramic city views and a private terrace.',
        price: 950,
        capacity: 4,
        images: ['https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg', 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'],
    },
    {
        title: 'Deluxe King Room',
        description: 'A spacious room with a king-sized bed and elegant furnishings.',
        price: 450,
        capacity: 2,
        images: ['https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg', 'https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg'],
    },
    // For Santorini Seaside Escape
    {
        title: 'Caldera View Suite',
        description: 'Wake up to the iconic view of the Santorini caldera from your private balcony.',
        price: 650,
        capacity: 2,
        images: ['https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg', 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg'],
    },
    {
        title: 'Infinity Pool Villa',
        description: 'A luxurious villa with a private infinity pool overlooking the Aegean Sea.',
        price: 1200,
        capacity: 4,
        images: ['https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg', 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg'],
    },
     // For Modern City Hub
     {
        title: 'Executive Business Room',
        description: 'Modern comforts and a dedicated workspace for the discerning traveler.',
        price: 250,
        capacity: 2,
        images: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg', 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg'],
    },
    {
        title: 'City View Twin Room',
        description: 'A comfortable room with two single beds and a stunning view of the city skyline.',
        price: 220,
        capacity: 2,
        images: ['https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg', 'https://images.pexels.com/photos/6782476/pexels-photo-6782476.jpeg'],
    }
];

const sampleReviewsData = [
  // Reviews for The Grand Palace
  {
    rating: 5,
    comment: "Absolutely stunning hotel with breathtaking views. The service was impeccable from start to finish. A truly luxurious experience.",
  },
  {
    rating: 4,
    comment: "Great location and beautiful facilities. The pool area is fantastic. The room was spacious and clean, though the restaurant was a bit pricey.",
  },
  // Reviews for Santorini Seaside Escape
  {
    rating: 5,
    comment: "The view from our suite was unbelievable. Waking up to the caldera every morning was magical. The staff were friendly and accommodating. Highly recommend!",
  },
  {
    rating: 5,
    comment: "Perfect honeymoon destination. The privacy of the infinity pool villa is unmatched. It's expensive, but worth every penny for a special occasion.",
  },
  // Reviews for Modern City Hub
  {
    rating: 4,
    comment: "Very clean, modern, and conveniently located for business meetings. The gym is well-equipped. It's not a 'resort' but it's perfect for a city trip.",
  },
];


// --- Seeding Functions ---
const seedCollection = async <T extends Record<string, any>>(
    collectionName: string, 
    data: T[], 
    uniqueField: keyof T & string
) => {
    const collectionRef = collection(db, collectionName);
    console.log(`Checking if ${collectionName} collection needs seeding...`);

    const existingDocsSnapshot = await getDocs(query(collectionRef));
    const existingData = new Set(existingDocsSnapshot.docs.map(doc => doc.data()[uniqueField]));
    
    const newData = data.filter(item => !item[uniqueField] || !existingData.has(item[uniqueField]));

    if (newData.length === 0) {
        console.log(`${collectionName} collection is already up to date. Seeding skipped.`);
        return [];
    }

    console.log(`Seeding ${newData.length} new documents into ${collectionName}...`);
    const batch = writeBatch(db);
    const newDocIds: string[] = [];

    for (const item of newData) {
        const newDocRef = doc(collectionRef);
        batch.set(newDocRef, { ...item, createdAt: serverTimestamp() });
        newDocIds.push(newDocRef.id);
    }

    await batch.commit();
    console.log(`${newData.length} documents seeded into ${collectionName}.`);
    return newDocIds;
};

const seedSubcollection = async (
    parentCollection: string,
    parentId: string,
    subcollectionName: string,
    data: any[]
) => {
    const subcollectionRef = collection(db, parentCollection, parentId, subcollectionName);
    console.log(`Checking if ${subcollectionName} for ${parentId} needs seeding...`);

    const existingDocsSnapshot = await getDocs(query(subcollectionRef));
    if (existingDocsSnapshot.size > 0) {
        console.log(`Subcollection ${subcollectionName} for ${parentId} already has data. Seeding skipped.`);
        return;
    }

    console.log(`Seeding ${data.length} documents into ${subcollectionName} for ${parentId}...`);
    const batch = writeBatch(db);
    for (const item of data) {
        const newDocRef = doc(subcollectionRef);
        batch.set(newDocRef, { ...item, createdAt: serverTimestamp() });
    }
    await batch.commit();
    console.log(`Seeded ${subcollectionName} for ${parentId}.`);
}


const seedDatabase = async () => {
    try {
        await seedCollection<NewUser>('users', sampleUsersData, 'email');
    // Seed Buses
    await seedCollection('buses', sampleBusesData, 'operator');

        const usersSnapshot = await getDocs(collection(db, 'users'));
        const users = usersSnapshot.docs.map(doc => ({ ...doc.data() as NewUser, id: doc.id }));
        const aliceOwner = users.find(u => u.email === 'alice@example.com');
        const charlieOwner = users.find(u => u.email === 'charlie@example.com');
        const bobGuest = users.find(u => u.email === 'bob@example.com');

        const hotelsToSeed: (Omit<NewHotel, 'createdAt'>)[] = [];
        if (aliceOwner) {
            sampleHotelsData.slice(0, 3).forEach(hotel => {
                hotelsToSeed.push({
                    ...hotel,
                    ownerId: aliceOwner.id,
                    ownerName: aliceOwner.name,
                    ownerEmail: aliceOwner.email
                });
            });
        }
        if (charlieOwner) {
             sampleHotelsData.slice(3, 4).forEach(hotel => {
                hotelsToSeed.push({
                    ...hotel,
                    ownerId: charlieOwner.id,
                    ownerName: charlieOwner.name,
                    ownerEmail: charlieOwner.email
                });
            });
        }
        
        if (hotelsToSeed.length > 0) {
            await seedCollection('hotels', hotelsToSeed, 'name');
        }

        const allHotelsSnapshot = await getDocs(collection(db, 'hotels'));
        const allHotels = allHotelsSnapshot.docs.map(doc => ({ ...doc.data() as NewHotel, id: doc.id }));
        
        const grandPalace = allHotels.find(h => h.name === 'The Grand Palace');
        const santoriniEscape = allHotels.find(h => h.name === 'Santorini Seaside Escape');
        const modernHub = allHotels.find(h => h.name === 'Modern City Hub');

        const roomsToSeed = [];
        if(grandPalace) {
            roomsToSeed.push({ ...sampleRoomsData[0], hotelId: grandPalace.id, status: 'approved' });
            roomsToSeed.push({ ...sampleRoomsData[1], hotelId: grandPalace.id, status: 'approved' });
        }
        if(santoriniEscape) {
            roomsToSeed.push({ ...sampleRoomsData[2], hotelId: santoriniEscape.id, status: 'approved' });
            roomsToSeed.push({ ...sampleRoomsData[3], hotelId: santoriniEscape.id, status: 'approved' });
        }
        if(modernHub) {
            roomsToSeed.push({ ...sampleRoomsData[4], hotelId: modernHub.id, status: 'approved' });
            roomsToSeed.push({ ...sampleRoomsData[5], hotelId: modernHub.id, status: 'approved' });
        }
        
        if(roomsToSeed.length > 0) {
            await seedCollection('rooms', roomsToSeed, 'title');
        }
        
        // Seed Reviews
        if (bobGuest) {
            const guestReviewBase = {
                userId: bobGuest.id,
                userName: bobGuest.name,
                userAvatar: `https://i.pravatar.cc/150?u=${bobGuest.id}`,
                userCountry: 'USA'
            };

            if (grandPalace) {
                await seedSubcollection('hotels', grandPalace.id, 'reviews', [
                    { ...guestReviewBase, hotelId: grandPalace.id, ...sampleReviewsData[0] },
                    { ...guestReviewBase, hotelId: grandPalace.id, ...sampleReviewsData[1] }
                ]);
            }
            if (santoriniEscape) {
                 await seedSubcollection('hotels', santoriniEscape.id, 'reviews', [
                    { ...guestReviewBase, hotelId: santoriniEscape.id, ...sampleReviewsData[2] },
                    { ...guestReviewBase, hotelId: santoriniEscape.id, ...sampleReviewsData[3] }
                ]);
            }
             if (modernHub) {
                 await seedSubcollection('hotels', modernHub.id, 'reviews', [
                    { ...guestReviewBase, hotelId: modernHub.id, ...sampleReviewsData[4] }
                ]);
            }
        }

    } catch (error) {
        console.error("Error seeding database:", error);
    }
};

// Immediately invoke the seeding function to ensure data is available on startup
seedDatabase();



import { notFound } from 'next/navigation';
import { getHotelById, getRoomsByHotelId } from '@/lib/data';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Share2, Heart, Star, ShieldCheck, MapPin, Wifi, ParkingSquare, UtensilsCrossed, Dumbbell, Waves, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ImageGrid } from '@/components/image-grid';
import { BookingCard } from '@/components/booking-card';
import { MeetTheHost } from '@/components/meet-the-host';
import { ReviewsSection } from '@/components/reviews-section';

type HotelPageProps = {
  params: {
    id: string;
  };
};

const facilityIconMap: { [key: string]: React.ElementType } = {
    wifi: Wifi,
    parking: ParkingSquare,
    restaurant: UtensilsCrossed,
    gym: Dumbbell,
    pool: Waves,
    spa: Sparkles,
};
const facilityNameMap: { [key: string]: string } = {
    wifi: "Free WiFi",
    parking: "Parking",
    restaurant: "Restaurant",
    gym: "Gym",
    pool: "Swimming Pool",
    spa: "Spa",
}


export default async function HotelPage({ params }: HotelPageProps) {
  const hotel = await getHotelById(params.id);
  
  if (!hotel || hotel.status !== 'approved') {
    notFound();
  }

  const rooms = await getRoomsByHotelId(params.id);

  const allImages = [
      hotel.coverImage,
      ...rooms.flatMap(room => room.images).slice(0, 4)
  ];
  // Ensure we have 5 images for the grid, duplicating if necessary
  while(allImages.length > 0 && allImages.length < 5) {
      allImages.push(...allImages.slice(0, 5 - allImages.length));
  }


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
            {/* Header section */}
            <div className="mb-4">
                <h1 className="text-3xl font-bold tracking-tight">{hotel.name}</h1>
                <div className="flex justify-between items-center mt-2 text-sm">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1"><Star className="w-4 h-4 text-primary" /> 4.8 (245 reviews)</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {hotel.location}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="flex items-center gap-2 underline"><Share2 className="w-4 h-4" /> Share</Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-2 underline"><Heart className="w-4 h-4" /> Save</Button>
                    </div>
                </div>
            </div>

            {/* Image Gallery */}
            <ImageGrid images={allImages} />
            
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mt-12">
                <div className="lg:col-span-7">
                    <div className="pb-8 border-b">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-semibold">Entire rental unit in {hotel.location.split(',')[0]}</h2>
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={`https://i.pravatar.cc/150?u=${hotel.ownerId}`} alt={hotel.ownerName} />
                                <AvatarFallback>{hotel.ownerName?.charAt(0).toUpperCase()}</AvatarFallback>
                             </Avatar>
                        </div>
                        <p className="mt-2 text-muted-foreground leading-relaxed">
                            {hotel.description}
                        </p>
                    </div>

                    <div className="py-8 border-b">
                         <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <ShieldCheck className="w-6 h-6 mt-1" />
                                <div>
                                    <h3 className="font-semibold">Identity verified</h3>
                                    <p className="text-sm text-muted-foreground">The host's identity has been confirmed for your safety.</p>
                                </div>
                            </div>
                         </div>
                    </div>

                     <div className="py-8 border-b">
                        <h2 className="text-2xl font-semibold mb-4">What this place offers</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {hotel.facilities && hotel.facilities.map(facility => {
                                const Icon = facilityIconMap[facility];
                                return Icon ? (
                                    <div key={facility} className="flex items-center gap-3">
                                        <Icon className="w-6 h-6"/>
                                        <span>{facilityNameMap[facility]}</span>
                                    </div>
                                ) : null;
                            })}
                        </div>
                    </div>
                    
                </div>

                <aside className="lg:col-span-5 lg:sticky top-24 h-fit">
                   <BookingCard rooms={rooms} hotel={hotel} />
                </aside>
            </div>
            
             <Separator className="my-12" />
             
             <ReviewsSection hotelId={params.id} />

             <Separator className="my-12" />

             {/* Map Section */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">Where you'll be</h2>
                <div className="h-96 w-full rounded-xl overflow-hidden">
                    <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight={0}
                        marginWidth={0}
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(hotel.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        title={`Map of ${hotel.name}`}
                        aria-label={`Map of ${hotel.name}`}
                    ></iframe>
                 </div>
              </div>

             <Separator className="my-12" />

             <MeetTheHost hotel={hotel} />


             <Separator className="my-12" />

              <div>
                <h2 className="text-2xl font-semibold mb-4">Things to know</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="font-semibold">House rules</h3>
                        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                            <li>Check-in: {hotel.checkInTime}</li>
                            <li>Check-out: {hotel.checkOutTime}</li>
                             <li>{hotel.isPetFriendly ? 'Pets allowed' : 'No pets allowed'}</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold">Health & safety</h3>
                         <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                            <li>Carbon monoxide alarm</li>
                            <li>Smoke alarm</li>
                        </ul>
                    </div>
                     <div>
                        <h3 className="font-semibold">Cancellation policy</h3>
                        <p className="mt-2 text-sm text-muted-foreground">{hotel.cancellationPolicy}</p>
                    </div>
                </div>
              </div>


        </div>
      </main>
      <Footer />
    </div>
  );
}

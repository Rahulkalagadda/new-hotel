import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { HotelCard } from '@/components/hotel-card';
import { searchHotels, getRoomsByHotelId } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { SearchIcon } from 'lucide-react';
import { SearchFilters } from '@/components/search-filters';
import { SearchForm } from '@/components/search-form';
import SearchSuggestions from '@/components/search-suggestions';

type SearchPageProps = {
    searchParams: {
        destination?: string;
        from?: string;
        to?: string;
        guests?: string;
        facilities?: string;
        minPrice?: string;
        maxPrice?: string;
    }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const allHotels = await searchHotels({
        destination: searchParams.destination,
        facilities: searchParams.facilities?.split(','),
    });

    const minPrice = searchParams.minPrice ? parseInt(searchParams.minPrice, 10) : 0;
    const maxPrice = searchParams.maxPrice ? parseInt(searchParams.maxPrice, 10) : 1500;

    const hotelPromises = allHotels.map(async hotel => {
        const rooms = await getRoomsByHotelId(hotel.id);
        const cheapestRoom = rooms.reduce((min, room) => (room.price < min ? room.price : min), Infinity);
        
        // Return hotel with its cheapest room price, or null if no rooms
        return { 
            ...hotel, 
            cheapestPrice: rooms.length > 0 ? cheapestRoom : null 
        };
    });

    const hotelsWithPrices = (await Promise.all(hotelPromises))
        // Filter out hotels with no rooms
        .filter(hotel => hotel.cheapestPrice !== null)
        // Filter by price range
        .filter(hotel => hotel.cheapestPrice! >= minPrice && hotel.cheapestPrice! <= maxPrice);


    const hasSearchParams = Object.keys(searchParams).length > 0 && !!searchParams.destination;

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1 py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-headline font-bold mb-4">Search Results</h1>
                    <p className="text-muted-foreground mb-8">
                        {hasSearchParams ? `Showing results for your search.` : 'Find the perfect hotel for your next trip.'}
                    </p>

                    <div className="max-w-5xl mx-auto">
                      <SearchForm />
                      {/* Suggestions (client) */}
                      <SearchSuggestions initial={searchParams.destination ?? ''} />
                    </div>

                    <div className="lg:grid lg:grid-cols-12 lg:gap-8 mt-8">
                        <aside className="lg:col-span-3 mb-8 lg:mb-0">
                           <Card className="p-6 sticky top-24">
                             <h3 className="text-lg font-semibold mb-4">Refine Search</h3>
                             <SearchFilters searchParams={searchParams}/>
                           </Card>
                        </aside>
                        <div className="lg:col-span-9">
                            {hotelsWithPrices.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {hotelsWithPrices.map((hotel) => (
                                        <a href={`/hotel/${hotel.id}`} key={hotel.id}>
                                            <HotelCard hotel={hotel} price={hotel.cheapestPrice!} />
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <Card>
                                    <CardContent className="p-12 text-center">
                                        <SearchIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                                        <h2 className="text-2xl font-bold mb-2">No hotels found</h2>
                                        <p className="text-muted-foreground">Try adjusting your search criteria.</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

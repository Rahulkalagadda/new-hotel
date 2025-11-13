
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { UserBookings } from "@/components/user-bookings";
import { BookMarked } from "lucide-react";

export default function BookingsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero header similar to design: peach band with title */}
        <div className="w-full bg-amber-100/80"> 
          <div className="container mx-auto px-4 py-12">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-200 rounded">
                <BookMarked className="h-8 w-8 text-rose-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-headline font-bold text-rose-700">My Bookings</h1>
                <p className="text-muted-foreground">View your past and upcoming reservations.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10">
          <UserBookings />
        </div>
      </main>
      <Footer />
    </div>
  );
}

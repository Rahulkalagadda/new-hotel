
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { OwnerDashboard } from "@/components/owner-dashboard";

export default function OwnerPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
            <OwnerDashboard />
        </div>
      </main>
      <Footer />
    </div>
  );
}

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AdminDashboard } from "@/components/admin-dashboard";
import { Shield } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 mb-8">
                <Shield className="h-10 w-10 text-primary" />
                <div>
                    <h1 className="text-4xl font-headline font-bold">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Manage hotel and room approvals.</p>
                </div>
            </div>
            <AdminDashboard />
        </div>
      </main>
      <Footer />
    </div>
  );
}

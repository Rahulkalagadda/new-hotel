import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function HomeLanding() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="container px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Lodgify</h1>
          <p className="text-lg text-muted-foreground mb-8">Find hotels, flights, and bus trips — all in one place.</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/" className="px-6 py-3 bg-primary text-white rounded-md shadow">Hotels</Link>
            <Link href="/flights" className="px-6 py-3 border border-border rounded-md">Flights</Link>
            <Link href="/bus" className="px-6 py-3 border border-border rounded-md">Bus</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

"use client"

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const DESTINATIONS = [
  'Delhi', 'Bengaluru', 'Mumbai', 'Goa', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad'
]

export default function SearchSuggestions({ initial = '' }: { initial?: string }) {
  const router = useRouter()
  const [query, setQuery] = useState(initial)
  const [matches, setMatches] = useState<string[]>([])

  useEffect(() => {
    if (!query) {
      setMatches([])
      return
    }
    const q = query.toLowerCase()
    setMatches(DESTINATIONS.filter(d => d.toLowerCase().includes(q)).slice(0, 6))
  }, [query])

  const onSelect = (dest: string) => {
    router.push(`/hotels?destination=${encodeURIComponent(dest)}`)
  }

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-2">Suggestions</h2>
      <div className="border rounded p-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try: Delhi, Mumbai, Goa"
          className="w-full border rounded px-3 py-2 mb-3"
          aria-label="Search suggestions"
        />

        {query ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {matches.length === 0 && <div className="text-sm text-muted-foreground">No matches</div>}
            {matches.map(m => (
              <button key={m} onClick={() => onSelect(m)} className="text-left p-3 border rounded hover:shadow-sm bg-white">
                <div className="font-medium">{m}</div>
                <div className="text-sm text-muted-foreground">Hotels, flights and buses</div>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {DESTINATIONS.slice(0,8).map(d => (
              <Link key={d} href={`/hotels?destination=${encodeURIComponent(d)}`} className="block p-3 border rounded text-center bg-white hover:shadow-sm">{d}</Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

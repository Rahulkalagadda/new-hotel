"use client"

import React, { useState } from 'react'

type Props = {
  initialFrom: string
  initialTo: string
  initialDate: string
  onApply: (from: string, to: string, date: string) => void
  onClose: () => void
}

export default function BusSearchPanel({ initialFrom, initialTo, initialDate, onApply, onClose }: Props) {
  const [from, setFrom] = useState(initialFrom)
  const [to, setTo] = useState(initialTo)
  const [date, setDate] = useState(initialDate)

  return (
    <div className="bg-white border rounded p-4 shadow mb-6">
      <div className="flex flex-col md:flex-row gap-3 items-center">
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground mr-2">FROM</label>
          <input className="border rounded px-3 py-2" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground mr-2">TO</label>
          <input className="border rounded px-3 py-2" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground mr-2">DEPARTURE DATE</label>
          <input type="date" className="border rounded px-3 py-2" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={() => { onApply(from, to, date) }} className="px-4 py-2 bg-blue-600 text-white rounded">Search</button>
        </div>
      </div>
    </div>
  )
}

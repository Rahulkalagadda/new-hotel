import React from 'react'
import Link from 'next/link'

const QuickActions: React.FC = () => {
  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border">
      <h3 className="text-lg font-semibold mb-3">Quick actions</h3>
      <div className="grid grid-cols-1 gap-2">
        <Link href="/owner/hotel/new" className="block text-left px-4 py-2 bg-primary text-white rounded-md">Add new listing</Link>
        <Link href="/owner/hotel" className="block text-left px-4 py-2 border rounded-md">Manage your listings</Link>
        <Link href="/bookings" className="block text-left px-4 py-2 border rounded-md">View bookings</Link>
        <Link href="/owner/reviews" className="block text-left px-4 py-2 border rounded-md">Respond to reviews</Link>
      </div>
    </div>
  )
}

export default QuickActions

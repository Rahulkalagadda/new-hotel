import React from 'react'
import Link from 'next/link'

const UserQuickActions: React.FC = () => {
  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border">
      <h3 className="text-lg font-semibold mb-3">Quick actions</h3>
      <div className="grid grid-cols-1 gap-2">
        <Link href="/search" className="block text-left px-4 py-2 bg-primary text-white rounded-md">Search hotels</Link>
        <Link href="/bookings" className="block text-left px-4 py-2 border rounded-md">My bookings</Link>
        <Link href="/profile" className="block text-left px-4 py-2 border rounded-md">Account settings</Link>
        <Link href="/help" className="block text-left px-4 py-2 border rounded-md">Support</Link>
      </div>
    </div>
  )
}

export default UserQuickActions

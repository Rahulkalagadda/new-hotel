"use client"

import React from 'react'

export default function BusBookingFull() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-blue-600 text-white rounded-md p-6 mb-6">
        <h1 className="text-2xl font-semibold">Review your Booking</h1>
        <p className="text-sm opacity-90 mt-1">Mumbai - Basti | 11th November 25</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border rounded p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-semibold">Sunil Tour and Travels</div>
                <div className="text-sm text-muted-foreground mt-1">NON AC Sleeper (2+1) • Seats Selected: 2</div>
              </div>
              <div className="text-right text-sm text-muted-foreground">Cancellation Policy</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border rounded p-4">
              <div className="text-xs text-muted-foreground">Boarding Point Details</div>
              <div className="mt-2 font-medium">Kaliyun Bypass Vatika Hotel</div>
              <div className="text-sm text-muted-foreground mt-1">10:30 PM, 11th Nov 2025</div>
            </div>
            <div className="bg-white border rounded p-4">
              <div className="text-xs text-muted-foreground">Dropping Point Details</div>
              <div className="mt-2 font-medium">Bus Stand Basti</div>
              <div className="text-sm text-muted-foreground mt-1">07:00 AM, 13th Nov 2025</div>
            </div>
          </div>

          <div className="bg-white border rounded p-4">
            <div className="text-sm font-medium mb-2">go ASSURED — Travel Stress Free</div>
            <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div className="p-3 bg-slate-50 rounded">2x Refund on bus cancellation</div>
              <div className="p-3 bg-slate-50 rounded">Upto ₹75000 Accidental Hospitalisation</div>
              <div className="p-3 bg-slate-50 rounded">Upto ₹5 lac Death & Disability</div>
            </div>
          </div>

          <div className="bg-white border rounded p-4">
            <h3 className="font-medium">Traveller Details</h3>
            <p className="text-sm text-muted-foreground mt-1">Enter passenger details as per government ID.</p>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <div className="grid grid-cols-2 gap-3">
                <input className="border rounded px-3 py-2" placeholder="Full Name" />
                <input className="border rounded px-3 py-2" placeholder="Age" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select className="border rounded px-3 py-2">
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
                <input className="border rounded px-3 py-2" placeholder="Seat" />
              </div>
            </div>
          </div>

          <div className="bg-white border rounded p-4">
            <h3 className="font-medium">Contact Details</h3>
            <div className="mt-3 grid grid-cols-1 gap-2">
              <input className="border rounded px-3 py-2" placeholder="Email" />
              <div className="flex gap-2">
                <select className="border rounded px-3 py-2 w-24">
                  <option>91</option>
                </select>
                <input className="border rounded px-3 py-2 flex-1" placeholder="Mobile Number" />
              </div>
            </div>
          </div>

          <div className="bg-white border rounded p-4">
            <h3 className="font-medium">Pincode and State</h3>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <input className="border rounded px-3 py-2" placeholder="Enter Billing Address" />
              <input className="border rounded px-3 py-2" placeholder="Enter Pincode" />
            </div>
          </div>

        </div>

        <aside className="space-y-4">
          <div className="bg-white border rounded p-4 w-80">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">PRICE</div>
              <div className="text-sm text-muted-foreground">Login to get personalized offer</div>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between">
                <div className="text-sm">Base Fare</div>
                <div className="font-medium">₹2455.0</div>
              </div>

              <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                <div>Discounts</div>
                <div>-₹245.5</div>
              </div>

              <div className="border-t my-3" />

              <div className="flex items-center justify-between text-lg font-bold">
                <div>Amount</div>
                <div>₹2210</div>
              </div>
            </div>

            <div className="mt-4">
              <button className="w-full bg-orange-500 text-white py-3 rounded">Pay ₹ 2210</button>
            </div>
          </div>

          <div className="bg-white border rounded p-4 w-80 text-sm text-muted-foreground">
            <div className="font-medium mb-2">Offers</div>
            <div>- GoDeal Discount applied</div>
            <div className="mt-2">- Use goCash for extra savings</div>
          </div>
        </aside>
      </div>
    </div>
  )
}

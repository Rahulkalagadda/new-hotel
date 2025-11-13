
"use client";
import { Star, Users, MapPin, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface BusDetailsProps {
  selectedSeats: string[];
}

export function BusDetails({ selectedSeats }: BusDetailsProps) {
  const [activeTab, setActiveTab] = useState('why-book');

  const tabs = [
    { id: 'why-book', label: 'Why book this bus?' },
    { id: 'route', label: 'Bus route' },
    { id: 'boarding', label: 'Boarding point' },
    { id: 'dropping', label: 'Dropping point' },
    { id: 'rest-stops', label: 'Rest stops' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">IntrCity SmartBus</h2>
            <p className="text-sm text-gray-600 mt-1">15:45 - 20:55 · Wed 12 Nov</p>
            <p className="text-sm text-gray-500">AC Sleeper (2+1)</p>
          </div>
          <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded text-sm">
            <Star className="w-4 h-4 fill-white" />
            <span className="font-semibold">4.8</span>
          </div>
        </div>
        <div className="text-xs text-gray-500">296 ratings</div>
      </div>

      <div className="grid grid-cols-3 gap-2 p-4 border-b border-gray-200">
        <img
          src="https://images.pexels.com/photos/1906643/pexels-photo-1906643.jpeg?auto=compress&cs=tinysrgb&w=400"
          alt="Bus exterior"
          className="w-full h-20 object-cover rounded"
        />
        <img
          src="https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=400"
          alt="Bus interior"
          className="w-full h-20 object-cover rounded"
        />
        <img
          src="https://images.pexels.com/photos/1906643/pexels-photo-1906643.jpeg?auto=compress&cs=tinysrgb&w=400"
          alt="Bus side view"
          className="w-full h-20 object-cover rounded"
        />
      </div>

      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#E53935] text-[#E53935]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'why-book' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Why book this bus?</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-gray-700 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Women Traveling</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-gray-700 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Highly rated by women</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <button className="flex items-center justify-between w-full text-left">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-700 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Live Tracking</p>
                      <p className="text-sm text-gray-600 mt-1">
                        You can now track your bus and plan your commute to the boarding...
                      </p>
                    </div>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'route' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bus route</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500 mt-2"></div>
                <div>
                  <p className="font-medium text-gray-900">Sion</p>
                  <p className="text-sm text-gray-600">15:45 · Starting point</p>
                </div>
              </div>

              <div className="ml-1.5 border-l-2 border-dashed border-gray-300 h-8"></div>

              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-[#E53935] mt-2"></div>
                <div>
                  <p className="font-medium text-gray-900">Pune</p>
                  <p className="text-sm text-gray-600">20:55 · Destination</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'why-book' && activeTab !== 'route' && (
          <div className="text-center py-8 text-gray-500">
            <p>Information will be displayed here</p>
          </div>
        )}
      </div>
    </div>
  );
}

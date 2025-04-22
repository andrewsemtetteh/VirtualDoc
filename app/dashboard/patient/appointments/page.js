'use client';
import { useState } from 'react';
import { CalendarIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchFilters, setSearchFilters] = useState({
    specialty: '',
    date: '',
    type: 'all'
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-700 transition-colors">
            New Appointment
          </button>
        </div>
      </div>
      
      {/* Booking Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
        <h2 className="text-lg font-semibold mb-4">Book New Appointment</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
            <select 
              className="w-full border-gray-300 rounded-lg p-2"
              value={searchFilters.specialty}
              onChange={(e) => setSearchFilters({...searchFilters, specialty: e.target.value})}
            >
              <option value="">All Specialties</option>
              <option value="cardiology">Cardiology</option>
              <option value="dermatology">Dermatology</option>
              <option value="neurology">Neurology</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input 
              type="date" 
              className="w-full border-gray-300 rounded-lg p-2"
              value={searchFilters.date}
              onChange={(e) => setSearchFilters({...searchFilters, date: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select 
              className="w-full border-gray-300 rounded-lg p-2"
              value={searchFilters.type}
              onChange={(e) => setSearchFilters({...searchFilters, type: e.target.value})}
            >
              <option value="all">All Types</option>
              <option value="in-person">In-Person</option>
              <option value="video">Video Consultation</option>
            </select>
          </div>
        </div>
        <button className="mt-4 bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
          Search Available Slots
        </button>
      </div>

      {/* Appointments Tabs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex flex-wrap space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`py-4 border-b-2 font-medium text-sm ${
                activeTab === 'upcoming'
                  ? 'border-green-800 text-green-800'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`py-4 border-b-2 font-medium text-sm ${
                activeTab === 'past'
                  ? 'border-green-800 text-green-800'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Past
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {/* Appointment list will be rendered here based on activeTab */}
          <div className="text-center text-gray-500 py-8">
            No appointments found
          </div>
        </div>
      </div>
    </div>
  );
} 
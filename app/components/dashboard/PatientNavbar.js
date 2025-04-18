'use client';
import { useState } from 'react';
import Link from 'next/link';
import { BellIcon, UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

export default function PatientNavbar({ user }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <nav className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-white shadow-sm z-40">
      <div className="h-full px-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Patient Dashboard</h2>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 text-gray-600 hover:text-gray-800 rounded-lg">
            <BellIcon className="h-6 w-6" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2"
            >
              <UserCircleIcon className="h-8 w-8 text-gray-600" />
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-gray-700">{user?.fullName || 'Patient'}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <ChevronDownIcon className="h-4 w-4 text-gray-600" />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                <Link
                  href="/dashboard/patient/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Your Profile
                </Link>
                <Link
                  href="/dashboard/patient/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Settings
                </Link>
                <div className="border-t border-gray-200">
                  <button
                    onClick={() => {/* Add logout logic */}}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 
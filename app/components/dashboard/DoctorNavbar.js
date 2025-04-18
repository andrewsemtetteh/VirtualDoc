'use client';
import { useState } from 'react';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function DoctorNavbar({ user }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-white shadow-sm z-40">
      <div className="h-full px-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Doctor Dashboard</h2>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 text-gray-600 hover:text-gray-800 rounded-lg">
            <BellIcon className="h-6 w-6" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2"
            >
              <UserCircleIcon className="h-8 w-8 text-gray-600" />
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-gray-700">{user?.name || 'Doctor'}</p>
                <p className="text-xs text-gray-500">{user?.specialty || 'Specialist'}</p>
              </div>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                <a
                  href="/dashboard/doctor/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Your Profile
                </a>
                <a
                  href="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </a>
                <a
                  href="/logout"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 
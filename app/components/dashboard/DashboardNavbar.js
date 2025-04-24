'use client';
import { useState } from 'react';
import {
  BellIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import useClickOutside from '../../hooks/useClickOutside';

export default function DashboardNavbar({ user }) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Appointment Reminder",
      message: "Your appointment with Dr. Smith is tomorrow at 2:00 PM",
      time: "2 hours ago",
      isRead: false
    },
    {
      id: 2,
      title: "New Prescription",
      message: "Dr. Davis has uploaded a new prescription",
      time: "1 day ago",
      isRead: false
    }
  ]);

  const notificationsRef = useClickOutside(() => setIsNotificationsOpen(false));
  const profileRef = useClickOutside(() => setIsProfileOpen(false));

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <nav className="fixed top-0 right-0 left-0 md:left-64 bg-white border-b border-gray-200 z-30">
      <div className="px-4 md:px-6 h-16">
        <div className="flex justify-between items-center h-full">
          {/* Empty div to maintain spacing */}
          <div></div>

          <div className="flex items-center space-x-4">
            {/* Search Bar - hidden on mobile */}
            <div className="hidden md:block relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-64 pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                placeholder="Search..."
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                }}
                className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none relative"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <button 
                        className="text-xs text-green-600 hover:text-green-800"
                        onClick={() => {
                          setNotifications(notifications.map(n => ({ ...n, isRead: true })));
                        }}
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`px-4 py-3 hover:bg-gray-50 ${!notification.isRead ? 'bg-green-50' : ''}`}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                            <BellIcon className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="ml-3 w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            <p className="text-sm text-gray-500">{notification.message}</p>
                            <p className="mt-1 text-xs text-gray-400">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2"
              >
                <UserCircleIcon className="h-8 w-8 text-gray-600" />
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium text-gray-700">{user?.fullName || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/dashboard/patient/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <UserCircleIcon className="mr-3 h-5 w-5 text-gray-400" />
                      Your Profile
                    </Link>
                    <Link
                      href="/dashboard/patient/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Cog6ToothIcon className="mr-3 h-5 w-5 text-gray-400" />
                      Settings
                    </Link>
                    <Link
                      href="/help"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <QuestionMarkCircleIcon className="mr-3 h-5 w-5 text-gray-400" />
                      Help Center
                    </Link>
                  </div>
                  <div className="border-t border-gray-200">
                    <button
                      onClick={() => {/* Add logout logic */}}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                    >
                      <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-red-400" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 
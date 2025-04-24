'use client';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { BellIcon, UserCircleIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

export default function AdminNavbar({ user }) {
  return (
    <nav className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-white shadow-sm z-40">
      <div className="h-full px-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
        
        <div className="flex items-center space-x-4">
          {/* System Settings */}
          <button className="p-2 text-gray-600 hover:text-gray-800 rounded-lg">
            <Cog6ToothIcon className="h-6 w-6" />
          </button>

          {/* Notifications */}
          <button className="p-2 text-gray-600 hover:text-gray-800 rounded-lg">
            <BellIcon className="h-6 w-6" />
          </button>

          {/* Profile Dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2">
              <UserCircleIcon className="h-8 w-8 text-gray-600" />
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-gray-700">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500">System Administrator</p>
              </div>
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="/dashboard/admin/profile"
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } block px-4 py-2 text-sm text-gray-700`}
                    >
                      Your Profile
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="/dashboard/admin/settings"
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } block px-4 py-2 text-sm text-gray-700`}
                    >
                      System Settings
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="/logout"
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } block px-4 py-2 text-sm text-gray-700`}
                    >
                      Sign out
                    </a>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </nav>
  );
} 
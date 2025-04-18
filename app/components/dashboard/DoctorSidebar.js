'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  CalendarIcon,
  DocumentArrowDownIcon,
  UserGroupIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function DoctorSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Home', href: '/dashboard/doctor', icon: HomeIcon },
    { name: 'Appointments', href: '/dashboard/doctor/appointments', icon: CalendarIcon },
    { name: 'Patients', href: '/dashboard/doctor/patients', icon: UserGroupIcon },
    { name: 'Video Consultation', href: '/dashboard/doctor/video-consultation', icon: VideoCameraIcon },
    { name: 'E-Prescriptions', href: '/dashboard/doctor/prescriptions', icon: DocumentArrowDownIcon },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar */}
      <nav className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="p-5 border-b border-gray-200">
            <h1 className="text-xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-800">
                VirtualDoc
              </span>
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-2 mx-2 rounded-lg ${
                    isActive
                      ? 'bg-green-100 text-green-800'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
} 
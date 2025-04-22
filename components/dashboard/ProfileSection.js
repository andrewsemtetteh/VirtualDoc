'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function ProfileSection() {
  const { data: session } = useSession();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-6 mb-6">
        <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt="Profile"
              width={96}
              height={96}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl">👤</span>
            </div>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{session?.user?.name || 'Patient Name'}</h2>
          <p className="text-gray-600">{session?.user?.email || 'patient@example.com'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
              <p className="text-gray-800">January 1, 1990</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Phone Number</label>
              <p className="text-gray-800">+1 (555) 123-4567</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Address</label>
              <p className="text-gray-800">123 Main St, City, State 12345</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Medical Information</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-600">Blood Type</label>
              <p className="text-gray-800">O+</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Primary Care Physician</label>
              <p className="text-gray-800">Dr. Sarah Johnson</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Insurance Provider</label>
              <p className="text-gray-800">HealthCare Plus</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
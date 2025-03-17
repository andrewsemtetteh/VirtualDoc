'use client';

import { useSession } from 'next-auth/react';

export default function WelcomeSection() {
  const { data: session } = useSession();
  const currentTime = new Date();
  const hour = currentTime.getHours();

  const getGreeting = () => {
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">
        {getGreeting()}, {session?.user?.name}!
      </h2>
      <div className="space-y-4">
        <div className="flex items-center text-gray-600">
          <span className="text-xl mr-2">🏥</span>
          <p>Welcome to your Virtual Doctor Dashboard</p>
        </div>
        <div className="flex items-center text-gray-600">
          <span className="text-xl mr-2">📅</span>
          <p>Manage your appointments and consultations</p>
        </div>
        <div className="flex items-center text-gray-600">
          <span className="text-xl mr-2">📋</span>
          <p>Access your medical records and prescriptions</p>
        </div>
        <div className="flex items-center text-gray-600">
          <span className="text-xl mr-2">🔔</span>
          <p>Stay updated with important notifications</p>
        </div>
      </div>
    </div>
  );
} 
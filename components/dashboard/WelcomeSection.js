'use client';

import { useSession } from 'next-auth/react';

export default function WelcomeSection() {
  const { data: session } = useSession();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Welcome back, {session?.user?.name || 'Patient'}!
      </h2>
      <p className="text-gray-600">
        Here's an overview of your health status and upcoming activities.
      </p>
      
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Next Appointment</h3>
          <p className="text-blue-600">No upcoming appointments</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">Last Visit</h3>
          <p className="text-green-600">2 weeks ago</p>
        </div>
      </div>
    </div>
  );
} 
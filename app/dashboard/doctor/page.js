'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

// Components will be created separately
import WelcomeSection from '@/components/dashboard/doctor/WelcomeSection';
import AppointmentManager from '@/components/dashboard/doctor/AppointmentManager';
import ProfileManager from '@/components/dashboard/doctor/ProfileManager';
import VideoConsultation from '@/components/dashboard/doctor/VideoConsultation';
import PrescriptionManager from '@/components/dashboard/doctor/PrescriptionManager';
import PatientManager from '@/components/dashboard/doctor/PatientManager';
import Analytics from '@/components/dashboard/doctor/Analytics';

export default function DoctorDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);

  // Fetch doctor data and notifications
  useEffect(() => {
    // TODO: Implement data fetching
  }, [session]);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <WelcomeSection />
            <AppointmentManager type="upcoming" limit={3} />
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Notifications</h3>
                {notifications.map((notification, index) => (
                  <div key={index} className="py-2 border-b last:border-0">
                    {notification.message}
                  </div>
                ))}
              </div>
              <Analytics />
            </div>
          </div>
        );
      case 'profile':
        return <ProfileManager />;
      case 'appointments':
        return <AppointmentManager />;
      case 'consultations':
        return <VideoConsultation />;
      case 'prescriptions':
        return <PrescriptionManager />;
      case 'patients':
        return <PatientManager />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg">
        <div className="p-4">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="Profile"
                  width={48}
                  height={48}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-2xl">👨‍⚕️</span>
                </div>
              )}
            </div>
            <div>
              <h2 className="font-semibold">Dr. {session?.user?.name}</h2>
              <p className="text-sm text-gray-500">{session?.user?.specialization}</p>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'profile', label: 'Profile', icon: '👤' },
              { id: 'appointments', label: 'Appointments', icon: '📅' },
              { id: 'consultations', label: 'Video Consultations', icon: '🎥' },
              { id: 'prescriptions', label: 'Prescriptions', icon: '📝' },
              { id: 'patients', label: 'Patients', icon: '👥' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'hover:bg-gray-50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
} 
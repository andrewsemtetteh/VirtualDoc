'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

// Components will be created separately
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import AppointmentList from '@/components/dashboard/AppointmentList';
import ProfileSection from '@/components/dashboard/ProfileSection';
import MedicalRecords from '@/components/dashboard/MedicalRecords';
import VideoConsultation from '@/components/dashboard/VideoConsultation';
import Notifications from '@/components/dashboard/Notifications';
import FeedbackSection from '@/components/dashboard/FeedbackSection';

export default function PatientDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);

  // Fetch patient data and notifications
  useEffect(() => {
    // TODO: Implement data fetching
  }, [session]);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <WelcomeSection />
            <AppointmentList type="upcoming" limit={3} />
            <Notifications notifications={notifications} />
          </div>
        );
      case 'profile':
        return <ProfileSection />;
      case 'appointments':
        return <AppointmentList />;
      case 'records':
        return <MedicalRecords />;
      case 'consultations':
        return <VideoConsultation />;
      case 'feedback':
        return <FeedbackSection />;
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
                  <span className="text-2xl">👤</span>
                </div>
              )}
            </div>
            <div>
              <h2 className="font-semibold">{session?.user?.name}</h2>
              <p className="text-sm text-gray-500">Patient</p>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'profile', label: 'Profile', icon: '👤' },
              { id: 'appointments', label: 'Appointments', icon: '📅' },
              { id: 'records', label: 'Medical Records', icon: '📋' },
              { id: 'consultations', label: 'Video Consultations', icon: '🎥' },
              { id: 'feedback', label: 'Feedback', icon: '⭐' },
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
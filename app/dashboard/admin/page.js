'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

// Components will be created separately
import UserManagement from '@/components/dashboard/admin/UserManagement';
import DoctorVerification from '@/components/dashboard/admin/DoctorVerification';
import AppointmentMonitoring from '@/components/dashboard/admin/AppointmentMonitoring';
import AnalyticsReports from '@/components/dashboard/admin/AnalyticsReports';
import SystemSettings from '@/components/dashboard/admin/SystemSettings';
import AdminNotifications from '@/components/dashboard/admin/AdminNotifications';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingVerifications: 0,
    activeAppointments: 0,
  });

  // Fetch admin data, notifications, and stats
  useEffect(() => {
    // TODO: Implement data fetching
  }, [session]);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Total Users</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Pending Verifications</h3>
                <p className="text-3xl font-bold text-yellow-600">{stats.pendingVerifications}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Active Appointments</h3>
                <p className="text-3xl font-bold text-green-600">{stats.activeAppointments}</p>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <AdminNotifications notifications={notifications} />
            </div>
          </div>
        );
      case 'users':
        return <UserManagement />;
      case 'verification':
        return <DoctorVerification />;
      case 'appointments':
        return <AppointmentMonitoring />;
      case 'analytics':
        return <AnalyticsReports />;
      case 'settings':
        return <SystemSettings />;
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
                  <span className="text-2xl">👑</span>
                </div>
              )}
            </div>
            <div>
              <h2 className="font-semibold">{session?.user?.name}</h2>
              <p className="text-sm text-gray-500">Administrator</p>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'users', label: 'User Management', icon: '👥' },
              { id: 'verification', label: 'Doctor Verification', icon: '✅' },
              { id: 'appointments', label: 'Appointments', icon: '📅' },
              { id: 'analytics', label: 'Analytics & Reports', icon: '📈' },
              { id: 'settings', label: 'System Settings', icon: '⚙️' },
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
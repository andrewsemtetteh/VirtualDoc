'use client';
import PatientSidebar from '../../components/dashboard/PatientSidebar';
import DashboardNavbar from '../../components/dashboard/DashboardNavbar';

export default function PatientDashboardLayout({ children }) {
  const userProfile = {
    fullName: 'Joshua Agyeman',
    email: 'john@example.com',
    avatar: null
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PatientSidebar />
      <div className="md:ml-64">
        <DashboardNavbar user={userProfile} />
        <main className="p-4 md:p-8 mt-16">
          {children}
        </main>
      </div>
    </div>
  );
} 
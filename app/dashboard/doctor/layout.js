'use client';
import DoctorSidebar from '../../components/dashboard/DoctorSidebar';
import DoctorNavbar from '../../components/dashboard/DoctorNavbar';

export default function DoctorLayout({ children }) {
  const doctorProfile = {
    name: 'Dr. Smith',
    specialty: 'Cardiologist',
    avatar: null
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DoctorSidebar />
      <div className="md:ml-64">
        <DoctorNavbar user={doctorProfile} />
        <main className="p-4 md:p-8 mt-16">
          {children}
        </main>
      </div>
    </div>
  );
} 
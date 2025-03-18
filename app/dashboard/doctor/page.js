'use client';
import dynamic from 'next/dynamic';

const DoctorDashboard = dynamic(() => import('../../components/dashboard/DoctorDashboard'), {
  ssr: false
});

export default function DoctorDashboardPage() {
  return <DoctorDashboard />;
} 
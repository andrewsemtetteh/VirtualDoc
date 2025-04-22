'use client';
import dynamic from 'next/dynamic';

const PatientDashboard = dynamic(() => import('../../components/dashboard/PatientDashboard'), {
  ssr: false
});

export default function PatientDashboardPage() {
  return <PatientDashboard />;
} 
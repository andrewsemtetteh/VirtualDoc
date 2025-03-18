'use client';
import dynamic from 'next/dynamic';

const AdminDashboard = dynamic(() => import('../../components/dashboard/AdminDashboard'), {
  ssr: false
});

export default function AdminDashboardPage() {
  return <AdminDashboard />;
} 
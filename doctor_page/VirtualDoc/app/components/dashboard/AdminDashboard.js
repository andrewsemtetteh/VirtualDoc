'use client';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [systemStats, setSystemStats] = useState({});

  useEffect(() => {
    // Add your data fetching logic here
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">System Overview</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Add New User
        </button>
        <button className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Verify Doctors
        </button>
        <button className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          System Settings
        </button>
      </div>

      {/* System Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-2">Active Doctors</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-2">Total Patients</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-2">Today's Appointments</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
      </div>

      {/* Pending Verifications */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Pending Doctor Verifications</h2>
        <div className="space-y-4">
          {/* Add verification requests here */}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {/* Add activity log here */}
        </div>
      </div>
    </div>
  );
} 
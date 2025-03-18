'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Add your data fetching logic here
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Patient Dashboard</h1>
        <p className="text-gray-600">Welcome back, [Patient Name]</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Book New Appointment
        </button>
        <button className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Join Video Consultation
        </button>
        <button className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          View Medical Records
        </button>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
        <div className="space-y-4">
          {/* Add appointment list items here */}
        </div>
      </div>

      {/* Recent Medical Records */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Medical Records</h2>
        <div className="space-y-4">
          {/* Add medical records list here */}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        <div className="space-y-4">
          {/* Add notifications list here */}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard; 
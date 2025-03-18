'use client';
import { useState, useEffect } from 'react';

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [consultations, setConsultations] = useState([]);

  useEffect(() => {
    // Add your data fetching logic here
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Doctor Dashboard</h1>
        <p className="text-gray-600">Dr. [Doctor Name] - [Specialization]</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Start Consultation
        </button>
        <button className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          View Appointments
        </button>
        <button className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          Write Prescription
        </button>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Today's Schedule</h2>
        <div className="space-y-4">
          {/* Add schedule items here */}
        </div>
      </div>

      {/* Recent Patients */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Patients</h2>
        <div className="space-y-4">
          {/* Add patient list here */}
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-2">Total Consultations</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-2">Pending Reviews</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-2">Patient Rating</h3>
          <p className="text-3xl font-bold">4.8</p>
        </div>
      </div>
    </div>
  );
} 
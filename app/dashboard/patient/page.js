'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  CalendarIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  DocumentArrowDownIcon,
  UserCircleIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  IdentificationIcon,
  CheckCircleIcon,
  PencilIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      doctorName: "Sarah Smith",
      specialty: "Cardiologist",
      date: "2024-03-25",
      time: "10:00 AM",
      type: "Video",
      status: "Confirmed"
    },
    {
      id: 2,
      doctorName: "John Davis",
      specialty: "General Physician",
      date: "2024-03-27",
      time: "2:30 PM",
      type: "Video",
      status: "Pending"
    }
  ]);

  const patientInfo = {
    id: "PT-2024-001",
    name: "Joshua Agyeman",
    age: "28",
    bloodType: "O+",
    nextAppointment: "March 25, 2024"
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, John!</h1>
            <p className="text-gray-600">Here's what's happening with your health today.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-700 transition-colors">
              Book Appointment
            </button>
          </div>
        </div>
      </div>

      {/* Patient Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">John Doe</span>
            </div>
            <div className="flex flex-col sm:flex-row justify-between">
              <span className="text-gray-600">Date of Birth:</span>
              <span className="font-medium">January 1, 1980</span>
            </div>
            <div className="flex flex-col sm:flex-row justify-between">
              <span className="text-gray-600">Gender:</span>
              <span className="font-medium">Male</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">john.doe@example.com</span>
            </div>
            <div className="flex flex-col sm:flex-row justify-between">
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium">(555) 123-4567</span>
            </div>
            <div className="flex flex-col sm:flex-row justify-between">
              <span className="text-gray-600">Address:</span>
              <span className="font-medium">123 Main St, City, State</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4">Insurance Information</h2>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between">
              <span className="text-gray-600">Provider:</span>
              <span className="font-medium">Blue Cross Blue Shield</span>
            </div>
            <div className="flex flex-col sm:flex-row justify-between">
              <span className="text-gray-600">Policy Number:</span>
              <span className="font-medium">BCBS123456789</span>
            </div>
            <div className="flex flex-col sm:flex-row justify-between">
              <span className="text-gray-600">Group Number:</span>
              <span className="font-medium">GRP123456</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <div className="flex flex-col">
            <span className="text-gray-600">Upcoming Appointments</span>
            <span className="text-2xl font-bold">2</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <div className="flex flex-col">
            <span className="text-gray-600">Pending Prescriptions</span>
            <span className="text-2xl font-bold">1</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <div className="flex flex-col">
            <span className="text-gray-600">Recent Lab Results</span>
            <span className="text-2xl font-bold">3</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <div className="flex flex-col">
            <span className="text-gray-600">Messages</span>
            <span className="text-2xl font-bold">5</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center justify-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <span>Book Appointment</span>
          </button>
          <button className="flex items-center justify-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <span>View Medical Records</span>
          </button>
          <button className="flex items-center justify-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <span>Request Prescription</span>
          </button>
          <button className="flex items-center justify-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <span>Message Doctor</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium">Appointment with Dr. Smith</h3>
              <p className="text-gray-600">Cardiology Consultation</p>
            </div>
            <span className="text-sm text-gray-500">2 days ago</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium">Lab Results Received</h3>
              <p className="text-gray-600">Blood Test Results</p>
            </div>
            <span className="text-sm text-gray-500">5 days ago</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium">Prescription Refill</h3>
              <p className="text-gray-600">Medication X</p>
            </div>
            <span className="text-sm text-gray-500">1 week ago</span>
          </div>
        </div>
      </div>
    </div>
  );
} 
'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  HomeIcon,
  CalendarIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  DocumentArrowDownIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const NavItem = ({ icon, text, href, active }) => (
  <Link
    href={href}
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      active 
        ? 'bg-green-100 text-green-800' 
        : 'text-gray-600 hover:bg-gray-50'
    }`}
  >
    {icon}
    <span className="hidden md:block">{text}</span>
  </Link>
);

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: "John Doe",
      time: "10:00 AM",
      type: "Video Consultation",
      status: "Confirmed"
    },
    {
      id: 2,
      patientName: "Jane Smith",
      time: "2:30 PM",
      type: "Follow-up",
      status: "Pending"
    }
  ]);

  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "John Doe",
      lastVisit: "2024-03-20",
      condition: "Routine Checkup"
    },
    {
      id: 2,
      name: "Jane Smith",
      lastVisit: "2024-03-18",
      condition: "Follow-up"
    }
  ]);

  const doctor = {
    name: "Dr. Smith",
    specialty: "Cardiologist",
    avatar: null
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Responsive Sidebar/Navbar */}
      <nav className="fixed top-0 left-0 h-full w-20 md:w-64 bg-white shadow-lg z-50 transition-all duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="p-5.5 border-b border-gray-200">
            <h1 className="hidden md:block text-xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-800">
                VirtualDoc
              </span>
            </h1>
            <span className="md:hidden text-2xl font-bold text-green-700">VD</span>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 py-6 space-y-2">
            <NavItem icon={<HomeIcon className="w-5 h-5" />} text="Home" href="/dashboard/doctor" active />
            <NavItem icon={<CalendarIcon className="w-5 h-5" />} text="Appointments" href="/dashboard/doctor/appointments" />
            <NavItem icon={<UserGroupIcon className="w-5 h-5" />} text="Patients" href="/dashboard/doctor/patients" />
            <NavItem icon={<VideoCameraIcon className="w-5 h-5" />} text="Video Consultation" href="/dashboard/doctor/video-consultation" />
            <NavItem icon={<DocumentArrowDownIcon className="w-5 h-5" />} text="E-Prescriptions" href="/dashboard/doctor/prescriptions" />
            <NavItem icon={<ChatBubbleLeftRightIcon className="w-5 h-5" />} text="Messages" href="/messages" />
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="md:ml-64 p-4 md:p-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-green-800 to-green-700 rounded-2xl p-6 md:p-8 text-white mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, Dr. Smith!</h1>
              <p className="text-green-100">You have {appointments.length} appointments today</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link 
                href="/dashboard/doctor/video-consultation"
                className="inline-flex items-center px-4 py-2 bg-white text-green-800 rounded-lg hover:bg-green-50 transition-colors"
              >
                <VideoCameraIcon className="w-5 h-5 mr-2" />
                Start Consultation
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-gray-500 mb-2">Today's Appointments</h3>
            <p className="text-3xl font-bold text-gray-800">{appointments.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-gray-500 mb-2">Total Patients</h3>
            <p className="text-3xl font-bold text-gray-800">{patients.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-gray-500 mb-2">Pending Reviews</h3>
            <p className="text-3xl font-bold text-gray-800">3</p>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Today's Schedule</h2>
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{appointment.patientName}</h3>
                  <p className="text-sm text-gray-500">{appointment.time} - {appointment.type}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  appointment.status === 'Confirmed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {appointment.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Patients */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Recent Patients</h2>
          <div className="space-y-4">
            {patients.map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{patient.name}</h3>
                  <p className="text-sm text-gray-500">Last Visit: {patient.lastVisit}</p>
                  <p className="text-sm text-gray-500">{patient.condition}</p>
                </div>
                <Link
                  href={`/dashboard/doctor/patients/${patient.id}`}
                  className="text-green-800 hover:text-green-700"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 
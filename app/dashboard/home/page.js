'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  CalendarIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  DocumentArrowDownIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

export default function HomePage() {
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
      type: "In-Person",
      status: "Pending"
    }
  ]);

  const [recentPrescriptions, setRecentPrescriptions] = useState([
    {
      id: 1,
      medication: "Amoxicillin",
      doctor: "Sarah Smith",
      date: "2024-03-20",
      dosage: "500mg",
      duration: "7 days"
    },
    {
      id: 2,
      medication: "Ibuprofen",
      doctor: "John Davis",
      date: "2024-03-18",
      dosage: "400mg",
      duration: "5 days"
    }
  ]);

  const [healthTips, setHealthTips] = useState([
    {
      id: 1,
      title: "Stay Hydrated",
      description: "Drink at least 8 glasses of water daily for optimal health."
    },
    {
      id: 2,
      title: "Regular Exercise",
      description: "Aim for 30 minutes of moderate exercise 5 times a week."
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-green-800 to-green-700 rounded-2xl p-6 md:p-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, Joshua!</h1>
            <p className="text-green-100">Your health journey continues here</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <Link 
              href="/dashboard/appointments"
              className="inline-flex items-center px-4 py-2 bg-white text-green-800 rounded-lg hover:bg-green-50 transition-colors"
            >
              <CalendarIcon className="w-5 h-5 mr-2" />
              Book Appointment
            </Link>
            <Link 
              href="/dashboard/video-consultation"
              className="inline-flex items-center px-4 py-2 bg-white text-green-800 rounded-lg hover:bg-green-50 transition-colors"
            >
              <VideoCameraIcon className="w-5 h-5 mr-2" />
              Join Video Call
            </Link>
          </div>
        </div>
      </div>

      {/* User Profile Summary */}
      <div className="flex items-center space-x-4 bg-white rounded-xl shadow-sm p-6">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
          <UserCircleIcon className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Joshua Agyeman</h2>
          <p className="text-sm text-gray-500">Patient ID: P123456</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickStatsCard
          title="Upcoming Appointments"
          value={appointments.length}
          icon={<CalendarIcon className="w-6 h-6 text-green-800" />}
          href="/dashboard/appointments"
        />
        <QuickStatsCard
          title="Recent Prescriptions"
          value={recentPrescriptions.length}
          icon={<DocumentArrowDownIcon className="w-6 h-6 text-green-800" />}
          href="/dashboard/prescriptions"
        />
        <QuickStatsCard
          title="Medical Records"
          value="View"
          icon={<DocumentTextIcon className="w-6 h-6 text-green-800" />}
          href="/dashboard/medical-records"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Appointments */}
          <Card
            title="Upcoming Appointments"
            action={
              <Link 
                href="/dashboard/appointments"
                className="text-sm text-green-800 hover:text-green-700"
              >
                View All
              </Link>
            }
          >
            <div className="divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">Dr. {appointment.doctorName}</h3>
                      <p className="text-sm text-gray-500">{appointment.specialty}</p>
                      <p className="text-sm text-gray-500">{appointment.date} at {appointment.time}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                        appointment.type === 'Video' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {appointment.type} Consultation
                      </span>
                    </div>
                    <div>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        appointment.status === 'Confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Prescriptions */}
          <Card
            title="Recent Prescriptions"
            action={
              <Link 
                href="/dashboard/prescriptions"
                className="text-sm text-green-800 hover:text-green-700"
              >
                View All
              </Link>
            }
          >
            <div className="divide-y divide-gray-200">
              {recentPrescriptions.map((prescription) => (
                <div key={prescription.id} className="py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{prescription.medication}</h3>
                      <p className="text-sm text-gray-500">Dr. {prescription.doctor}</p>
                      <p className="text-sm text-gray-500">
                        {prescription.dosage} - {prescription.duration}
                      </p>
                    </div>
                    <button className="inline-flex items-center px-3 py-1 bg-green-800 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                      <DocumentArrowDownIcon className="w-4 h-4 mr-1" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Side Column */}
        <div className="space-y-6">
          {/* Health Tips */}
          <Card title="Health Tips">
            <div className="space-y-4">
              {healthTips.map((tip) => (
                <div key={tip.id} className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-medium text-green-900 mb-1">{tip.title}</h3>
                  <p className="text-sm text-green-800">{tip.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

const Card = ({ title, children, action }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      {action}
    </div>
    {children}
  </div>
);

const QuickStatsCard = ({ title, value, icon, href }) => (
  <Link href={href}>
    <div className="bg-white rounded-xl shadow-sm p-6 hover:bg-gray-50 transition-colors cursor-pointer">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-green-50 rounded-xl">
          {icon}
        </div>
      </div>
      <h3 className="text-sm text-gray-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </Link>
); 
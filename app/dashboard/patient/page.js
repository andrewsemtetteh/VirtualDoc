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
      <div className="bg-gradient-to-r from-green-800 to-green-700 rounded-2xl p-6 md:p-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, Joshua!</h1>
            <p className="text-green-100">Your health journey continues here</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <Link 
              href="/dashboard/patient/appointments"
              className="inline-flex items-center px-4 py-2 bg-white text-green-800 rounded-lg hover:bg-green-50 transition-colors"
            >
              <CalendarIcon className="w-5 h-5 mr-2" />
              Book Appointment
            </Link>
            <Link 
              href="/dashboard/patient/video-consultation"
              className="inline-flex items-center px-4 py-2 bg-white text-green-800 rounded-lg hover:bg-green-50 transition-colors"
            >
              <VideoCameraIcon className="w-5 h-5 mr-2" />
              Join Video Call
            </Link>
          </div>
        </div>

        {/* Patient Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 pt-4 border-t border-green-600">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <IdentificationIcon className="w-6 h-6 text-white" />
              <div>
                <p className="text-sm text-green-100">Patient ID</p>
                <p className="text-lg font-semibold text-white">{patientInfo.id}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <UserCircleIcon className="w-6 h-6 text-white" />
              <div>
                <p className="text-sm text-green-100">Age</p>
                <p className="text-lg font-semibold text-white">{patientInfo.age} years</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <DocumentTextIcon className="w-6 h-6 text-white" />
              <div>
                <p className="text-sm text-green-100">Blood Type</p>
                <p className="text-lg font-semibold text-white">{patientInfo.bloodType}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <CalendarIcon className="w-6 h-6 text-white" />
              <div>
                <p className="text-sm text-green-100">Next Meeting</p>
                <p className="text-lg font-semibold text-white">{patientInfo.nextAppointment}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-green-600">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <CalendarIcon className="w-6 h-6 text-white" />
              <div>
                <p className="text-sm text-green-100">Appointments</p>
                <p className="text-xl font-bold text-white">2</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <VideoCameraIcon className="w-6 h-6 text-white" />
              <div>
                <p className="text-sm text-green-100">Consultations</p>
                <p className="text-xl font-bold text-white">2</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <DocumentTextIcon className="w-6 h-6 text-white" />
              <div>
                <p className="text-sm text-green-100">Medical Records</p>
                <p className="text-xl font-bold text-white">5</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <DocumentArrowDownIcon className="w-6 h-6 text-white" />
              <div>
                <p className="text-sm text-green-100">Prescriptions</p>
                <p className="text-xl font-bold text-white">3</p>
              </div>
            </div>
          </div>
        </div>

        {/* Member Status */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-green-600">
          <span className="inline-flex items-center text-sm text-green-100">
            <ClockIcon className="w-4 h-4 mr-1" />
            Member since 2024
          </span>
          <span className="inline-flex items-center text-sm text-green-100">
            <CheckCircleIcon className="w-4 h-4 mr-1" />
            Active Patient
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/dashboard/patient/appointments" 
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all group">
          <CalendarIcon className="w-8 h-8 text-green-700 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-gray-800">Schedule Appointment</h3>
          <p className="text-sm text-gray-500 mt-1">Book your next visit</p>
        </Link>
        <Link href="/dashboard/patient/video-consultation"
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all group">
          <VideoCameraIcon className="w-8 h-8 text-green-700 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-gray-800">Video Consultation</h3>
          <p className="text-sm text-gray-500 mt-1">Connect with your doctor</p>
        </Link>
        <Link href="/dashboard/patient/medical-records"
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all group">
          <DocumentTextIcon className="w-8 h-8 text-green-700 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-gray-800">Medical Records</h3>
          <p className="text-sm text-gray-500 mt-1">View your health history</p>
        </Link>
        <Link href="/dashboard/patient/prescriptions"
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all group">
          <DocumentArrowDownIcon className="w-8 h-8 text-green-700 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-gray-800">Prescriptions</h3>
          <p className="text-sm text-gray-500 mt-1">Access your medications</p>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h2>
              <Link href="/dashboard/patient/appointments" className="text-green-800 hover:text-green-700 text-sm font-medium">
                View All
              </Link>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="bg-green-50 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">Dr. {appointment.doctorName}</h3>
                    <p className="text-sm text-gray-600">{appointment.specialty}</p>
                    <p className="text-sm text-gray-600">{appointment.date} at {appointment.time}</p>
                    <span className="inline-block px-2 py-1 mt-2 text-xs rounded-full bg-green-100 text-green-800">
                      Video Consultation
                    </span>
                  </div>
                  <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Prescriptions */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Recent Prescriptions</h2>
              <Link href="/dashboard/patient/prescriptions" className="text-green-800 hover:text-green-700 text-sm font-medium">
                View All
              </Link>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="bg-green-50 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">General Medication</h3>
                    <p className="text-sm text-gray-600">Prescribed by Dr. {appointment.doctorName}</p>
                    <p className="text-sm text-gray-600">{appointment.date}</p>
                  </div>
                  <button className="flex items-center space-x-2 px-3 py-2 bg-green-800 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    <span className="text-sm">Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 
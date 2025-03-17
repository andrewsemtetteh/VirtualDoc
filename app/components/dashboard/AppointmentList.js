'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function AppointmentList({ type = 'all', limit }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch appointments from API
    // This is mock data for demonstration
    const mockAppointments = [
      {
        id: 1,
        doctorName: 'Dr. Sarah Smith',
        specialization: 'Cardiologist',
        date: new Date(2024, 2, 25, 14, 30),
        status: 'upcoming',
        type: 'Video Consultation',
      },
      {
        id: 2,
        doctorName: 'Dr. John Doe',
        specialization: 'Dermatologist',
        date: new Date(2024, 2, 27, 10, 0),
        status: 'upcoming',
        type: 'In-Person',
      },
      {
        id: 3,
        doctorName: 'Dr. Emily Brown',
        specialization: 'Neurologist',
        date: new Date(2024, 2, 20, 15, 45),
        status: 'completed',
        type: 'Video Consultation',
      },
    ];

    setAppointments(mockAppointments);
    setLoading(false);
  }, []);

  const filteredAppointments = appointments
    .filter(appointment => type === 'all' || appointment.status === type)
    .slice(0, limit);

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'text-blue-600 bg-blue-50';
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">
        {type === 'upcoming' ? 'Upcoming Appointments' : 'All Appointments'}
      </h3>
      <div className="space-y-4">
        {filteredAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium">{appointment.doctorName}</h4>
                <p className="text-sm text-gray-500">{appointment.specialization}</p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  appointment.status
                )}`}
              >
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600 mt-2">
              <span className="mr-2">📅</span>
              {format(appointment.date, 'PPP')}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="mr-2">⏰</span>
              {format(appointment.date, 'p')}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="mr-2">
                {appointment.type === 'Video Consultation' ? '🎥' : '🏥'}
              </span>
              {appointment.type}
            </div>
            {appointment.status === 'upcoming' && (
              <div className="mt-4 flex space-x-2">
                {appointment.type === 'Video Consultation' && (
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                    Join Call
                  </button>
                )}
                <button className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                  Reschedule
                </button>
                <button className="border border-red-300 text-red-600 px-4 py-2 rounded-lg text-sm hover:bg-red-50 transition-colors">
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {type === 'upcoming' && (
        <button className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
          View All Appointments →
        </button>
      )}
    </div>
  );
} 
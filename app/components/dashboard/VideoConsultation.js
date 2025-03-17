'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function VideoConsultation() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch video consultations from API
    // Mock data for demonstration
    const mockConsultations = [
      {
        id: 1,
        doctorName: 'Dr. Sarah Smith',
        specialization: 'Cardiologist',
        date: new Date(2024, 2, 25, 14, 30),
        duration: 30,
        status: 'scheduled',
        meetingLink: 'https://meet.virtualdoc.com/abc123',
      },
      {
        id: 2,
        doctorName: 'Dr. John Doe',
        specialization: 'Dermatologist',
        date: new Date(2024, 2, 20, 15, 45),
        duration: 45,
        status: 'completed',
        recordingLink: 'https://virtualdoc.com/recordings/xyz789',
      },
    ];

    setConsultations(mockConsultations);
    setLoading(false);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'text-blue-600 bg-blue-50';
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled':
        return '🕒';
      case 'completed':
        return '✅';
      case 'cancelled':
        return '❌';
      default:
        return '📅';
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Video Consultations</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Schedule New Consultation
          </button>
        </div>

        <div className="space-y-6">
          {consultations.map((consultation) => (
            <div
              key={consultation.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-lg">
                      {consultation.doctorName}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                        consultation.status
                      )}`}
                    >
                      <span>{getStatusIcon(consultation.status)}</span>
                      {consultation.status.charAt(0).toUpperCase() +
                        consultation.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {consultation.specialization}
                  </p>
                </div>
                {consultation.status === 'scheduled' && (
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                    Join Call
                  </button>
                )}
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">📅</span>
                    <span>Date: {format(consultation.date, 'PPP')}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">⏰</span>
                    <span>Time: {format(consultation.date, 'p')}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">⌛</span>
                    <span>Duration: {consultation.duration} minutes</span>
                  </div>
                </div>

                {consultation.status === 'scheduled' && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Meeting Link:</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={consultation.meetingLink}
                        readOnly
                        className="flex-1 px-3 py-1 text-sm border rounded-lg bg-gray-50"
                      />
                      <button className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700">
                        Copy
                      </button>
                    </div>
                  </div>
                )}

                {consultation.status === 'completed' && consultation.recordingLink && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Recording:</p>
                    <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                      <span>📹</span>
                      View Recording
                    </button>
                  </div>
                )}
              </div>

              {consultation.status === 'scheduled' && (
                <div className="mt-4 flex justify-end space-x-2">
                  <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-700">
                    Reschedule
                  </button>
                  <button className="px-4 py-2 text-sm text-red-600 hover:text-red-700">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {consultations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No video consultations found</p>
            <button className="mt-4 text-blue-600 hover:text-blue-700">
              Schedule your first consultation
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 
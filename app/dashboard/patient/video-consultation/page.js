'use client';
import { useState } from 'react';
import { VideoCameraIcon, MicrophoneIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function VideoConsultationPage() {
  const [isInCall, setIsInCall] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Video Consultation</h1>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-700 transition-colors">
            Schedule Consultation
          </button>
        </div>
      </div>

      {isInCall ? (
        <div className="bg-gray-900 rounded-xl aspect-video relative">
          {/* Video call interface */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="flex flex-wrap justify-center gap-4">
              <button className="p-4 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                <MicrophoneIcon className="w-6 h-6 text-white" />
              </button>
              <button className="p-4 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                <VideoCameraIcon className="w-6 h-6 text-white" />
              </button>
              <button 
                className="p-4 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
                onClick={() => setIsInCall(false)}
              >
                <XMarkIcon className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upcoming consultations */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <h2 className="text-lg font-semibold mb-4">Upcoming Consultations</h2>
            <div className="text-center text-gray-500 py-8">
              No upcoming video consultations
            </div>
          </div>

          {/* Past consultations */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <h2 className="text-lg font-semibold mb-4">Past Consultations</h2>
            <div className="text-center text-gray-500 py-8">
              No past video consultations
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
'use client';

import Image from 'next/image';

export default function DoctorCard({ doctor, onBook }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={doctor.profilePicture || '/default-doctor.jpg'}
          alt={doctor.fullName}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">Dr. {doctor.fullName}</h3>
        <p className="text-gray-600 mb-2">{doctor.specialization}</p>
        
        <div className="flex items-center mb-2">
          <span className="text-yellow-400 mr-1">★</span>
          <span className="text-gray-700">
            {doctor.rating?.toFixed(1) || 'New'}
          </span>
          <span className="text-gray-500 ml-2">
            ({doctor.reviewCount || 0} reviews)
          </span>
        </div>
        
        <div className="flex items-center mb-4">
          <span className="text-gray-700">
            {doctor.yearsOfExperience} years of experience
          </span>
        </div>
        
        <button
          onClick={onBook}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
} 
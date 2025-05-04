import React from 'react';
import Image from 'next/image';
import { Phone, Clock, Calendar, MapPin, CheckCircle2, User } from 'lucide-react';

const DoctorCard = ({ doctor, onBookAppointment, darkMode }) => {
  return (
    <div className={`rounded-xl overflow-hidden transition-all duration-300 ${
      darkMode 
        ? 'bg-gray-800 hover:bg-gray-700' 
        : 'bg-white hover:bg-gray-50'
    } shadow-lg hover:shadow-xl`}>
      {/* Doctor Image */}
      <div className="relative h-48 w-full">
        {doctor.profilePicture ? (
          <Image
            src={doctor.profilePicture}
            alt={doctor.fullName}
            fill
            className="object-cover"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${
            darkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <User className={`h-16 w-16 ${
              darkMode ? 'text-gray-300' : 'text-gray-500'
            }`} />
          </div>
        )}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            doctor.status === 'active'
              ? 'bg-green-100 text-green-800'
              : doctor.status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {doctor.status}
          </span>
        </div>
      </div>

      {/* Doctor Info */}
      <div className={`p-6 ${darkMode ? 'text-white' : 'text-gray-900'} text-center`}>
        <div className="flex items-center justify-center mb-2">
          <h3 className="text-xl font-bold">
            {doctor.status === 'active' ? `Dr. ${doctor.fullName}` : doctor.fullName}
          </h3>
          {doctor.status === 'active' && (
            <CheckCircle2 className="h-5 w-5 text-blue-500 ml-2" />
          )}
        </div>
        <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {doctor.specialization}
        </p>
        
        {/* Experience */}
        <div className="flex items-center justify-center mb-3">
          <Clock className={`h-4 w-4 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {doctor.yearsOfExperience || 'New'} years experience
          </span>
        </div>

        {/* Phone Number */}
        <div className="flex items-center justify-center mb-3">
          <Phone className={`h-4 w-4 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {doctor.phoneNumber || 'Phone number not available'}
          </span>
        </div>

        {/* Book Appointment Button */}
        <button
          onClick={() => onBookAppointment(doctor)}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-300 ${
            darkMode
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default DoctorCard; 
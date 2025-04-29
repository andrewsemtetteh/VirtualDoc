'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function DoctorVerification({ darkMode }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [actionInProgress, setActionInProgress] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [counts, setCounts] = useState({
    pending: 0,
    rejected: 0,
    total: 0,
    currentFilter: 0
  });

  useEffect(() => {
    fetchDoctors(selectedStatus);
  }, [selectedStatus]);

  const fetchDoctors = async (status) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/doctors/pending?status=${status === 'all' ? 'pending' : status}`);
      if (!response.ok) throw new Error('Failed to fetch doctors');
      const data = await response.json();
      setDoctors(data.doctors);
      setCounts({
        pending: data.counts.pending,
        rejected: data.counts.rejected,
        total: data.counts.total,
        currentFilter: data.counts.currentFilter
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const handleAction = async (doctorId, action, message = '') => {
    try {
      setActionInProgress(true);
      const response = await fetch(`/api/admin/doctors/${doctorId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: action,
          message: message || undefined
        }),
      });

      if (!response.ok) throw new Error('Action failed');

      // Refresh the list
      await fetchDoctors(selectedStatus);
      
      // Reset states
      setShowRejectionModal(false);
      setRejectionReason('');
      setSelectedDoctor(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionInProgress(false);
    }
  };

  const openRejectionModal = (doctor) => {
    setSelectedDoctor(doctor);
    setShowRejectionModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-lg ${
      darkMode 
        ? 'bg-gray-800 shadow-md' 
        : 'bg-white shadow-md border border-gray-100 hover:shadow-lg'
    } transition-all duration-300`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium">Doctor Verification Requests</h3>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {selectedStatus === 'all' 
              ? `Showing all verification requests (${counts.currentFilter})`
              : `Showing ${selectedStatus} doctors (${counts.currentFilter})`
            }
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Status filter buttons */}
          <div className="flex space-x-2">
            {[
              { value: 'all', label: 'All', color: 'gray' },
              { value: 'pending', label: 'Pending', color: 'yellow' },
              { value: 'rejected', label: 'Rejected', color: 'red' }
            ].map(({ value, label, color }) => (
              <button
                key={value}
                onClick={() => handleStatusChange(value)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
                  selectedStatus === value
                    ? darkMode
                      ? `bg-${color}-700 text-white`
                      : `bg-${color}-100 text-${color}-800`
                    : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
                {value !== 'all' && counts[value] > 0 && ` (${counts[value]})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {doctors.length === 0 ? (
          <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <p className="text-lg font-medium">No doctors found</p>
            <p className="text-sm mt-2">
              There are no {selectedStatus} doctor verification requests.
            </p>
          </div>
        ) : (
          <table className={`min-w-full transition-all duration-300 ${
            darkMode ? 'text-gray-300' : 'text-gray-900'
          }`}>
            <thead>
              <tr className={`border-b transition-all duration-300 ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y transition-all duration-300 ${
              darkMode ? 'divide-gray-700' : 'divide-gray-200'
            }`}>
              {doctors.map((doctor) => (
                <tr key={doctor._id} className={`transition-all duration-300 ${
                  darkMode 
                    ? 'hover:bg-gray-750' 
                    : 'hover:bg-gray-50'
                }`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {doctor.profilePicture ? (
                          <Image 
                            src={doctor.profilePicture} 
                            alt={doctor.fullName}
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.classList.add('bg-gray-200');
                            }}
                          />
                        ) : (
                          <span className={`text-sm ${darkMode ? 'text-gray-600' : 'text-gray-500'}`}>
                            {doctor.fullName.split(' ').map(n => n[0]).join('')}
                          </span>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="font-medium">{doctor.fullName}</div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {doctor.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">{doctor.specialization}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {doctor.licenseNumber && (
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          darkMode 
                            ? 'bg-gray-700 text-gray-300' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          License #{doctor.licenseNumber}
                        </span>
                      )}
                      {doctor.licenseDocument && (
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          darkMode 
                            ? 'bg-gray-700 text-gray-300' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          License Document
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      doctor.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(doctor.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {doctor.status === 'pending' && (
                        <>
                          <button
                            type="button"
                            className={`px-3 py-1 rounded-lg font-medium transition-all duration-300 ${
                              darkMode 
                                ? 'bg-green-700 hover:bg-green-800 text-white' 
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                            onClick={() => handleAction(doctor._id, 'active')}
                            disabled={actionInProgress}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            className={`px-3 py-1 rounded-lg font-medium transition-all duration-300 ${
                              darkMode 
                                ? 'bg-red-700 hover:bg-red-800 text-white' 
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                            onClick={() => openRejectionModal(doctor)}
                            disabled={actionInProgress}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        className={`px-3 py-1 rounded-lg font-medium transition-all duration-300 ${
                          darkMode 
                            ? 'bg-yellow-700 hover:bg-yellow-800 text-white' 
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        }`}
                        onClick={() => {/* TODO: Implement info request */}}
                        disabled={actionInProgress}
                      >
                        Request Info
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} max-w-md w-full mx-4`}>
            <h3 className="text-lg font-medium mb-4">Reject Doctor Application</h3>
            <p className="text-sm text-gray-500 mb-4">
              Please provide a reason for rejecting {selectedDoctor?.fullName}'s application
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className={`w-full p-2 rounded border mb-4 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
              rows="4"
              placeholder="Enter rejection reason..."
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowRejectionModal(false)}
                className={`px-4 py-2 rounded ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction(selectedDoctor._id, 'rejected', rejectionReason)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                disabled={!rejectionReason.trim()}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StarRating({ rating }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  return (
    <span className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <svg key={`full-${i}`} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {hasHalfStar && (
        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="#facc15" />
              <stop offset="50%" stopColor="#d1d5db" />
            </linearGradient>
          </defs>
          <path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg key={`empty-${i}`} className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
} 
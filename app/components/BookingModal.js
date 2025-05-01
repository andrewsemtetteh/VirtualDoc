'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Calendar, Clock, FileText, MessageSquare } from 'lucide-react';

export default function BookingModal({ doctor, onClose, onSubmit, darkMode, isRescheduling, currentAppointment }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    date: currentAppointment?.date ? new Date(currentAppointment.date).toISOString().split('T')[0] : '',
    time: currentAppointment?.time || '',
    reason: isRescheduling ? '' : (currentAppointment?.reason || ''),
    rescheduleReason: '',
    notes: currentAppointment?.notes || ''
  });
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/appointments', {
        method: isRescheduling ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          doctorId: doctor._id,
          appointmentId: isRescheduling ? currentAppointment._id : undefined,
          reason: isRescheduling ? formData.rescheduleReason : formData.reason
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to book appointment');
      }

      const data = await response.json();
      onSubmit(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div 
        ref={modalRef}
        className={`rounded-xl p-6 max-w-md w-full ${
          darkMode ? 'bg-gray-800/95' : 'bg-white/95'
        } shadow-2xl backdrop-blur-sm`}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {isRescheduling ? 'Reschedule Appointment' : 'Book Appointment'}
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              with Dr. {doctor?.fullName || doctor?.doctorName || 'Unknown Doctor'}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className={`p-2 rounded-full ${
              darkMode 
                ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <X size={24} />
          </button>
        </div>

        {isRescheduling && currentAppointment && (
          <div className={`mb-6 p-4 rounded-lg ${
            darkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <h3 className={`text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Current Appointment Details</h3>
            <div className="space-y-2">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span className="font-medium">Date:</span> {new Date(currentAppointment.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span className="font-medium">Time:</span> {new Date(`2000-01-01T${currentAppointment.time}`).toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  minute: '2-digit' 
                })}
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span className="font-medium">Reason:</span> {currentAppointment.reason}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {isRescheduling ? 'New Date' : 'Date'}
              </div>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              disabled={loading}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full p-3 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {isRescheduling ? 'New Time' : 'Time'}
              </div>
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              disabled={loading}
              className={`w-full p-3 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                {isRescheduling ? 'Reason for Rescheduling' : 'Reason for Visit'}
              </div>
            </label>
            <input
              type="text"
              name={isRescheduling ? "rescheduleReason" : "reason"}
              value={isRescheduling ? formData.rescheduleReason : formData.reason}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder={isRescheduling ? "Enter reason for rescheduling" : "Enter reason for visit"}
              className={`w-full p-3 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          {!isRescheduling && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Additional Notes (Optional)
                </div>
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                disabled={loading}
                placeholder="Enter any additional notes"
                rows="3"
                className={`w-full p-3 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm p-2 bg-red-100 rounded">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={`px-4 py-2 rounded-lg font-medium ${
                darkMode
                  ? 'text-gray-300 bg-gray-700 hover:bg-gray-600'
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
              } disabled:opacity-50`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-lg font-medium text-white ${
                isRescheduling ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'
              } disabled:opacity-50`}
            >
              {loading ? (isRescheduling ? 'Rescheduling...' : 'Booking...') : (isRescheduling ? 'Reschedule' : 'Book Appointment')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
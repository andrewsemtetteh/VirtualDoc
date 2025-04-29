'use client';

import { useState } from 'react';
import { X, Calendar, Clock, FileText, MessageSquare } from 'lucide-react';

export default function BookingModal({ doctor, onClose, onSubmit, darkMode }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reason: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSubmit(formData);
      // If successful, onSubmit will handle the modal closing
    } catch (err) {
      setError(err.message || 'Failed to book appointment');
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`rounded-xl p-6 max-w-md w-full ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-2xl`}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Book Appointment
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              with Dr. {doctor.fullName}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Date
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
                Time
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
                Reason for Visit
              </div>
            </label>
            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter reason for visit"
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
              className="px-4 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
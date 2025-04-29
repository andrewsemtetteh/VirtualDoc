'use client';

import { useState } from 'react';
import { format } from 'date-fns';

export default function BookingForm({ doctor, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    scheduledFor: '',
    reason: ''
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.scheduledFor) {
      newErrors.scheduledFor = 'Please select a date and time';
    } else if (new Date(formData.scheduledFor) < new Date()) {
      newErrors.scheduledFor = 'Cannot book appointments in the past';
    }
    
    if (!formData.reason.trim()) {
      newErrors.reason = 'Please provide a reason for the appointment';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date and Time
        </label>
        <input
          type="datetime-local"
          name="scheduledFor"
          value={formData.scheduledFor}
          onChange={handleChange}
          min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
          className={`w-full p-2 border rounded ${
            errors.scheduledFor ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.scheduledFor && (
          <p className="text-red-500 text-sm mt-1">{errors.scheduledFor}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Reason for Visit
        </label>
        <textarea
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          rows={4}
          placeholder="Please describe the reason for your visit..."
          className={`w-full p-2 border rounded ${
            errors.reason ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.reason && (
          <p className="text-red-500 text-sm mt-1">{errors.reason}</p>
        )}
      </div>
      
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Book Appointment
        </button>
      </div>
    </form>
  );
} 
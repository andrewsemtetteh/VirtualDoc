import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Calendar, Clock, X } from 'lucide-react';

export default function BookingModal({ isOpen, onClose, doctor, onSubmit }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (doctor && selectedDate) {
      const dateAvailability = doctor?.availability?.find(a => a.date === selectedDate);
      if (dateAvailability) {
        setAvailableSlots(dateAvailability.slots);
      } else {
        setAvailableSlots([]);
      }
    }
  }, [doctor, selectedDate]);

  const validateForm = () => {
    const errors = {};
    
    if (!selectedDate) {
      errors.date = 'Please select a date';
    } else if (new Date(selectedDate) < new Date()) {
      errors.date = 'Cannot select a past date';
    }
    
    if (!selectedTime) {
      errors.time = 'Please select a time';
    }
    
    if (!reason.trim()) {
      errors.reason = 'Please provide a reason for the appointment';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // Format date from DD/MM/YYYY to YYYY-MM-DD
      const [day, month, year] = selectedDate.split('/');
      const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      
      const formData = {
        doctorId: doctor._id,
        date: formattedDate,
        time: selectedTime,
        reason: reason,
        notes: notes || null // Make notes optional
      };

      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Book Appointment with {doctor?.name}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => {
                        // Format the date to DD/MM/YYYY for display
                        const date = new Date(e.target.value);
                        const day = date.getDate().toString().padStart(2, '0');
                        const month = (date.getMonth() + 1).toString().padStart(2, '0');
                        const year = date.getFullYear();
                        setSelectedDate(`${day}/${month}/${year}`);
                        if (formErrors.date) {
                          setFormErrors(prev => ({ ...prev, date: '' }));
                        }
                      }}
                      className={`mt-1 block w-full rounded-md ${
                        formErrors.date ? 'border-red-500' : 'border-gray-300'
                      } shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {formErrors.date && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.date}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Time *
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        className={`focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm ${
                          formErrors.time ? 'border-red-500' : 'border-gray-300'
                        } rounded-md`}
                        value={selectedTime}
                        onChange={(e) => {
                          setSelectedTime(e.target.value);
                          if (formErrors.time) {
                            setFormErrors(prev => ({ ...prev, time: '' }));
                          }
                        }}
                        required
                      >
                        <option value="">Select a time slot</option>
                        {availableSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                    {formErrors.time && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.time}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Reason for Visit *
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => {
                        setReason(e.target.value);
                        if (formErrors.reason) {
                          setFormErrors(prev => ({ ...prev, reason: '' }));
                        }
                      }}
                      className={`mt-1 block w-full rounded-md ${
                        formErrors.reason ? 'border-red-500' : 'border-gray-300'
                      } shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                      rows={3}
                      required
                      placeholder="Please describe the reason for your visit..."
                    />
                    {formErrors.reason && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.reason}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      rows={2}
                      placeholder="Enter any additional notes..."
                    />
                  </div>

                  {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                  )}

                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
                      disabled={loading}
                    >
                      {loading ? 'Booking...' : 'Book Appointment'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 
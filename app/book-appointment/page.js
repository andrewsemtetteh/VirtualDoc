'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useDoctors } from '@/hooks/useDoctors';
import DoctorCard from '@/components/DoctorCard';
import BookingForm from '@/components/BookingForm';

export default function BookAppointment() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  
  const { 
    doctors,
    loading, 
    error
  } = useDoctors();

  const handleBookAppointment = async (appointmentData) => {
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctorId: selectedDoctor._id,
          ...appointmentData
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to book appointment');
      }

      // Show success message and refresh appointments
      alert('Appointment booked successfully!');
      setSelectedDoctor(null);
      router.refresh();
    } catch (error) {
      alert(error.message);
    }
  };

  if (!session) {
    router.push('/login');
    return null;
  }

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Book an Appointment</h1>
      
      {/* Doctors List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.length > 0 ? (
          doctors.map(doctor => (
            <DoctorCard
              key={doctor._id}
              doctor={doctor}
              onBook={() => setSelectedDoctor(doctor)}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No doctors available
          </div>
        )}
      </div>
      
      {/* Booking Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">
              Book Appointment with Dr. {selectedDoctor.fullName}
            </h2>
            <BookingForm
              doctor={selectedDoctor}
              onSubmit={handleBookAppointment}
              onCancel={() => setSelectedDoctor(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
} 
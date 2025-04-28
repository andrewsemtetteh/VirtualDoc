import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

export const useDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    specialty: 'All Specialties',
    availability: 'Any Time',
    rating: 'All Ratings',
    search: ''
  });

  useEffect(() => {
    // Initialize Socket.io connection
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);

    // Join the doctors room
    socket.emit('join:doctors');

    // Handle new doctor updates
    socket.on('doctor:update', (updatedDoctor) => {
      setDoctors(prevDoctors => 
        prevDoctors.map(doctor => 
          doctor._id === updatedDoctor._id ? updatedDoctor : doctor
        )
      );
    });

    // Handle new doctor additions
    socket.on('doctor:new', (newDoctor) => {
      setDoctors(prevDoctors => [newDoctor, ...prevDoctors]);
    });

    // Cleanup on unmount
    return () => {
      socket.emit('leave:doctors');
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          specialty: filters.specialty,
          availability: filters.availability,
          rating: filters.rating,
          search: filters.search
        });

        const response = await fetch(`/api/doctors?${queryParams}`);
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }

        const data = await response.json();
        setDoctors(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [filters]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return {
    doctors,
    loading,
    error,
    filters,
    updateFilters
  };
}; 
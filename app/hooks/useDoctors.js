import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

export function useDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [specialties, setSpecialties] = useState(['All Specialties']);
  const [filters, setFilters] = useState({
    specialty: 'All Specialties',
    availability: 'Any Time',
    search: ''
  });

  // Fetch all doctors
  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let url = '/api/doctors';
      const params = new URLSearchParams();
      
      // Only add filters if they're not default values
      if (filters.specialty !== 'All Specialties') {
        params.append('specialty', filters.specialty);
      }
      if (filters.search.trim()) {
        params.append('search', filters.search.trim());
      }

      // Add params to URL if any exist
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url);
      console.log('Fetched doctors:', response.data.length); // Debug log
      setDoctors(response.data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch specialties
  const fetchSpecialties = useCallback(async () => {
    try {
      const response = await axios.get('/api/doctors/specialties');
      if (response.data && Array.isArray(response.data)) {
        setSpecialties(['All Specialties', ...response.data]);
      }
    } catch (err) {
      console.error('Error fetching specialties:', err);
    }
  }, []);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001');

    socket.on('doctorUpdate', (updatedDoctor) => {
      setDoctors(prev => 
        prev.map(doc => 
          doc._id === updatedDoctor._id ? updatedDoctor : doc
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Fetch doctors on mount and when filters change
  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // Fetch specialties on mount
  useEffect(() => {
    fetchSpecialties();
  }, [fetchSpecialties]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    doctors,
    loading,
    error,
    filters,
    specialties,
    updateFilters,
    refetch: fetchDoctors
  };
} 
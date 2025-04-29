import { useState, useCallback } from 'react';
import axios from 'axios';

export function useDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [specialties, setSpecialties] = useState([]);

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/api/doctors');
      
      if (response.data && Array.isArray(response.data.doctors)) {
        setDoctors(response.data.doctors);
        
        // Extract unique specialties
        const uniqueSpecialties = [...new Set(
          response.data.doctors.map(doctor => doctor.specialization)
        )].filter(Boolean);
        
        setSpecialties(uniqueSpecialties);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError(err.response?.data?.error || 'Failed to fetch doctors');
      setDoctors([]);
      setSpecialties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    doctors,
    loading,
    error,
    specialties,
    fetchDoctors
  };
} 
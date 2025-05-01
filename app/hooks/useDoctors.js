import { useState, useEffect } from 'react';
import axios from 'axios';

export function useDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('/api/doctors');
        setDoctors(response.data.doctors);
        setError(null);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('Failed to fetch doctors');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return { doctors, loading, error };
} 
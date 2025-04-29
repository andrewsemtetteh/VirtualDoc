import { useState, useEffect } from 'react';

export function useDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    specialty: 'All Specialties',
    search: ''
  });

  // Fetch specialties
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await fetch('/api/doctors/specialties');
        if (!response.ok) {
          throw new Error('Failed to fetch specialties');
        }
        const data = await response.json();
        setSpecialties(data.specializations);
      } catch (error) {
        console.error('Error fetching specialties:', error);
        setError(error.message);
      }
    };

    fetchSpecialties();
  }, []);

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/doctors');
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Filter doctors
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSpecialty = filters.specialty === 'All Specialties' || doctor.specialization === filters.specialty;
    const matchesSearch = !filters.search || 
      doctor.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(filters.search.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  const updateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  return {
    doctors: filteredDoctors,
    specialties,
    loading,
    error,
    filters,
    updateFilters
  };
} 
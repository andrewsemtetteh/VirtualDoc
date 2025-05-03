import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export function useAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/appointments');
      if (!response.data) {
        throw new Error('No data received from server');
      }
      setAppointments(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch appointments');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const bookAppointment = useCallback(async (appointmentData) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/appointments', appointmentData);
      if (!response.data?.appointment) {
        throw new Error('Invalid response from server');
      }
      setAppointments(prev => {
        const newAppointments = [...prev, response.data.appointment];
        return newAppointments.sort((a, b) => 
          new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)
        );
      });
      return response.data.appointment;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to book appointment';
      setError(errorMessage);
      console.error('Error booking appointment:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAppointment = useCallback(async (appointmentId, updateData) => {
    try {
      setLoading(true);
      const response = await axios.patch(`/api/appointments`, {
        appointmentId,
        ...updateData
      });
      if (!response.data?.appointment) {
        throw new Error('Invalid response from server');
      }
      setAppointments(prev => 
        prev.map(apt => 
          apt._id === appointmentId ? response.data.appointment : apt
        )
      );
      return response.data.appointment;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to update appointment';
      setError(errorMessage);
      console.error('Error updating appointment:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return {
    appointments,
    loading,
    error,
    bookAppointment,
    updateAppointment,
    refetch: fetchAppointments
  };
} 
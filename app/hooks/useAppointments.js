import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

export function useAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/appointments');
      setAppointments(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch appointments');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const bookAppointment = useCallback(async (appointmentData) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/appointments', appointmentData);
      setAppointments(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError('Failed to book appointment');
      console.error('Error booking appointment:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001');

    socket.on('appointmentUpdate', (updatedAppointment) => {
      setAppointments(prev => 
        prev.map(apt => 
          apt._id === updatedAppointment._id ? updatedAppointment : apt
        )
      );
    });

    socket.on('appointmentCreated', (newAppointment) => {
      setAppointments(prev => [...prev, newAppointment]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return {
    appointments,
    loading,
    error,
    bookAppointment,
    refetch: fetchAppointments
  };
} 
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useSession } from 'next-auth/react';

export function useSocket() {
  const { data: session } = useSession();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (session?.user?.id && !socketRef.current) {
      // Initialize socket connection
      socketRef.current = io(process.env.NEXT_PUBLIC_APP_URL, {
        auth: {
          userId: session.user.id
        }
      });

      // Handle connection events
      socketRef.current.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
        
        // Join user's room for private messages
        socketRef.current.emit('join', session.user.id);
      });

      socketRef.current.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });

      // Handle errors
      socketRef.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
      });
    }

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [session]);

  // Function to send a private message
  const sendPrivateMessage = (recipientId, message) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('private_message', {
        to: recipientId,
        message
      });
    }
  };

  // Function to handle video call signals
  const sendCallSignal = (recipientId, signal) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('video_call_signal', {
        to: recipientId,
        signal
      });
    }
  };

  // Function to handle appointment updates
  const sendAppointmentUpdate = (recipientId, notification) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('appointment_update', {
        to: recipientId,
        notification
      });
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    sendPrivateMessage,
    sendCallSignal,
    sendAppointmentUpdate
  };
} 
import { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useSession } from 'next-auth/react';

const RealTimeContext = createContext({});

export function RealTimeProvider({ children }) {
  const { data: session } = useSession();
  const { socket, isConnected } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [activeCall, setActiveCall] = useState(null);

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Handle new messages
    socket.on('receive_message', (message) => {
      setUnreadMessages(prev => prev + 1);
      setNotifications(prev => [{
        type: 'message',
        content: `New message from ${message.senderName}`,
        timestamp: new Date(),
        read: false
      }, ...prev]);
    });

    // Handle appointment updates
    socket.on('appointment_update', (data) => {
      setNotifications(prev => [{
        type: 'appointment',
        content: `Appointment ${data.status}: ${data.message}`,
        timestamp: new Date(),
        read: false
      }, ...prev]);
    });

    // Handle video call signals
    socket.on('receive_call_signal', (data) => {
      setActiveCall(data);
    });

    // Handle call ended
    socket.on('call_ended', () => {
      setActiveCall(null);
    });

    return () => {
      socket.off('receive_message');
      socket.off('appointment_update');
      socket.off('receive_call_signal');
      socket.off('call_ended');
    };
  }, [socket, isConnected]);

  // Mark notifications as read
  const markNotificationsAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Reset unread message count
  const resetUnreadMessages = () => {
    setUnreadMessages(0);
  };

  // Handle incoming call
  const handleIncomingCall = (accept) => {
    if (accept && activeCall) {
      // Navigate to video call page
      window.location.href = `/dashboard/patient/consultations?call=${activeCall.roomName}`;
    }
    setActiveCall(null);
  };

  const value = {
    notifications,
    unreadMessages,
    activeCall,
    markNotificationsAsRead,
    resetUnreadMessages,
    handleIncomingCall
  };

  return (
    <RealTimeContext.Provider value={value}>
      {children}
    </RealTimeContext.Provider>
  );
}

export function useRealTime() {
  const context = useContext(RealTimeContext);
  if (!context) {
    throw new Error('useRealTime must be used within a RealTimeProvider');
  }
  return context;
} 
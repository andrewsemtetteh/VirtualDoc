'use client';

import { useState, useEffect } from 'react';
import { format, formatDistanceToNow } from 'date-fns';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch notifications from API
    // Mock data for demonstration
    const mockNotifications = [
      {
        id: 1,
        type: 'appointment',
        message: 'Upcoming appointment with Dr. Sarah Smith tomorrow at 2:30 PM',
        date: new Date(2024, 2, 24, 14, 30),
        read: false,
      },
      {
        id: 2,
        type: 'prescription',
        message: 'New prescription available from Dr. John Doe',
        date: new Date(2024, 2, 23, 10, 15),
        read: false,
      },
      {
        id: 3,
        type: 'reminder',
        message: 'Remember to take your medication - Amoxicillin 500mg',
        date: new Date(2024, 2, 23, 9, 0),
        read: true,
      },
      {
        id: 4,
        type: 'report',
        message: 'Your lab results are ready to view',
        date: new Date(2024, 2, 22, 16, 45),
        read: true,
      },
    ];

    setNotifications(mockNotifications);
    setLoading(false);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'appointment':
        return '📅';
      case 'prescription':
        return '💊';
      case 'reminder':
        return '⏰';
      case 'report':
        return '📋';
      default:
        return '🔔';
    }
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      <div className="divide-y max-h-[400px] overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 hover:bg-gray-50 transition-colors ${
              !notification.read ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl">
                {getNotificationIcon(notification.type)}
              </span>
              <div className="flex-1">
                <p className="text-gray-800">{notification.message}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(notification.date, { addSuffix: true })}
                  </p>
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No notifications to display
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="p-4 border-t">
          <button className="text-sm text-blue-600 hover:text-blue-700 w-full text-center">
            View All Notifications
          </button>
        </div>
      )}
    </div>
  );
} 
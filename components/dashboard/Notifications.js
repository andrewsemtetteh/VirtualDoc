'use client';

export default function Notifications({ notifications = [] }) {
  const defaultNotifications = [
    {
      id: 1,
      type: 'appointment',
      title: 'Upcoming Appointment',
      message: 'You have an appointment with Dr. Sarah Johnson tomorrow at 10:00 AM',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'prescription',
      title: 'New Prescription',
      message: 'Dr. Michael Chen has prescribed new medication for your treatment',
      time: '1 day ago',
      read: true
    },
    {
      id: 3,
      type: 'reminder',
      title: 'Medication Reminder',
      message: 'Don\'t forget to take your prescribed medication',
      time: '2 days ago',
      read: true
    }
  ];

  const displayNotifications = notifications.length > 0 ? notifications : defaultNotifications;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Notifications</h2>
      
      <div className="space-y-4">
        {displayNotifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`border rounded-lg p-4 ${
              notification.read ? 'bg-gray-50' : 'bg-blue-50'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-800">{notification.title}</h3>
                <p className="text-sm text-gray-600">{notification.message}</p>
              </div>
              <span className="text-xs text-gray-500">{notification.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
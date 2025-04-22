'use client';

export default function AppointmentList({ type = 'all', limit }) {
  const appointments = [
    {
      id: 1,
      doctor: 'Dr. Sarah Johnson',
      date: '2024-03-20',
      time: '10:00 AM',
      type: 'Video Consultation',
      status: 'upcoming'
    },
    {
      id: 2,
      doctor: 'Dr. Michael Chen',
      date: '2024-03-25',
      time: '2:30 PM',
      type: 'In-person Visit',
      status: 'upcoming'
    }
  ];

  const filteredAppointments = type === 'all' 
    ? appointments 
    : appointments.filter(apt => apt.status === type);

  const displayedAppointments = limit 
    ? filteredAppointments.slice(0, limit)
    : filteredAppointments;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Appointments</h2>
      {displayedAppointments.length === 0 ? (
        <p className="text-gray-600">No appointments found</p>
      ) : (
        <div className="space-y-4">
          {displayedAppointments.map((appointment) => (
            <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">{appointment.doctor}</h3>
                  <p className="text-sm text-gray-600">{appointment.type}</p>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                  {appointment.status}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <p>{appointment.date} at {appointment.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 
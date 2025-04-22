'use client';

export default function VideoConsultation() {
  const consultations = [
    {
      id: 1,
      doctor: 'Dr. Sarah Johnson',
      date: '2024-03-20',
      time: '10:00 AM',
      status: 'upcoming',
      type: 'General Check-up'
    },
    {
      id: 2,
      doctor: 'Dr. Michael Chen',
      date: '2024-03-25',
      time: '2:30 PM',
      status: 'upcoming',
      type: 'Follow-up'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Video Consultations</h2>
      
      <div className="space-y-4">
        {consultations.map((consultation) => (
          <div key={consultation.id} className="border rounded-lg p-4 hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-800">{consultation.doctor}</h3>
                <p className="text-sm text-gray-600">{consultation.type}</p>
              </div>
              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                {consultation.status}
              </span>
            </div>
            
            <div className="mt-2 text-sm text-gray-600">
              <p>{consultation.date} at {consultation.time}</p>
            </div>
            
            <div className="mt-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Join Meeting
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
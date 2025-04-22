'use client';

export default function MedicalRecords() {
  const records = [
    {
      id: 1,
      date: '2024-02-15',
      type: 'Check-up',
      doctor: 'Dr. Sarah Johnson',
      diagnosis: 'Healthy',
      prescription: 'None',
      notes: 'Regular check-up completed. All vitals normal.'
    },
    {
      id: 2,
      date: '2024-01-10',
      type: 'Follow-up',
      doctor: 'Dr. Michael Chen',
      diagnosis: 'Common Cold',
      prescription: 'Antibiotics',
      notes: 'Prescribed antibiotics for 7 days. Rest recommended.'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Medical Records</h2>
      
      <div className="space-y-6">
        {records.map((record) => (
          <div key={record.id} className="border rounded-lg p-4 hover:bg-gray-50">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-gray-800">{record.type}</h3>
                <p className="text-sm text-gray-600">Dr. {record.doctor}</p>
              </div>
              <span className="text-sm text-gray-500">{record.date}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Diagnosis</label>
                <p className="text-gray-800">{record.diagnosis}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Prescription</label>
                <p className="text-gray-800">{record.prescription}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">Notes</label>
              <p className="text-gray-800">{record.notes}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
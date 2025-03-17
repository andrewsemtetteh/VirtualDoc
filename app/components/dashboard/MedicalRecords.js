'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function MedicalRecords() {
  const [activeTab, setActiveTab] = useState('records');
  const [records, setRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch medical records and prescriptions from API
    // Mock data for demonstration
    const mockRecords = [
      {
        id: 1,
        date: new Date(2024, 1, 15),
        doctorName: 'Dr. Sarah Smith',
        diagnosis: 'Upper Respiratory Infection',
        notes: 'Patient presented with fever, cough, and congestion. Prescribed antibiotics and rest.',
        attachments: ['xray.pdf', 'lab_results.pdf'],
      },
      {
        id: 2,
        date: new Date(2024, 0, 20),
        doctorName: 'Dr. John Doe',
        diagnosis: 'Annual Check-up',
        notes: 'All vitals normal. Recommended regular exercise and balanced diet.',
        attachments: ['blood_work.pdf'],
      },
    ];

    const mockPrescriptions = [
      {
        id: 1,
        date: new Date(2024, 1, 15),
        doctorName: 'Dr. Sarah Smith',
        medications: [
          {
            name: 'Amoxicillin',
            dosage: '500mg',
            frequency: 'Twice daily',
            duration: '7 days',
          },
        ],
        status: 'active',
      },
      {
        id: 2,
        date: new Date(2024, 0, 5),
        doctorName: 'Dr. Emily Brown',
        medications: [
          {
            name: 'Ibuprofen',
            dosage: '400mg',
            frequency: 'As needed',
            duration: '5 days',
          },
        ],
        status: 'completed',
      },
    ];

    setRecords(mockRecords);
    setPrescriptions(mockPrescriptions);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow">
        {/* Tabs */}
        <div className="border-b">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('records')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'records'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Medical Records
            </button>
            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'prescriptions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Prescriptions
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'records' ? (
            <div className="space-y-6">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium text-lg">{record.diagnosis}</h3>
                      <p className="text-sm text-gray-500">{record.doctorName}</p>
                      <p className="text-sm text-gray-500">
                        {format(record.date, 'PPP')}
                      </p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Download
                    </button>
                  </div>
                  <p className="text-gray-600 mb-4">{record.notes}</p>
                  {record.attachments.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Attachments
                      </h4>
                      <div className="flex gap-2">
                        {record.attachments.map((attachment, index) => (
                          <button
                            key={index}
                            className="flex items-center px-3 py-1 bg-gray-100 rounded-lg text-sm text-gray-600 hover:bg-gray-200"
                          >
                            <span className="mr-2">📎</span>
                            {attachment}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {prescriptions.map((prescription) => (
                <div
                  key={prescription.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-lg">Prescription</h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            prescription.status === 'active'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {prescription.status.charAt(0).toUpperCase() +
                            prescription.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {prescription.doctorName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(prescription.date, 'PPP')}
                      </p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Share with Pharmacy
                    </button>
                  </div>
                  <div className="space-y-4">
                    {prescription.medications.map((medication, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-lg p-3 space-y-2"
                      >
                        <h4 className="font-medium">{medication.name}</h4>
                        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Dosage:</span>{' '}
                            {medication.dosage}
                          </div>
                          <div>
                            <span className="font-medium">Frequency:</span>{' '}
                            {medication.frequency}
                          </div>
                          <div>
                            <span className="font-medium">Duration:</span>{' '}
                            {medication.duration}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
import { useState, useEffect } from 'react';
import { FileText, Download, Video } from 'lucide-react';
import { format } from 'date-fns';

export default function Consultations({ darkMode }) {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] = useState(null);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const response = await fetch('/api/appointments?status=completed');
        if (!response.ok) {
          throw new Error('Failed to fetch consultations');
        }
        const data = await response.json();
        setConsultations(data);
      } catch (error) {
        console.error('Error fetching consultations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, []);

  const handleDownloadPrescription = async (prescriptionId) => {
    try {
      const response = await fetch(`/api/prescriptions/${prescriptionId}/download`);
      if (!response.ok) {
        throw new Error('Failed to download prescription');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prescription-${prescriptionId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading prescription:', error);
      alert('Failed to download prescription. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Consultations List */}
      <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className="text-lg font-medium mb-4">Past Consultations</h3>
        <div className="space-y-4">
          {consultations.length > 0 ? (
            consultations.map((consultation) => (
              <div
                key={consultation._id}
                className={`p-4 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">
                        {consultation.doctorName?.charAt(0) || 'D'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{consultation.doctorName}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(consultation.date), 'MMM d, yyyy')} at{' '}
                        {consultation.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {consultation.prescription && (
                      <button
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() =>
                          handleDownloadPrescription(consultation.prescription)
                        }
                      >
                        <Download size={20} />
                      </button>
                    )}
                    <button
                      className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                      onClick={() => setSelectedConsultation(consultation)}
                    >
                      <FileText size={20} />
                    </button>
                  </div>
                </div>
                {selectedConsultation?._id === consultation._id && (
                  <div className="mt-4 space-y-2">
                    <div>
                      <h4 className="font-medium">Diagnosis</h4>
                      <p className="text-sm text-gray-500">
                        {consultation.diagnosis || 'No diagnosis recorded'}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Notes</h4>
                      <p className="text-sm text-gray-500">
                        {consultation.notes || 'No notes recorded'}
                      </p>
                    </div>
                    {consultation.prescription && (
                      <div>
                        <h4 className="font-medium">Prescription</h4>
                        <div className="mt-2 space-y-2">
                          {consultation.prescription.medications.map(
                            (medication, index) => (
                              <div
                                key={index}
                                className="text-sm text-gray-500"
                              >
                                <p className="font-medium">{medication.name}</p>
                                <p>Dosage: {medication.dosage}</p>
                                <p>Frequency: {medication.frequency}</p>
                                <p>Duration: {medication.duration}</p>
                                {medication.instructions && (
                                  <p>Instructions: {medication.instructions}</p>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No past consultations</p>
          )}
        </div>
      </div>
    </div>
  );
} 
import { Download, Edit, Trash2, FileText, Clock, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Dialog } from '@headlessui/react';

export default function PrescriptionsSection({ darkMode }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [editingPrescription, setEditingPrescription] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [prescriptionToDelete, setPrescriptionToDelete] = useState(null);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await fetch('/api/prescriptions/doctor');
      const data = await response.json();
      setPrescriptions(data);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      toast.error('Failed to fetch prescriptions');
    }
  };

  const handleDownload = async (prescription) => {
    try {
      // Create text content for the prescription
      const textContent = `
PRESCRIPTION
============

Patient: ${prescription.patientName}
Date: ${new Date(prescription.createdAt).toLocaleDateString()}

DIAGNOSIS
---------
${prescription.diagnosis}

TREATMENT PLAN
-------------
${prescription.treatmentPlan}

MEDICATION DETAILS
----------------
Medication: ${prescription.medication}
Dosage: ${prescription.dosage}
Frequency: ${prescription.frequency}
Duration: ${prescription.duration}

${prescription.additionalInstructions ? `
ADDITIONAL INSTRUCTIONS
---------------------
${prescription.additionalInstructions}
` : ''}

Prescribed by: Dr. ${prescription.doctorName}
Date: ${new Date(prescription.createdAt).toLocaleDateString()}
`;

      // Create a Blob with the text content
      const blob = new Blob([textContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `prescription-${prescription.patientName}-${new Date(prescription.createdAt).toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Prescription downloaded successfully');
    } catch (error) {
      console.error('Error downloading prescription:', error);
      toast.error('Failed to download prescription');
    }
  };

  const handleEdit = (prescription) => {
    setEditingPrescription(prescription);
    // TODO: Implement edit modal
    toast.info('Edit functionality coming soon');
  };

  const handleDelete = async (prescription) => {
    setPrescriptionToDelete(prescription);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/prescriptions/${prescriptionToDelete._id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setPrescriptions(prescriptions.filter(p => p._id !== prescriptionToDelete._id));
        toast.success('Prescription deleted successfully');
      } else {
        throw new Error('Failed to delete prescription');
      }
    } catch (error) {
      console.error('Error deleting prescription:', error);
      toast.error('Failed to delete prescription');
    } finally {
      setIsDeleteModalOpen(false);
      setPrescriptionToDelete(null);
    }
  };

  return (
    <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center">
          <FileText className="mr-2 text-green-500" size={24} />
          Recent Prescriptions
        </h3>
        <div className="text-sm text-gray-500 flex items-center">
          <Clock className="mr-1" size={16} />
          {new Date().toLocaleDateString()}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prescriptions.length > 0 ? (
          prescriptions.map((prescription) => (
            <div 
              key={prescription._id} 
              className={`rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl ${
                darkMode ? 'bg-gray-700' : 'bg-white'
              }`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-full ${
                      darkMode ? 'bg-gray-600' : 'bg-green-100'
                    } flex items-center justify-center`}>
                      <User className={`${darkMode ? 'text-gray-300' : 'text-green-600'}`} size={24} />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">{prescription.patientName}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(prescription.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleDownload(prescription)}
                      className={`p-2 rounded-full ${
                        darkMode 
                          ? 'text-blue-400 hover:bg-gray-600' 
                          : 'text-blue-500 hover:bg-blue-50'
                      } transition-colors duration-200`}
                      title="Download Prescription"
                    >
                      <Download size={18} />
                    </button>
                    <button 
                      onClick={() => handleEdit(prescription)}
                      className={`p-2 rounded-full ${
                        darkMode 
                          ? 'text-yellow-400 hover:bg-gray-600' 
                          : 'text-yellow-500 hover:bg-yellow-50'
                      } transition-colors duration-200`}
                      title="Edit Prescription"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(prescription)}
                      className={`p-2 rounded-full ${
                        darkMode 
                          ? 'text-red-400 hover:bg-gray-600' 
                          : 'text-red-500 hover:bg-red-50'
                      } transition-colors duration-200`}
                      title="Delete Prescription"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className={`p-3 rounded-lg ${
                    darkMode ? 'bg-gray-600' : 'bg-gray-50'
                  }`}>
                    <p className="text-sm font-medium text-gray-500">Diagnosis</p>
                    <p className="mt-1">{prescription.diagnosis}</p>
                  </div>

                  <div className={`p-3 rounded-lg ${
                    darkMode ? 'bg-gray-600' : 'bg-gray-50'
                  }`}>
                    <p className="text-sm font-medium text-gray-500">Treatment Plan</p>
                    <p className="mt-1">{prescription.treatmentPlan}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className={`p-3 rounded-lg ${
                      darkMode ? 'bg-gray-600' : 'bg-gray-50'
                    }`}>
                      <p className="text-sm font-medium text-gray-500">Medication</p>
                      <p className="mt-1">{prescription.medication}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${
                      darkMode ? 'bg-gray-600' : 'bg-gray-50'
                    }`}>
                      <p className="text-sm font-medium text-gray-500">Dosage</p>
                      <p className="mt-1">{prescription.dosage}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className={`p-3 rounded-lg ${
                      darkMode ? 'bg-gray-600' : 'bg-gray-50'
                    }`}>
                      <p className="text-sm font-medium text-gray-500">Frequency</p>
                      <p className="mt-1">{prescription.frequency}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${
                      darkMode ? 'bg-gray-600' : 'bg-gray-50'
                    }`}>
                      <p className="text-sm font-medium text-gray-500">Duration</p>
                      <p className="mt-1">{prescription.duration}</p>
                    </div>
                  </div>

                  {prescription.additionalInstructions && (
                    <div className={`p-3 rounded-lg ${
                      darkMode ? 'bg-gray-600' : 'bg-gray-50'
                    }`}>
                      <p className="text-sm font-medium text-gray-500">Additional Instructions</p>
                      <p className="mt-1">{prescription.additionalInstructions}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
              darkMode ? 'bg-gray-600' : 'bg-gray-100'
            } mb-4`}>
              <FileText className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={32} />
            </div>
            <p className={`text-lg font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No prescriptions found
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Start by creating a new prescription for your patients
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className={`mx-auto max-w-sm rounded-lg p-6 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <Dialog.Title className={`text-lg font-medium mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Delete Prescription
            </Dialog.Title>
            
            <p className={`mb-6 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Are you sure you want to delete this prescription? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className={`px-4 py-2 rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
} 
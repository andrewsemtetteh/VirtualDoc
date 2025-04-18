'use client';
import { useState } from 'react';
import { DocumentTextIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

export default function MedicalRecordsPage() {
  const [activeTab, setActiveTab] = useState('consultations');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Medical Records</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('consultations')}
              className={`py-4 border-b-2 font-medium text-sm ${
                activeTab === 'consultations'
                  ? 'border-green-800 text-green-800'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Consultations
            </button>
            <button
              onClick={() => setActiveTab('diagnoses')}
              className={`py-4 border-b-2 font-medium text-sm ${
                activeTab === 'diagnoses'
                  ? 'border-green-800 text-green-800'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Diagnoses
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`py-4 border-b-2 font-medium text-sm ${
                activeTab === 'notes'
                  ? 'border-green-800 text-green-800'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Doctor's Notes
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          <div className="text-center text-gray-500 py-8">
            No records found
          </div>
        </div>
      </div>
    </div>
  );
} 
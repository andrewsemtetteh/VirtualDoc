'use client';
import { useState } from 'react';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">E-Prescriptions</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
        {prescriptions.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No prescriptions found
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {prescriptions.map((prescription, index) => (
              <div key={index} className="py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{prescription.medication}</h3>
                    <p className="text-sm text-gray-500">Prescribed by Dr. {prescription.doctor}</p>
                    <p className="text-sm text-gray-500">{prescription.date}</p>
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>
                  <button className="flex items-center space-x-2 bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    <DocumentArrowDownIcon className="w-5 h-5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
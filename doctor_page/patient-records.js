import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import PatientProfile from '../components/PatientProfile'
import NotesForm from '../components/NotesForm'

const dummyPatient = {
  name: 'John Doe',
  medicalHistory: [
    'Diabetes Type 2',
    'Hypertension',
    'Allergy to penicillin',
  ],
  notes: [
    'Prescribed Metformin 500mg daily',
    'Recommended low-sodium diet',
  ],
}

const PatientRecords = () => {
  const [patient, setPatient] = useState(dummyPatient)

  const addNote = (newNote) => {
    setPatient((prev) => ({
      ...prev,
      notes: [...prev.notes, newNote],
    }))
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-primaryGreen mb-6">Patient Records</h1>
        <PatientProfile patient={patient} />
        <NotesForm onAddNote={addNote} />
      </main>
    </div>
  )
}

export default PatientRecords

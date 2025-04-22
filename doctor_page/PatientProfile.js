const PatientProfile = ({ patient }) => {
  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-semibold text-primaryGreen mb-4">{patient.name}</h2>
      <div className="mb-4">
        <h3 className="font-semibold">Medical History</h3>
        <ul className="list-disc list-inside text-gray-700">
          {patient.medicalHistory.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-semibold">Notes & Prescriptions</h3>
        <ul className="list-disc list-inside text-gray-700">
          {patient.notes.map((note, index) => (
            <li key={index}>{note}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default PatientProfile

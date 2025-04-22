const AppointmentList = ({ appointments }) => {
  return (
    <div className="space-y-4">
      {appointments.map((appt) => (
        <div key={appt.id} className="p-4 border rounded shadow-sm hover:shadow-md transition-shadow bg-white">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-primaryGreen">{appt.patientName}</h3>
            <span className="text-sm text-gray-500">{appt.date} at {appt.time}</span>
          </div>
          <p className="text-gray-700 mt-1">{appt.reason}</p>
        </div>
      ))}
    </div>
  )
}

export default AppointmentList

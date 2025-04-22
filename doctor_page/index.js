import Sidebar from '../components/Sidebar'
import AppointmentList from '../components/AppointmentList'

const dummyAppointments = [
  {
    id: 1,
    patientName: 'John Doe',
    date: '2024-06-10',
    time: '10:00 AM',
    reason: 'General Checkup',
  },
  {
    id: 2,
    patientName: 'Jane Smith',
    date: '2024-06-11',
    time: '2:00 PM',
    reason: 'Follow-up Visit',
  },
  {
    id: 3,
    patientName: 'Michael Johnson',
    date: '2024-06-12',
    time: '11:30 AM',
    reason: 'Consultation',
  },
]

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-primaryGreen mb-6">Dashboard</h1>
        <section>
          <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
          <AppointmentList appointments={dummyAppointments} />
        </section>
      </main>
    </div>
  )
}

export default Dashboard

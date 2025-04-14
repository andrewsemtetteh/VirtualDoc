import Link from "next/link"
import { Calendar, Video, FileText, Users, Clock, Plus } from "lucide-react"

export default function DashboardPage() {
  return (
    <div>
      <div className="dashboard-header-row">
        <h1>Dashboard</h1>
        <div className="date-display">Today is {new Date().toLocaleDateString()}</div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-icon">
              <Calendar />
            </div>
            <div className="stat-info">
              <div className="stat-label">Today's Appointments</div>
              <div className="stat-value">5</div>
              <div className="stat-description">2 upcoming</div>
            </div>
            <Link href="/dashboard/appointments" className="stat-link">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-icon">
              <Video />
            </div>
            <div className="stat-info">
              <div className="stat-label">Pending Consultations</div>
              <div className="stat-value">3</div>
              <div className="stat-description">Next at 2:30 PM</div>
            </div>
            <Link href="/dashboard/consultations" className="stat-link">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-icon">
              <FileText />
            </div>
            <div className="stat-info">
              <div className="stat-label">Prescriptions</div>
              <div className="stat-value">12</div>
              <div className="stat-description">4 need renewal</div>
            </div>
            <Link href="/dashboard/prescriptions" className="stat-link">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-icon">
              <Users />
            </div>
            <div className="stat-info">
              <div className="stat-label">Total Patients</div>
              <div className="stat-value">128</div>
              <div className="stat-description">↑ 12% from last month</div>
            </div>
            <Link href="/dashboard/patients" className="stat-link">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Upcoming Appointments</h2>
            <p>Your schedule for today</p>
          </div>
          <div className="card-content">
            <div className="appointment-list">
              {upcomingAppointments.map((appointment, index) => (
                <div key={index} className="appointment-item">
                  <div className="appointment-icon">
                    <Clock />
                  </div>
                  <div className="appointment-details">
                    <div className="appointment-header">
                      <h4>{appointment.patientName}</h4>
                      <span>{appointment.time}</span>
                    </div>
                    <p>{appointment.reason}</p>
                    <div className="appointment-tags">
                      <span className={`tag ${appointment.isNew ? "tag-new" : ""}`}>
                        {appointment.isNew ? "New Patient" : "Follow-up"}
                      </span>
                      <span className="appointment-duration">{appointment.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="card-action">
              <Link href="/dashboard/appointments" className="btn btn-outline btn-sm">
                View All Appointments
              </Link>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h2>Quick Actions</h2>
            <p>Common tasks you can perform</p>
          </div>
          <div className="card-content">
            <div className="quick-actions-grid">
              <Link href="/dashboard/consultations/new" className="quick-action-btn">
                <Video />
                Start Consultation
              </Link>
              <Link href="/dashboard/prescriptions/new" className="quick-action-btn">
                <FileText />
                Write Prescription
              </Link>
              <Link href="/dashboard/patients/new" className="quick-action-btn">
                <Users />
                <Plus className="btn-icon" />
                Add New Patient
              </Link>
              <Link href="/dashboard/appointments/schedule" className="quick-action-btn">
                <Calendar />
                Schedule Appointment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const upcomingAppointments = [
  {
    patientName: "Sarah Johnson",
    time: "10:00 AM",
    reason: "Annual check-up",
    isNew: false,
    duration: "30 min",
  },
  {
    patientName: "Michael Chen",
    time: "11:30 AM",
    reason: "Respiratory issues",
    isNew: true,
    duration: "45 min",
  },
  {
    patientName: "Emily Rodriguez",
    time: "2:00 PM",
    reason: "Medication review",
    isNew: false,
    duration: "20 min",
  },
]

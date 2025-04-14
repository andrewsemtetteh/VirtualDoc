"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState("today")

  return (
    <div>
      <div className="dashboard-header-row">
        <h1>Appointments</h1>
        <Link href="/dashboard/appointments/schedule" className="btn btn-primary">
          <Plus className="btn-icon" />
          Schedule Appointment
        </Link>
      </div>

      <div className="tabs">
        <div className="tab-list">
          <button className={`tab-item ${activeTab === "today" ? "active" : ""}`} onClick={() => setActiveTab("today")}>
            Today
          </button>
          <button
            className={`tab-item ${activeTab === "upcoming" ? "active" : ""}`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming
          </button>
          <button className={`tab-item ${activeTab === "past" ? "active" : ""}`} onClick={() => setActiveTab("past")}>
            Past
          </button>
        </div>

        <div className={`tab-content ${activeTab === "today" ? "active" : ""}`}>
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Today's Appointments</h2>
              <p>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="card-content">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Patient</th>
                    <th>Type</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {todayAppointments.map((appointment, index) => (
                    <tr key={index}>
                      <td>{appointment.time}</td>
                      <td className="font-medium">{appointment.patientName}</td>
                      <td>{appointment.type}</td>
                      <td>{appointment.reason}</td>
                      <td>
                        <span
                          className={`badge ${
                            appointment.status === "In Progress"
                              ? "badge-success"
                              : appointment.status === "Scheduled"
                                ? "badge-secondary"
                                : "badge-outline"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                      <td className="text-right">
                        {appointment.status === "Scheduled" && (
                          <Link
                            href={`/dashboard/consultations/new?appointment=${index}`}
                            className="btn btn-outline btn-sm"
                          >
                            Start Consultation
                          </Link>
                        )}
                        {appointment.status === "In Progress" && (
                          <Link href={`/dashboard/consultations/${index}/join`} className="btn btn-primary btn-sm">
                            Join Consultation
                          </Link>
                        )}
                        {appointment.status === "Completed" && (
                          <Link href={`/dashboard/consultations/${index}/notes`} className="btn btn-outline btn-sm">
                            View Notes
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className={`tab-content ${activeTab === "upcoming" ? "active" : ""}`}>
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Upcoming Appointments</h2>
              <p>Your scheduled appointments for the next 7 days</p>
            </div>
            <div className="card-content">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Patient</th>
                    <th>Type</th>
                    <th>Reason</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingAppointments.map((appointment, index) => (
                    <tr key={index}>
                      <td>
                        <div className="font-medium">{appointment.date}</div>
                        <div className="text-muted">{appointment.time}</div>
                      </td>
                      <td>{appointment.patientName}</td>
                      <td>{appointment.type}</td>
                      <td>{appointment.reason}</td>
                      <td className="text-right">
                        <Link href={`/dashboard/appointments/${index}`} className="btn btn-outline btn-sm">
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className={`tab-content ${activeTab === "past" ? "active" : ""}`}>
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Past Appointments</h2>
              <p>Your completed appointments</p>
            </div>
            <div className="card-content">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Patient</th>
                    <th>Type</th>
                    <th>Reason</th>
                    <th>Duration</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pastAppointments.map((appointment, index) => (
                    <tr key={index}>
                      <td>
                        <div className="font-medium">{appointment.date}</div>
                        <div className="text-muted">{appointment.time}</div>
                      </td>
                      <td>{appointment.patientName}</td>
                      <td>{appointment.type}</td>
                      <td>{appointment.reason}</td>
                      <td>{appointment.duration}</td>
                      <td className="text-right">
                        <Link href={`/dashboard/consultations/${index}/notes`} className="btn btn-outline btn-sm">
                          View Notes
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const todayAppointments = [
  {
    time: "10:00 AM",
    patientName: "Sarah Johnson",
    type: "Follow-up",
    reason: "Annual check-up",
    status: "Completed",
  },
  {
    time: "11:30 AM",
    patientName: "Michael Chen",
    type: "New Patient",
    reason: "Respiratory issues",
    status: "In Progress",
  },
  {
    time: "2:00 PM",
    patientName: "Emily Rodriguez",
    type: "Follow-up",
    reason: "Medication review",
    status: "Scheduled",
  },
  {
    time: "3:30 PM",
    patientName: "David Wilson",
    type: "Follow-up",
    reason: "Blood pressure check",
    status: "Scheduled",
  },
  {
    time: "4:45 PM",
    patientName: "Jennifer Lee",
    type: "Follow-up",
    reason: "Therapy session",
    status: "Scheduled",
  },
]

const upcomingAppointments = [
  {
    date: "Tomorrow",
    time: "9:15 AM",
    patientName: "Robert Brown",
    type: "Follow-up",
    reason: "Skin condition",
  },
  {
    date: "Tomorrow",
    time: "2:30 PM",
    patientName: "Lisa Wong",
    type: "Follow-up",
    reason: "Migraine follow-up",
  },
  {
    date: "May 20, 2023",
    time: "11:00 AM",
    patientName: "Thomas Garcia",
    type: "New Patient",
    reason: "General consultation",
  },
  {
    date: "May 22, 2023",
    time: "10:30 AM",
    patientName: "Amanda Miller",
    type: "Follow-up",
    reason: "Diabetes management",
  },
]

const pastAppointments = [
  {
    date: "May 10, 2023",
    time: "11:00 AM",
    patientName: "Sarah Johnson",
    type: "Follow-up",
    reason: "Annual check-up",
    duration: "25 minutes",
  },
  {
    date: "May 8, 2023",
    time: "3:30 PM",
    patientName: "Robert Brown",
    type: "New Patient",
    reason: "Skin condition",
    duration: "40 minutes",
  },
  {
    date: "May 5, 2023",
    time: "9:15 AM",
    patientName: "Jennifer Lee",
    type: "Follow-up",
    reason: "Prescription renewal",
    duration: "15 minutes",
  },
]

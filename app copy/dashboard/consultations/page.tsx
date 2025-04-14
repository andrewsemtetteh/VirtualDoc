"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"

export default function ConsultationsPage() {
  const [activeTab, setActiveTab] = useState("upcoming")

  return (
    <div>
      <div className="dashboard-header-row">
        <h1>Consultations</h1>
        <Link href="/dashboard/consultations/new" className="btn btn-primary">
          <Plus className="btn-icon" />
          New Consultation
        </Link>
      </div>

      <div className="tabs">
        <div className="tab-list">
          <button
            className={`tab-item ${activeTab === "upcoming" ? "active" : ""}`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming
          </button>
          <button className={`tab-item ${activeTab === "past" ? "active" : ""}`} onClick={() => setActiveTab("past")}>
            Past
          </button>
          <button
            className={`tab-item ${activeTab === "canceled" ? "active" : ""}`}
            onClick={() => setActiveTab("canceled")}
          >
            Canceled
          </button>
        </div>

        <div className={`tab-content ${activeTab === "upcoming" ? "active" : ""}`}>
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Upcoming Consultations</h2>
              <p>Manage your scheduled video consultations</p>
            </div>
            <div className="card-content">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Date & Time</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingConsultations.map((consultation, index) => (
                    <tr key={index}>
                      <td className="font-medium">{consultation.patientName}</td>
                      <td>{consultation.dateTime}</td>
                      <td>{consultation.reason}</td>
                      <td>
                        <span
                          className={`badge ${consultation.status === "Ready" ? "badge-success" : "badge-outline"}`}
                        >
                          {consultation.status}
                        </span>
                      </td>
                      <td className="text-right">
                        {consultation.status === "Ready" ? (
                          <Link href={`/dashboard/consultations/${index}/join`} className="btn btn-primary btn-sm">
                            Join Now
                          </Link>
                        ) : (
                          <Link href={`/dashboard/consultations/${index}`} className="btn btn-outline btn-sm">
                            View
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

        <div className={`tab-content ${activeTab === "past" ? "active" : ""}`}>
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Past Consultations</h2>
              <p>Review your completed consultations</p>
            </div>
            <div className="card-content">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Date & Time</th>
                    <th>Reason</th>
                    <th>Duration</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pastConsultations.map((consultation, index) => (
                    <tr key={index}>
                      <td className="font-medium">{consultation.patientName}</td>
                      <td>{consultation.dateTime}</td>
                      <td>{consultation.reason}</td>
                      <td>{consultation.duration}</td>
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

        <div className={`tab-content ${activeTab === "canceled" ? "active" : ""}`}>
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Canceled Consultations</h2>
              <p>Review canceled or rescheduled consultations</p>
            </div>
            <div className="card-content">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Original Date</th>
                    <th>Reason</th>
                    <th>Canceled By</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {canceledConsultations.map((consultation, index) => (
                    <tr key={index}>
                      <td className="font-medium">{consultation.patientName}</td>
                      <td>{consultation.dateTime}</td>
                      <td>{consultation.reason}</td>
                      <td>{consultation.canceledBy}</td>
                      <td className="text-right">
                        <Link href={`/dashboard/consultations/reschedule/${index}`} className="btn btn-outline btn-sm">
                          Reschedule
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

const upcomingConsultations = [
  {
    patientName: "Michael Chen",
    dateTime: "Today, 2:30 PM",
    reason: "Respiratory issues",
    status: "Ready",
  },
  {
    patientName: "Emily Rodriguez",
    dateTime: "Today, 4:00 PM",
    reason: "Medication review",
    status: "Scheduled",
  },
  {
    patientName: "David Wilson",
    dateTime: "Tomorrow, 10:30 AM",
    reason: "Follow-up consultation",
    status: "Scheduled",
  },
]

const pastConsultations = [
  {
    patientName: "Sarah Johnson",
    dateTime: "May 10, 2023, 11:00 AM",
    reason: "Annual check-up",
    duration: "25 minutes",
  },
  {
    patientName: "Robert Brown",
    dateTime: "May 8, 2023, 3:30 PM",
    reason: "Skin condition",
    duration: "40 minutes",
  },
  {
    patientName: "Jennifer Lee",
    dateTime: "May 5, 2023, 9:15 AM",
    reason: "Prescription renewal",
    duration: "15 minutes",
  },
]

const canceledConsultations = [
  {
    patientName: "Thomas Garcia",
    dateTime: "May 12, 2023, 2:00 PM",
    reason: "Headache consultation",
    canceledBy: "Patient",
  },
  {
    patientName: "Lisa Wong",
    dateTime: "May 7, 2023, 10:45 AM",
    reason: "Blood pressure check",
    canceledBy: "Doctor",
  },
]

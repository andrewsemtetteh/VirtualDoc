"use client"

import { useState } from "react"
import Link from "next/link"
import { Filter, Plus, MoreVertical } from "lucide-react"

export default function PrescriptionsPage() {
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null)

  const toggleDropdown = (index: number) => {
    if (dropdownOpen === index) {
      setDropdownOpen(null)
    } else {
      setDropdownOpen(index)
    }
  }

  return (
    <div>
      <div className="dashboard-header-row">
        <h1>Prescriptions</h1>
        <Link href="/dashboard/prescriptions/new" className="btn btn-primary">
          <Plus className="btn-icon" />
          New Prescription
        </Link>
      </div>

      <div className="search-filter-row">
        <div className="search-input">
          <input type="text" placeholder="Search prescriptions..." />
        </div>
        <div className="dropdown">
          <button className="btn btn-outline">
            <Filter className="btn-icon" />
            Filter
          </button>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="card-header">
          <h2>All Prescriptions</h2>
          <p>Manage and track patient prescriptions</p>
        </div>
        <div className="card-content">
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Medication</th>
                <th>Dosage</th>
                <th>Issued Date</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((prescription, index) => (
                <tr key={index}>
                  <td className="font-medium">{prescription.patientName}</td>
                  <td>{prescription.medication}</td>
                  <td>{prescription.dosage}</td>
                  <td>{prescription.issuedDate}</td>
                  <td>
                    <span
                      className={`badge ${
                        prescription.status === "Active"
                          ? "badge-success"
                          : prescription.status === "Expired"
                            ? "badge-secondary"
                            : "badge-warning"
                      }`}
                    >
                      {prescription.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="dropdown">
                      <button className="btn btn-icon" onClick={() => toggleDropdown(index)}>
                        <MoreVertical />
                      </button>
                      {dropdownOpen === index && (
                        <div className="dropdown-menu show">
                          <Link href={`/dashboard/prescriptions/${index}`} className="dropdown-item">
                            View Details
                          </Link>
                          <Link href={`/dashboard/prescriptions/${index}/edit`} className="dropdown-item">
                            Edit
                          </Link>
                          <a href="#" className="dropdown-item">
                            Renew Prescription
                          </a>
                          <div className="dropdown-divider"></div>
                          <a href="#" className="dropdown-item text-danger">
                            Cancel Prescription
                          </a>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const prescriptions = [
  {
    patientName: "Sarah Johnson",
    medication: "Lisinopril",
    dosage: "10mg once daily",
    issuedDate: "May 10, 2023",
    status: "Active",
  },
  {
    patientName: "Michael Chen",
    medication: "Albuterol",
    dosage: "2 puffs every 4-6 hours as needed",
    issuedDate: "May 15, 2023",
    status: "Active",
  },
  {
    patientName: "Emily Rodriguez",
    medication: "Metformin",
    dosage: "500mg twice daily with meals",
    issuedDate: "April 28, 2023",
    status: "Refill Needed",
  },
  {
    patientName: "David Wilson",
    medication: "Atorvastatin",
    dosage: "20mg once daily at bedtime",
    issuedDate: "March 15, 2023",
    status: "Expired",
  },
  {
    patientName: "Jennifer Lee",
    medication: "Sertraline",
    dosage: "50mg once daily in the morning",
    issuedDate: "May 5, 2023",
    status: "Active",
  },
]

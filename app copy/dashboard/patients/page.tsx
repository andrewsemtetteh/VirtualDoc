"use client"

import { useState } from "react"
import Link from "next/link"
import { Filter, Plus, MoreVertical } from "lucide-react"

export default function PatientsPage() {
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
        <h1>Patients</h1>
        <Link href="/dashboard/patients/new" className="btn btn-primary">
          <Plus className="btn-icon" />
          Add Patient
        </Link>
      </div>

      <div className="search-filter-row">
        <div className="search-input">
          <input type="text" placeholder="Search patients..." />
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
          <h2>Patient Records</h2>
          <p>View and manage your patient records</p>
        </div>
        <div className="card-content">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Last Visit</th>
                <th>Medical Conditions</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient, index) => (
                <tr key={index}>
                  <td className="font-medium">{patient.name}</td>
                  <td>{patient.age}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.lastVisit}</td>
                  <td>
                    <div className="tag-list">
                      {patient.conditions.map((condition, i) => (
                        <span key={i} className="tag">
                          {condition}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="text-right">
                    <div className="dropdown">
                      <button className="btn btn-icon" onClick={() => toggleDropdown(index)}>
                        <MoreVertical />
                      </button>
                      {dropdownOpen === index && (
                        <div className="dropdown-menu show">
                          <Link href={`/dashboard/patients/${index}`} className="dropdown-item">
                            View Medical History
                          </Link>
                          <Link href={`/dashboard/consultations/new?patient=${index}`} className="dropdown-item">
                            Start Consultation
                          </Link>
                          <Link href={`/dashboard/prescriptions/new?patient=${index}`} className="dropdown-item">
                            Write Prescription
                          </Link>
                          <Link href={`/dashboard/appointments/schedule?patient=${index}`} className="dropdown-item">
                            Schedule Appointment
                          </Link>
                          <div className="dropdown-divider"></div>
                          <Link href={`/dashboard/patients/${index}/edit`} className="dropdown-item">
                            Edit Patient Info
                          </Link>
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

const patients = [
  {
    name: "Sarah Johnson",
    age: 45,
    gender: "Female",
    lastVisit: "May 10, 2023",
    conditions: ["Hypertension", "Diabetes"],
  },
  {
    name: "Michael Chen",
    age: 42,
    gender: "Male",
    lastVisit: "May 15, 2023",
    conditions: ["Asthma", "Allergies"],
  },
  {
    name: "Emily Rodriguez",
    age: 38,
    gender: "Female",
    lastVisit: "April 28, 2023",
    conditions: ["Diabetes", "Obesity"],
  },
  {
    name: "David Wilson",
    age: 65,
    gender: "Male",
    lastVisit: "March 15, 2023",
    conditions: ["Hypertension", "High Cholesterol"],
  },
  {
    name: "Jennifer Lee",
    age: 29,
    gender: "Female",
    lastVisit: "May 5, 2023",
    conditions: ["Anxiety", "Depression"],
  },
  {
    name: "Robert Brown",
    age: 52,
    gender: "Male",
    lastVisit: "May 8, 2023",
    conditions: ["Eczema"],
  },
  {
    name: "Lisa Wong",
    age: 48,
    gender: "Female",
    lastVisit: "May 7, 2023",
    conditions: ["Hypertension", "Migraines"],
  },
]

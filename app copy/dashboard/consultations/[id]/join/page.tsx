"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Video, Mic, MicOff, VideoOff, PhoneOff } from "lucide-react"

// Mock patient data - in a real app, this would come from your backend
const patientData = {
  name: "Michael Chen",
  age: 42,
  gender: "Male",
  reason: "Respiratory issues",
  allergies: "Penicillin",
  medications: "Lisinopril 10mg daily",
  medicalHistory: "Hypertension, Seasonal allergies",
  vitalSigns: {
    bloodPressure: "120/80 mmHg",
    heartRate: "72 bpm",
    temperature: "98.6°F",
    respiratoryRate: "16 breaths/min",
    oxygenSaturation: "98%",
  },
}

export default function ConsultationRoom() {
  const params = useParams()
  const router = useRouter()
  const [isCallActive, setIsCallActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [consultationNotes, setConsultationNotes] = useState("")
  const [elapsedTime, setElapsedTime] = useState(0)
  const [activeTab, setActiveTab] = useState("notes")
  const [prescription, setPrescription] = useState({
    medication: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
  })

  // Start timer when call becomes active
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isCallActive) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isCallActive])

  // Format elapsed time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startCall = () => {
    setIsCallActive(true)
  }

  const endCall = () => {
    setIsCallActive(false)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff)
  }

  const handlePrescriptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPrescription((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const savePrescription = () => {
    // In a real app, you would save this to your backend
    alert("Prescription saved")
  }

  const completeConsultation = () => {
    // In a real app, you would save all data to your backend
    alert("Consultation completed")
    router.push("/dashboard/consultations")
  }

  return (
    <div className="consultation-container">
      <div className="consultation-header">
        <div>
          <h1>Video Consultation</h1>
          <p className="text-muted">
            Patient: {patientData.name} • {isCallActive ? `In Progress (${formatTime(elapsedTime)})` : "Ready to Start"}
          </p>
        </div>
        <div>
          {!isCallActive ? (
            <button onClick={startCall} className="btn btn-primary">
              <Video className="btn-icon" />
              Start Call
            </button>
          ) : (
            <button onClick={endCall} className="btn btn-danger">
              <PhoneOff className="btn-icon" />
              End Call
            </button>
          )}
        </div>
      </div>

      <div className="consultation-content">
        <div className="consultation-main">
          <div className="video-container">
            {!isCallActive ? (
              <div className="video-placeholder">
                <Video className="video-icon" />
                <h3>Ready to Start Consultation</h3>
                <p>Click "Start Call" to begin the video consultation</p>
              </div>
            ) : isVideoOff ? (
              <div className="video-off">
                <VideoOff className="video-icon" />
                <h3>Camera is Off</h3>
                <p>The patient cannot see you</p>
              </div>
            ) : (
              // This would be replaced with actual video stream in a real app
              <img
                src="/placeholder.svg?height=480&width=640"
                alt="Video stream placeholder"
                className="video-stream"
              />
            )}

            {/* Video call controls */}
            {isCallActive && (
              <div className="video-controls">
                <button className={`video-control-btn ${isMuted ? "active" : ""}`} onClick={toggleMute}>
                  {isMuted ? <MicOff /> : <Mic />}
                </button>
                <button className={`video-control-btn ${isVideoOff ? "active" : ""}`} onClick={toggleVideo}>
                  {isVideoOff ? <VideoOff /> : <Video />}
                </button>
                <button className="video-control-btn video-control-end" onClick={endCall}>
                  <PhoneOff />
                </button>
              </div>
            )}
          </div>

          <div className="tabs">
            <div className="tab-list">
              <button
                className={`tab-item ${activeTab === "notes" ? "active" : ""}`}
                onClick={() => setActiveTab("notes")}
              >
                Consultation Notes
              </button>
              <button
                className={`tab-item ${activeTab === "prescription" ? "active" : ""}`}
                onClick={() => setActiveTab("prescription")}
              >
                Prescription
              </button>
            </div>

            <div className={`tab-content ${activeTab === "notes" ? "active" : ""}`}>
              <div className="dashboard-card">
                <div className="card-header">
                  <h2>Consultation Notes</h2>
                  <p>Record your observations and diagnosis</p>
                </div>
                <div className="card-content">
                  <textarea
                    className="consultation-textarea"
                    placeholder="Enter your consultation notes here..."
                    value={consultationNotes}
                    onChange={(e) => setConsultationNotes(e.target.value)}
                  ></textarea>
                </div>
                <div className="card-footer">
                  <button className="btn btn-outline">Save Draft</button>
                  <button className="btn btn-primary">Save Notes</button>
                </div>
              </div>
            </div>

            <div className={`tab-content ${activeTab === "prescription" ? "active" : ""}`}>
              <div className="dashboard-card">
                <div className="card-header">
                  <h2>Issue Prescription</h2>
                  <p>Create a digital prescription for the patient</p>
                </div>
                <div className="card-content">
                  <div className="prescription-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="medication">Medication</label>
                        <input
                          id="medication"
                          name="medication"
                          placeholder="Medication name"
                          value={prescription.medication}
                          onChange={handlePrescriptionChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="dosage">Dosage</label>
                        <input
                          id="dosage"
                          name="dosage"
                          placeholder="e.g., 10mg"
                          value={prescription.dosage}
                          onChange={handlePrescriptionChange}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="frequency">Frequency</label>
                        <input
                          id="frequency"
                          name="frequency"
                          placeholder="e.g., Twice daily"
                          value={prescription.frequency}
                          onChange={handlePrescriptionChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="duration">Duration</label>
                        <input
                          id="duration"
                          name="duration"
                          placeholder="e.g., 7 days"
                          value={prescription.duration}
                          onChange={handlePrescriptionChange}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="instructions">Special Instructions</label>
                      <textarea
                        id="instructions"
                        name="instructions"
                        placeholder="Additional instructions for the patient..."
                        value={prescription.instructions}
                        onChange={handlePrescriptionChange}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <button className="btn btn-outline">Clear</button>
                  <button onClick={savePrescription} className="btn btn-primary">
                    Issue Prescription
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="patient-info">
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Patient Information</h2>
            </div>
            <div className="card-content">
              <div>
                <h3 className="text-muted">Patient</h3>
                <p className="font-medium">{patientData.name}</p>
              </div>
              <div className="info-row">
                <div className="info-item">
                  <h3>Age</h3>
                  <p>{patientData.age}</p>
                </div>
                <div className="info-item">
                  <h3>Gender</h3>
                  <p>{patientData.gender}</p>
                </div>
              </div>
              <div className="info-item">
                <h3>Reason for Visit</h3>
                <p>{patientData.reason}</p>
              </div>
              <div className="info-item">
                <h3>Allergies</h3>
                <p>{patientData.allergies}</p>
              </div>
              <div className="info-item">
                <h3>Current Medications</h3>
                <p>{patientData.medications}</p>
              </div>
              <div className="info-item">
                <h3>Medical History</h3>
                <p>{patientData.medicalHistory}</p>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h2>Vital Signs</h2>
              <p>Patient-reported vital signs</p>
            </div>
            <div className="card-content">
              <div className="vital-signs">
                <div className="vital-item">
                  <span>Blood Pressure:</span>
                  <span>{patientData.vitalSigns.bloodPressure}</span>
                </div>
                <div className="vital-item">
                  <span>Heart Rate:</span>
                  <span>{patientData.vitalSigns.heartRate}</span>
                </div>
                <div className="vital-item">
                  <span>Temperature:</span>
                  <span>{patientData.vitalSigns.temperature}</span>
                </div>
                <div className="vital-item">
                  <span>Respiratory Rate:</span>
                  <span>{patientData.vitalSigns.respiratoryRate}</span>
                </div>
                <div className="vital-item">
                  <span>Oxygen Saturation:</span>
                  <span>{patientData.vitalSigns.oxygenSaturation}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={completeConsultation}
            className="btn btn-primary btn-block"
            disabled={!isCallActive && elapsedTime === 0}
          >
            Complete Consultation
          </button>
        </div>
      </div>
    </div>
  )
}

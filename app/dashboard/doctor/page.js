'use client';
import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Calendar, Users, FileText, MessageSquare, Video, Bell, Settings, LogOut, User, Menu, X, Search, Sun, Moon, Edit, Trash2, Clock, Download, CheckCircle } from 'lucide-react';
import { Menu as HMenu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import MeetingLinkModal from '@/app/components/MeetingLinkModal';
import PrescriptionModal from '@/app/components/PrescriptionModal';
import PrescriptionsSection from '@/app/components/PrescriptionsSection';
import PracticeOverview from '@/app/components/PracticeOverview';

function PendingApprovalPage({ darkMode }) {
  return (
    <div className={`min-h-screen flex items-center justify-center ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className={`max-w-md w-full mx-4 p-8 rounded-lg shadow-lg ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="text-center">
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
            darkMode ? 'bg-green-900' : 'bg-green-100'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${
              darkMode ? 'text-green-400' : 'text-green-600'
            }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className={`mt-4 text-2xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>Account Under Review</h2>
          <p className={`mt-2 text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Thank you for registering with VirtualDoc. Our team is currently reviewing your credentials.
            You will be notified once your account has been approved.
          </p>
          <div className="mt-6">
            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <h3 className={`text-sm font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>What happens next?</h3>
              <ul className={`mt-2 text-sm space-y-2 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <li className="flex items-center">
                  <svg className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Our team will verify your medical license
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Review your professional credentials
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Send you an email once approved
                </li>
              </ul>
            </div>
            <p className={`mt-4 text-xs ${
              darkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>
              This process typically takes 1-2 business days. If you have any questions,
              please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DoctorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [recentConsultations, setRecentConsultations] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    monthlyAppointments: 0,
    totalPatients: 0,
    unreadMessages: 0
  });
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'appointment', message: 'New appointment request from John Doe', time: '5 mins ago', read: false },
    { id: 2, type: 'message', message: 'New message from Sarah Smith', time: '15 mins ago', read: false },
    { id: 3, type: 'prescription', message: 'Prescription renewal request', time: '1 hour ago', read: true }
  ]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  const [doctorProfile, setDoctorProfile] = useState(null);

  const [appointmentFilters, setAppointmentFilters] = useState({
    date: '',
    patient: '',
    status: 'all'
  });

  const [patientFilters, setPatientFilters] = useState({
    search: '',
    lastVisit: 'all',
    sortBy: 'name'
  });

  const [patients, setPatients] = useState([]);
  const [showMeetingLinkModal, setShowMeetingLinkModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedAppointmentForPrescription, setSelectedAppointmentForPrescription] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [patientsWithCompletedAppointments, setPatientsWithCompletedAppointments] = useState([]);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    const savedSection = localStorage.getItem('doctorSection');
    const savedCollapsed = localStorage.getItem('doctorNavCollapsed');
    setDarkMode(savedTheme === 'dark');
    if (savedSection) {
      setActiveSection(savedSection);
    }
    if (savedCollapsed) {
      setCollapsed(savedCollapsed === 'true');
    }
    // Log session data to help debug
    console.log('Session data:', session);
  }, [session]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme', darkMode ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', darkMode);
    }
  }, [darkMode, mounted]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Check authentication
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      // Fetch dashboard data
      fetch('/api/doctor/dashboard')
        .then(res => res.json())
        .then(data => setDashboardData(data));

      // Fetch upcoming appointments
      fetch('/api/appointments/upcoming')
        .then(res => res.json())
        .then(data => setUpcomingAppointments(data));

      // Fetch past appointments
      fetch('/api/appointments/past')
        .then(res => res.json())
        .then(data => setPastAppointments(data));

      // Fetch completed appointments
      fetch('/api/appointments/completed')
        .then(res => res.json())
        .then(data => {
          setCompletedAppointments(data);
          // Extract unique patients from completed appointments
          const uniquePatients = data.reduce((acc, appointment) => {
            if (!acc.find(p => p._id === appointment.patientId)) {
              acc.push({
                _id: appointment.patientId,
                fullName: appointment.patientName,
                lastVisit: appointment.completedAt
              });
            }
            return acc;
          }, []);
          setPatientsWithCompletedAppointments(uniquePatients);
        });

      // Fetch prescriptions
      fetch('/api/prescriptions/doctor')
        .then(res => res.json())
        .then(data => setPrescriptions(data));

      // Fetch doctor profile
      fetch(`/api/doctor/profile?email=${encodeURIComponent(session.user.email)}`)
        .then(res => res.json())
        .then(data => setDoctorProfile(data));
    }
  }, [session]);

  useEffect(() => {
    if (session?.user?.email) {
      fetch('/api/doctor/patients')
        .then(res => res.json())
        .then(data => setPatients(data));
    }
  }, [session]);

  const toggleSidebar = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    localStorage.setItem('doctorNavCollapsed', newCollapsed.toString());
  };

  const handleNavigation = (section) => {
    setActiveSection(section);
    localStorage.setItem('doctorSection', section);
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const handleConfirmAppointment = async (appointmentId) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}/confirm`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to confirm appointment');
      }

      // Show meeting link modal
      const appointment = upcomingAppointments.find(a => a._id === appointmentId);
      setSelectedAppointment(appointment);
      setShowMeetingLinkModal(true);

      // Refresh appointments
      const appointmentsResponse = await fetch('/api/appointments/upcoming');
      const appointmentsData = await appointmentsResponse.json();
      setUpcomingAppointments(appointmentsData);

      toast.success('Appointment confirmed successfully');
    } catch (error) {
      console.error('Error confirming appointment:', error);
      toast.error('Failed to confirm appointment');
    }
  };

  const handleSaveMeetingLink = async (appointmentId, meetingLink) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}/meeting-link`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ meetingLink }),
      });

      if (!response.ok) {
        throw new Error('Failed to save meeting link');
      }

      // Refresh appointments
      const appointmentsResponse = await fetch('/api/appointments/upcoming');
      const appointmentsData = await appointmentsResponse.json();
      setUpcomingAppointments(appointmentsData);

      toast.success('Meeting link saved successfully');
    } catch (error) {
      console.error('Error saving meeting link:', error);
      toast.error('Failed to save meeting link');
    }
  };

  const handleRejectAppointment = async (appointmentId) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to reject appointment');
      }

      // Refresh appointments
      const appointmentsResponse = await fetch('/api/appointments/upcoming');
      const appointmentsData = await appointmentsResponse.json();
      setUpcomingAppointments(appointmentsData);

      // Show success notification
      toast.success('Appointment rejected successfully');
    } catch (error) {
      console.error('Error rejecting appointment:', error);
      toast.error('Failed to reject appointment');
    }
  };

  const handleMarkAsDone = async (appointmentId) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to mark appointment as done');
      }

      // Refresh both upcoming and completed appointments
      const [upcomingResponse, completedResponse] = await Promise.all([
        fetch('/api/appointments/upcoming'),
        fetch('/api/appointments/completed')
      ]);

      const upcomingData = await upcomingResponse.json();
      const completedData = await completedResponse.json();

      setUpcomingAppointments(upcomingData);
      setCompletedAppointments(completedData);

      toast.success('Appointment marked as completed');
    } catch (error) {
      console.error('Error marking appointment as done:', error);
      toast.error('Failed to mark appointment as done');
    }
  };

  const handlePrescribe = (appointment) => {
    setSelectedAppointmentForPrescription(appointment);
    setShowPrescriptionModal(true);
  };

  const handleCreatePrescription = async (appointmentId, prescriptionData) => {
    try {
      const response = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentId,
          ...prescriptionData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create prescription');
      }

      toast.success('Prescription created successfully');
      
      // Refresh completed appointments to show the new prescription
      const completedResponse = await fetch('/api/appointments/completed');
      const completedData = await completedResponse.json();
      setCompletedAppointments(completedData);
    } catch (error) {
      console.error('Error creating prescription:', error);
      toast.error('Failed to create prescription');
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Practice Overview Section */}
            <PracticeOverview darkMode={darkMode} />

            {/* Today's Appointments */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-medium mb-4">Today's Appointments</h3>
              <div className="space-y-4">
                {upcomingAppointments
                  .filter(appointment => {
                    const appointmentDate = new Date(appointment.scheduledFor);
                    const today = new Date();
                    return appointmentDate.toDateString() === today.toDateString();
                  })
                  .map((appointment) => (
                    <div key={appointment._id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center justify-between`}>
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">
                            {appointment.patientName?.split(' ').map(n => n[0]).join('') || 'P'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <p className="font-medium">{appointment.patientName}</p>
                          <p className="text-sm text-gray-500">{appointment.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-lg font-medium">{new Date(appointment.scheduledFor).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-500">{new Date(appointment.scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <button 
                          className={`px-4 py-2 rounded ${
                            new Date(appointment.scheduledFor).getTime() - Date.now() <= 600000 // 10 minutes before
                              ? 'bg-green-500 text-white hover:bg-green-600'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                          disabled={new Date(appointment.scheduledFor).getTime() - Date.now() > 600000}
                          onClick={() => handleJoinVideoCall(appointment._id)}
                        >
                          Join Call
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            
            {/* Prescriptions Section */}
            <PrescriptionsSection darkMode={darkMode} />
          </div>
        );
      case 'appointments':
        return (
          <div className="space-y-6">
            {/* Filters */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Date</label>
                  <input 
                    type="date" 
                    className="w-full rounded-md border-gray-300 shadow-sm"
                    value={appointmentFilters.date}
                    onChange={(e) => setAppointmentFilters(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Patient</label>
                  <input 
                    type="text" 
                    placeholder="Search patient..."
                    className="w-full rounded-md border-gray-300 shadow-sm"
                    value={appointmentFilters.patient}
                    onChange={(e) => setAppointmentFilters(prev => ({ ...prev, patient: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                  <select 
                    className="w-full rounded-md border-gray-300 shadow-sm"
                    value={appointmentFilters.status}
                    onChange={(e) => setAppointmentFilters(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="all">All Statuses</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-medium mb-4">Upcoming Appointments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingAppointments
                  .filter(appointment => appointment.status === 'accepted')
                  .map((appointment) => (
                    <div key={appointment._id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex flex-col`}>
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">
                            {appointment.patientName?.split(' ').map(n => n[0]).join('') || 'P'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <p className="font-medium">{appointment.patientName}</p>
                          <p className="text-sm text-gray-500">{appointment.type}</p>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="mb-2">
                          <span className="text-sm font-medium">Consultation Reason: </span>
                          <span className="text-sm text-gray-500">{appointment.reason}</span>
                        </div>
                        {appointment.notes && (
                          <div className="mb-2">
                            <span className="text-sm font-medium">Additional Notes: </span>
                            <span className="text-sm text-gray-500">{appointment.notes}</span>
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <Clock size={16} className="mr-2" />
                          <span>Time: {appointment.scheduledFor ? new Date(appointment.scheduledFor).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: true 
                          }) : 'Not set'}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar size={16} className="mr-2" />
                          <span>Date: {appointment.scheduledFor ? new Date(appointment.scheduledFor).toLocaleDateString('en-US', { 
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'Not set'}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        {appointment.meetingLink ? (
                          <a
                            href={appointment.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
                          >
                            <Video className="h-4 w-4 mr-2" />
                            Join Meeting
                          </a>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setShowMeetingLinkModal(true);
                            }}
                            className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center"
                          >
                            <Video className="h-4 w-4 mr-2" />
                            Add Meeting Link
                          </button>
                        )}
                        <button
                          onClick={() => handleMarkAsDone(appointment._id)}
                          className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center justify-center"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Done
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Completed Appointments */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'} mt-6`}>
              <h3 className="text-lg font-medium mb-4">Completed Appointments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedAppointments.map((appointment) => (
                  <div key={appointment._id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex flex-col`}>
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">
                          {appointment.patientName?.split(' ').map(n => n[0]).join('') || 'P'}
                        </span>
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">{appointment.patientName}</p>
                        <p className="text-sm text-gray-500">{appointment.type}</p>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="mb-2">
                        <span className="text-sm font-medium">Consultation Reason: </span>
                        <span className="text-sm text-gray-500">{appointment.reason}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Clock size={16} className="mr-2" />
                        <span>Completed: {new Date(appointment.completedAt).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => handlePrescribe(appointment)}
                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Prescribe
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'patients':
        return (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search Patients</label>
                  <div className="relative">
                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'} h-5 w-5`} />
                    <input
                      type="text"
                      placeholder="Search by name..."
                      className={`pl-10 pr-4 py-2 rounded-md border transition-all duration-300 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-gray-500' 
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-300'
                      } w-full focus:outline-none`}
                      value={patientFilters.search}
                      onChange={(e) => setPatientFilters(prev => ({ ...prev, search: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Visit</label>
                  <select 
                    className="w-full rounded-md border-gray-300 shadow-sm"
                    value={patientFilters.lastVisit}
                    onChange={(e) => setPatientFilters(prev => ({ ...prev, lastVisit: e.target.value }))}
                  >
                    <option value="all">All Time</option>
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="year">Last Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select 
                    className="w-full rounded-md border-gray-300 shadow-sm"
                    value={patientFilters.sortBy}
                    onChange={(e) => setPatientFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                  >
                    <option value="name">Name</option>
                    <option value="lastVisit">Last Visit</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Patient List */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-medium mb-4">Patients</h3>
              <div className="space-y-4">
                {patientsWithCompletedAppointments
                  .filter(patient => {
                    const matchesSearch = !patientFilters.search || 
                      patient.fullName.toLowerCase().includes(patientFilters.search.toLowerCase());
                    const matchesLastVisit = patientFilters.lastVisit === 'all' || 
                      (() => {
                        const lastVisit = new Date(patient.lastVisit);
                        const now = new Date();
                        switch (patientFilters.lastVisit) {
                          case 'week': return now - lastVisit <= 7 * 24 * 60 * 60 * 1000;
                          case 'month': return now - lastVisit <= 30 * 24 * 60 * 60 * 1000;
                          case 'year': return now - lastVisit <= 365 * 24 * 60 * 60 * 1000;
                          default: return true;
                        }
                      })();
                    return matchesSearch && matchesLastVisit;
                  })
                  .sort((a, b) => {
                    switch (patientFilters.sortBy) {
                      case 'name': return a.fullName.localeCompare(b.fullName);
                      case 'lastVisit': return new Date(b.lastVisit) - new Date(a.lastVisit);
                      default: return 0;
                    }
                  })
                  .map((patient) => (
                    <div key={patient._id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center justify-between`}>
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">
                            {patient.fullName?.split(' ').map(n => n[0]).join('') || 'P'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <p className="font-medium">{patient.fullName}</p>
                          <p className="text-xs text-gray-400">Last visit: {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                          onClick={() => handleViewPatientDetails(patient._id)}
                        >
                          View Records
                        </button>
                        <button 
                          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                          onClick={() => handleScheduleAppointment(patient._id)}
                        >
                          Schedule
                        </button>
                      </div>
                    </div>
                  )) || (
                  <div className="text-center py-12">
                    <Users className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    <h3 className={`mt-2 text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      No patients found
                    </h3>
                    <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Start by scheduling appointments with your patients
                    </p>
                    <button
                      onClick={() => setActiveSection('appointments')}
                      className={`mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                        darkMode 
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      Go to Appointments
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'prescriptions':
        return (
          <div className="space-y-6">
            {/* New Prescription Form */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'} mb-6`}>
              <h3 className={`text-lg font-medium mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>New Prescription</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-left`}>Patient</label>
                    <select className={`w-full h-12 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}>
                      <option>Select Patient</option>
                      {patientsWithCompletedAppointments.map(patient => (
                        <option key={patient._id} value={patient._id}>{patient.fullName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-left`}>Diagnosis</label>
                    <textarea 
                      className={`w-full h-24 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="Enter diagnosis details"
                    ></textarea>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-left`}>Treatment Plan</label>
                    <textarea 
                      className={`w-full h-24 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="Enter treatment plan"
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-left`}>Medication</label>
                      <input 
                        type="text" 
                        className={`w-full h-12 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        placeholder="Enter medication name" 
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-left`}>Dosage</label>
                      <input 
                        type="text" 
                        className={`w-full h-12 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        placeholder="e.g., 500mg" 
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-left`}>Frequency</label>
                      <input 
                        type="text" 
                        className={`w-full h-12 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        placeholder="e.g., Twice daily" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-left`}>Duration</label>
                    <input 
                      type="text" 
                      className={`w-full h-12 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="e.g., 7 days" 
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-left`}>Additional Instructions</label>
                    <textarea 
                      className={`w-full h-24 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="Enter any additional instructions"
                    ></textarea>
                  </div>
                </div>
                <button type="submit" className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 text-lg font-medium">
                  Issue Prescription
                </button>
              </form>
            </div>

            {/* Prescriptions List */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-medium mb-6">Recent Prescriptions</h3>
              <div className="space-y-6">
                {prescriptions.length > 0 ? (
                  prescriptions.map((prescription) => (
                    <div key={prescription._id} className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">
                              {prescription.patientName?.split(' ').map(n => n[0]).join('') || 'P'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <p className="font-medium">{prescription.patientName}</p>
                            <p className="text-xs text-gray-500">Issued: {new Date(prescription.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button className="p-2 text-blue-500 hover:text-blue-600">
                            <Download size={20} />
                          </button>
                          <button className="p-2 text-yellow-500 hover:text-yellow-600">
                            <Edit size={20} />
                          </button>
                          <button className="p-2 text-red-500 hover:text-red-600">
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 text-sm space-y-2">
                        <p><span className="font-medium">Diagnosis:</span> {prescription.diagnosis}</p>
                        <p><span className="font-medium">Treatment Plan:</span> {prescription.treatmentPlan}</p>
                        <p><span className="font-medium">Medication:</span> {prescription.medication}</p>
                        <p><span className="font-medium">Dosage:</span> {prescription.dosage}</p>
                        <p><span className="font-medium">Frequency:</span> {prescription.frequency}</p>
                        <p><span className="font-medium">Duration:</span> {prescription.duration}</p>
                        {prescription.additionalInstructions && (
                          <p><span className="font-medium">Additional Instructions:</span> {prescription.additionalInstructions}</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No prescriptions found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'appointments':
        return (
          <div className="space-y-6">
            {/* Filters */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Date</label>
                  <input 
                    type="date" 
                    className="w-full rounded-md border-gray-300 shadow-sm"
                    value={appointmentFilters.date}
                    onChange={(e) => setAppointmentFilters(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Patient</label>
                  <input 
                    type="text" 
                    placeholder="Search patient..."
                    className="w-full rounded-md border-gray-300 shadow-sm"
                    value={appointmentFilters.patient}
                    onChange={(e) => setAppointmentFilters(prev => ({ ...prev, patient: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                  <select 
                    className="w-full rounded-md border-gray-300 shadow-sm"
                    value={appointmentFilters.status}
                    onChange={(e) => setAppointmentFilters(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="all">All Statuses</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-medium mb-4">Upcoming Appointments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingAppointments
                  .filter(appointment => appointment.status === 'accepted')
                  .map((appointment) => (
                    <div key={appointment._id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex flex-col`}>
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">
                            {appointment.patientName?.split(' ').map(n => n[0]).join('') || 'P'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <p className="font-medium">{appointment.patientName}</p>
                          <p className="text-sm text-gray-500">{appointment.type}</p>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="mb-2">
                          <span className="text-sm font-medium">Consultation Reason: </span>
                          <span className="text-sm text-gray-500">{appointment.reason}</span>
                        </div>
                        {appointment.notes && (
                          <div className="mb-2">
                            <span className="text-sm font-medium">Additional Notes: </span>
                            <span className="text-sm text-gray-500">{appointment.notes}</span>
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <Clock size={16} className="mr-2" />
                          <span>Time: {appointment.scheduledFor ? new Date(appointment.scheduledFor).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: true 
                          }) : 'Not set'}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar size={16} className="mr-2" />
                          <span>Date: {appointment.scheduledFor ? new Date(appointment.scheduledFor).toLocaleDateString('en-US', { 
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'Not set'}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        {appointment.meetingLink ? (
                          <a
                            href={appointment.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
                          >
                            <Video className="h-4 w-4 mr-2" />
                            Join Meeting
                          </a>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setShowMeetingLinkModal(true);
                            }}
                            className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center"
                          >
                            <Video className="h-4 w-4 mr-2" />
                            Add Meeting Link
                          </button>
                        )}
                        <button
                          onClick={() => handleMarkAsDone(appointment._id)}
                          className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center justify-center"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Done
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Completed Appointments */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'} mt-6`}>
              <h3 className="text-lg font-medium mb-4">Completed Appointments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedAppointments.map((appointment) => (
                  <div key={appointment._id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex flex-col`}>
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">
                          {appointment.patientName?.split(' ').map(n => n[0]).join('') || 'P'}
                        </span>
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">{appointment.patientName}</p>
                        <p className="text-sm text-gray-500">{appointment.type}</p>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="mb-2">
                        <span className="text-sm font-medium">Consultation Reason: </span>
                        <span className="text-sm text-gray-500">{appointment.reason}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Clock size={16} className="mr-2" />
                        <span>Completed: {new Date(appointment.completedAt).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => handlePrescribe(appointment)}
                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Prescribe
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const toggleProfile = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  // Show loading state
  if (!mounted || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Show pending approval page
  if (session?.user?.status === 'pending') {
    return <PendingApprovalPage darkMode={darkMode} />;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-green-50 to-gray-100 text-gray-900'} transition-all duration-300`}>
      {/* Header */}
      <div className={`w-full ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b sticky top-0 z-50`}>
        <header className="flex items-center justify-between max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 h-16">
          <div className="flex items-center space-x-4">
            <div className="text-green-700">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="18" cy="18" r="18" fill="currentColor" fillOpacity="0.2" />
                <path d="M11 18C11 14.134 14.134 11 18 11V25C14.134 25 11 21.866 11 18Z" fill="currentColor" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-800">VirtualDoc</span>
          </div>
            
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode} 
              className={`p-2 rounded-full transition-all duration-300 ${
                darkMode 
                  ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                  : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
              }`}
            >
              {mounted && (darkMode ? <Sun size={20} /> : <Moon size={20} />)}
            </button>
              
            <HMenu as="div" className="relative" ref={profileRef}>
              <HMenu.Button className={`flex items-center space-x-3 p-2 focus:outline-none rounded-lg ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}>
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center overflow-hidden">
                  {session?.user?.profilePicture ? (
                    <Image 
                      src={session.user.profilePicture} 
                      alt={session.user.name} 
                      width={32} 
                      height={32} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5 text-white" />
                  )}
                </div>
                <div className="text-left hidden md:block">
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    {session?.user?.name ? `Dr. ${session.user.name}` : 'Loading...'}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {doctorProfile?.specialization ? doctorProfile.specialization : 'Loading...'}
                  </p>
                </div>
              </HMenu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <HMenu.Items className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg focus:outline-none z-50 ${
                  darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}>
                  <div className="py-1">
                    <HMenu.Item>
                      {({ active }) => (
                        <a
                          href="/dashboard/doctor/settings"
                          className={`${
                            active ? (darkMode ? 'bg-gray-700' : 'bg-gray-100') : ''
                          } block px-4 py-2 text-sm ${
                            darkMode ? 'text-gray-200' : 'text-gray-700'
                          }`}
                        >
                          <div className="flex items-center">
                            <Settings className={`h-4 w-4 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            Settings
                          </div>
                        </a>
                      )}
                    </HMenu.Item>
                  </div>
                  <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <HMenu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => {
                            signOut({ callbackUrl: '/' });
                          }}
                          className={`${
                            active ? (darkMode ? 'bg-gray-700' : 'bg-red-50') : ''
                          } block w-full text-left px-4 py-2 text-sm text-red-600 rounded-b-lg`}
                        >
                          <div className="flex items-center">
                            <LogOut className={`h-4 w-4 mr-2 ${darkMode ? 'text-red-500' : 'text-red-600'}`} />
                            Sign out
                          </div>
                        </button>
                      )}
                    </HMenu.Item>
                  </div>
                </HMenu.Items>
              </Transition>
            </HMenu>
          </div>
        </header>
      </div>

      {/* Main Content */}
      <main className="pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
            {/* Welcome Section */}
            <section id="welcome" className="scroll-mt-20">
              <div className={`p-4 sm:p-6 rounded-lg shadow-sm bg-gradient-to-r from-green-700 to-green-900 text-white`}>
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">Welcome back, Dr. {session?.user?.name}</h1>
                    <p className="text-lg text-green-100">
                      Here's what's happening with your practice today
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <div className="p-4 rounded-lg bg-white/10">
                      <p className="text-sm text-green-100">Current Time</p>
                      <p className="text-2xl font-semibold">{new Date().toLocaleTimeString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Appointments Section */}
            <section id="appointments" className="scroll-mt-20">
              <h2 className="text-2xl font-bold mb-4 sm:mb-6">Appointments</h2>
              
              {/* Pending Appointments */}
              <div className={`p-4 sm:p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'} mb-4 sm:mb-6`}>
                <h3 className="text-lg font-medium mb-4 sm:mb-4">Pending Confirmations</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingAppointments
                    .filter(appointment => appointment.status === 'pending')
                    .map((appointment) => (
                      <div key={appointment._id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex flex-col`}>
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">
                              {appointment.patientName?.split(' ').map(n => n[0]).join('') || 'P'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <p className="font-medium">{appointment.patientName}</p>
                            <p className="text-sm text-gray-500">{appointment.type}</p>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="mb-2">
                            <p className="text-sm font-medium">Consultation Reason:</p>
                            <p className="text-sm text-gray-500">{appointment.reason}</p>
                          </div>
                          {appointment.notes && (
                            <div className="mb-2">
                              <p className="text-sm font-medium">Notes:</p>
                              <p className="text-sm text-gray-500">{appointment.notes}</p>
                            </div>
                          )}
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <Clock size={16} className="mr-2" />
                            <span>{new Date(appointment.scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar size={16} className="mr-2" />
                            <span>{new Date(appointment.scheduledFor).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <button 
                            className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            onClick={() => handleConfirmAppointment(appointment._id)}
                          >
                            Confirm
                          </button>
                          <button 
                            className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={() => handleRejectAppointment(appointment._id)}
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Upcoming Appointments */}
              <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className="text-lg font-medium mb-4">Upcoming Appointments</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingAppointments
                    .filter(appointment => appointment.status === 'accepted')
                    .map((appointment) => (
                      <div key={appointment._id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex flex-col`}>
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">
                              {appointment.patientName?.split(' ').map(n => n[0]).join('') || 'P'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <p className="font-medium">{appointment.patientName}</p>
                            <p className="text-sm text-gray-500">{appointment.type}</p>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="mb-2">
                            <span className="text-sm font-medium">Consultation Reason: </span>
                            <span className="text-sm text-gray-500">{appointment.reason}</span>
                          </div>
                          {appointment.notes && (
                            <div className="mb-2">
                              <span className="text-sm font-medium">Additional Notes: </span>
                              <span className="text-sm text-gray-500">{appointment.notes}</span>
                            </div>
                          )}
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <Clock size={16} className="mr-2" />
                            <span>Time: {appointment.scheduledFor ? new Date(appointment.scheduledFor).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit',
                              hour12: true 
                            }) : 'Not set'}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar size={16} className="mr-2" />
                            <span>Date: {appointment.scheduledFor ? new Date(appointment.scheduledFor).toLocaleDateString('en-US', { 
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) : 'Not set'}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-4">
                          {appointment.meetingLink ? (
                            <a
                              href={appointment.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
                            >
                              <Video className="h-4 w-4 mr-2" />
                              Join Meeting
                            </a>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedAppointment(appointment);
                                setShowMeetingLinkModal(true);
                              }}
                              className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center"
                            >
                              <Video className="h-4 w-4 mr-2" />
                              Add Meeting Link
                            </button>
                          )}
                          <button
                            onClick={() => handleMarkAsDone(appointment._id)}
                            className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center justify-center"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Done
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Completed Appointments */}
              <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'} mt-6`}>
                <h3 className="text-lg font-medium mb-4">Completed Appointments</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {completedAppointments.map((appointment) => (
                    <div key={appointment._id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex flex-col`}>
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">
                            {appointment.patientName?.split(' ').map(n => n[0]).join('') || 'P'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <p className="font-medium">{appointment.patientName}</p>
                          <p className="text-sm text-gray-500">{appointment.type}</p>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="mb-2">
                          <span className="text-sm font-medium">Consultation Reason: </span>
                          <span className="text-sm text-gray-500">{appointment.reason}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <Clock size={16} className="mr-2" />
                          <span>Completed: {new Date(appointment.completedAt).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <button
                          onClick={() => handlePrescribe(appointment)}
                          className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Prescribe
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Prescriptions Section */}
            <PrescriptionsSection darkMode={darkMode} />

            {/* Patients Section */}
            <section id="patients" className="scroll-mt-20">
              <h2 className="text-2xl font-bold mb-6">Patients</h2>
              <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="space-y-4">
                  {patientsWithCompletedAppointments.map((patient, index) => (
                    <div key={patient._id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            {patient.profilePicture ? (
                              <Image 
                                src={patient.profilePicture} 
                                alt={patient.fullName} 
                                width={48} 
                                height={48} 
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <span className="text-gray-500">
                                {patient.fullName?.split(' ').map(n => n[0]).join('') || 'P'}
                              </span>
                            )}
                          </div>
                          <div className="ml-4">
                            <p className="font-medium">{index + 1}. {patient.fullName}</p>
                            <p className="text-sm text-gray-500">Last visit: {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={() => handleViewPatientDetails(patient._id)}
                          >
                            View Records
                          </button>
                          <button 
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            onClick={() => handleScheduleAppointment(patient._id)}
                          >
                            Schedule
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      {/* Meeting Link Modal */}
      <MeetingLinkModal
        isOpen={showMeetingLinkModal}
        onClose={() => setShowMeetingLinkModal(false)}
        onSave={handleSaveMeetingLink}
        appointment={selectedAppointment}
        darkMode={darkMode}
      />

      {/* Prescription Modal */}
      <PrescriptionModal
        isOpen={showPrescriptionModal}
        onClose={() => {
          setShowPrescriptionModal(false);
          setSelectedAppointmentForPrescription(null);
        }}
        appointment={selectedAppointmentForPrescription}
        onSubmit={handleCreatePrescription}
        darkMode={darkMode}
      />
    </div>
  );
}

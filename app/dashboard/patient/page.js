'use client';
import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Calendar, Users, FileText, MessageSquare, Video, Settings, LogOut, User, Search, Sun, Moon, Stethoscope, Clock, Download, Upload, Star } from 'lucide-react';
import { Menu as HMenu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useDoctors } from '@/hooks/useDoctors';
import BookingModal from '@/app/components/BookingModal';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import DoctorCard from '@/app/components/DoctorCard';

export default function PatientDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [patientProfile, setPatientProfile] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    appointments: [],
    prescriptions: [],
    lastCheckup: null,
    nextCheckup: null
  });
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [doctorSearch, setDoctorSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  const profileRef = useRef(null);

  const handleBookingSubmit = async (appointmentData) => {
    try {
      console.log('Session status:', status);
      console.log('Session data:', session);

      if (status !== 'authenticated' || !session?.user) {
        console.error('Session validation failed:', { status, session });
        throw new Error('Please login to book an appointment');
      }

      const userId = session.user._id || session.user.id;
      if (!userId) {
        console.error('No user ID found in session:', session.user);
        throw new Error('Session error: Please login again');
      }

      setLoading(true);
      const response = await axios.post('/api/appointments', {
        ...appointmentData,
        patientId: userId
      });

      if (response.status === 201) {
        toast.success('Appointment booked successfully!');
        fetchAppointments(); // Refresh the appointments list
      } else {
        throw new Error('Failed to book appointment');
      }
    } catch (err) {
      console.error('Error booking appointment:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('/api/doctors');
      setDoctors(response.data.doctors || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/patient/dashboard');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchPatientProfile = async () => {
    try {
      const response = await fetch('/api/patient/profile');
      if (!response.ok) {
        throw new Error('Failed to fetch patient profile');
      }
      const data = await response.json();
      setPatientProfile(data);
    } catch (error) {
      console.error('Error fetching patient profile:', error);
      setError('Failed to load patient profile');
    }
  };

  const fetchAppointments = async () => {
    try {
      if (!session?.user) {
        console.error('No user session found');
        return;
      }

      console.log('Fetching appointments for user:', session.user);
      setLoading(true);

      const response = await axios.get('/api/appointments', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.data) {
        throw new Error('No appointments data received');
      }

      console.log('Received appointments:', response.data);

      const appointmentsWithDoctorInfo = await Promise.all(
        response.data.map(async (appointment) => {
          try {
            const doctorResponse = await axios.get(`/api/doctors/${appointment.doctorId}`);
            return {
              ...appointment,
              doctorName: doctorResponse.data.fullName,
              specialty: doctorResponse.data.specialization
            };
          } catch (error) {
            console.error('Error fetching doctor info:', error);
            return appointment;
          }
        })
      );
      
      const sortedAppointments = appointmentsWithDoctorInfo.sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      );
      
      console.log('Sorted appointments:', sortedAppointments);
      setAppointments(sortedAppointments);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        toast.error(err.response.data.error || 'Failed to fetch appointments');
      } else {
        toast.error('Failed to fetch appointments');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Session status:', status);
    console.log('Session data:', session);

    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user) {
      setMounted(true);
      const savedTheme = localStorage.getItem('theme');
      setDarkMode(savedTheme === 'dark');
      
      // Only fetch data if we have a valid session
      if (session.user._id || session.user.id) {
        fetchAppointments();
        fetchDoctors();
        fetchPatientProfile();
        fetchDashboardData();
      } else {
        console.error('No user ID found in session:', session.user);
        toast.error('Session error: Please login again');
        signOut();
      }
    }
  }, [status, session]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme', darkMode ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', darkMode);
    }
  }, [darkMode, mounted]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Format date for display
  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Format time for display
  const formatTime = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit' 
    });
  };

  // Get relative time for last checkup
  const getRelativeTime = (date) => {
    if (!date) return 'N/A';
    const now = new Date();
    const diff = now - new Date(date);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return <div className="flex items-center justify-center min-h-screen">Please sign in to access the dashboard</div>;
  }

  if (!mounted) return null;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-green-50 to-gray-100 text-gray-900'} transition-all duration-300`}>
      {/* Fixed Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm transition-all duration-300 h-16 border-b`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-green-700 mr-2">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="18" cy="18" r="18" fill="currentColor" fillOpacity="0.2" />
                  <path d="M11 18C11 14.134 14.134 11 18 11V25C14.134 25 11 21.866 11 18Z" fill="currentColor" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-800">VirtualDoc</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-full transition-all duration-300 ${
                  darkMode 
                    ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                    : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                }`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Profile Menu */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className={`flex items-center space-x-3 p-2 focus:outline-none rounded-lg ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  }`}
                >
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
                      {patientProfile?.fullName || session?.user?.name || 'Patient'}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {patientProfile?.patientId || 'Loading...'}
                    </p>
                  </div>
                </button>

                {showProfileMenu && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg focus:outline-none ${
                    darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  }`}>
                    <div className="py-1">
                      <a
                        href="/dashboard/patient/settings"
                        className={`block px-4 py-2 text-sm ${
                          darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center">
                          <Settings className={`h-4 w-4 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          Settings
                        </div>
                      </a>
                    </div>
                    <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                      >
                        <div className="flex items-center">
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign out
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        {/* Welcome Section */}
        <section id="welcome" className="p-4 md:p-8">
          <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gradient-to-r from-green-900 to-green-800' : 'bg-gradient-to-r from-green-900 to-green-800'} text-white`}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2">Welcome back, {patientProfile?.fullName}!</h1>
                <p className="text-green-100 mb-4">Here's what's happening with your health today</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-green-100">Patient ID</p>
                    <p className="font-medium">{patientProfile?.patientId || 'Loading...'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-100">Member since</p>
                    <p className="font-medium">{patientProfile?.memberSince || 'Loading...'}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-green-100">Last Checkup</p>
                  <p className="font-medium">{getRelativeTime(dashboardData.lastCheckup)}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  {patientProfile?.profilePicture ? (
                    <Image
                      src={patientProfile.profilePicture}
                      alt={patientProfile.fullName}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-white text-xl">
                      {patientProfile?.fullName?.split(' ').map(n => n[0]).join('') || 'P'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Patient Stats Section */}
        <section id="patient-stats" className="p-6 md:p-8">
          <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-bold mb-6">Your Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className="text-lg font-semibold mb-4">Health Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Health Status</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      <span className="text-sm font-medium">Good</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Checkup</span>
                    <span className="text-sm">{getRelativeTime(dashboardData.lastCheckup)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Next Checkup</span>
                    <span className="text-sm">{dashboardData.nextCheckup ? formatDate(dashboardData.nextCheckup.date) : 'Not scheduled'}</span>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className="text-lg font-semibold mb-4">Appointment Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Appointments</span>
                    <span className="text-sm font-medium">{appointments.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pending</span>
                    <span className="text-sm font-medium">{appointments.filter(a => a.status === 'pending').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completed</span>
                    <span className="text-sm font-medium">{appointments.filter(a => a.status === 'completed').length}</span>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className="text-lg font-semibold mb-4">Prescription Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Prescriptions</span>
                    <span className="text-sm font-medium">{dashboardData.prescriptions.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Prescription</span>
                    <span className="text-sm">{dashboardData.prescriptions.length > 0 ? formatDate(dashboardData.prescriptions[0].createdAt) : 'None'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Upcoming Refills</span>
                    <span className="text-sm">{dashboardData.prescriptions.filter(p => p.needsRefill).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Appointments Section */}
        <section id="appointments" className="p-6 md:p-8">
          <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-bold mb-6">Appointments</h2>
            
            {/* Pending Appointments */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Pending Appointments</h3>
              <div className="space-y-4">
                {appointments.filter(appointment => appointment.status === 'pending').length > 0 ? (
                  appointments.filter(appointment => appointment.status === 'pending').map((appointment) => (
                    <div key={appointment._id} className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">
                              {appointment.doctorName?.split(' ').map(n => n[0]).join('') || 'D'}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium">Dr. {appointment.doctorName}</h3>
                            <p className="text-sm text-gray-500">{appointment.specialty}</p>
                            <p className="text-sm text-gray-500">Reason: {appointment.reason}</p>
                          </div>
                        </div>
                        <div className="text-right mt-4 md:mt-0">
                          <p className="text-lg font-medium">{formatDate(appointment.date)}</p>
                          <p className="text-sm text-gray-500">{appointment.time}</p>
                          <p className="text-sm text-yellow-500">Pending Approval</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">No pending appointments</p>
                )}
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Upcoming Appointments</h3>
              <div className="space-y-4">
                {appointments.filter(appointment => appointment.status === 'approved' || appointment.status === 'scheduled').length > 0 ? (
                  appointments.filter(appointment => appointment.status === 'approved' || appointment.status === 'scheduled').map((appointment) => (
                    <div key={appointment._id} className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">
                              {appointment.doctorName?.split(' ').map(n => n[0]).join('') || 'D'}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium">Dr. {appointment.doctorName}</h3>
                            <p className="text-sm text-gray-500">{appointment.specialty}</p>
                            <p className="text-sm text-gray-500">Reason: {appointment.reason}</p>
                          </div>
                        </div>
                        <div className="text-right mt-4 md:mt-0">
                          <p className="text-lg font-medium">{formatDate(appointment.date)}</p>
                          <p className="text-sm text-gray-500">{appointment.time}</p>
                          <p className="text-sm text-green-500">Confirmed</p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-4">
                        <button
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setShowRescheduleModal(true);
                          }}
                          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setShowCancelModal(true);
                          }}
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">No upcoming appointments</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Find Doctor Section */}
        <section id="find-doctor" className="p-6 md:p-8">
          <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-bold mb-6">Find a Doctor</h2>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : doctors.length === 0 ? (
              <div className="text-center text-gray-500">No doctors available</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {doctors.map((doctor) => (
                  <DoctorCard
                    key={doctor._id}
                    doctor={doctor}
                    darkMode={darkMode}
                    onBookAppointment={() => {
                      setSelectedDoctor(doctor);
                      setShowBookingModal(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Prescriptions Section */}
        <section id="prescriptions" className="p-4 md:p-8">
          <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-xl font-bold">Prescriptions</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData.prescriptions.length > 0 ? (
                dashboardData.prescriptions.map((prescription) => (
                  <div key={prescription._id} className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">
                            {prescription.doctorName?.split(' ').map(n => n[0]).join('') || 'D'}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium">Dr. {prescription.doctorName}</h3>
                          <p className="text-sm text-gray-500">{formatDate(prescription.createdAt)}</p>
                        </div>
                      </div>
                      <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        <Download size={18} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Medication</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{prescription.medication}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Dosage</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{prescription.dosage}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Duration</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{prescription.duration}</p>
                      </div>
                      {prescription.notes && (
                        <div>
                          <h4 className="text-sm font-medium mb-1">Notes</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{prescription.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Status</span>
                        <span className={`text-sm font-medium ${
                          prescription.status === 'active' ? 'text-green-500' : 'text-yellow-500'
                        }`}>
                          {prescription.status === 'active' ? 'Active' : 'Pending Refill'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No active prescriptions</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Booking Modal */}
      {showBookingModal && selectedDoctor && (
        <BookingModal
          doctor={selectedDoctor}
          darkMode={darkMode}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedDoctor(null);
          }}
          onSubmit={handleBookingSubmit}
        />
      )}
    </div>
  );
}

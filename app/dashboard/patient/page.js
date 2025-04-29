'use client';
import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Calendar, Users, FileText, MessageSquare, Video, Bell, Settings, LogOut, User, Menu, X, Search, Sun, Moon, Stethoscope, Clock, Download, Upload, Star } from 'lucide-react';
import { Menu as HMenu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useDoctors } from '@/hooks/useDoctors';
import BookingModal from '@/components/BookingModal';
import { io } from 'socket.io-client';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function PatientDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [patientProfile, setPatientProfile] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    appointments: [],
    prescriptions: [],
    unreadMessages: 0,
    lastCheckup: null,
    nextCheckup: null
  });
  const [notifications, setNotifications] = useState([]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  const { filters, updateFilters, specialties } = useDoctors();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    const savedSection = localStorage.getItem('patientSection');
    const savedCollapsed = localStorage.getItem('patientNavCollapsed');
    setDarkMode(savedTheme === 'dark');
    if (savedSection) {
      setActiveSection(savedSection);
    }
    if (savedCollapsed) {
      setCollapsed(savedCollapsed === 'true');
    }
  }, []);

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
    const fetchPatientProfile = async () => {
      try {
        const response = await fetch('/api/patient/profile');
        const data = await response.json();
        
        if (!response.ok) {
          console.error('Profile fetch error:', data.error || 'Unknown error', data.sessionData || '');
          setPatientProfile({
            fullName: session?.user?.name || 'Patient',
            patientId: 'Not Available',
            memberSince: new Date().getFullYear(),
            profilePicture: session?.user?.image || null
          });
          return;
        }
        
        const profileData = {
          fullName: data.fullName || session?.user?.name || 'Patient',
          patientId: data.patientId || 'Not Available',
          memberSince: data.memberSince || new Date().getFullYear(),
          profilePicture: data.profilePicture || session?.user?.image || null
        };
        
        setPatientProfile(profileData);
      } catch (error) {
        console.error('Error fetching patient profile:', error);
        setPatientProfile({
          fullName: session?.user?.name || 'Patient',
          patientId: 'Not Available',
          memberSince: new Date().getFullYear(),
          profilePicture: session?.user?.image || null
        });
      }
    };

    if (session?.user && status === 'authenticated') {
      fetchPatientProfile();
    }
  }, [session, status]);

  useEffect(() => {
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

    if (session?.user) {
      fetchDashboardData();
    }
  }, [session]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/doctors');
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }
        const data = await response.json();
        setDoctors(data.doctors);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchDoctors();
    }
  }, [session]);

  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001');

    socketRef.current.on('doctorUpdate', (updatedDoctor) => {
      setDoctors(prev => 
        prev.map(doc => 
          doc._id === updatedDoctor._id ? updatedDoctor : doc
        )
      );
    });

    socketRef.current.on('appointmentUpdate', (updatedAppointment) => {
      setAppointments(prev => 
        prev.map(app => 
          app._id === updatedAppointment._id ? updatedAppointment : app
        )
      );
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('/api/appointments');
        setAppointments(response.data);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        toast.error('Failed to fetch appointments');
      }
    };

    fetchAppointments();
  }, []);

  const toggleSidebar = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    localStorage.setItem('patientNavCollapsed', newCollapsed.toString());
  };

  const handleNavigation = (section) => {
    setActiveSection(section);
    localStorage.setItem('patientSection', section);
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

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (formData) => {
    try {
      const response = await axios.post('/api/appointments', {
        doctorId: selectedDoctor._id,
        ...formData
      });

      // Update local state
      setAppointments(prev => [...prev, response.data.appointment]);
      setShowBookingModal(false);
      setSelectedDoctor(null);

      // Show success notification
      toast.success('Appointment booked successfully!');
    } catch (err) {
      console.error('Error booking appointment:', err);
      toast.error(err.response?.data?.error || 'Failed to book appointment');
    }
  };

  const handleReschedule = async (appointmentId, newDate, newTime) => {
    try {
      const response = await axios.put(`/api/appointments/${appointmentId}`, {
        date: newDate,
        time: newTime
      });

      setAppointments(prev => 
        prev.map(app => 
          app._id === appointmentId ? response.data : app
        )
      );

      toast.success('Appointment rescheduled successfully!');
    } catch (err) {
      console.error('Error rescheduling appointment:', err);
      toast.error(err.response?.data?.error || 'Failed to reschedule appointment');
    }
  };

  const handleCancel = async (appointmentId) => {
    try {
      await axios.delete(`/api/appointments/${appointmentId}`);
      
      setAppointments(prev => 
        prev.filter(app => app._id !== appointmentId)
      );

      toast.success('Appointment cancelled successfully!');
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      toast.error(err.response?.data?.error || 'Failed to cancel appointment');
    }
  };

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

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Health Status Overview */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-bold mb-4">Health Status Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className="font-medium mb-2">Current Health Status</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Good</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Last updated: {getRelativeTime(dashboardData.lastCheckup)}</p>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className="font-medium mb-2">Next Checkup</h3>
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} />
                    <span>{dashboardData.nextCheckup ? formatDate(dashboardData.nextCheckup.date) : 'No upcoming checkups'}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {dashboardData.nextCheckup ? `With ${dashboardData.nextCheckup.doctor}` : ''}
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className="font-medium mb-2">Recent Activity</h3>
                  <p className="text-sm">Last consultation: {getRelativeTime(dashboardData.lastCheckup)}</p>
                  <p className="text-sm">Active prescriptions: {dashboardData.prescriptions.length}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button 
                onClick={() => handleNavigation('book-appointment')}
                className={`p-4 rounded-lg shadow-sm flex items-center space-x-3 ${
                  darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                }`}
              >
                    <Calendar size={24} className="text-blue-500" />
                <span>Book Appointment</span>
              </button>
              <button 
                onClick={() => handleNavigation('consultations')}
                className={`p-4 rounded-lg shadow-sm flex items-center space-x-3 ${
                  darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <Video size={24} className="text-green-500" />
                <span>Start Consultation</span>
              </button>
              <button 
                onClick={() => handleNavigation('medical-records')}
                className={`p-4 rounded-lg shadow-sm flex items-center space-x-3 ${
                  darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <FileText size={24} className="text-purple-500" />
                <span>View Records</span>
              </button>
              <button 
                onClick={() => handleNavigation('messages')}
                className={`p-4 rounded-lg shadow-sm flex items-center space-x-3 ${
                  darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <MessageSquare size={24} className="text-orange-500" />
                <span>Messages ({dashboardData.unreadMessages})</span>
              </button>
            </div>

            {/* Upcoming Appointments */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-bold mb-4">Upcoming Appointments</h2>
              <div className="space-y-4">
                {dashboardData.appointments.length > 0 ? (
                  dashboardData.appointments.map((appointment) => (
                    <div key={appointment._id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center justify-between`}>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            {appointment.doctorName?.split(' ').map(n => n[0]).join('') || 'D'}
                        </div>
                        <div>
                          <p className="font-medium">{appointment.doctorName}</p>
                          <p className="text-sm text-gray-500">{appointment.specialty}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatTime(appointment.scheduledFor)}</p>
                        <p className="text-sm text-gray-500">{formatDate(appointment.scheduledFor)}</p>
                        <div className="mt-2 flex space-x-2">
                          <button 
                            onClick={() => handleReschedule(appointment._id)}
                            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                          >
                            Reschedule
                          </button>
                          <button 
                            onClick={() => handleCancel(appointment._id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No upcoming appointments</p>
                )}
              </div>
            </div>

            {/* Recent Prescriptions */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-bold mb-4">Recent Prescriptions</h2>
              <div className="space-y-4">
                {dashboardData.prescriptions.length > 0 ? (
                  dashboardData.prescriptions.map((prescription) => (
                    <div key={prescription._id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center justify-between`}>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            {prescription.doctorName?.split(' ').map(n => n[0]).join('') || 'D'}
                        </div>
                        <div>
                          <p className="font-medium">{prescription.doctorName}</p>
                          <p className="text-sm text-gray-500">{prescription.medication}</p>
                          <p className="text-sm text-gray-500">Issued: {formatDate(prescription.createdAt)}</p>
                        </div>
                      </div>
                      <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                          <Download size={16} className="inline mr-1" />
                          Download
                        </button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No active prescriptions</p>
                )}
              </div>
            </div>
          </div>
        );
      case 'book-appointment':
        return (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'} mb-6`}>
              <h2 className="text-xl font-bold mb-6">Find and Book a Doctor</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Specialty</label>
                  <select 
                    className={`w-full h-12 rounded-md border-gray-300 shadow-sm ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    value={filters.specialty}
                    onChange={(e) => updateFilters({ specialty: e.target.value })}
                  >
                    <option value="All Specialties">All Specialties</option>
                    {specialties && specialties.length > 0 ? (
                      specialties.filter(s => s !== 'All Specialties').map((specialty) => (
                        <option key={specialty} value={specialty}>{specialty}</option>
                      ))
                    ) : (
                      <option disabled>Loading specialties...</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Availability</label>
                  <select 
                    className={`w-full h-12 rounded-md border-gray-300 shadow-sm ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    value={filters.availability}
                    onChange={(e) => updateFilters({ availability: e.target.value })}
                  >
                    <option>Any Time</option>
                    <option>Today</option>
                    <option>This Week</option>
                    <option>Next Week</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Search</label>
                  <div className="relative">
                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'} h-5 w-5`} />
                    <input 
                      type="text" 
                      placeholder="Search by name, specialty, or location..." 
                      className={`w-full h-12 pl-10 pr-4 rounded-md border-gray-300 shadow-sm ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      value={filters.search}
                      onChange={(e) => updateFilters({ search: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Doctor List */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                </div>
              ) : error ? (
                <div className="text-center text-red-500">
                  {error}
                </div>
              ) : doctors.length === 0 ? (
                <div className="text-center text-gray-500">
                  No doctors found matching your criteria
                </div>
              ) : (
                <div className="space-y-6">
                  {doctors.map((doctor) => (
                    <div key={doctor._id} className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center justify-between`}>
                      <div className="flex items-center space-x-6">
                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          {doctor.profilePicture ? (
                            <Image 
                              src={doctor.profilePicture} 
                              alt={doctor.name} 
                              width={80} 
                              height={80} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-500 text-2xl">{doctor?.name ? doctor.name.charAt(0) : '?'}</span>
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-medium">{doctor.name}</h3>
                          <p className="text-gray-500">{doctor.specialty}</p>
                          <div className="flex items-center mt-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-5 w-5 ${i < Math.floor(doctor.rating) ? 'text-yellow-500' : 'text-gray-300'}`} 
                                  fill={i < Math.floor(doctor.rating) ? 'currentColor' : 'none'}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500 ml-2">({doctor.reviewCount} reviews)</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {doctor?.availability?.some(a => a.slots > 0) ? 'Available Today' : 'No Availability'}
                        </p>
                        <button 
                          className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          onClick={() => handleBookAppointment(doctor)}
                        >
                          Book Video Consultation
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Your Appointments */}
              <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-bold mb-4">Your Appointments</h2>
              <div className="space-y-4">
                {appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <div key={appointment._id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center justify-between`}>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          {appointment.doctorName?.split(' ').map(n => n[0]).join('') || 'D'}
                    </div>
                    <div>
                          <p className="font-medium">{appointment.doctorName}</p>
                          <p className="text-sm text-gray-500">{appointment.specialty}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatTime(appointment.scheduledFor)}</p>
                        <p className="text-sm text-gray-500">{formatDate(appointment.scheduledFor)}</p>
                        <div className="mt-2 flex space-x-2">
                          <button 
                            onClick={() => handleReschedule(appointment._id)}
                            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                          >
                            Reschedule
                          </button>
                          <button 
                            onClick={() => handleCancel(appointment._id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No appointments scheduled</p>
                )}
              </div>
            </div>
          </div>
        );
      case 'consultations':
        return (
          <div className="space-y-6">
            {/* Past Consultations */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-bold mb-4">Past Consultations</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((consultation) => (
                  <div key={consultation} className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">DS</span>
                    </div>
                    <div>
                          <h3 className="font-medium">Dr. Sarah Smith</h3>
                          <p className="text-sm text-gray-500">Dermatology</p>
                    </div>
                      </div>
                      <span className="text-sm text-gray-500">2 days ago</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-medium mb-2">Doctor's Notes</h4>
                        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
                          <p className="text-sm">Patient presented with mild eczema symptoms. Recommended topical corticosteroid cream and follow-up in 2 weeks.</p>
                    </div>
                  </div>
                      
                  <div>
                        <h4 className="font-medium mb-2">Diagnosis</h4>
                        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
                          <p className="text-sm">Mild eczema</p>
                  </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Prescription</h4>
                      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
                        <p className="text-sm">Topical corticosteroid cream (1% hydrocortisone)</p>
                        <p className="text-sm text-gray-500 mt-2">Apply twice daily for 2 weeks</p>
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-4">
                      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        <Download size={16} className="inline mr-1" />
                        Download Consultation Notes
                    </button>
                      <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                        <Download size={16} className="inline mr-1" />
                        Download Prescription
                    </button>
                  </div>
              </div>
                ))}
              </div>
            </div>

            {/* Upcoming Consultation */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-bold mb-4">Upcoming Consultation</h2>
              <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">DS</span>
                      </div>
                    <div>
                      <h3 className="font-medium">Dr. Sarah Smith</h3>
                      <p className="text-sm text-gray-500">Dermatology</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Tomorrow, 2:30 PM</p>
                    <p className="text-sm text-gray-500">Video Consultation</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Consultation Link</h4>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="text" 
                      value="https://virtualdoc.com/consultation/123456" 
                      readOnly 
                      className={`flex-1 p-2 rounded border ${
                        darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'
                      }`}
                    />
                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                      Copy Link
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex space-x-4">
                  <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                          Reschedule
                        </button>
                  <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                          Cancel
                        </button>
                      </div>
              </div>
            </div>
          </div>
        );
      case 'medical-records':
        return (
          <div className="space-y-6">
            {/* Medical Records Overview */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-bold mb-4">Medical Records Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className="font-medium mb-2">Allergies</h3>
                  <div className="space-y-2">
                    <p className="text-sm">No known allergies</p>
                    <button className="text-sm text-blue-500 hover:text-blue-600">Add Allergy</button>
                </div>
              </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className="font-medium mb-2">Medications</h3>
                  <div className="space-y-2">
                    <p className="text-sm">Topical corticosteroid cream (1% hydrocortisone)</p>
                    <button className="text-sm text-blue-500 hover:text-blue-600">Add Medication</button>
              </div>
            </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className="font-medium mb-2">Conditions</h3>
                  <div className="space-y-2">
                    <p className="text-sm">Mild eczema</p>
                    <button className="text-sm text-blue-500 hover:text-blue-600">Add Condition</button>
          </div>
                </div>
              </div>
            </div>

            {/* Recent Medical Records */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Recent Medical Records</h2>
                <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                  Request New Record
                </button>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((record) => (
                  <div key={record} className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium">Consultation with Dr. Sarah Smith</h3>
                        <p className="text-sm text-gray-500">Dermatology - Follow-up</p>
                      </div>
                      <span className="text-sm text-gray-500">2 days ago</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Diagnosis</h4>
                        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
                          <p className="text-sm">Mild eczema</p>
                    </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Treatment</h4>
                        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
                          <p className="text-sm">Topical corticosteroid cream</p>
                          <p className="text-sm text-gray-500 mt-2">Apply twice daily for 2 weeks</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Notes</h4>
                      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
                        <p className="text-sm">Patient presented with mild eczema symptoms. Recommended topical corticosteroid cream and follow-up in 2 weeks.</p>
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-4">
                      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        <Download size={16} className="inline mr-1" />
                        Download Record
                      </button>
                      <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                        Share with Doctor
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Update Health Information */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-bold mb-4">Update Health Information</h2>
              <form className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Medical History
                  </label>
                  <textarea
                    className={`w-full rounded-md border-gray-300 shadow-sm ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    rows="4"
                    placeholder="Enter your medical history..."
                  ></textarea>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Current Symptoms
                  </label>
                  <textarea
                    className={`w-full rounded-md border-gray-300 shadow-sm ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    rows="4"
                    placeholder="Describe any current symptoms..."
                  ></textarea>
                </div>

                <div className="flex justify-end">
                  <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      case 'messages':
        return (
          <div className="space-y-6">
            {/* Chat Interface */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-medium mb-4">Messages</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((message) => (
                  <div key={message} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center justify-between`}>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">DS</span>
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">Dr. Sarah Smith</p>
                        <p className="text-sm text-gray-500">Last message: 2 hours ago</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                      Chat
                    </button>
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

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return <div className="flex items-center justify-center min-h-screen">Please sign in to access the dashboard</div>;
  }

  if (!mounted) return null;

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-green-50 to-gray-100 text-gray-900'} transition-all duration-300`}>
      {/* Sidebar */}
      <div className={`${collapsed ? 'w-20' : 'w-64'} ${darkMode ? 'bg-gray-800' : 'bg-white'} transition-all duration-300 shadow-lg fixed h-full z-50`}>
        {/* Logo */}
        <div className={`flex items-center p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} h-16`}>
          <div className="text-green-700 mr-2">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="18" fill="currentColor" fillOpacity="0.2" />
              <path d="M11 18C11 14.134 14.134 11 18 11V25C14.134 25 11 21.866 11 18Z" fill="currentColor" />
            </svg>
          </div>
          {!collapsed && <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-800">VirtualDoc</span>}
        </div>

        {/* Menu */}
        <div className="p-4">
          {!collapsed && <div className="text-sm font-medium text-gray-500 mb-4">MAIN MENU</div>}
          
          <div className="space-y-2">
            {/* Dashboard */}
            <div 
              onClick={() => handleNavigation('dashboard')}
              className={`flex items-center p-3 rounded-lg cursor-pointer ${
                activeSection === 'dashboard' 
                  ? (darkMode ? 'bg-green-700 text-white' : 'bg-green-50 text-green-800') 
                  : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-green-50 hover:text-green-800')
              }`}
            >
              <LayoutDashboard size={20} />
              {!collapsed && <span className="ml-3 font-medium">Dashboard</span>}
            </div>
            
            {/* Book Appointment */}
            <div 
              onClick={() => handleNavigation('book-appointment')}
              className={`flex items-center p-3 rounded-lg cursor-pointer ${
                activeSection === 'book-appointment' 
                  ? (darkMode ? 'bg-green-700 text-white' : 'bg-green-50 text-green-800') 
                  : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-green-50 hover:text-green-800')
              }`}
            >
              <Calendar size={20} />
              {!collapsed && <span className="ml-3">Book Appointment</span>}
            </div>
            
            {/* Consultations */}
            <div 
              onClick={() => handleNavigation('consultations')}
              className={`flex items-center p-3 rounded-lg cursor-pointer ${
                activeSection === 'consultations' 
                  ? (darkMode ? 'bg-green-700 text-white' : 'bg-green-50 text-green-800') 
                  : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-green-50 hover:text-green-800')
              }`}
            >
              <Video size={20} />
              {!collapsed && <span className="ml-3">Consultations</span>}
            </div>
            
            {/* Medical Records */}
            <div 
              onClick={() => handleNavigation('medical-records')}
              className={`flex items-center p-3 rounded-lg cursor-pointer ${
                activeSection === 'medical-records' 
                  ? (darkMode ? 'bg-green-700 text-white' : 'bg-green-50 text-green-800') 
                  : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-green-50 hover:text-green-800')
              }`}
            >
              <FileText size={20} />
              {!collapsed && <span className="ml-3">Medical Records</span>}
            </div>
            
            {/* Messages */}
            <div 
              onClick={() => handleNavigation('messages')}
              className={`flex items-center p-3 rounded-lg cursor-pointer ${
                activeSection === 'messages' 
                  ? (darkMode ? 'bg-green-700 text-white' : 'bg-green-50 text-green-800') 
                  : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-green-50 hover:text-green-800')
              }`}
            >
              <MessageSquare size={20} />
              {!collapsed && <span className="ml-3">Messages</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${collapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
        {/* Header */}
        <header className={`flex items-center justify-between px-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm transition-all duration-300 h-16 border-b sticky top-0 z-40`}>
          <div className="flex items-center">
            <button onClick={toggleSidebar} className={`p-2 rounded-full transition-all duration-300 ${
              darkMode 
                ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
            }`}>
              {collapsed ? <Menu size={20} /> : <X size={20} />}
            </button>
            <h1 className="ml-4 text-2xl font-bold">
              {activeSection === 'medical-records' ? 'Medical Records' : 
               activeSection === 'book-appointment' ? 'Find and Book a Doctor' :
               activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'} h-5 w-5 transition-colors duration-300`} />
              <input
                type="text"
                placeholder="Search..."
                className={`pl-10 pr-4 py-2 rounded-full border transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-gray-500' 
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-300'
                } w-64 focus:outline-none`}
              />
            </div>

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

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button 
                onClick={handleNotificationClick}
                className={`p-2 rounded-full relative transition-all duration-300 ${
                  darkMode 
                    ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                    : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                }`}
              >
                <Bell size={20} />
                {unreadNotifications > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className={`absolute right-0 mt-2 w-80 ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                } rounded-lg shadow-lg py-1 z-50 border transition-colors duration-300`}>
                  <div className={`flex justify-between items-center px-4 py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Notifications</h3>
                    {unreadNotifications > 0 && (
                      <button 
                        className={`text-sm ${darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-500'}`}
                        onClick={() => {
                          setNotifications(notifications.map(n => ({ ...n, read: true })));
                        }}
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`px-4 py-3 ${darkMode ? 'hover:bg-gray-700 border-gray-700' : 'hover:bg-gray-50 border-gray-100'} border-b last:border-0`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className="flex items-start">
                          <div className={`flex-shrink-0 ${darkMode ? 'bg-green-900' : 'bg-green-100'} p-2 rounded-full`}>
                            <Bell className={`h-4 w-4 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                          </div>
                          <div className="ml-3">
                            <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{notification.type}</p>
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{notification.message}</p>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
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
                    {patientProfile?.fullName || session?.user?.name || 'Patient'}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {patientProfile?.patientId || 'Loading...'}
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
                <HMenu.Items className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg focus:outline-none ${
                  darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}>
                  <div className="py-1">
                    <HMenu.Item>
                      {({ active }) => (
                        <a
                          href="/dashboard/patient/settings"
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

        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {renderContent()}
        </main>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          setSelectedDoctor(null);
        }}
        doctor={selectedDoctor}
        onSubmit={handleBookingSubmit}
      />
    </div>
  );
}

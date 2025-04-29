'use client';
import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Calendar, Users, FileText, MessageSquare, Video, Bell, Settings, LogOut, User, Menu, X, Search, Sun, Moon, Edit, Trash2 } from 'lucide-react';
import { Menu as HMenu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
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
                          <p className="font-medium">{new Date(appointment.scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          <p className="text-sm text-gray-500">Today</p>
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

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Calendar size={24} className="text-blue-500" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold">{dashboardData.monthlyAppointments}</h2>
                    <p className="text-sm text-gray-500">This Month's Appointments</p>
                  </div>
                </div>
              </div>
              <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Users size={24} className="text-green-500" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold">{dashboardData.totalPatients}</h2>
                    <p className="text-sm text-gray-500">Total Patients</p>
                  </div>
                </div>
              </div>
              <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <MessageSquare size={24} className="text-purple-500" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold">{dashboardData.unreadMessages}</h2>
                    <p className="text-sm text-gray-500">Unread Messages</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Appointments (Next 7 Days) */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-medium mb-4">Upcoming Appointments (Next 7 Days)</h3>
              <div className="space-y-4">
                {upcomingAppointments
                  .filter(appointment => {
                    const appointmentDate = new Date(appointment.scheduledFor);
                    const today = new Date();
                    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                    return appointmentDate > today && appointmentDate <= nextWeek;
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
                      <div className="text-right">
                        <p className="font-medium">{new Date(appointment.scheduledFor).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-500">{new Date(appointment.scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Notifications Feed */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-medium mb-4">Notifications</h3>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} ${
                      !notification.read ? (darkMode ? 'border-l-4 border-blue-500' : 'border-l-4 border-blue-400') : ''
                    }`}
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 ${darkMode ? 'bg-blue-900' : 'bg-blue-100'} p-2 rounded-full`}>
                        <Bell className={`h-4 w-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      </div>
                      <div className="ml-3">
                        <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{notification.title}</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{notification.message}</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
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
              <div className="space-y-4">
                {upcomingAppointments
                  .filter(appointment => {
                    const matchesDate = !appointmentFilters.date || 
                      new Date(appointment.scheduledFor).toDateString() === new Date(appointmentFilters.date).toDateString();
                    const matchesPatient = !appointmentFilters.patient || 
                      appointment.patientName.toLowerCase().includes(appointmentFilters.patient.toLowerCase());
                    const matchesStatus = appointmentFilters.status === 'all' || 
                      appointment.status === appointmentFilters.status;
                    return matchesDate && matchesPatient && matchesStatus;
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
                          <p className="font-medium">{new Date(appointment.scheduledFor).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-500">{new Date(appointment.scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <button 
                          className={`px-4 py-2 rounded ${
                            new Date(appointment.scheduledFor).getTime() - Date.now() <= 600000
                              ? 'bg-green-500 text-white hover:bg-green-600'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                          disabled={new Date(appointment.scheduledFor).getTime() - Date.now() > 600000}
                          onClick={() => handleJoinVideoCall(appointment._id)}
                        >
                          Join Call
                        </button>
                        <button 
                          className="p-2 text-blue-500 hover:text-blue-600"
                          onClick={() => handleViewPatientDetails(appointment.patientId)}
                        >
                          <User size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Past Appointments */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-medium mb-4">Past Appointments</h3>
              <div className="space-y-4">
                {pastAppointments
                  .filter(appointment => {
                    const matchesDate = !appointmentFilters.date || 
                      new Date(appointment.scheduledFor).toDateString() === new Date(appointmentFilters.date).toDateString();
                    const matchesPatient = !appointmentFilters.patient || 
                      appointment.patientName.toLowerCase().includes(appointmentFilters.patient.toLowerCase());
                    const matchesStatus = appointmentFilters.status === 'all' || 
                      appointment.status === appointmentFilters.status;
                    return matchesDate && matchesPatient && matchesStatus;
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
                          <p className="font-medium">{new Date(appointment.scheduledFor).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-500">{new Date(appointment.scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          <p className={`text-sm ${
                            appointment.status === 'completed' ? 'text-green-500' :
                            appointment.status === 'cancelled' ? 'text-red-500' :
                            'text-yellow-500'
                          }`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </p>
                        </div>
                        <button 
                          className="p-2 text-blue-500 hover:text-blue-600"
                          onClick={() => handleViewPatientDetails(appointment.patientId)}
                        >
                          <User size={20} />
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
                    <option value="age">Age</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Patient List */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-medium mb-4">Patient Records</h3>
              <div className="space-y-4">
                {patients
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
                      case 'age': return b.age - a.age;
                      default: return 0;
                    }
                  })
                  .map((patient) => (
                    <div key={patient._id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center justify-between`}>
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {patient.profilePicture ? (
                            <Image 
                              src={patient.profilePicture} 
                              alt={patient.fullName} 
                              width={40} 
                              height={40} 
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <span className="text-gray-500">
                              {patient.fullName?.split(' ').map(n => n[0]).join('') || 'P'}
                            </span>
                          )}
                        </div>
                        <div className="ml-4">
                          <p className="font-medium">{patient.fullName}</p>
                          <p className="text-sm text-gray-500">Age: {patient.age}</p>
                          <p className="text-xs text-gray-400">Last visit: {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'N/A'}</p>
                        </div>
                      </div>
                      <button 
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => handleViewPatientDetails(patient._id)}
                      >
                        View Records
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        );
      case 'medical-records':
        return (
          <div className="space-y-6">
            {/* New Medical Record Form */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-medium mb-4">New Medical Record</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Patient</label>
                  <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                    <option>Select Patient</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Consultation Date</label>
                  <input type="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Diagnosis</label>
                  <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" rows="3"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prescription</label>
                  <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" rows="3"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Treatment Plan</label>
                  <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" rows="3"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
                  <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" rows="3"></textarea>
                </div>
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                  Save Medical Record
                </button>
              </form>
            </div>

            {/* Medical Records List */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Medical Records</h3>
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'} h-5 w-5`} />
                  <input
                    type="text"
                    placeholder="Search records..."
                    className={`pl-10 pr-4 py-2 rounded-full border transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-gray-500' 
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-300'
                    } w-64 focus:outline-none`}
                  />
                </div>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((record) => (
                  <div key={record} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center justify-between`}>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">JD</span>
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">John Doe</p>
                        <p className="text-sm text-gray-500">Diagnosis: Common Cold</p>
                        <p className="text-xs text-gray-400">Consultation Date: 2024-03-15</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-blue-500 hover:text-blue-600">
                        <FileText size={20} />
                      </button>
                      <button className="p-2 text-yellow-500 hover:text-yellow-600">
                        <Edit size={20} />
                      </button>
                      <button className="p-2 text-red-500 hover:text-red-600">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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
                        <span className="text-gray-500">JD</span>
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">John Doe</p>
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
            
            {/* Appointments */}
            <div 
              onClick={() => handleNavigation('appointments')}
              className={`flex items-center p-3 rounded-lg cursor-pointer ${
                activeSection === 'appointments' 
                  ? (darkMode ? 'bg-green-700 text-white' : 'bg-green-50 text-green-800') 
                  : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-green-50 hover:text-green-800')
              }`}
            >
              <Calendar size={20} />
              {!collapsed && <span className="ml-3">Appointments</span>}
            </div>
            
            {/* Patients */}
            <div 
              onClick={() => handleNavigation('patients')}
              className={`flex items-center p-3 rounded-lg cursor-pointer ${
                activeSection === 'patients' 
                  ? (darkMode ? 'bg-green-700 text-white' : 'bg-green-50 text-green-800') 
                  : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-green-50 hover:text-green-800')
              }`}
            >
              <Users size={20} />
              {!collapsed && <span className="ml-3">Patients</span>}
            </div>
            
            {/* Prescriptions */}
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
              {activeSection === 'medical-records' ? 'Medical Records' : activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
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
                onClick={toggleNotifications}
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
                            <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{notification.title}</p>
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
                <HMenu.Items className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg focus:outline-none ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
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

        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

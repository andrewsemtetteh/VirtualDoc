'use client';
import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Calendar, Users, FileText, MessageSquare, Video, Bell, Settings, LogOut, User, Menu, X, Search, Sun, Moon, Stethoscope, Clock, Download, Upload } from 'lucide-react';
import { Menu as HMenu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Image from 'next/image';

export default function PatientDashboard() {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [upcomingAppointments, setUpcomingAppointments] = useState([
    { id: 1, doctor: 'Dr. Sarah Smith', specialty: 'Dermatology', date: 'Today', time: '10:00 AM', type: 'Video' },
    { id: 2, doctor: 'Dr. John Doe', specialty: 'Cardiology', date: 'Tomorrow', time: '2:30 PM', type: 'Voice' }
  ]);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'appointment', message: 'Appointment reminder with Dr. Sarah Smith', time: '5 mins ago', read: false },
    { id: 2, type: 'prescription', message: 'New prescription from Dr. John Doe', time: '1 hour ago', read: false },
    { id: 3, type: 'message', message: 'New message from Dr. Sarah Smith', time: '2 hours ago', read: true }
  ]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    setDarkMode(savedTheme === 'dark');
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

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleNavigation = (section) => {
    setActiveSection(section);
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
            {/* Welcome Banner with Profile Summary */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gradient-to-r from-green-900 to-green-800' : 'bg-gradient-to-r from-green-900 to-green-800'} text-white`}>
              {/* Welcome Section */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold mb-2">Welcome back, John!</h1>
                  <p className="text-green-100">Here's what's happening with your health today</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-green-100">Last Checkup</p>
                    <p className="font-medium">2 weeks ago</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <User size={24} />
                  </div>
                </div>
              </div>

              {/* Profile Summary */}
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-800/50' : 'bg-green-800/50'} backdrop-blur-sm`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-700'} flex items-center justify-center`}>
                      <span className={`text-2xl font-bold ${darkMode ? 'text-gray-300' : 'text-gray-300'}`}>JD</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-white">John Doe</h3>
                      <p className="text-sm text-green-100">Patient ID: #12345</p>
                      <p className="text-sm text-green-100">Member since 2023</p>
                    </div>
                  </div>
                  <div className={`border-l border-r ${darkMode ? 'border-green-700' : 'border-green-700'} px-6`}>
                    <h4 className="text-sm font-medium text-green-100 mb-2">Health Status</h4>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <span className="text-sm text-white">Good</span>
                    </div>
                    <p className="text-sm text-green-100 mt-2">Last updated: Today</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-green-100 mb-2">Next Checkup</h4>
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} className="text-green-300" />
                      <span className="text-sm text-white">June 15, 2024</span>
                    </div>
                    <p className="text-sm text-green-100 mt-2">With Dr. Sarah Smith</p>
                  </div>
                </div>
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
                    <h2 className="text-2xl font-bold">2</h2>
                    <p className="text-sm text-gray-500">Upcoming Appointments</p>
                  </div>
                </div>
              </div>
              <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full">
                    <FileText size={24} className="text-green-500" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold">5</h2>
                    <p className="text-sm text-gray-500">Active Prescriptions</p>
                  </div>
                </div>
              </div>
              <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <MessageSquare size={24} className="text-purple-500" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold">3</h2>
                    <p className="text-sm text-gray-500">Unread Messages</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-medium mb-4">Upcoming Appointments</h3>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center justify-between`}>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">DS</span>
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">{appointment.doctor}</p>
                        <p className="text-sm text-gray-500">{appointment.specialty}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{appointment.time}</p>
                      <p className="text-sm text-gray-500">{appointment.date}</p>
                      <p className="text-sm text-blue-500">{appointment.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Prescriptions */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-medium mb-4">Recent Prescriptions</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((prescription) => (
                  <div key={prescription} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center justify-between`}>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">JD</span>
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">Dr. John Doe</p>
                        <p className="text-sm text-gray-500">Amoxicillin 500mg</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">2 days ago</p>
                      <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                        <Download size={16} className="inline mr-1" />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'find-doctor':
        return (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-medium mb-4">Find a Doctor</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Specialty</label>
                  <select className={`w-full rounded-md border-gray-300 shadow-sm ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}>
                    <option>All Specialties</option>
                    <option>Dermatology</option>
                    <option>Cardiology</option>
                    <option>Pediatrics</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Availability</label>
                  <select className={`w-full rounded-md border-gray-300 shadow-sm ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}>
                    <option>Any Time</option>
                    <option>Today</option>
                    <option>This Week</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Rating</label>
                  <select className={`w-full rounded-md border-gray-300 shadow-sm ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}>
                    <option>All Ratings</option>
                    <option>4+ Stars</option>
                    <option>3+ Stars</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Search</label>
                  <input 
                    type="text" 
                    placeholder="Search doctors..." 
                    className={`w-full rounded-md border-gray-300 shadow-sm ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`} 
                  />
                </div>
              </div>
            </div>

            {/* Doctor List */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="space-y-4">
                {[1, 2, 3].map((doctor) => (
                  <div key={doctor} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center justify-between`}>
                    <div className="flex items-center">
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-xl">DS</span>
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">Dr. Sarah Smith</p>
                        <p className="text-sm text-gray-500">Dermatology</p>
                        <div className="flex items-center mt-1">
                          <span className="text-yellow-500">★★★★★</span>
                          <span className="text-sm text-gray-500 ml-2">(45 reviews)</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Available Today</p>
                      <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                        Book Appointment
                      </button>
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
            {/* Book New Appointment */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-medium mb-4">Book New Appointment</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Select Doctor</label>
                    <select className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}>
                      <option>Dr. Sarah Smith - Dermatology</option>
                      <option>Dr. John Doe - Cardiology</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Appointment Type</label>
                    <select className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}>
                      <option>Video Consultation</option>
                      <option>Voice Consultation</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Date</label>
                    <input 
                      type="date" 
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`} 
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Time</label>
                    <input 
                      type="time" 
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`} 
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Reason for Visit</label>
                  <textarea 
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`} 
                    rows="3"
                  ></textarea>
                </div>
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                  Book Appointment
                </button>
              </form>
            </div>

            {/* Appointment List */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-medium mb-4">Your Appointments</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((appointment) => (
                  <div key={appointment} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center justify-between`}>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">DS</span>
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">Dr. Sarah Smith</p>
                        <p className="text-sm text-gray-500">Dermatology Consultation</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Tomorrow, 2:30 PM</p>
                      <p className="text-sm text-blue-500">Video Call</p>
                      <div className="mt-2 flex space-x-2">
                        <button className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                          Reschedule
                        </button>
                        <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'consultations':
        return (
          <div className="space-y-6">
            {/* Video Call Interface */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-medium mb-4">Video Consultation</h3>
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Video size={48} className="mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-500">Waiting for doctor to join...</p>
                </div>
              </div>
              <div className="mt-4 flex justify-center space-x-4">
                <button className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600">
                  <Video size={24} />
                </button>
                <button className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600">
                  <MessageSquare size={24} />
                </button>
                <button className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600">
                  <Upload size={24} />
                </button>
              </div>
            </div>
          </div>
        );
      case 'medical-records':
        return (
          <div className="space-y-6">
            {/* Medical Records */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-medium mb-4">Medical Records</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((record) => (
                  <div key={record} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Consultation with Dr. Sarah Smith</p>
                        <p className="text-sm text-gray-500">Dermatology - Follow-up</p>
                      </div>
                      <span className="text-sm text-gray-500">2 days ago</span>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm">Diagnosis: Mild eczema</p>
                      <p className="text-sm">Treatment: Topical corticosteroid cream</p>
                      <p className="text-sm">Follow-up: 2 weeks</p>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                        <Download size={16} className="inline mr-1" />
                        Download Report
                      </button>
                      <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                        Share with Doctor
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
            
            {/* Find A Doctor */}
            <div 
              onClick={() => handleNavigation('find-doctor')}
              className={`flex items-center p-3 rounded-lg cursor-pointer ${
                activeSection === 'find-doctor' 
                  ? (darkMode ? 'bg-green-700 text-white' : 'bg-green-50 text-green-800') 
                  : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-green-50 hover:text-green-800')
              }`}
            >
              <Stethoscope size={20} />
              {!collapsed && <span className="ml-3">Find A Doctor</span>}
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
               activeSection === 'find-doctor' ? 'Find A Doctor' :
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
                    <span className={`text-sm font-medium text-white`}>
                      {session?.user?.name ? session.user.name.split(' ').map(n => n[0]).join('') : 'JD'}
                    </span>
                  )}
                </div>
                <div className="text-left hidden md:block">
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    {session?.user?.name || 'John Doe'}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Patient</p>
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
                          href="/dashboard/patient/profile"
                          className={`${
                            active ? (darkMode ? 'bg-gray-700' : 'bg-gray-100') : ''
                          } block px-4 py-2 text-sm rounded-t-lg ${
                            darkMode ? 'text-gray-200' : 'text-gray-700'
                          }`}
                        >
                          <div className="flex items-center">
                            <User className={`h-4 w-4 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            Your Profile
                          </div>
                        </a>
                      )}
                    </HMenu.Item>
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
                        <a
                          href="/logout"
                          className={`${
                            active ? (darkMode ? 'bg-gray-700' : 'bg-red-50') : ''
                          } block px-4 py-2 text-sm text-red-600 rounded-b-lg`}
                        >
                          <div className="flex items-center">
                            <LogOut className={`h-4 w-4 mr-2 ${darkMode ? 'text-red-500' : 'text-red-600'}`} />
                            Sign out
                          </div>
                        </a>
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

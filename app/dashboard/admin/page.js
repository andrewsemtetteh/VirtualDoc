'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  BarChart, Users, Calendar, FileText, 
  Menu, X, Search, Bell, Sun, Moon,
  ChevronDown, LayoutDashboard, ShoppingCart, User, Settings,
  LogOut, UserPlus, UserCheck
} from 'lucide-react';
import { Menu as HMenu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Image from 'next/image';

// Import DoctorVerification component at the top
import DoctorVerification from './components/DoctorVerification';
import Notifications from '@/app/components/Notifications';

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [approvedDoctors, setApprovedDoctors] = useState([]);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [doctorError, setDoctorError] = useState(null);
  const [doctorSearch, setDoctorSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [counts, setCounts] = useState({
    pending: 0,
    rejected: 0
  });
  const doctorsPerPage = 5;
  
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  const [patientStats, setPatientStats] = useState({
    totalPatients: 0,
    newPatientsThisMonth: 0,
    activePatients: 0,
    upcomingAppointments: 0
  });
  const [patients, setPatients] = useState([]);
  const [patientPage, setPatientPage] = useState(1);
  const [patientTotalPages, setPatientTotalPages] = useState(1);
  const [patientStatus, setPatientStatus] = useState('all');
  const [patientSearch, setPatientSearch] = useState('');

  useEffect(() => {
    setMounted(true);
    // Check authentication
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
    // Load theme, section and navbar state from localStorage
    const savedTheme = localStorage.getItem('theme');
    const savedSection = localStorage.getItem('adminSection');
    const savedCollapsed = localStorage.getItem('adminNavCollapsed');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    }
    if (savedSection) {
      setCurrentSection(savedSection);
    }
    if (savedCollapsed) {
      setCollapsed(savedCollapsed === 'true');
    }
  }, [status, router]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme', darkMode ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', darkMode);
    }
  }, [darkMode, mounted]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (currentSection === 'doctors') {
      fetchApprovedDoctors();
      fetchPendingDoctors(selectedStatus);
    }
  }, [currentSection, selectedStatus]);

  useEffect(() => {
    if (currentSection === 'patients') {
      fetchPatientStats();
      fetchPatients();
    }
  }, [currentSection]);

  const fetchApprovedDoctors = async () => {
    try {
      setLoadingDoctors(true);
      const response = await fetch('/api/admin/doctors/approved');
      if (!response.ok) throw new Error('Failed to fetch approved doctors');
      const data = await response.json();
      setApprovedDoctors(data.doctors);
    } catch (err) {
      setDoctorError(err.message);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const fetchPendingDoctors = async (status = 'all') => {
    try {
      setLoadingDoctors(true);
      const response = await fetch(`/api/admin/doctors/pending?status=${status === 'all' ? 'pending' : status}`);
      if (!response.ok) throw new Error('Failed to fetch pending doctors');
      const data = await response.json();
      let filteredDoctors;
      if (status === 'all') {
        // Show both pending and rejected
        filteredDoctors = data.doctors.filter(d => d.status === 'pending' || d.status === 'rejected');
      } else {
        filteredDoctors = data.doctors.filter(d => d.status === status);
      }
      setPendingDoctors(filteredDoctors);
      setCounts({
        pending: data.counts.pending,
        rejected: data.counts.rejected
      });
    } catch (err) {
      setDoctorError(err.message);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const fetchPatientStats = async () => {
    try {
      const response = await fetch('/api/admin/patients/stats');
      if (response.ok) {
        const data = await response.json();
        setPatientStats(data);
      }
    } catch (error) {
      console.error('Error fetching patient stats:', error);
    }
  };

  const fetchPatients = async (page = 1, status = 'all', search = '') => {
    try {
      const response = await fetch(`/api/admin/patients?page=${page}&limit=10&status=${status}&search=${search}`);
      if (response.ok) {
        const data = await response.json();
        setPatients(data.patients);
        setPatientTotalPages(data.totalPages);
        setPatientPage(data.page);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleAction = async (doctorId, action, message = '') => {
    try {
      setActionInProgress(true);
      const response = await fetch(`/api/admin/doctors/${doctorId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: action,
          message: message || undefined
        }),
      });

      if (!response.ok) throw new Error('Action failed');

      // Refresh both lists
      await Promise.all([
        fetchApprovedDoctors(),
        fetchPendingDoctors()
      ]);
      
      // Reset states
      setShowRejectionModal(false);
      setRejectionReason('');
      setSelectedDoctor(null);
    } catch (err) {
      setDoctorError(err.message);
    } finally {
      setActionInProgress(false);
    }
  };

  const openRejectionModal = (doctor) => {
    setSelectedDoctor(doctor);
    setShowRejectionModal(true);
  };

  const notifications = [
    {
      title: "Appointment Reminder",
      message: "Your appointment with Dr. Smith is tomorrow at 2:00 PM",
      time: "2 hours ago"
    },
    {
      title: "New Prescription",
      message: "Dr. Davis has uploaded a new prescription",
      time: "1 day ago"
    }
  ];

  const toggleSidebar = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    localStorage.setItem('adminNavCollapsed', newCollapsed.toString());
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  // Navigation handler
  const handleNavigation = (section) => {
    setCurrentSection(section);
    localStorage.setItem('adminSection', section);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    fetchPendingDoctors(status);
  };

  // Render content based on active section
  const renderContent = () => {
    switch(currentSection) {
      case 'dashboard':
        return (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
              {/* Total Appointments */}
              <div className={`p-4 md:p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 md:p-3 rounded-full">
                    <Calendar size={20} className="text-green-500" />
                  </div>
                  <div className="ml-3 md:ml-4">
                    <h2 className="text-xl md:text-2xl font-bold">254</h2>
                    <p className="text-xs md:text-sm text-gray-500">Total Appointments</p>
                  </div>
                  <div className="ml-auto text-green-500 flex items-center">
                    <span className="text-xs md:text-sm">2.5%</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Total Doctors */}
              <div className={`p-4 md:p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center">
                  <div className="bg-purple-100 p-2 md:p-3 rounded-full">
                    <User size={20} className="text-purple-500" />
                  </div>
                  <div className="ml-3 md:ml-4">
                    <h2 className="text-xl md:text-2xl font-bold">48</h2>
                    <p className="text-xs md:text-sm text-gray-500">Total Doctors</p>
                  </div>
                  <div className="ml-auto text-green-500 flex items-center">
                    <span className="text-xs md:text-sm">1.2%</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Total Patients */}
              <div className={`p-4 md:p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 md:p-3 rounded-full">
                    <Users size={20} className="text-blue-500" />
                  </div>
                  <div className="ml-3 md:ml-4">
                    <h2 className="text-xl md:text-2xl font-bold">1,259</h2>
                    <p className="text-xs md:text-sm text-gray-500">Total Patients</p>
                  </div>
                  <div className="ml-auto text-green-500 flex items-center">
                    <span className="text-xs md:text-sm">4.6%</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Total Medical Records */}
              <div className={`p-4 md:p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 md:p-3 rounded-full">
                    <FileText size={20} className="text-green-500" />
                  </div>
                  <div className="ml-3 md:ml-4">
                    <h2 className="text-xl md:text-2xl font-bold">3,847</h2>
                    <p className="text-xs md:text-sm text-gray-500">Medical Records</p>
                  </div>
                  <div className="ml-auto text-green-500 flex items-center">
                    <span className="text-xs md:text-sm">6.2%</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Activity & Upcoming Appointments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Recent Activity */}
              <div className={`p-4 md:p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className="text-base md:text-lg font-medium mb-4">Recent Activity</h3>
                
                <div className="space-y-3 md:space-y-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className={`p-3 md:p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-start`}>
                      <div className={`p-2 rounded-full ${['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-orange-100'][item % 4]}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 md:h-5 md:w-5 ${['text-blue-500', 'text-green-500', 'text-purple-500', 'text-orange-500'][item % 4]}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          {item % 4 === 0 ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> : 
                          item % 4 === 1 ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /> :
                          item % 4 === 2 ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> :
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />}
                        </svg>
                      </div>
                      <div className="ml-3 md:ml-4">
                        <p className="text-sm md:text-base font-medium">
                          {item % 4 === 0 ? "New prescription issued" : 
                           item % 4 === 1 ? "Patient medical record updated" : 
                           item % 4 === 2 ? "Appointment scheduled" : 
                           "New patient registered"}
                        </p>
                        <p className="text-xs md:text-sm text-gray-500">
                          {item % 4 === 0 ? "Dr. Johnson issued a prescription for Patient #12345" : 
                           item % 4 === 1 ? "Medical record for Sarah Williams has been updated" : 
                           item % 4 === 2 ? "Appointment scheduled for James Brown on April 5, 10:30 AM" : 
                           "Emily Davis completed registration as a new patient"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {item * 10} minutes ago
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Upcoming Appointments */}
              <div className={`p-4 md:p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base md:text-lg font-medium">Upcoming Appointments</h3>
                  <button
                    type="button"
                    className={`px-3 py-1 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                      darkMode 
                        ? 'bg-green-700 hover:bg-green-800 text-white' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    View All
                  </button>
                </div>
                
                <div className="space-y-3 md:space-y-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className={`p-3 md:p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex justify-between`}>
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center`}>
                          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {["JS", "EJ", "MB", "SD"][item % 4]}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm md:text-base font-medium">
                            {["John Smith", "Emma Johnson", "Michael Brown", "Sarah Davis"][item % 4]}
                          </p>
                          <p className="text-xs md:text-sm text-gray-500">
                            {["General Checkup", "Follow-up", "Consultation", "Prescription Renewal"][item % 4]}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-xs md:text-sm">
                            {["09:00 AM", "10:30 AM", "01:15 PM", "03:45 PM"][item % 4]}
                          </span>
                        </div>
                        <div className="flex items-center mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-xs md:text-sm">
                            {["Today", "Tomorrow", "Mar 25", "Mar 26"][item % 4]}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        );
        case 'appointments':
          return (
            <>
              {/* Appointments Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Total Appointments */}
                <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="flex items-center">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Calendar size={24} className="text-green-500" />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-2xl font-bold">324</h2>
                      <p className="text-sm text-gray-500">Total Appointments</p>
                    </div>
                    <div className="ml-auto text-green-500 flex items-center">
                      <span>3.2%</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Confirmed Appointments */}
                <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h2 className="text-2xl font-bold">276</h2>
                      <p className="text-sm text-gray-500">Confirmed</p>
                    </div>
                    <div className="ml-auto text-green-500 flex items-center">
                      <span>2.5%</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Pending Appointments */}
                <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="flex items-center">
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h2 className="text-2xl font-bold">38</h2>
                      <p className="text-sm text-gray-500">Pending</p>
                    </div>
                    <div className="ml-auto text-red-500 flex items-center">
                      <span>-1.2%</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Canceled Appointments */}
                <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="flex items-center">
                    <div className="bg-red-100 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h2 className="text-2xl font-bold">10</h2>
                      <p className="text-sm text-gray-500">Canceled</p>
                    </div>
                    <div className="ml-auto text-gray-500 flex items-center">
                      <span>0%</span>
                    </div>
                  </div>
                </div>
              </div>
        
              {/* Appointments Charts and Lists */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Appointments Distribution */}
                <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium">Appointment Distribution</h3>
                    <select className={`p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                      <option>This Month</option>
                      <option>Last Month</option>
                      <option>This Quarter</option>
                    </select>
                  </div>
                  
                  {/* Placeholder for chart */}
                  <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg relative">
                    {/* Pie Chart Placeholder */}
                    <div className="absolute inset-0 flex justify-center items-center">
                      <div className="w-48 h-48 rounded-full bg-blue-500 opacity-20 absolute"></div>
                      <div className="w-36 h-36 rounded-full bg-green-500 opacity-20 absolute"></div>
                      <div className="w-24 h-24 rounded-full bg-yellow-500 opacity-20 absolute"></div>
                      <div className="w-12 h-12 rounded-full bg-red-500 opacity-20 absolute"></div>
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex justify-center space-x-6 mt-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <span>Confirmed</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span>Completed</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <span>Pending</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span>Canceled</span>
                    </div>
                  </div>
                </div>
                
                {/* Recent Appointments */}
                <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Recent Appointments</h3>
                    <button
                      type="button"
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        darkMode 
                          ? 'bg-green-700 hover:bg-green-800 text-white' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      View All
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex justify-between items-center`}>
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center`}>
                            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {["JS", "EJ", "MB", "SD"][item % 4]}
                            </span>
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">
                              {["John Smith", "Emma Johnson", "Michael Brown", "Sarah Davis"][item % 4]}
                            </p>
                            <p className="text-sm text-gray-500">
                              {["General Checkup", "Follow-up", "Consultation", "Prescription Renewal"][item % 4]}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`px-2 py-1 rounded text-xs ${
                            item % 4 === 0 ? 'bg-green-100 text-green-800' :
                            item % 4 === 1 ? 'bg-blue-100 text-blue-800' :
                            item % 4 === 2 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {["Confirmed", "Completed", "Pending", "Canceled"][item % 4]}
                          </span>
                          <span className="text-sm text-gray-500 mt-1">
                            {["Today", "Yesterday", "Mar 25", "Mar 26"][item % 4]}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          );
          case 'patients':
            return (
              <>
                {/* Patients Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  {/* Total Patients */}
                  <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <Users size={24} className="text-blue-500" />
                      </div>
                      <div className="ml-4">
                        <h2 className="text-2xl font-bold">{patientStats.totalPatients}</h2>
                        <p className="text-sm text-gray-500">Total Patients</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* New Patients This Month */}
                  <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="flex items-center">
                      <div className="bg-green-100 p-3 rounded-full">
                        <UserPlus size={24} className="text-green-500" />
                      </div>
                      <div className="ml-4">
                        <h2 className="text-2xl font-bold">{patientStats.newPatientsThisMonth}</h2>
                        <p className="text-sm text-gray-500">New This Month</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Active Patients */}
                  <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="flex items-center">
                      <div className="bg-purple-100 p-3 rounded-full">
                        <UserCheck size={24} className="text-purple-500" />
                      </div>
                      <div className="ml-4">
                        <h2 className="text-2xl font-bold">{patientStats.activePatients}</h2>
                        <p className="text-sm text-gray-500">Active Patients</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Upcoming Appointments */}
                  <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="flex items-center">
                      <div className="bg-yellow-100 p-3 rounded-full">
                        <Calendar size={24} className="text-yellow-500" />
                      </div>
                      <div className="ml-4">
                        <h2 className="text-2xl font-bold">{patientStats.upcomingAppointments}</h2>
                        <p className="text-sm text-gray-500">Upcoming Appointments</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Patient Records Table */}
                <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'} mb-6`}>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium">Patient Records</h3>
                    <div className="flex items-center">
                      <div className={`flex items-center rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} px-4 py-2 mr-4`}>
                        <Search size={16} className="text-gray-500" />
                        <input 
                          type="text" 
                          placeholder="Search patients" 
                          className={`ml-2 bg-transparent focus:outline-none w-40 ${darkMode ? 'placeholder-gray-400' : 'placeholder-gray-500'}`}
                          value={patientSearch}
                          onChange={(e) => {
                            setPatientSearch(e.target.value);
                            fetchPatients(1, patientStatus, e.target.value);
                          }}
                        />
                      </div>
                      <select 
                        className={`p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
                        value={patientStatus}
                        onChange={(e) => {
                          setPatientStatus(e.target.value);
                          fetchPatients(1, e.target.value, patientSearch);
                        }}
                      >
                        <option value="all">All Patients</option>
                        <option value="active">Active Patients</option>
                        <option value="inactive">Inactive Patients</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                          <th className="py-3 px-3 md:px-6 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                          <th className="py-3 px-3 md:px-6 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="py-3 px-3 md:px-6 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                          <th className="py-3 px-3 md:px-6 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                          <th className="py-3 px-3 md:px-6 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="py-3 px-3 md:px-6 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {patients.map((patient) => (
                          <tr key={patient._id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                            <td className="py-4 px-3 md:px-6">
                              <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center`}>
                                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {patient.fullName?.split(' ').map(n => n[0]).join('') || 'P'}
                                  </span>
                                </div>
                                <span className="ml-3">{patient.fullName}</span>
                              </div>
                            </td>
                            <td className="py-4 px-3 md:px-6 text-sm md:text-base">{patient._id}</td>
                            <td className="py-4 px-3 md:px-6 text-sm md:text-base">{patient.phone}</td>
                            <td className="py-4 px-3 md:px-6 text-sm md:text-base">
                              {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="py-4 px-3 md:px-6">
                              <span className={`px-2 py-1 rounded text-xs ${
                                patient.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {patient.status}
                              </span>
                            </td>
                            <td className="py-4 px-3 md:px-6">
                              <div className="flex space-x-2">
                                <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </button>
                                <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination */}
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-4 md:mt-6 space-y-3 sm:space-y-0">
                    <div className="text-xs md:text-sm text-gray-500">
                      Showing {patients.length > 0 ? (patientPage - 1) * 10 + 1 : 0} to {Math.min(patientPage * 10, patientStats.totalPatients)} of {patientStats.totalPatients} patients
                    </div>
                    <div className="flex space-x-1">
                      <button 
                        className={`px-2 py-1 md:px-3 md:py-1 rounded text-xs md:text-sm ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                        onClick={() => fetchPatients(patientPage - 1, patientStatus, patientSearch)}
                        disabled={patientPage === 1}
                      >
                        Previous
                      </button>
                      {Array.from({ length: patientTotalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          className={`px-2 py-1 md:px-3 md:py-1 rounded text-xs md:text-sm ${
                            page === patientPage
                              ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                              : darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                          onClick={() => fetchPatients(page, patientStatus, patientSearch)}
                        >
                          {page}
                        </button>
                      ))}
                      <button 
                        className={`px-2 py-1 md:px-3 md:py-1 rounded text-xs md:text-sm ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                        onClick={() => fetchPatients(patientPage + 1, patientStatus, patientSearch)}
                        disabled={patientPage === patientTotalPages}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </>
            );
            case 'doctors': {
              // Doctor Directory logic moved here for scope
              const doctorsPerPage = 5;
              const filteredDoctors = approvedDoctors.filter((doctor) => {
                const search = doctorSearch.toLowerCase();
                return (
                  doctor.fullName.toLowerCase().includes(search) ||
                  doctor.email.toLowerCase().includes(search) ||
                  (doctor.specialization || "").toLowerCase().includes(search)
                );
              });
              const totalDoctors = filteredDoctors.length;
              const totalPages = Math.ceil(totalDoctors / doctorsPerPage);
              const paginatedDoctors = filteredDoctors.slice(
                (currentPage - 1) * doctorsPerPage,
                currentPage * doctorsPerPage
              );
              // Calculate average rating for stats area
              const ratings = approvedDoctors.map(d => d.rating).filter(r => typeof r === 'number' && !isNaN(r));
              const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length) : 0;
              return (
                <>
                  {/* Doctors Overview Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    {/* Total Doctors */}
                    <div className={`p-6 rounded-lg ${
                      darkMode 
                        ? 'bg-gray-800 shadow-md' 
                        : 'bg-white shadow-md border border-gray-100 hover:shadow-lg'
                    } transition-all duration-300`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Total Doctors
                          </p>
                          <h3 className="text-2xl font-bold mt-2">{totalDoctors}</h3>
                        </div>
                        <div className={`p-3 rounded-full ${
                          darkMode ? 'bg-blue-900' : 'bg-blue-100'
                        }`}>
                          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    {/* Active Doctors */}
                    <div className={`p-6 rounded-lg ${
                      darkMode 
                        ? 'bg-gray-800 shadow-md' 
                        : 'bg-white shadow-md border border-gray-100 hover:shadow-lg'
                    } transition-all duration-300`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Active Doctors
                          </p>
                          <h3 className="text-2xl font-bold mt-2">
                            {filteredDoctors.filter(d => d.status === 'active').length}
                          </h3>
                        </div>
                        <div className={`p-3 rounded-full ${
                          darkMode ? 'bg-green-900' : 'bg-green-100'
                        }`}>
                          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    {/* Average Rating */}
                    <div className={`p-6 rounded-lg ${
                      darkMode 
                        ? 'bg-gray-800 shadow-md' 
                        : 'bg-white shadow-md border border-gray-100 hover:shadow-lg'
                    } transition-all duration-300`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Average Rating
                          </p>
                          <div className="flex items-center mt-2">
                            <StarRating rating={avgRating} />
                            <span className="ml-2 text-sm">{avgRating.toFixed(1)}/5</span>
                        </div>
                        </div>
                        <div className={`p-3 rounded-full ${
                          darkMode ? 'bg-yellow-900' : 'bg-yellow-100'
                        }`}>
                          <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    {/* Pending Verifications */}
                    <div className={`p-6 rounded-lg ${
                      darkMode 
                        ? 'bg-gray-800 shadow-md' 
                        : 'bg-white shadow-md border border-gray-100 hover:shadow-lg'
                    } transition-all duration-300`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Pending Verifications
                          </p>
                          <h3 className="text-2xl font-bold mt-2">
                            {filteredDoctors.filter(d => d.status === 'pending').length}
                          </h3>
                        </div>
                        <div className={`p-3 rounded-full ${
                          darkMode ? 'bg-purple-900' : 'bg-purple-100'
                        }`}>
                          <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Doctor Directory Table */}
                  <div className={`p-6 rounded-lg ${
                    darkMode 
                      ? 'bg-gray-800 shadow-md' 
                      : 'bg-white shadow-md border border-gray-100 hover:shadow-lg'
                  } transition-all duration-300 mb-8`}>
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="text-lg font-medium">Doctor Directory</h3>
                        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Manage and view all registered doctors
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Search doctors..." 
                            value={doctorSearch}
                            onChange={(e) => setDoctorSearch(e.target.value)}
                            className={`pl-10 pr-4 py-2 rounded-lg text-sm ${
                            darkMode 
                                ? 'bg-gray-700 text-white placeholder-gray-400'
                                : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          />
                          <svg
                            className={`w-5 h-5 absolute left-3 top-2.5 ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                      </div>
                    </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className={`min-w-full divide-y ${
                        darkMode ? 'divide-gray-700' : 'divide-gray-200'
                      }`}>
                        <thead>
                          <tr>
                            <th className={`px-6 py-3 text-left text-xs font-medium ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            } uppercase tracking-wider`}>
                              Doctor
                            </th>
                            <th className={`px-6 py-3 text-left text-xs font-medium ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            } uppercase tracking-wider`}>
                              Specialty
                            </th>
                            <th className={`px-6 py-3 text-left text-xs font-medium ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            } uppercase tracking-wider`}>
                              Status
                            </th>
                            <th className={`px-6 py-3 text-left text-xs font-medium ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            } uppercase tracking-wider`}>
                              Rating
                            </th>
                            <th className={`px-6 py-3 text-left text-xs font-medium ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            } uppercase tracking-wider`}>
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${
                          darkMode ? 'divide-gray-700' : 'divide-gray-200'
                        }`}>
                          {paginatedDoctors.length === 0 ? (
                            <tr>
                              <td colSpan="5" className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No approved doctors found</td>
                            </tr>
                          ) : paginatedDoctors.map((doctor) => (
                            <tr key={doctor._id} className={`${
                              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                              }`}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                    {doctor.profilePicture && doctor.profilePicture !== '' ? (
                                      <img
                                        className="h-10 w-10 rounded-full object-cover"
                                          src={doctor.profilePicture} 
                                          alt={doctor.fullName}
                                        onError={e => { e.target.onerror = null; e.target.src = ''; }}
                                        />
                                      ) : (
                                      // Default SVG icon
                                      <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                        <circle cx="12" cy="8" r="4" />
                                        <path d="M4 20c0-4 8-4 8-4s8 0 8 4v1H4v-1z" />
                                      </svg>
                                      )}
                                    </div>
                                    <div className="ml-4">
                                    <div className={`text-sm font-medium ${
                                      darkMode ? 'text-white' : 'text-gray-900'
                                    }`}>
                                      {doctor.fullName}
                                    </div>
                                    <div className={`text-sm ${
                                      darkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                      {doctor.email}
                                    </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                <div className={`text-sm ${
                                  darkMode ? 'text-gray-300' : 'text-gray-900'
                                }`}>
                                  {doctor.specialization}
                                </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  doctor.status === 'active'
                                    ? darkMode
                                      ? 'bg-green-900 text-green-200'
                                      : 'bg-green-100 text-green-800'
                                    : doctor.status === 'on leave'
                                      ? darkMode
                                        ? 'bg-yellow-900 text-yellow-200'
                                        : 'bg-yellow-100 text-yellow-800'
                                      : darkMode
                                        ? 'bg-gray-700 text-gray-300'
                                        : 'bg-gray-200 text-gray-800'
                                }`}>
                                  {doctor.status === 'active' ? 'Active' : doctor.status === 'on leave' ? 'On Leave' : 'Inactive'}
                                </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                  <StarRating rating={doctor.rating || 0} />
                                  <span className={`ml-2 text-sm ${
                                    darkMode ? 'text-gray-400' : 'text-gray-500'
                                  }`}>
                                    ({doctor.ratingCount || 0} patients)
                                  </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex space-x-2">
                                  <button
                                    className={`mr-2 ${
                                      darkMode 
                                        ? 'text-blue-400 hover:text-blue-300'
                                        : 'text-blue-600 hover:text-blue-900'
                                    }`}
                                  >
                                      View
                                    </button>
                                  <button
                                    className={`${
                                      darkMode
                                        ? 'text-red-400 hover:text-red-300'
                                        : 'text-red-600 hover:text-red-900'
                                    }`}
                                  >
                                    Suspend
                                  </button>
                                  </div>
                                </td>
                              </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                      {/* Pagination */}
                    <div className="flex items-center justify-between mt-6">
                      <div className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                          {totalDoctors === 0 ? (
                            'No doctors to show'
                          ) : (
                          `Showing ${((currentPage - 1) * doctorsPerPage) + 1} to ${Math.min(currentPage * doctorsPerPage, totalDoctors)} of ${totalDoctors} doctors`
                          )}
                        </div>
                        <div className="flex space-x-1">
                          <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                          className={`px-2 py-1 md:px-3 md:py-1 rounded text-xs md:text-sm ${
                            darkMode
                              ? 'bg-gray-700 hover:bg-gray-600'
                              : 'bg-gray-200 hover:bg-gray-300'
                          } ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            Previous
                          </button>
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-2 py-1 md:px-3 md:py-1 rounded text-xs md:text-sm ${
                                page === currentPage
                                  ? darkMode
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-blue-500 text-white'
                                  : darkMode
                                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                          <button
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages || totalDoctors === 0}
                          className={`px-2 py-1 md:px-3 md:py-1 rounded text-xs md:text-sm ${
                            darkMode
                              ? 'bg-gray-700 hover:bg-gray-600'
                              : 'bg-gray-200 hover:bg-gray-300'
                          } ${(currentPage === totalPages || totalDoctors === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            Next
                          </button>
                        </div>
                    </div>
                  </div>

                  {/* Doctor Verification Requests Table */}
                  <div className={`p-6 rounded-lg ${
                    darkMode 
                      ? 'bg-gray-800 shadow-md' 
                      : 'bg-white shadow-md border border-gray-100 hover:shadow-lg'
                  } transition-all duration-300`}>
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="text-lg font-medium">Doctor Verification Requests</h3>
                        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Review and manage doctor verification requests
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex space-x-2">
                          {[
                            { value: 'all', label: 'All', color: 'gray' },
                            { value: 'pending', label: 'Pending', color: 'yellow' },
                            { value: 'rejected', label: 'Rejected', color: 'red' }
                          ].map(({ value, label, color }) => (
                            <button
                              key={value}
                              onClick={() => handleStatusChange(value)}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
                                selectedStatus === value
                                  ? darkMode
                                    ? `bg-${color}-700 text-white`
                                    : `bg-${color}-100 text-${color}-800`
                                  : darkMode
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {label}
                              {value !== 'all' && counts[value] > 0 && ` (${counts[value]})`}
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>

                    <div className="overflow-x-auto">
                      {pendingDoctors.length === 0 ? (
                        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <p className="text-lg font-medium">No doctors found</p>
                          <p className="text-sm mt-2">
                            There are no {selectedStatus} doctor verification requests.
                          </p>
                        </div>
                      ) : (
                        <table className={`min-w-full divide-y ${
                          darkMode ? 'divide-gray-700' : 'divide-gray-200'
                        }`}>
                          <thead>
                            <tr>
                              <th className={`px-6 py-3 text-left text-xs font-medium ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              } uppercase tracking-wider`}>
                                Doctor
                              </th>
                              <th className={`px-6 py-3 text-left text-xs font-medium ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              } uppercase tracking-wider`}>
                                Specialty
                              </th>
                              <th className={`px-6 py-3 text-left text-xs font-medium ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              } uppercase tracking-wider`}>
                                Documents
                              </th>
                              <th className={`px-6 py-3 text-left text-xs font-medium ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              } uppercase tracking-wider`}>
                                Status
                              </th>
                              <th className={`px-6 py-3 text-left text-xs font-medium ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              } uppercase tracking-wider`}>
                                Submitted
                              </th>
                              <th className={`px-6 py-3 text-left text-xs font-medium ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              } uppercase tracking-wider`}>
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className={`divide-y ${
                            darkMode ? 'divide-gray-700' : 'divide-gray-200'
                          }`}>
                            {pendingDoctors.map((doctor) => (
                              <tr key={doctor._id} className={`${
                                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                              }`}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                      <img
                                        className="h-10 w-10 rounded-full object-cover"
                                        src={doctor.profilePicture && doctor.profilePicture !== '' ? doctor.profilePicture : '/default-avatar.png'}
                                        alt={doctor.fullName}
                                        onError={e => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }}
                                      />
                                    </div>
                                    <div className="ml-4">
                                      <div className={`text-sm font-medium ${
                                        darkMode ? 'text-white' : 'text-gray-900'
                                      }`}>
                                        {doctor.fullName}
                                      </div>
                                      <div className={`text-sm ${
                                        darkMode ? 'text-gray-400' : 'text-gray-500'
                                      }`}>
                                        {doctor.email}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className={`text-sm ${
                                    darkMode ? 'text-gray-300' : 'text-gray-900'
                                  }`}>
                                    {doctor.specialization}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex flex-wrap gap-1">
                                    {doctor.licenseNumber && (
                                      <span className={`px-2 py-1 text-xs rounded-full ${
                                        darkMode 
                                          ? 'bg-gray-700 text-gray-300' 
                                          : 'bg-gray-100 text-gray-600'
                                      }`}>
                                        License #{doctor.licenseNumber}
                                      </span>
                                    )}
                                    {doctor.licenseDocument && (
                                      <span className={`px-2 py-1 text-xs rounded-full ${
                                        darkMode 
                                          ? 'bg-gray-700 text-gray-300' 
                                          : 'bg-gray-100 text-gray-600'
                                      }`}>
                                        License Document
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    doctor.status === 'pending'
                                      ? darkMode
                                        ? 'bg-yellow-900 text-yellow-200'
                                        : 'bg-yellow-100 text-yellow-800'
                                      : darkMode
                                        ? 'bg-red-900 text-red-200'
                                        : 'bg-red-100 text-red-800'
                                  }`}>
                                    {doctor.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  {new Date(doctor.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex space-x-2">
                                    {doctor.status === 'pending' && (
                                      <>
                                        <button
                                          type="button"
                                          className={`px-3 py-1 rounded-lg font-medium transition-all duration-300 ${
                                            darkMode 
                                              ? 'bg-green-700 hover:bg-green-800 text-white' 
                                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                                          }`}
                                          onClick={() => handleAction(doctor._id, 'approved')}
                                        >
                                          Approve
                                        </button>
                                        <button
                                          type="button"
                                          className={`px-3 py-1 rounded-lg font-medium transition-all duration-300 ${
                                            darkMode 
                                              ? 'bg-red-700 hover:bg-red-800 text-white' 
                                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                                          }`}
                                          onClick={() => openRejectionModal(doctor)}
                                        >
                                          Reject
                                        </button>
                                      </>
                                    )}
                                    <button
                                      type="button"
                                      className={`px-3 py-1 rounded-lg font-medium transition-all duration-300 ${
                                        darkMode 
                                          ? 'bg-yellow-700 hover:bg-yellow-800 text-white' 
                                          : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                      }`}
                                    >
                                      Request Info
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </>
              );
            }
            case 'medical-records':
              return (
                <>
                  {/* Medical Records Overview Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    {/* Total Records */}
                    <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-3 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h2 className="text-2xl font-bold">3,847</h2>
                          <p className="text-sm text-gray-500">Total Records</p>
                        </div>
                        <div className="ml-auto text-green-500 flex items-center">
                          <span>6.2%</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* New Records */}
                    <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <div className="flex items-center">
                        <div className="bg-green-100 p-3 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h2 className="text-2xl font-bold">142</h2>
                          <p className="text-sm text-gray-500">Added this month</p>
                        </div>
                        <div className="ml-auto text-green-500 flex items-center">
                          <span>8.7%</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* Pending Updates */}
                    <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <div className="flex items-center">
                        <div className="bg-yellow-100 p-3 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h2 className="text-2xl font-bold">28</h2>
                          <p className="text-sm text-gray-500">Pending Updates</p>
                        </div>
                        <div className="ml-auto text-red-500 flex items-center">
                          <span>3.5%</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* Digital Records */}
                    <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <div className="flex items-center">
                        <div className="bg-purple-100 p-3 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h2 className="text-2xl font-bold">92%</h2>
                          <p className="text-sm text-gray-500">Digital Records</p>
                        </div>
                        <div className="ml-auto text-green-500 flex items-center">
                          <span>2.1%</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
            
                  {/* Record Categories and Recent Updates */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Record Categories */}
                    <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <div className="flex justify-between items-center mb-6">

                        
                        <h3 className="text-lg font-medium">Record Categories</h3>
                        <select className={`p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                          <option>All Time</option>
                          <option>This Year</option>
                          <option>This Month</option>
                        </select>
                      </div>
                      
                      {/* Pie Chart Placeholder */}
                      <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg flex items-center justify-center relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-40 h-40 rounded-full border-8 border-blue-400 relative">
                            <div className="absolute top-0 right-0 w-1/2 h-full rounded-r-full border-t-8 border-r-8 border-b-8 border-green-400" style={{transform: 'rotate(45deg)', transformOrigin: '0 50%'}}></div>
                            <div className="absolute top-0 left-0 w-1/2 h-1/2 rounded-tl-full border-t-8 border-l-8 border-yellow-400" style={{transform: 'rotate(-45deg)', transformOrigin: '100% 100%'}}></div>
                            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 rounded-bl-full border-b-8 border-l-8 border-red-400" style={{transform: 'rotate(-45deg)', transformOrigin: '100% 0%'}}></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Legend */}
                      <div className="flex flex-wrap justify-center space-x-4 mt-4">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                          <span>Consultations (35%)</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                          <span>Lab Results (25%)</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                          <span>Prescriptions (20%)</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                          <span>Imaging (20%)</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Recently Updated Records */}
                    <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Recently Updated Records</h3>
                        <button
                          type="button"
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            darkMode 
                              ? 'bg-green-700 hover:bg-green-800 text-white' 
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          View All
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        {[1, 2, 3, 4].map((item) => (
                          <div key={item} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex justify-between items-center`}>
                            <div className="flex items-center">
                              <div className={`p-2 rounded-full ${
                                ["bg-blue-100", "bg-green-100", "bg-yellow-100", "bg-red-100"][item % 4]
                              }`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${
                                  ["text-blue-500", "text-green-500", "text-yellow-500", "text-red-500"][item % 4]
                                }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  {[
                                    <path key="1" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
                                    <path key="2" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-2.38.12l-.1.025a6 6 0 01-2.38.12l-2.387-.477a2 2 0 00-1.022.547m3.125.375a7.416 7.416 0 00-3.898 0" />,
                                    <path key="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />,
                                    <path key="4" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                  ][item % 4]}
                                </svg>
                              </div>
                              <div className="ml-3">
                                <p className="font-medium">
                                  {["Annual Check-up", "Blood Work Results", "Prescription Renewal", "Vaccination Record"][item % 4]}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {["Jessica Williams", "Thomas Anderson", "Sarah Martinez", "David Thompson"][item % 4]}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-sm text-gray-500">
                                {["MR-10845", "MR-10723", "MR-10692", "MR-10654"][item % 4]}
                              </span>
                              <span className="text-xs text-gray-400 mt-1">
                                Updated {["Today", "Yesterday", "2 days ago", "3 days ago"][item % 4]}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Medical Records Table */}
                  <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'} mb-6`}>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-medium">Medical Records</h3>
                      <div className="flex items-center">
                        <div className={`flex items-center rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} px-4 py-2 mr-4`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <input 
                            type="text" 
                            placeholder="Search records" 
                            className={`ml-2 bg-transparent focus:outline-none w-40 ${darkMode ? 'placeholder-gray-400' : 'placeholder-gray-500'}`}
                          />
                        </div>
                        <select className={`p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} mr-2`}>
                          <option>All Records</option>
                          <option>Consultations</option>
                          <option>Lab Results</option>
                          <option>Prescriptions</option>
                          <option>Imaging</option>
                        </select>
                        <select className={`p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                          <option>Last 30 Days</option>
                          <option>Last 90 Days</option>
                          <option>Last Year</option>
                          <option>All Time</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Table */}
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <th className="py-3 text-left">Record ID</th>
                            <th className="py-3 text-left">Patient</th>
                            <th className="py-3 text-left">Record Type</th>
                            <th className="py-3 text-left">Created</th>
                            <th className="py-3 text-left">Updated</th>
                            <th className="py-3 text-left">Provider</th>
                            <th className="py-3 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {[
                            {
                              id: "MR-10845",
                              patient: "Jessica Williams",
                              type: "Annual Check-up",
                              created: "Mar 26, 2025",
                              updated: "Mar 30, 2025",
                              provider: "Dr. Alan Roberts"
                            },
                            {
                              id: "MR-10723",
                              patient: "Thomas Anderson",
                              type: "Blood Work Results",
                              created: "Mar 15, 2025",
                              updated: "Mar 28, 2025",
                              provider: "Dr. Sarah Chen"
                            },
                            {
                              id: "MR-10692",
                              patient: "Sarah Martinez",
                              type: "Prescription Renewal",
                              created: "Mar 20, 2025",
                              updated: "Mar 27, 2025",
                              provider: "Dr. Michael Johnson"
                            },
                            {
                              id: "MR-10654",
                              patient: "David Thompson",
                              type: "Vaccination Record",
                              created: "Mar 18, 2025",
                              updated: "Mar 25, 2025",
                              provider: "Dr. Emily Wilson"
                            },
                            {
                              id: "MR-10612",
                              patient: "Jennifer Clark",
                              type: "X-Ray Results",
                              created: "Mar 10, 2025",
                              updated: "Mar 22, 2025",
                              provider: "Dr. Alan Roberts"
                            },
                          ].map((record, index) => (
                            <tr key={index} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                              <td className="py-4 font-medium">{record.id}</td>
                              <td className="py-4">
                                <div className="flex items-center">
                                  <div className={`w-8 h-8 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center`}>
                                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                      {record.patient.split(' ').map(n => n[0]).join('')}
                                    </span>
                                  </div>
                                  <span className="ml-3">{record.patient}</span>
                                </div>
                              </td>
                              <td className="py-4">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  record.type.includes('Check-up') ? 'bg-blue-100 text-blue-800' : 
                                  record.type.includes('Blood') ? 'bg-green-100 text-green-800' : 
                                  record.type.includes('Prescription') ? 'bg-yellow-100 text-yellow-800' : 
                                  record.type.includes('Vaccination') ? 'bg-purple-100 text-purple-800' : 
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {record.type}
                                </span>
                              </td>
                              <td className="py-4">{record.created}</td>
                              <td className="py-4">{record.updated}</td>
                              <td className="py-4">{record.provider}</td>
                              <td className="py-4">
                                <div className="flex space-x-2">
                                  <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                  </button>
                                  <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                  </button>
                                  <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-6">
                      <div className="text-sm text-gray-500">
                        Showing 1 to 5 of 238 records
                      </div>
                      <div className="flex space-x-1">
                        <button className={`px-3 py-1 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}>
                          Previous
                        </button>
                        <button className={`px-3 py-1 rounded ${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`}>
                          1
                        </button>
                        <button className={`px-3 py-1 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}>
                          2
                        </button>
                        <button className={`px-3 py-1 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}>
                          3
                        </button>
                        <button className={`px-3 py-1 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}>
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              );
      default:
        return null;
    }
  };

  // Add logout handler
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
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
                currentSection === 'dashboard' 
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
                currentSection === 'appointments' 
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
                currentSection === 'patients' 
                  ? (darkMode ? 'bg-green-700 text-white' : 'bg-green-50 text-green-800') 
                  : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-green-50 hover:text-green-800')
              }`}
            >
              <Users size={20} />
              {!collapsed && <span className="ml-3">Patients</span>}
            </div>
            
            {/* Doctors */}
            <div 
              onClick={() => handleNavigation('doctors')}
              className={`flex items-center p-3 rounded-lg cursor-pointer ${
                currentSection === 'doctors' 
                  ? (darkMode ? 'bg-green-700 text-white' : 'bg-green-50 text-green-800') 
                  : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-green-50 hover:text-green-800')
              }`}
            >
              <User size={20} />
              {!collapsed && <span className="ml-3">Doctors</span>}
            </div>
            
            {/* Medical Records */}
            <div 
              onClick={() => handleNavigation('medical-records')}
              className={`flex items-center p-3 rounded-lg cursor-pointer ${
                currentSection === 'medical-records' 
                  ? (darkMode ? 'bg-green-700 text-white' : 'bg-green-50 text-green-800') 
                  : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-green-50 hover:text-green-800')
              }`}
            >
              <FileText size={20} />
              {!collapsed && <span className="ml-3">Medical Records</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden ${collapsed ? 'ml-20' : 'ml-64'}`}>
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
              {currentSection === 'medical-records' ? 'Medical Records' : currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
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
            
            <div className="relative" ref={notificationsRef}>
              <Notifications darkMode={darkMode} />
            </div>
            
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
                    {session?.user?.name || 'Andrew Sem Tetteh'}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Administrator</p>
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
                          href="/dashboard/admin/profile"
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
                          href="/dashboard/admin/settings"
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
                          onClick={handleLogout}
                          className={`w-full text-left ${
                            active ? (darkMode ? 'bg-gray-700' : 'bg-red-50') : ''
                          } block px-4 py-2 text-sm text-red-600 rounded-b-lg`}
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
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} max-w-md w-full mx-4`}>
            <h3 className="text-lg font-medium mb-4">Reject Doctor Application</h3>
            <p className="text-sm text-gray-500 mb-4">
              Please provide a reason for rejecting {selectedDoctor?.fullName}'s application
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className={`w-full p-2 rounded border mb-4 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
              rows="4"
              placeholder="Enter rejection reason..."
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowRejectionModal(false)}
                className={`px-4 py-2 rounded ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction(selectedDoctor._id, 'rejected', rejectionReason)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                disabled={!rejectionReason.trim()}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Add StarRating component at the bottom
function StarRating({ rating }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  return (
    <span className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {hasHalfStar && (
        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="#facc15" />
              <stop offset="50%" stopColor="#d1d5db" />
            </linearGradient>
          </defs>
          <path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}
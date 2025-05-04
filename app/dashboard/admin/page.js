'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  BarChart, Users, Calendar, FileText, 
  Menu, X, Search, Bell, Sun, Moon,
  ChevronDown, LayoutDashboard, ShoppingCart, User, Settings,
  LogOut, UserPlus, UserCheck, Clock, CheckCircle
} from 'lucide-react';
import { Menu as HMenu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

// Import DoctorVerification component at the top
import DoctorVerification from './components/DoctorVerification';
import Notifications from '@/app/components/Notifications';

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [approvedDoctors, setApprovedDoctors] = useState([]);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [doctorError, setDoctorError] = useState(null);
  const [doctorSearch, setDoctorSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [counts, setCounts] = useState({
    pending: 0,
    rejected: 0,
    total: 0
  });
  const [avgRating, setAvgRating] = useState(0);
  const doctorsPerPage = 10;
  
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
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [appointmentStats, setAppointmentStats] = useState({
    totalAppointments: 0,
    totalPrescriptions: 0,
    completedAppointments: 0,
    approvedAppointments: 0
  });

  useEffect(() => {
    setMounted(true);
    // Check authentication
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
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
    fetchApprovedDoctors();
    fetchPendingDoctors();
  }, []);

  useEffect(() => {
    fetchPatientStats();
    fetchPatients(patientPage, patientStatus, patientSearch);
  }, [patientPage, patientStatus, patientSearch]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/admin/notifications');
        if (response.ok) {
          const data = await response.json();
          setNotifications(data.notifications);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    if (approvedDoctors.length > 0) {
      const totalRating = approvedDoctors.reduce((sum, doctor) => sum + (doctor.rating || 0), 0);
      const average = totalRating / approvedDoctors.length;
      setAvgRating(average);
    }
  }, [approvedDoctors]);

  useEffect(() => {
    const fetchAppointmentStats = async () => {
      try {
        const response = await fetch('/api/admin/appointments/stats');
        if (response.ok) {
          const data = await response.json();
          setAppointmentStats({
            totalAppointments: data.totalAppointments,
            totalPrescriptions: data.totalPrescriptions,
            completedAppointments: data.completedAppointments,
            approvedAppointments: data.approvedAppointments
          });
        }
      } catch (error) {
        console.error('Error fetching appointment stats:', error);
      }
    };

    fetchAppointmentStats();
  }, []);

  const fetchApprovedDoctors = async () => {
    try {
      setLoadingDoctors(true);
      const response = await fetch(`/api/admin/doctors/approved?page=${currentPage}&limit=${doctorsPerPage}&search=${doctorSearch}`);
      if (!response.ok) throw new Error('Failed to fetch approved doctors');
      const data = await response.json();
      setApprovedDoctors(data.doctors);
      setTotalPages(data.totalPages);
    } catch (err) {
      setDoctorError(err.message);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const fetchPendingDoctors = async (status = 'all') => {
    try {
      setLoadingDoctors(true);
      const response = await fetch('/api/admin/doctors/pending');
      if (!response.ok) throw new Error('Failed to fetch pending doctors');
      const data = await response.json();
      
      // Update pending doctors list
      const pendingDocs = data.doctors.filter(d => d.status === 'pending');
      const rejectedDocs = data.doctors.filter(d => d.status === 'rejected');
      
      setPendingDoctors(status === 'all' ? [...pendingDocs, ...rejectedDocs] : 
                        status === 'pending' ? pendingDocs : rejectedDocs);

      // Update counts
      setCounts({
        pending: pendingDocs.length,
        rejected: rejectedDocs.length,
        total: data.doctors.length
      });
    } catch (err) {
      setDoctorError(err.message);
      console.error('Error fetching pending doctors:', err);
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
      setLoadingPatients(true);
      const response = await fetch(`/api/admin/patients?page=${page}&limit=10&status=${status}&search=${search}`);
      if (response.ok) {
        const data = await response.json();
        setPatients(data.patients);
        setPatientTotalPages(data.totalPages);
        setPatientPage(page);
        setPatientStatus(status);
        setPatientSearch(search);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoadingPatients(false);
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
          status: action === 'approve' ? 'active' : action,
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

      // Show success message
      toast.success(
        action === 'approve' 
          ? 'Doctor approved successfully' 
          : 'Doctor rejected and removed from the system'
      );
    } catch (err) {
      setDoctorError(err.message);
      toast.error('Failed to process doctor request');
    } finally {
      setActionInProgress(false);
    }
  };

  const handleViewPatient = (patientId) => {
    router.push(`/dashboard/admin/patients/${patientId}`);
  };

  const handleSuspendPatient = async (patientId, reason) => {
    try {
      const response = await fetch(`/api/admin/patients/${patientId}/suspend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) throw new Error('Failed to suspend patient');

      // Refresh patient list
      await fetchPatients(patientPage, patientStatus, patientSearch);
      setShowSuspendModal(false);
      setSuspensionReason('');
      setSelectedPatient(null);
    } catch (error) {
      console.error('Error suspending patient:', error);
    }
  };

  const openSuspendModal = (patient) => {
    setSelectedPatient(patient);
    setShowSuspendModal(true);
  };

  const openRejectionModal = (doctor) => {
    setSelectedDoctor(doctor);
    setShowRejectionModal(true);
  };

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
    setNotificationsOpen(!notificationsOpen);
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
  const renderContent = (section) => {
    switch(section) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
              </div>
            </div>
          </div>
        );

      case 'appointments':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              </div>
            </div>
            
            {/* Confirmed Appointments */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold">276</h2>
                  <p className="text-sm text-gray-500">Confirmed</p>
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
              </div>
            </div>
          </div>
        );

      case 'patients':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Patients</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Patients */}
              <div className={`p-6 rounded-lg ${
                darkMode 
                  ? 'bg-gray-800 shadow-md' 
                  : 'bg-white shadow-md border border-gray-100 hover:shadow-lg'
              } transition-all duration-300`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Total Patients
                    </p>
                    <h3 className="text-2xl font-bold mt-2">{patientStats.totalPatients}</h3>
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      Registered patients
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${
                    darkMode ? 'bg-purple-900' : 'bg-purple-100'
                  }`}>
                    <Users className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
              </div>
              
              {/* New Patients */}
              <div className={`p-6 rounded-lg ${
                darkMode 
                  ? 'bg-gray-800 shadow-md' 
                  : 'bg-white shadow-md border border-gray-100 hover:shadow-lg'
              } transition-all duration-300`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      New This Month
                    </p>
                    <h3 className="text-2xl font-bold mt-2">{patientStats.newPatientsThisMonth}</h3>
                  </div>
                  <div className={`p-3 rounded-full ${
                    darkMode ? 'bg-green-900' : 'bg-green-100'
                  }`}>
                    <UserPlus className="w-6 h-6 text-green-500" />
                  </div>
                </div>
              </div>
              
              {/* Active Patients */}
              <div className={`p-6 rounded-lg ${
                darkMode 
                  ? 'bg-gray-800 shadow-md' 
                  : 'bg-white shadow-md border border-gray-100 hover:shadow-lg'
              } transition-all duration-300`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Active Patients
                    </p>
                    <h3 className="text-2xl font-bold mt-2">{patientStats.activePatients}</h3>
                  </div>
                  <div className={`p-3 rounded-full ${
                    darkMode ? 'bg-purple-900' : 'bg-purple-100'
                  }`}>
                    <UserCheck className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
              </div>
              
              {/* Upcoming Appointments */}
              <div className={`p-6 rounded-lg ${
                darkMode 
                  ? 'bg-gray-800 shadow-md' 
                  : 'bg-white shadow-md border border-gray-100 hover:shadow-lg'
              } transition-all duration-300`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Upcoming Appointments
                    </p>
                    <h3 className="text-2xl font-bold mt-2">{patientStats.upcomingAppointments}</h3>
                  </div>
                  <div className={`p-3 rounded-full ${
                    darkMode ? 'bg-yellow-900' : 'bg-yellow-100'
                  }`}>
                    <Calendar className="w-6 h-6 text-yellow-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Patients Table */}
            <div className={`rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden`}>
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Patient List</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {patients.map((patient) => (
                      <tr key={patient._id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {patient.profilePicture ? (
                                <Image
                                  src={patient.profilePicture}
                                  alt={patient.fullName}
                                  width={40}
                                  height={40}
                                  className="rounded-full"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <User className="h-6 w-6 text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium">{patient.fullName}</div>
                              <div className="text-sm text-gray-500">{patient.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">{patient.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            patient.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {patient.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'Never'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleViewPatient(patient._id)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            View
                          </button>
                          <button
                            onClick={() => openSuspendModal(patient)}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            Suspend
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'doctors':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Doctors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    <h3 className="text-2xl font-bold mt-2">{approvedDoctors.length}</h3>
                  </div>
                  <div className={`p-3 rounded-full ${
                    darkMode ? 'bg-blue-900' : 'bg-blue-100'
                  }`}>
                    <User className="w-6 h-6 text-blue-500" />
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
                      {approvedDoctors.filter(d => d.status === 'active').length}
                    </h3>
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      Currently practicing
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${
                    darkMode ? 'bg-green-900' : 'bg-green-100'
                  }`}>
                    <UserCheck className="w-6 h-6 text-green-500" />
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
                      {pendingDoctors.filter(d => d.status === 'pending').length}
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

            {/* Doctors Table */}
            <div className={`rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden`}>
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Doctor List</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {approvedDoctors.map((doctor) => (
                      <tr key={doctor._id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {doctor.profilePicture ? (
                                <Image
                                  src={doctor.profilePicture}
                                  alt={doctor.fullName}
                                  width={40}
                                  height={40}
                                  className="rounded-full"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <User className="h-6 w-6 text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium">{doctor.fullName}</div>
                              <div className="text-sm text-gray-500">{doctor.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium">{doctor.specialization || 'Not specified'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            doctor.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {doctor.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleAction(doctor._id, 'suspend')}
                            className="text-yellow-600 hover:text-yellow-900 mr-3"
                          >
                            Suspend
                          </button>
                          <button
                            onClick={() => handleAction(doctor._id, 'activate')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Activate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Doctor Requests Table */}
            <div className={`rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden mt-8`}>
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Doctor Requests</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {pendingDoctors.map((doctor) => (
                      <tr key={doctor._id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {doctor.profilePicture ? (
                                <Image
                                  src={doctor.profilePicture}
                                  alt={doctor.fullName}
                                  width={40}
                                  height={40}
                                  className="rounded-full"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <User className="h-6 w-6 text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium">{doctor.fullName}</div>
                              <div className="text-sm text-gray-500">{doctor.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium">{doctor.specialization || 'Not specified'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            doctor.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {doctor.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            {new Date(doctor.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleAction(doctor._id, 'approve')}
                            className="text-green-600 hover:text-green-900 mr-3"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => openRejectionModal(doctor)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'medical-records':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!mounted) return null;

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-green-50 to-gray-100 text-gray-900'} transition-all duration-300`}>
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
            <button 
              onClick={() => setDarkMode(!darkMode)} 
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
                        <button
                          onClick={() => signOut()}
                          className={`${
                            active ? (darkMode ? 'bg-gray-700' : 'bg-gray-100') : ''
                          } block w-full text-left px-4 py-2 text-sm ${
                            darkMode ? 'text-gray-200' : 'text-gray-700'
                          }`}
                        >
                          <div className="flex items-center">
                            <LogOut className={`h-4 w-4 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            Sign Out
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
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Dashboard Overview Section */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Dashboard Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Prescriptions */}
              <div className={`p-6 rounded-lg ${
                darkMode 
                  ? 'bg-gray-800 shadow-md' 
                  : 'bg-white shadow-md border border-gray-100 hover:shadow-lg'
              } transition-all duration-300`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Total Prescriptions
                    </p>
                    <h3 className="text-2xl font-bold mt-2">{appointmentStats.totalPrescriptions}</h3>
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      Issued by doctors
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${
                    darkMode ? 'bg-blue-900' : 'bg-blue-100'
                  }`}>
                    <FileText className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              </div>
              
              {/* Approved Appointments */}
              <div className={`p-6 rounded-lg ${
                darkMode 
                  ? 'bg-gray-800 shadow-md' 
                  : 'bg-white shadow-md border border-gray-100 hover:shadow-lg'
              } transition-all duration-300`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Approved Appointments
                    </p>
                    <h3 className="text-2xl font-bold mt-2">{appointmentStats.approvedAppointments}</h3>
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      Approved by doctors
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${
                    darkMode ? 'bg-green-900' : 'bg-green-100'
                  }`}>
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                </div>
              </div>
              
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
                    <h3 className="text-2xl font-bold mt-2">{approvedDoctors.length}</h3>
                  </div>
                  <div className={`p-3 rounded-full ${
                    darkMode ? 'bg-purple-900' : 'bg-purple-100'
                  }`}>
                    <User className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
              </div>
              
              {/* Total Patients */}
              <div className={`p-6 rounded-lg ${
                darkMode 
                  ? 'bg-gray-800 shadow-md' 
                  : 'bg-white shadow-md border border-gray-100 hover:shadow-lg'
              } transition-all duration-300`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Total Patients
                    </p>
                    <h3 className="text-2xl font-bold mt-2">{patientStats.totalPatients}</h3>
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      Registered patients
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${
                    darkMode ? 'bg-purple-900' : 'bg-purple-100'
                  }`}>
                    <Users className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Doctors Section */}
          <div className="mt-12 space-y-8">
            <h2 className="text-2xl font-bold">Doctors</h2>
            
            {/* Doctors Table */}
            <div className={`rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden`}>
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Doctor List</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {approvedDoctors.map((doctor) => (
                      <tr key={doctor._id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {doctor.profilePicture ? (
                                <Image
                                  src={doctor.profilePicture}
                                  alt={doctor.fullName}
                                  width={40}
                                  height={40}
                                  className="rounded-full"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <User className="h-6 w-6 text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium">{doctor.fullName}</div>
                              <div className="text-sm text-gray-500">{doctor.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium">{doctor.specialization || 'Not specified'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            doctor.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {doctor.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleAction(doctor._id, 'suspend')}
                            className="text-yellow-600 hover:text-yellow-900 mr-3"
                          >
                            Suspend
                          </button>
                          <button
                            onClick={() => handleAction(doctor._id, 'activate')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Activate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Doctor Requests Table */}
            <div className={`rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden mt-8`}>
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Doctor Requests</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {pendingDoctors.map((doctor) => (
                      <tr key={doctor._id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {doctor.profilePicture ? (
                                <Image
                                  src={doctor.profilePicture}
                                  alt={doctor.fullName}
                                  width={40}
                                  height={40}
                                  className="rounded-full"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <User className="h-6 w-6 text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium">{doctor.fullName}</div>
                              <div className="text-sm text-gray-500">{doctor.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium">{doctor.specialization || 'Not specified'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            doctor.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {doctor.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            {new Date(doctor.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleAction(doctor._id, 'approve')}
                            className="text-green-600 hover:text-green-900 mr-3"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => openRejectionModal(doctor)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Patients Section */}
          <div className="mt-12 space-y-8">
            <h2 className="text-2xl font-bold">Patients</h2>
            
            {/* Patients Table */}
            <div className={`rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden`}>
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Patient List</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {patients.map((patient) => (
                      <tr key={patient._id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {patient.profilePicture ? (
                                <Image
                                  src={patient.profilePicture}
                                  alt={patient.fullName}
                                  width={40}
                                  height={40}
                                  className="rounded-full"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <User className="h-6 w-6 text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium">{patient.fullName}</div>
                              <div className="text-sm text-gray-500">{patient.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">{patient.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            patient.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {patient.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'Never'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleViewPatient(patient._id)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            View
                          </button>
                          <button
                            onClick={() => openSuspendModal(patient)}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            Suspend
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
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
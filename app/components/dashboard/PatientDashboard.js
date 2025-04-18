'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  UserCircleIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  CalendarIcon,
  BanknotesIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  HomeIcon,
  ChevronDownIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  DocumentArrowDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowUpTrayIcon,
  ShareIcon,
  PhoneIcon,
  MapPinIcon,
  ReceiptRefundIcon
} from '@heroicons/react/24/outline';

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [healthTips, setHealthTips] = useState([]);
  const [payments, setPayments] = useState([]);
  const [userProfile, setUserProfile] = useState({
    fullName: 'Joshua Agyeman',
    email: 'john@example.com',
    avatar: null
  });
  const [recentActivities, setRecentActivities] = useState([
    {
      icon: <CalendarIcon className="w-4 h-4 text-blue-600" />,
      description: "Appointment scheduled with Dr. Smith",
      time: "2 hours ago"
    },
    {
      icon: <DocumentTextIcon className="w-4 h-4 text-blue-600" />,
      description: "New prescription uploaded",
      time: "Yesterday"
    },
    {
      icon: <VideoCameraIcon className="w-4 h-4 text-blue-600" />,
      description: "Completed video consultation",
      time: "2 days ago"
    }
  ]);
  const [medicalHistory, setMedicalHistory] = useState({
    pastAppointments: [],
    prescriptions: [],
    labReports: [],
    doctorNotes: [],
    vaccinations: []
  });
  
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [pendingBills, setPendingBills] = useState([]);
  const [searchFilters, setSearchFilters] = useState({
    specialization: '',
    location: '',
    date: '',
    consultationType: ''
  });

  // Fetch patient data on component mount
  useEffect(() => {
    // Add your data fetching logic here
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simplified Navigation Sidebar */}
      <nav className="fixed top-0 left-0 h-full w-20 md:w-64 bg-white shadow-lg z-50 transition-all duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="p-4 border-b border-gray-200">
            <h1 className="hidden md:block text-xl font-bold text-blue-600">VirtualDoc</h1>
            <span className="md:hidden text-2xl font-bold text-blue-600">VD</span>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 py-6 space-y-2">
            <NavItem icon={<CalendarIcon className="w-5 h-5" />} text="Appointments" href="/appointments" />
            <NavItem icon={<VideoCameraIcon className="w-5 h-5" />} text="Video Consultation" href="/consultation" />
            <NavItem icon={<DocumentTextIcon className="w-5 h-5" />} text="Medical Records" href="/records" />
            <NavItem icon={<DocumentArrowDownIcon className="w-5 h-5" />} text="Prescriptions" href="/prescriptions" />
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="ml-20 md:ml-64 p-4 md:p-8">
        {/* Header with Profile */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
              <BellIcon className="w-6 h-6 text-gray-600" />
            </button>
            <div className="relative">
              <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
                {userProfile.avatar ? (
                  <img src={userProfile.avatar} alt="" className="w-8 h-8 rounded-full" />
                ) : (
                  <UserCircleIcon className="w-8 h-8 text-gray-600" />
                )}
                <ChevronDownIcon className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CalendarIcon className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">Appointments</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-800">{appointments.length}</span>
              <span className="text-sm text-gray-500">Upcoming</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <VideoCameraIcon className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">Consultations</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-800">0</span>
              <span className="text-sm text-gray-500">Scheduled</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DocumentTextIcon className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">Medical Records</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-800">{medicalHistory.length}</span>
              <span className="text-sm text-gray-500">Total Records</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <DocumentArrowDownIcon className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">Prescriptions</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-800">{medicalHistory.prescriptions.length}</span>
              <span className="text-sm text-gray-500">Active</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <button className="flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <CalendarIcon className="w-5 h-5" />
            <span>Book Appointment</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <VideoCameraIcon className="w-5 h-5" />
            <span>Start Consultation</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            <DocumentTextIcon className="w-5 h-5" />
            <span>View Records</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
            <DocumentArrowDownIcon className="w-5 h-5" />
            <span>Download Prescription</span>
          </button>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h2>
              <Link href="/appointments" className="text-blue-600 hover:text-blue-700 text-sm">
                View All
              </Link>
            </div>
            <div className="divide-y">
              {appointments.length === 0 ? (
                <p className="text-gray-500 py-4">No upcoming appointments</p>
              ) : (
                appointments.map((appointment) => (
                  <div key={appointment.id} className="py-3">
                    {/* Appointment details */}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Prescriptions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Recent Prescriptions</h2>
              <Link href="/prescriptions" className="text-blue-600 hover:text-blue-700 text-sm">
                View All
              </Link>
            </div>
            <div className="divide-y">
              {medicalHistory.prescriptions.length === 0 ? (
                <p className="text-gray-500 py-4">No recent prescriptions</p>
              ) : (
                medicalHistory.prescriptions.map((prescription) => (
                  <div key={prescription.id} className="py-3">
                    {/* Prescription details */}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper Components
const NavItem = ({ icon, text, href, active }) => (
  <Link 
    href={href}
    className={`flex items-center px-4 py-3 mx-2 space-x-4 
      ${active 
        ? 'bg-blue-50 text-blue-600 rounded-xl' 
        : 'text-gray-600 hover:bg-gray-50 rounded-xl'
      }`}
  >
    <div className="w-5 h-5">{icon}</div>
    <span className="hidden md:block text-sm font-medium">{text}</span>
  </Link>
);

const Card = ({ title, children, action }) => (
  <div className="bg-white rounded-2xl shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      {action}
    </div>
    {children}
  </div>
);

const ActionButton = ({ icon, label, description, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-start space-x-4 p-4 rounded-xl
             bg-gray-50 hover:bg-gray-100 transition-colors"
  >
    <div className="p-3 bg-white rounded-lg shadow-sm">{icon}</div>
    <div className="text-left">
      <h3 className="font-medium text-gray-900">{label}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  </button>
);

const StatsCard = ({ title, value, icon, trend, color }) => (
  <div className="bg-white rounded-2xl shadow-sm p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 bg-${color}-100 rounded-xl`}>
        {icon}
      </div>
      <span className="text-sm text-green-600">{trend}</span>
    </div>
    <h3 className="text-sm text-gray-600 mb-1">{title}</h3>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

// Add the new ProfileDropdown component
const ProfileDropdown = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        {user.avatar ? (
          <img 
            src={user.avatar} 
            alt={user.fullName} 
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <UserCircleIcon className="w-8 h-8 text-gray-600" />
        )}
        <span className="hidden md:block text-gray-700">{user.fullName}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
          <Link 
            href="/profile/settings" 
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Settings
          </Link>
          <Link 
            href="/help" 
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Help
          </Link>
          <button 
            onClick={() => {/* handle logout */}}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

// Add these components after the existing helper components
const AppointmentsList = ({ appointments }) => {
  if (appointments.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No upcoming appointments
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {appointments.map((appointment, index) => (
        <div key={index} className="py-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900">Dr. {appointment.doctorName}</h3>
              <p className="text-sm text-gray-500">{appointment.specialty}</p>
              <p className="text-sm text-gray-500">{appointment.date} at {appointment.time}</p>
              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                appointment.type === 'Video' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
              }`}>
                {appointment.type} Consultation
              </span>
            </div>
            <div className="flex space-x-2">
              {appointment.type === 'Video' && (
                <button className="btn-primary text-sm">Join Call</button>
              )}
              <button className="btn-secondary text-sm">Reschedule</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const MedicalRecordsList = ({ records }) => {
  if (records.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No medical records found
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {records.map((record, index) => (
        <div key={index} className="py-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900">{record.title}</h3>
              <p className="text-sm text-gray-500">Dr. {record.doctorName}</p>
              <p className="text-sm text-gray-500">{record.date}</p>
            </div>
            <button className="btn-secondary text-sm">
              View Details
        </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const PaymentsList = ({ payments }) => {
  if (payments.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No payment history
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {payments.map((payment, index) => (
        <div key={index} className="py-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-gray-900">{payment.description}</h3>
              <p className="text-sm text-gray-500">{payment.date}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">${payment.amount}</p>
              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                payment.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {payment.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const HealthTipsList = ({ tips }) => {
  if (tips.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No health tips available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tips.map((tip, index) => (
        <div key={index} className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-1">{tip.title}</h3>
          <p className="text-sm text-blue-800">{tip.description}</p>
        </div>
      ))}
    </div>
  );
};

// Add this component with the other helper components
const QuickAction = () => {
  return (
    <div className="flex space-x-4">
      <button className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors">
        <CalendarIcon className="w-5 h-5" />
        <span>Book Appointment</span>
        </button>
      <button className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors">
        <VideoCameraIcon className="w-5 h-5" />
        <span>Join Call</span>
        </button>
      </div>
  );
};

// Also, let's add the Timeline component that was referenced but not defined
const Timeline = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No recent activities
      </div>
    );
  }

  return (
        <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            {activity.icon}
          </div>
          <div>
            <p className="text-gray-900">{activity.description}</p>
            <p className="text-sm text-gray-500">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// New Helper Components
const SearchFilter = ({ filters, onFilterChange }) => (
  <>
    <div className="space-y-2">
      <label className="text-sm text-gray-600">Specialization</label>
      <select
        className="w-full p-2 border rounded-lg"
        value={filters.specialization}
        onChange={(e) => onFilterChange({...filters, specialization: e.target.value})}
      >
        <option value="">All Specializations</option>
        {/* Add specialization options */}
      </select>
    </div>
    <div className="space-y-2">
      <label className="text-sm text-gray-600">Location</label>
      <select
        className="w-full p-2 border rounded-lg"
        value={filters.location}
        onChange={(e) => onFilterChange({...filters, location: e.target.value})}
      >
        <option value="">All Locations</option>
        {/* Add location options */}
      </select>
    </div>
  </>
);

const MedicalRecordsTabs = ({ medicalHistory }) => {
  const [activeTab, setActiveTab] = useState('appointments');
  
  return (
    <div>
      <div className="flex space-x-4 border-b mb-4">
        {['Past Appointments', 'Prescriptions', 'Lab Reports', 'Doctor Notes', 'Vaccinations'].map(tab => (
          <button
            key={tab}
            className={`pb-2 px-1 ${activeTab === tab.toLowerCase() ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab(tab.toLowerCase())}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="p-4">
        {/* Render content based on activeTab */}
        </div>
      </div>
  );
};

const VideoConsultation = () => (
        <div className="space-y-4">
    <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
      <VideoCameraIcon className="w-16 h-16 text-gray-600" />
    </div>
    <div className="flex justify-center space-x-4">
      <button className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200">
        <PhoneIcon className="w-6 h-6" />
      </button>
      <button className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200">
        <ShareIcon className="w-6 h-6" />
      </button>
      <button className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200">
        <ArrowUpTrayIcon className="w-6 h-6" />
      </button>
        </div>
      </div>
);

const PaymentSummary = ({ pendingBills, paymentHistory }) => (
        <div className="space-y-4">
    <div className="p-4 bg-yellow-50 rounded-lg">
      <h3 className="font-medium text-yellow-800">Pending Bills</h3>
      {/* Add pending bills list */}
    </div>
    <div>
      <h3 className="font-medium mb-2">Payment Methods</h3>
      <div className="grid grid-cols-3 gap-2">
        <button className="p-2 border rounded-lg hover:bg-gray-50">
          Credit Card
        </button>
        <button className="p-2 border rounded-lg hover:bg-gray-50">
          PayPal
        </button>
        <button className="p-2 border rounded-lg hover:bg-gray-50">
          Mobile Money
        </button>
        </div>
      </div>
    </div>
  );

const DoctorsList = ({ filters }) => {
  // This would typically come from an API call based on filters
  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Smith",
      specialization: "Cardiology",
      location: "New York",
      availability: ["Mon", "Wed", "Fri"],
      rating: 4.8,
      image: null,
      nextAvailable: "Today, 4:00 PM"
    },
    {
      id: 2,
      name: "Dr. John Davis",
      specialization: "General Medicine",
      location: "Los Angeles",
      availability: ["Tue", "Thu", "Sat"],
      rating: 4.9,
      image: null,
      nextAvailable: "Tomorrow, 10:00 AM"
    },
    // Add more sample doctors
  ];

  if (doctors.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No doctors found matching your criteria
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {doctors.map((doctor) => (
        <div 
          key={doctor.id} 
          className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start space-x-4">
            {/* Doctor's Image/Avatar */}
            <div className="flex-shrink-0">
              {doctor.image ? (
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <UserCircleIcon className="w-12 h-12 text-blue-600" />
                </div>
              )}
            </div>

            {/* Doctor's Info */}
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{doctor.name}</h3>
                  <p className="text-sm text-gray-600">{doctor.specialization}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <MapPinIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{doctor.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-yellow-400">
                    <span className="text-sm font-medium text-gray-900 mr-1">
                      {doctor.rating}
                    </span>
                    ★
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Next Available</p>
                  <p className="text-sm font-medium text-gray-900">{doctor.nextAvailable}</p>
                </div>
              </div>

              {/* Available Days */}
              <div className="mt-3 flex flex-wrap gap-2">
                {doctor.availability.map((day) => (
                  <span
                    key={day}
                    className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded"
                  >
                    {day}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex space-x-3">
                <button className="flex-1 btn-primary text-sm">
                  Book Appointment
                </button>
                <button className="flex-1 btn-secondary text-sm">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Make sure to add these CSS classes to your global styles if not already present
const globalStyles = `
  .btn-primary {
    @apply px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors;
  }

  .btn-secondary {
    @apply px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors;
  }
`;
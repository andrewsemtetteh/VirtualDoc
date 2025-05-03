import { Calendar, Users, FileText, MessageSquare, Clock, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function PracticeOverview({ darkMode }) {
  const [stats, setStats] = useState({
    monthlyAppointments: 0,
    totalPatients: 0,
    pendingPrescriptions: 0,
    averageResponseTime: '0 min',
    monthlyRevenue: 0,
    patientSatisfaction: '0%'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPracticeStats();
  }, []);

  const fetchPracticeStats = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching practice stats...');
      
      const response = await fetch('/api/doctor/stats');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received stats data:', data);
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setStats(data);
    } catch (error) {
      console.error('Error fetching practice stats:', error);
      setError(error.message);
      toast.error('Failed to fetch practice statistics');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, trend, color }) => (
    <div className={`p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl ${
      darkMode ? 'bg-gray-700' : 'bg-white'
    }`}>
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-lg ${
          darkMode ? 'bg-gray-600' : color
        }`}>
          <Icon className={`${darkMode ? 'text-gray-300' : 'text-white'}`} size={24} />
        </div>
        <div className={`text-sm font-medium ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {trend && (
            <span className={`inline-flex items-center ${
              trend > 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
        </div>
      </div>
      <div className="mt-4">
        <p className={`text-sm font-medium ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {title}
        </p>
        <p className={`mt-1 text-2xl font-semibold ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {loading ? '...' : value}
        </p>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="text-center py-8">
          <p className={`text-red-500 mb-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
            Error loading practice statistics
          </p>
          <button
            onClick={fetchPracticeStats}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center">
          <Activity className="mr-2 text-green-500" size={24} />
          Practice Overview
        </h3>
        <div className="text-sm text-gray-500 flex items-center">
          <Clock className="mr-1" size={16} />
          {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={Calendar}
          title="Monthly Appointments"
          value={stats.monthlyAppointments}
          trend={5}
          color="bg-blue-500"
        />
        <StatCard
          icon={Users}
          title="Total Patients"
          value={stats.totalPatients}
          trend={2}
          color="bg-green-500"
        />
        <StatCard
          icon={FileText}
          title="Pending Prescriptions"
          value={stats.pendingPrescriptions}
          trend={-3}
          color="bg-yellow-500"
        />
        <StatCard
          icon={Clock}
          title="Avg. Response Time"
          value={stats.averageResponseTime}
          trend={-10}
          color="bg-purple-500"
        />
        <StatCard
          icon={MessageSquare}
          title="Patient Satisfaction"
          value={stats.patientSatisfaction}
          trend={8}
          color="bg-pink-500"
        />
        <StatCard
          icon={Activity}
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          trend={12}
          color="bg-indigo-500"
        />
      </div>

      {/* Recent Activity Timeline */}
      <div className="mt-8">
        <h4 className={`text-lg font-medium mb-4 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Recent Activity
        </h4>
        <div className="space-y-4">
          {[
            {
              type: 'appointment',
              title: 'New Appointment Scheduled',
              patient: 'John Doe',
              time: '2 hours ago',
              color: 'blue'
            },
            {
              type: 'prescription',
              title: 'Prescription Issued',
              patient: 'Sarah Smith',
              time: '4 hours ago',
              color: 'green'
            },
            {
              type: 'message',
              title: 'New Patient Message',
              patient: 'Michael Brown',
              time: '6 hours ago',
              color: 'purple'
            }
          ].map((activity, index) => (
            <div 
              key={index}
              className={`flex items-start p-4 rounded-lg ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}
            >
              <div className={`w-2 h-2 rounded-full mt-1.5 ${
                darkMode ? `bg-${activity.color}-400` : `bg-${activity.color}-500`
              }`} />
              <div className="ml-4">
                <p className={`font-medium ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {activity.title}
                </p>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {activity.patient} • {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
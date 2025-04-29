import { useEffect, useState } from 'react';
import { Calendar, FileText, MessageSquare, Bell } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard({ darkMode }) {
  const [dashboardData, setDashboardData] = useState({
    appointments: [],
    prescriptions: [],
    unreadMessages: 0,
    lastCheckup: null,
    nextCheckup: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Health Status Card */}
      <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className="text-lg font-medium mb-4">Health Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Calendar className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Checkup</p>
              <p className="font-medium">
                {dashboardData.lastCheckup 
                  ? format(new Date(dashboardData.lastCheckup), 'MMM d, yyyy')
                  : 'No checkup recorded'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Calendar className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Next Checkup</p>
              <p className="font-medium">
                {dashboardData.nextCheckup 
                  ? format(new Date(dashboardData.nextCheckup), 'MMM d, yyyy')
                  : 'No upcoming checkup'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Bell className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Unread Messages</p>
              <p className="font-medium">{dashboardData.unreadMessages}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className="text-lg font-medium mb-4">Upcoming Appointments</h3>
        <div className="space-y-4">
          {dashboardData.appointments.length > 0 ? (
            dashboardData.appointments.map((appointment) => (
              <div key={appointment._id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center justify-between`}>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">
                      {appointment.doctorName?.charAt(0) || 'D'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{appointment.doctorName}</p>
                    <p className="text-sm text-gray-500">{appointment.specialty}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {format(new Date(appointment.date), 'MMM d, yyyy')}
                  </p>
                  <p className="text-sm text-gray-500">{appointment.time}</p>
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
        <h3 className="text-lg font-medium mb-4">Recent Prescriptions</h3>
        <div className="space-y-4">
          {dashboardData.prescriptions.length > 0 ? (
            dashboardData.prescriptions.map((prescription) => (
              <div key={prescription._id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center justify-between`}>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <FileText className="text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium">{prescription.doctorName}</p>
                    <p className="text-sm text-gray-500">
                      {prescription.medications.length} medications
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {format(new Date(prescription.createdAt), 'MMM d, yyyy')}
                  </p>
                  <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                    View
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No recent prescriptions</p>
          )}
        </div>
      </div>
    </div>
  );
} 
// app/dashboard/admin/page.js
'use client';

import { useState } from 'react';
import { 
  BarChart, Users, Calendar, FileText, 
  Menu, X, Search, Bell, Sun, Moon,
  ChevronDown, LayoutDashboard, ShoppingCart, User, Settings
} from 'lucide-react';

export default function AdminDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar */}
      <div className={`${collapsed ? 'w-20' : 'w-64'} ${darkMode ? 'bg-gray-800' : 'bg-white'} transition-all duration-300 shadow-lg`}>
        {/* Logo */}
        <div className="flex items-center p-4 border-b">
          <div className="text-blue-600 mr-2">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="18" fill="currentColor" fillOpacity="0.2" />
              <path d="M11 18C11 14.134 14.134 11 18 11V25C14.134 25 11 21.866 11 18Z" fill="currentColor" />
            </svg>
          </div>
          {!collapsed && <span className="text-xl font-bold">VirtualDoc</span>}
        </div>

        {/* Menu */}
        <div className="p-4">
          {!collapsed && <div className="text-sm font-medium text-gray-500 mb-4">MAIN MENU</div>}
          
          <div className="space-y-2">
            {/* Dashboard */}
            <div className={`flex items-center p-3 rounded-lg ${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}`}>
              <LayoutDashboard size={20} />
              {!collapsed && <span className="ml-3 font-medium">Dashboard</span>}
              {!collapsed && <ChevronDown size={16} className="ml-auto" />}
            </div>
            
            {/* Appointments */}
            <div className={`flex items-center p-3 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <Calendar size={20} />
              {!collapsed && <span className="ml-3">Appointments</span>}
            </div>
            
            {/* Patients */}
            <div className={`flex items-center p-3 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <Users size={20} />
              {!collapsed && <span className="ml-3">Patients</span>}
            </div>
            
            {/* Doctors */}
            <div className={`flex items-center p-3 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <User size={20} />
              {!collapsed && <span className="ml-3">Doctors</span>}
            </div>
            
            {/* Medical Records */}
            <div className={`flex items-center p-3 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <FileText size={20} />
              {!collapsed && <span className="ml-3">Medical Records</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className={`flex items-center justify-between p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              {collapsed ? <Menu size={20} /> : <X size={20} />}
            </button>
            <h1 className="ml-4 text-2xl font-bold">Dashboard</h1>
            <p className="ml-2 text-sm text-gray-500">VirtualDoc Admin Dashboard</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`flex items-center rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} px-4 py-2`}>
              <Search size={16} className="text-gray-500" />
              <input 
                type="text" 
                placeholder="Search" 
                className={`ml-2 bg-transparent focus:outline-none w-40 ${darkMode ? 'placeholder-gray-400' : 'placeholder-gray-500'}`}
              />
            </div>
            
            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">3</span>
            </button>
            
            <div className="flex items-center">
              <img 
                src="/api/placeholder/40/40" 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="ml-2 font-medium">Dr. Smith</span>
              <ChevronDown size={16} className="ml-1" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Total Appointments */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <Calendar size={24} className="text-green-500" />
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold">254</h2>
                  <p className="text-sm text-gray-500">Total Appointments</p>
                </div>
                <div className="ml-auto text-green-500 flex items-center">
                  <span>2.5%</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Total Revenue */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center">
                <div className="bg-orange-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold">$24.5K</h2>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                </div>
                <div className="ml-auto text-green-500 flex items-center">
                  <span>4.35%</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Total Doctors */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full">
                  <User size={24} className="text-purple-500" />
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold">48</h2>
                  <p className="text-sm text-gray-500">Total Doctors</p>
                </div>
                <div className="ml-auto text-green-500 flex items-center">
                  <span>1.2%</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Total Patients */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users size={24} className="text-blue-500" />
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold">1,259</h2>
                  <p className="text-sm text-gray-500">Total Patients</p>
                </div>
                <div className="ml-auto text-red-500 flex items-center">
                  <span>-0.58%</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Appointments Overview */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Appointments Overview</h3>
                <select className={`p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                  <option>Monthly</option>
                  <option>Weekly</option>
                  <option>Daily</option>
                </select>
              </div>
              
              {/* Placeholder for chart */}
              <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg relative">
                {/* Sample chart elements */}
                <div className="absolute bottom-0 left-0 w-full h-32 flex items-end px-6">
                  <div className="w-1/7 h-40 bg-blue-500 opacity-70 rounded-t-lg mx-1"></div>
                  <div className="w-1/7 h-28 bg-blue-500 opacity-70 rounded-t-lg mx-1"></div>
                  <div className="w-1/7 h-52 bg-blue-500 opacity-70 rounded-t-lg mx-1"></div>
                  <div className="w-1/7 h-36 bg-blue-500 opacity-70 rounded-t-lg mx-1"></div>
                  <div className="w-1/7 h-64 bg-blue-500 opacity-70 rounded-t-lg mx-1"></div>
                  <div className="w-1/7 h-48 bg-blue-500 opacity-70 rounded-t-lg mx-1"></div>
                  <div className="w-1/7 h-56 bg-blue-500 opacity-70 rounded-t-lg mx-1"></div>
                </div>
                
                {/* Chart overlay - blue line */}
                <div className="absolute bottom-0 left-0 w-full h-32 px-6">
                  <svg width="100%" height="100%" viewBox="0 0 400 150" preserveAspectRatio="none">
                    <path 
                      d="M0,100 C50,80 100,120 150,90 C200,60 250,110 300,70 C350,30 400,50 400,30" 
                      fill="none" 
                      stroke="#3B82F6" 
                      strokeWidth="3"
                    />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Revenue Breakdown */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Revenue this week</h3>
                <select className={`p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                  <option>This Week</option>
                  <option>Last Week</option>
                  <option>This Month</option>
                </select>
              </div>
              
              {/* Placeholder for chart */}
              <div className="h-64 flex items-end space-x-4">
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col space-y-1">
                    <div className="flex flex-col h-48 justify-end">
                      <div className="bg-purple-500 h-24 w-full rounded-t-lg"></div>
                      <div className="bg-blue-400 h-8 w-full"></div>
                    </div>
                    <div className="text-center text-sm">Mon</div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col space-y-1">
                    <div className="flex flex-col h-48 justify-end">
                      <div className="bg-purple-500 h-40 w-full rounded-t-lg"></div>
                      <div className="bg-blue-400 h-16 w-full"></div>
                    </div>
                    <div className="text-center text-sm">Tue</div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col space-y-1">
                    <div className="flex flex-col h-48 justify-end">
                      <div className="bg-purple-500 h-32 w-full rounded-t-lg"></div>
                      <div className="bg-blue-400 h-8 w-full"></div>
                    </div>
                    <div className="text-center text-sm">Wed</div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col space-y-1">
                    <div className="flex flex-col h-48 justify-end">
                      <div className="bg-purple-500 h-36 w-full rounded-t-lg"></div>
                      <div className="bg-blue-400 h-12 w-full"></div>
                    </div>
                    <div className="text-center text-sm">Thu</div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col space-y-1">
                    <div className="flex flex-col h-48 justify-end">
                      <div className="bg-purple-500 h-20 w-full rounded-t-lg"></div>
                      <div className="bg-blue-400 h-6 w-full"></div>
                    </div>
                    <div className="text-center text-sm">Fri</div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col space-y-1">
                    <div className="flex flex-col h-48 justify-end">
                      <div className="bg-purple-500 h-44 w-full rounded-t-lg"></div>
                      <div className="bg-blue-400 h-14 w-full"></div>
                    </div>
                    <div className="text-center text-sm">Sat</div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col space-y-1">
                    <div className="flex flex-col h-48 justify-end">
                      <div className="bg-purple-500 h-40 w-full rounded-t-lg"></div>
                      <div className="bg-blue-400 h-8 w-full"></div>
                    </div>
                    <div className="text-center text-sm">Sun</div>
                  </div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="flex justify-center space-x-6 mt-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="ml-2 text-sm">Consultations</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="ml-2 text-sm">Prescriptions</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Activity & Upcoming Appointments */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
              
              <div className="space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-start`}>
                    <div className={`p-2 rounded-full ${['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-orange-100'][item % 4]}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${['text-blue-500', 'text-green-500', 'text-purple-500', 'text-orange-500'][item % 4]}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {item % 4 === 0 ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> : 
                        item % 4 === 1 ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /> :
                        item % 4 === 2 ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> :
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />}
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">
                        {item % 4 === 0 ? "New prescription issued" : 
                         item % 4 === 1 ? "Patient medical record updated" : 
                         item % 4 === 2 ? "Appointment scheduled" : 
                         "New patient registered"}
                      </p>
                      <p className="text-sm text-gray-500">
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
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Upcoming Appointments</h3>
                <button className="text-blue-500 text-sm">View All</button>
              </div>
              
              <div className="space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex justify-between`}>
                    <div className="flex items-center">
                      <img 
                        src={`/api/placeholder/${40 + item}/${40 + item}`} 
                        alt="Patient" 
                        className="w-10 h-10 rounded-full object-cover"
                      />
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
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm">
                          {["09:00 AM", "10:30 AM", "01:15 PM", "03:45 PM"][item % 4]}
                        </span>
                      </div>
                      <div className="flex items-center mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">
                          {["Today", "Tomorrow", "Mar 25", "Mar 26"][item % 4]}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
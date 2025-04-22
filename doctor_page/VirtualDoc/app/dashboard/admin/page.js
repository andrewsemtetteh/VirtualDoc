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
  const [activeSection, setActiveSection] = useState('dashboard');

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Navigation handler
  const handleNavigation = (section) => {
    setActiveSection(section);
  };

  // Render content based on active section
  const renderContent = () => {
    switch(activeSection) {
      case 'dashboard':
        return (
          <>
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
                  {/* Revenue chart columns */}
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                    <div key={day} className="flex-1 flex flex-col items-center">
                      <div className="w-full flex flex-col space-y-1">
                        <div className="flex flex-col h-48 justify-end">
                          <div className={`bg-purple-500 h-${24 + index * 4} w-full rounded-t-lg`}></div>
                          <div className={`bg-blue-400 h-${8 - index} w-full`}></div>
                        </div>
                        <div className="text-center text-sm">{day}</div>
                      </div>
                    </div>
                  ))}
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
                    <button className="text-blue-500 text-sm">View All</button>
                  </div>
                  
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex justify-between items-center`}>
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
                        <h2 className="text-2xl font-bold">1,259</h2>
                        <p className="text-sm text-gray-500">Total Patients</p>
                      </div>
                      <div className="ml-auto text-green-500 flex items-center">
                        <span>4.6%</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* New Patients */}
                  <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="flex items-center">
                      <div className="bg-green-100 p-3 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h2 className="text-2xl font-bold">87</h2>
                        <p className="text-sm text-gray-500">New this month</p>
                      </div>
                      <div className="ml-auto text-green-500 flex items-center">
                        <span>12.3%</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Active Treatment */}
                  <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="flex items-center">
                      <div className="bg-purple-100 p-3 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h2 className="text-2xl font-bold">463</h2>
                        <p className="text-sm text-gray-500">Active Treatment</p>
                      </div>
                      <div className="ml-auto text-yellow-500 flex items-center">
                        <span>0.8%</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Insurance Coverage */}
                  <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="flex items-center">
                      <div className="bg-red-100 p-3 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h2 className="text-2xl font-bold">78%</h2>
                        <p className="text-sm text-gray-500">Insurance Coverage</p>
                      </div>
                      <div className="ml-auto text-red-500 flex items-center">
                        <span>-1.2%</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
          
                {/* Patient Demographics and Lists */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Patient Demographics */}
                  <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-medium">Patient Demographics</h3>
                      <select className={`p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                        <option>Age Group</option>
                        <option>Gender</option>
                        <option>Location</option>
                      </select>
                    </div>
                    
                    {/* Age demographics chart */}
                    <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg relative">
                      {/* Bar Chart Placeholder */}
                      <div className="absolute inset-x-0 bottom-0 h-56 flex items-end justify-around px-4">
                        <div className="w-1/6 mx-1">
                          <div className="bg-blue-400 h-12 rounded-t"></div>
                          <div className="text-center text-xs mt-1">0-12</div>
                        </div>
                        <div className="w-1/6 mx-1">
                          <div className="bg-blue-400 h-16 rounded-t"></div>
                          <div className="text-center text-xs mt-1">13-18</div>
                        </div>
                        <div className="w-1/6 mx-1">
                          <div className="bg-blue-400 h-32 rounded-t"></div>
                          <div className="text-center text-xs mt-1">19-30</div>
                        </div>
                        <div className="w-1/6 mx-1">
                          <div className="bg-blue-400 h-40 rounded-t"></div>
                          <div className="text-center text-xs mt-1">31-45</div>
                        </div>
                        <div className="w-1/6 mx-1">
                          <div className="bg-blue-400 h-36 rounded-t"></div>
                          <div className="text-center text-xs mt-1">46-60</div>
                        </div>
                        <div className="w-1/6 mx-1">
                          <div className="bg-blue-400 h-24 rounded-t"></div>
                          <div className="text-center text-xs mt-1">60+</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Legend */}
                    <div className="flex justify-center space-x-6 mt-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                        <span>Number of Patients</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* New Patients */}
                  <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Recently Registered Patients</h3>
                      <button className="text-blue-500 text-sm">View All</button>
                    </div>
                    
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((item) => (
                        <div key={item} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex justify-between items-center`}>
                          <div className="flex items-center">
                            <img 
                              src={`/api/placeholder/${40 + item}/${40 + item}`} 
                              alt="Patient" 
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="ml-3">
                              <p className="font-medium">
                                {["Emily Wilson", "Robert Johnson", "Linda Davis", "Michael Taylor"][item % 4]}
                              </p>
                              <p className="text-sm text-gray-500">
                                {["+1 (555) 123-4567", "+1 (555) 987-6543", "+1 (555) 456-7890", "+1 (555) 234-5678"][item % 4]}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-sm text-gray-500">
                              {["32 years", "45 years", "28 years", "51 years"][item % 4]}
                            </span>
                            <span className="text-xs text-gray-400 mt-1">
                              Registered {["2 days ago", "3 days ago", "1 week ago", "2 weeks ago"][item % 4]}
                            </span>
                          </div>
                        </div>
                      ))}
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
                        />
                      </div>
                      <select className={`p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                        <option>All Patients</option>
                        <option>Active Patients</option>
                        <option>Inactive Patients</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                          <th className="py-3 text-left">Patient Name</th>
                          <th className="py-3 text-left">ID</th>
                          <th className="py-3 text-left">Phone</th>
                          <th className="py-3 text-left">Last Visit</th>
                          <th className="py-3 text-left">Status</th>
                          <th className="py-3 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {[
                          {
                            name: "Jessica Williams",
                            id: "PT-20245",
                            phone: "+1 (555) 987-3456",
                            lastVisit: "Mar 28, 2025",
                            status: "Active"
                          },
                          {
                            name: "Thomas Anderson",
                            id: "PT-19872",
                            phone: "+1 (555) 456-7890",
                            lastVisit: "Mar 15, 2025",
                            status: "Active"
                          },
                          {
                            name: "Sarah Martinez",
                            id: "PT-18456",
                            phone: "+1 (555) 234-5678",
                            lastVisit: "Feb 22, 2025",
                            status: "Inactive"
                          },
                          {
                            name: "David Thompson",
                            id: "PT-15678",
                            phone: "+1 (555) 345-6789",
                            lastVisit: "Mar 30, 2025",
                            status: "Active"
                          },
                          {
                            name: "Jennifer Clark",
                            id: "PT-14523",
                            phone: "+1 (555) 567-8901",
                            lastVisit: "Jan 05, 2025",
                            status: "Inactive"
                          },
                        ].map((patient, index) => (
                          <tr key={index} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                            <td className="py-4">
                              <div className="flex items-center">
                                <img 
                                  src={`/api/placeholder/${40 + index}/${40 + index}`}
                                  alt={patient.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                                <span className="ml-3 font-medium">{patient.name}</span>
                              </div>
                            </td>
                            <td className="py-4">{patient.id}</td>
                            <td className="py-4">{patient.phone}</td>
                            <td className="py-4">{patient.lastVisit}</td>
                            <td className="py-4">
                              <span className={`px-2 py-1 rounded text-xs ${
                                patient.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {patient.status}
                              </span>
                            </td>
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
                      Showing 1 to 5 of 124 patients
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
            case 'doctors':
              return (
                <>
                  {/* Doctors Overview Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
                    
                    {/* Active Doctors */}
                    <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <div className="flex items-center">
                        <div className="bg-green-100 p-3 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h2 className="text-2xl font-bold">42</h2>
                          <p className="text-sm text-gray-500">Active Doctors</p>
                        </div>
                        <div className="ml-auto text-green-500 flex items-center">
                          <span>0.5%</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* On Leave */}
                    <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <div className="flex items-center">
                        <div className="bg-yellow-100 p-3 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h2 className="text-2xl font-bold">6</h2>
                          <p className="text-sm text-gray-500">On Leave</p>
                        </div>
                        <div className="ml-auto text-red-500 flex items-center">
                          <span>+2</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* New Doctors */}
                    <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-3 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h2 className="text-2xl font-bold">3</h2>
                          <p className="text-sm text-gray-500">New This Month</p>
                        </div>
                        <div className="ml-auto text-green-500 flex items-center">
                          <span>+1</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
            
                  {/* Doctors Charts and Lists */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Specialties Distribution */}
                    <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-medium">Doctors by Specialty</h3>
                        <select className={`p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                          <option>All Departments</option>
                          <option>Active Only</option>
                          <option>Full-time</option>
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
                          <span>General</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span>Cardiology</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                          <span>Neurology</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                          <span>Other</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Doctor Ratings */}
                    <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-medium">Doctor Performance Ratings</h3>
                        <select className={`p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                          <option>This Month</option>
                          <option>Last Month</option>
                          <option>This Quarter</option>
                        </select>
                      </div>
                      
                      {/* Placeholder for bar chart */}
                      <div className="h-64 flex items-end space-x-4">
                        {/* Ratings chart bars */}
                        {['Dr. Smith', 'Dr. Johnson', 'Dr. Lee', 'Dr. Patel', 'Dr. Garcia'].map((doctor, index) => (
                          <div key={doctor} className="flex-1 flex flex-col items-center">
                            <div className="w-full flex flex-col space-y-1">
                              <div className="flex flex-col h-48 justify-end">
                                <div className={`bg-blue-500 h-${20 + index * 6} w-full rounded-t-lg`}></div>
                              </div>
                              <div className="text-center text-sm truncate">{doctor}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Scale */}
                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>0</span>
                        <span>1</span>
                        <span>2</span>
                        <span>3</span>
                        <span>4</span>
                        <span>5</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Doctor List */}
                  <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-medium">Doctor Directory</h3>
                      <div className="flex space-x-2">
                        <input 
                          type="text" 
                          placeholder="Search doctors..." 
                          className={`p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'}`}
                        />
                        <button className="bg-blue-500 text-white px-4 py-2 rounded">Add Doctor</button>
                      </div>
                    </div>
                    
                    {/* Doctor List Table */}
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patients</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y divide-gray-200 dark:divide-gray-700`}>
                          {[
                            { name: 'Dr. Sarah Johnson', specialty: 'Cardiology', status: 'Active', patients: 48, rating: 4.8 },
                            { name: 'Dr. Michael Chen', specialty: 'Neurology', status: 'Active', patients: 52, rating: 4.7 },
                            { name: 'Dr. Emily Williams', specialty: 'Pediatrics', status: 'On Leave', patients: 36, rating: 4.9 },
                            { name: 'Dr. David Kim', specialty: 'Orthopedics', status: 'Active', patients: 41, rating: 4.6 },
                            { name: 'Dr. Jessica Martinez', specialty: 'General Medicine', status: 'Active', patients: 65, rating: 4.5 }
                          ].map((doctor, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : ''}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <img 
                                    src={`/api/placeholder/${45 + index}/${45 + index}`} 
                                    alt={doctor.name} 
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                  <div className="ml-4">
                                    <div className="font-medium">{doctor.name}</div>
                                    <div className="text-sm text-gray-500">doctor{index + 1}@virtualdoc.com</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm">{doctor.specialty}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  doctor.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {doctor.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {doctor.patients}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <span className="text-sm mr-2">{doctor.rating}</span>
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <svg key={i} className={`w-4 h-4 ${i < Math.floor(doctor.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                    ))}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button className="text-blue-500 hover:text-blue-700 mr-3">Edit</button>
                                <button className="text-gray-500 hover:text-gray-700">View</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      
                      {/* Pagination */}
                      <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                          <button className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${darkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-700'}`}>
                            Previous
                          </button>
                          <button className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${darkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-700'}`}>
                            Next
                          </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm text-gray-500">
                              Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">48</span> doctors
                            </p>
                          </div>
                          <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                              <button className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${darkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-500'}`}>
                                <span className="sr-only">Previous</span>
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </button>
                              <button className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${darkMode ? 'bg-blue-600 text-white border-blue-500' : 'bg-blue-50 text-blue-600 border-blue-500'}`}>1</button>
                              <button className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${darkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-500'}`}>2</button>
                              <button className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${darkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-500'}`}>3</button>
                              <button className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${darkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-500'}`}>4</button>
                              <button className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${darkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-500'}`}>5</button>
                              <button className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${darkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-500'}`}>
                                <span className="sr-only">Next</span>
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </nav>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
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
                          <button className="text-blue-500 text-sm">View All</button>
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
                                    <img 
                                      src={`/api/placeholder/${40 + index}/${40 + index}`}
                                      alt={record.patient}
                                      className="w-8 h-8 rounded-full object-cover"
                                    />
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
            <div 
              onClick={() => handleNavigation('dashboard')}
              className={`flex items-center p-3 rounded-lg cursor-pointer ${
                activeSection === 'dashboard' 
                  ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600') 
                  : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')
              }`}
            >
              <LayoutDashboard size={20} />
              {!collapsed && <span className="ml-3 font-medium">Dashboard</span>}
              {!collapsed && <ChevronDown size={16} className="ml-auto" />}
            </div>
            
            {/* Appointments */}
            <div 
              onClick={() => handleNavigation('appointments')}
              className={`flex items-center p-3 rounded-lg cursor-pointer ${
                activeSection === 'appointments' 
                  ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600') 
                  : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')
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
                  ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600') 
                  : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')
              }`}
            >
              <Users size={20} />
              {!collapsed && <span className="ml-3">Patients</span>}
            </div>
            
            {/* Doctors */}
            <div 
              onClick={() => handleNavigation('doctors')}
              className={`flex items-center p-3 rounded-lg cursor-pointer ${
                activeSection === 'doctors' 
                  ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600') 
                  : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')
              }`}
            >
              <User size={20} />
              {!collapsed && <span className="ml-3">Doctors</span>}
            </div>
            
            {/* Medical Records */}
            <div 
              onClick={() => handleNavigation('medical-records')}
              className={`flex items-center p-3 rounded-lg cursor-pointer ${
                activeSection === 'medical-records' 
                  ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600') 
                  : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')
              }`}
            >
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
            <h1 className="ml-4 text-2xl font-bold">
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            </h1>
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

        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
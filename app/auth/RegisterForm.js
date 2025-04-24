'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Copyright from '../components/Copyright';

export default function RegisterForm() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [licenseDocument, setLicenseDocument] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    specialization: '',
    licenseNumber: '',
    yearsOfExperience: '',
    dateOfBirth: '',
    gender: '',
    profilePicture: null
  });
  
  // List of medical specializations
  const specializations = [
    "General Medicine",
    "Cardiology",
    "Dermatology",
    "Endocrinology",
    "Family Medicine",
    "Gastroenterology",
    "Hematology",
    "Infectious Disease",
    "Internal Medicine",
    "Nephrology",
    "Neurology",
    "Obstetrics and Gynecology",
    "Oncology",
    "Ophthalmology",
    "Orthopedics",
    "Otolaryngology (ENT)",
    "Pediatrics",
    "Psychiatry",
    "Pulmonology",
    "Radiology",
    "Rheumatology",
    "Urology"
  ];
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Return null on server-side
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLicenseDocumentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLicenseDocument(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    // Validate required fields
    if (!formData.fullName) {
      setError('Full name is required');
      setLoading(false);
      return;
    }
    
    if (!formData.email) {
      setError('Email is required');
      setLoading(false);
      return;
    }
    
    if (!formData.phoneNumber) {
      setError('Phone number is required');
      setLoading(false);
      return;
    }
    
    if (!formData.password) {
      setError('Password is required');
      setLoading(false);
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Doctor-specific validations
    if (formData.role === 'doctor') {
      if (!formData.specialization) {
        setError('Specialization is required');
        setLoading(false);
        return;
      }
      
      if (!formData.licenseNumber) {
        setError('License number is required');
        setLoading(false);
        return;
      }
      
      if (!formData.yearsOfExperience) {
        setError('Years of experience is required');
        setLoading(false);
        return;
      }
      
      if (!licenseDocument) {
        setError('License document is required');
        setLoading(false);
        return;
      }
    }

    // Patient-specific validations
    if (formData.role === 'patient') {
      if (!formData.dateOfBirth) {
        setError('Date of birth is required');
        setLoading(false);
        return;
      }
      
      if (!formData.gender) {
        setError('Gender is required');
        setLoading(false);
        return;
      }
    }

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      if (profileImage) {
        formDataToSend.append('profileImage', profileImage);
      }
      if (licenseDocument) {
        formDataToSend.append('licenseDocument', licenseDocument);
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        router.push('/auth/login?registered=true');
      }, 2000);
    } catch (err) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  // Render the form fields based on the selected role
  const renderRoleFields = () => {
    switch (formData.role) {
      case 'patient':
        return (
          <>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none text-sm"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </>
        );
      case 'doctor':
        return (
          <>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Specialization</label>
              <select
                required
                value={formData.specialization}
                onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none text-sm"
              >
                <option value="">Select specialization</option>
                {specializations.map((specialization) => (
                  <option key={specialization} value={specialization}>
                    {specialization}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">License Number</label>
              <input
                type="text"
                required
                value={formData.licenseNumber}
                onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none text-sm"
                placeholder="Your license number"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Years of Experience</label>
              <input
                type="number"
                value={formData.yearsOfExperience}
                onChange={(e) => setFormData({...formData, yearsOfExperience: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none text-sm"
                placeholder="Years of experience"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Upload License Document</label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleLicenseDocumentChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none text-sm"
                />
                {licenseDocument && (
                  <p className="mt-2 text-sm text-green-600">Document selected: {licenseDocument.name}</p>
                )}
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow bg-gradient-to-br from-green-50 to-gray-100 flex items-center justify-center w-full py-8">
        <div className="w-full max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            {/* Logo/Icon Section */}
            <div className="bg-green-800 py-6 px-4 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>
            
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">Create an Account</h2>
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {success}
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Profile Image Upload */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative w-24 h-24 mb-3">
                    {previewUrl ? (
                      <Image 
                        src={previewUrl} 
                        alt="Profile preview" 
                        width={96} 
                        height={96} 
                        className="rounded-full object-cover w-full h-full border-4 border-green-100"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center border-4 border-green-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                    
                    <label htmlFor="profile-upload" className="absolute -bottom-1 -right-1 bg-green-800 rounded-full p-2 cursor-pointer shadow-md hover:bg-green-700 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </label>
                    <input 
                      id="profile-upload" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                      className="hidden" 
                    />
                  </div>
                  <p className="text-sm text-gray-500">Upload profile picture (optional)</p>
                </div>
                
                {/* User Role Selection */}
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2">I am a</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['patient', 'doctor'].map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setFormData({...formData, role})}
                        className={`py-3 px-4 rounded-lg border text-sm font-medium transition-colors ${
                          formData.role === role 
                            ? 'bg-green-800 text-white border-green-800' 
                            : 'bg-white text-gray-700 border-gray-300 hover:border-green-500'
                        }`}
                      >
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Full Name */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                {/* Contact Information Section */}
                <div className="border-t border-gray-200 pt-5">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Contact Information</h3>
                  <p className="text-sm text-gray-500 mb-4">We require both your email and phone number for account security and communication purposes.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Email Field */}
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Email Address
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                          </svg>
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Phone Number Field */}
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Phone Number
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                          placeholder="Enter your phone number"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Password Section */}
                <div className="border-t border-gray-200 pt-5">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Security</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Password */}
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                          placeholder="Create a password"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Confirm Password */}
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Confirm Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                          placeholder="Confirm your password"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">Password must be at least 6 characters long</p>
                </div>
                
                {/* Role-specific fields */}
                <div className="border-t border-gray-200 pt-5">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Additional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderRoleFields()}
                  </div>
                </div>
                
                <button
                  type="submit"
                  className={`w-full py-3 px-4 bg-green-700 hover:bg-green-800 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
                
                <div className="text-center mt-6">
                  <p className="text-gray-600">
                    Already have an account? <Link href="/auth/login" className="text-green-700 hover:text-green-800 font-medium">Sign in</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Copyright />
          </div>
        </div>
      </footer>
    </div>
  );
} 
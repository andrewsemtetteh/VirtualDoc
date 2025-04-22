'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Enter contact, 2: Enter OTP, 3: Enter new password
  const [formData, setFormData] = useState({
    contact: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
    contactType: 'email' // 'email' or 'phone'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (step === 1) {
        // Send OTP to email/phone
        setSuccess(`OTP has been sent to your ${formData.contactType}`);
        setStep(2);
      } else if (step === 2) {
        // Verify OTP
        setSuccess('OTP verified successfully');
        setStep(3);
      } else if (step === 3) {
        // Reset password
        if (formData.newPassword !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        setSuccess('Password has been reset successfully');
        // Here you would typically redirect to login page
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100 flex items-center justify-center w-full py-8">
      <div className="w-full max-w-md mx-auto px-4">
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
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">
              {step === 1 ? 'Reset Password' : step === 2 ? 'Enter OTP' : 'New Password'}
            </h2>
            
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
              {step === 1 && (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Reset via</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['email', 'phone'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, contactType: type }))}
                          className={`py-3 px-4 rounded-lg border text-sm font-medium transition-colors ${
                            formData.contactType === type 
                              ? 'bg-green-800 text-white border-green-800' 
                              : 'bg-white text-gray-700 border-gray-300 hover:border-green-500'
                          }`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      {formData.contactType === 'email' ? 'Email Address' : 'Phone Number'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          {formData.contactType === 'email' ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          )}
                        </svg>
                      </div>
                      <input
                        type={formData.contactType === 'email' ? 'email' : 'tel'}
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        placeholder={`Enter your ${formData.contactType}`}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Enter OTP</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="Enter the OTP sent to you"
                      required
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">New Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        placeholder="Enter new password"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Confirm New Password</label>
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
                        placeholder="Confirm new password"
                        required
                      />
                    </div>
                  </div>
                </>
              )}
              
              <button
                type="submit"
                className={`w-full py-3 px-4 bg-green-700 hover:bg-green-800 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={loading}
              >
                {loading ? 'Processing...' : step === 1 ? 'Send OTP' : step === 2 ? 'Verify OTP' : 'Reset Password'}
              </button>
              
              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Remember your password? <Link href="/auth/login" className="text-green-700 hover:text-green-800 font-medium">Sign in</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 
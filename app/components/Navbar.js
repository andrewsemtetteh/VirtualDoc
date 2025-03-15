'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const router = useRouter();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleFindDoctorsClick = (e) => {
    e.preventDefault();
    setShowLoginPrompt(true);
    
    // Hide the prompt after 2 seconds and redirect
    setTimeout(() => {
      setShowLoginPrompt(false);
      router.push('/login');
    }, 2000);
  };

  const handleHowItWorksClick = (e) => {
    e.preventDefault();
    
    // Check if we're on the homepage
    if (window.location.pathname === '/') {
      // If on homepage, scroll to the section
      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If not on homepage, redirect to homepage with the section hash
      router.push('/#how-it-works');
    }
  };

  const handleContactUsClick = (e) => {
    e.preventDefault();
    
    // Check if we're on the homepage
    if (window.location.pathname === '/') {
      // If on homepage, scroll to the section
      document.getElementById('contact-us')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If not on homepage, redirect to homepage with the section hash
      router.push('/#contact-us');
    }
  };

  return (
    <nav className={`${isScrolled 
      ? 'bg-gradient-to-r from-gray-900/95 to-gray-800/95 backdrop-blur-md py-3' 
      : 'bg-gradient-to-r from-gray-900 to-gray-800 py-4'} 
      text-white sticky top-0 z-10 shadow-lg transition-all duration-300`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600">
                VirtualDoc
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="relative group">
              <span className="font-medium hover:text-green-400 transition-colors">Home</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <a 
              href="#" 
              onClick={handleFindDoctorsClick} 
              className="relative group cursor-pointer"
            >
              <span className="font-medium hover:text-green-400 transition-colors">Find Doctors</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a 
              href="#" 
              onClick={handleHowItWorksClick} 
              className="relative group cursor-pointer"
            >
              <span className="font-medium hover:text-green-400 transition-colors">How It Works</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a 
              href="#" 
              onClick={handleContactUsClick} 
              className="relative group cursor-pointer"
            >
              <span className="font-medium hover:text-green-400 transition-colors">Contact Us</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <Link href="/login">
              <button className="relative overflow-hidden bg-gradient-to-r from-green-500 to-green-700 text-white px-5 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/30 gradient-shift">
                <span className="relative z-10">Login</span>
                <span className="absolute inset-0 bg-gradient-to-r from-green-700 to-green-900 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
              </button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-white focus:outline-none relative w-10 h-10 flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <div className={`w-6 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}>
                <span className={`block h-0.5 w-6 bg-white rounded-full transition-all duration-300 ${isMenuOpen ? 'rotate-0' : '-translate-y-1.5'}`}></span>
                <span className={`block h-0.5 w-6 bg-white rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`block h-0.5 w-6 bg-white rounded-full transition-all duration-300 ${isMenuOpen ? '-rotate-90 -translate-y-1' : 'translate-y-1.5'}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMenuOpen ? 'max-h-80 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
          <div className="border-t border-gray-700 py-2">
            <div className="flex flex-col space-y-3 px-2">
              <Link href="/" className="hover:text-green-400 transition-colors py-2 font-medium flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Home</span>
              </Link>
              <a 
                href="#" 
                onClick={(e) => {
                  handleFindDoctorsClick(e);
                  setIsMenuOpen(false);
                }} 
                className="hover:text-green-400 transition-colors py-2 font-medium cursor-pointer flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Find Doctors</span>
              </a>
              <a 
                href="#" 
                onClick={(e) => {
                  handleHowItWorksClick(e);
                  setIsMenuOpen(false);
                }} 
                className="hover:text-green-400 transition-colors py-2 font-medium cursor-pointer flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>How It Works</span>
              </a>
              <a 
                href="#" 
                onClick={(e) => {
                  handleContactUsClick(e);
                  setIsMenuOpen(false);
                }} 
                className="hover:text-green-400 transition-colors py-2 font-medium cursor-pointer flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Contact Us</span>
              </a>
              <Link href="/login" className="py-2" onClick={() => setIsMenuOpen(false)}>
                <button className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-700 hover:to-green-900 text-white px-5 py-2 rounded-full font-medium w-full transition-all duration-300 flex items-center justify-center space-x-2 gradient-shift">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Login</span>
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Login Prompt */}
        {showLoginPrompt && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-down border-l-4 border-green-500">
            <div className="flex items-center space-x-3">
              <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <p className="font-medium text-gray-800">Please sign in to see available doctors</p>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 
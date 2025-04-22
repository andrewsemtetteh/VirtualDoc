'use client';

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Copyright from './components/Copyright';
import Link from 'next/link';
import Navbar from './components/Navbar';
import Slider from "react-slick";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const howItWorksData = [
    {
      step: "1",
      title: "Register",
      description: "Create your secure account in minutes"
    },
    {
      step: "2",
      title: "Book Appointment",
      description: "Choose your specialist and preferred time"
    },
    {
      step: "3",
      title: "Consultation",
      description: "Meet your doctor via video call"
    },
    {
      step: "4",
      title: "Prescription",
      description: "Receive digital prescriptions if needed"
    }
  ];

  const featuresData = [
    {
      title: "24/7 Availability",
      description: "Access healthcare services anytime, anywhere",
      icon: "🕒"
    },
    {
      title: "Secure Platform",
      description: "HIPAA-compliant video consultations and data protection",
      icon: "🔒"
    },
    {
      title: "Expert Doctors",
      description: "Connect with licensed and experienced healthcare providers",
      icon: "👨‍⚕️"
    },
    {
      title: "Digital Prescriptions",
      description: "Receive and manage prescriptions electronically",
      icon: "📝"
    },
    {
      title: "Easy Scheduling",
      description: "Book and manage appointments with a few clicks",
      icon: "📅"
    },
    {
      title: "Affordable Care",
      description: "Cost-effective healthcare solutions for everyone",
      icon: "💰"
    }
  ];

  // Check if the screen is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: true,
    centerPadding: "15px",
    adaptiveHeight: true,
    swipeToSlide: true,
    touchThreshold: 5,
    cssEase: "ease-out",
    responsive: [
      {
        breakpoint: 480,
        settings: {
          centerPadding: "10px",
          dots: true
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Healthcare at Your Fingertips
              </h1>
              <p className="text-lg md:text-xl text-gray-300">
                Connect with expert doctors virtually, get prescriptions, and manage your health - all from the comfort of your home.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/auth/login">
                  <button className="bg-green-800 text-white px-8 py-3 font-semibold text-lg hover:bg-green-700 transition-colors rounded-[30px]">
                    Get Started
                  </button>
                </Link>
                <Link href="#how-it-works">
                  <button className="bg-transparent border-2 border-white text-white px-8 py-3 font-semibold text-lg hover:bg-white/10 transition-colors rounded-[30px]">
                    Learn More
                  </button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center items-center">
              <div className="relative">
                <Image
                  src="/doc.jpg"
                  alt="Doctor"
                  width={500}
                  height={500}
                  className="border-4 border-white/20 rounded-[30px]"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20" id="how-it-works">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            Your Journey to Better Health
          </h2>
          
          {isMobile ? (
            <div className="px-2 pb-12 -mx-2">
              <Slider {...sliderSettings}>
                {howItWorksData.map((item) => (
                  <div key={item.step} className="px-1">
                    <div className="bg-white rounded-xl shadow-lg p-6 h-full hover:shadow-xl transition-shadow">
                      <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">
                        {item.step}
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-900">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorksData.map((item, index) => (
                <div key={item.step} className="relative">
                  <div className="bg-white rounded-xl shadow-lg p-6 h-full hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                  {index < howItWorksData.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Why Choose Virtual Doc?
          </h2>
          
          {isMobile ? (
            <div className="px-2 pb-12 -mx-2">
              <Slider {...sliderSettings}>
                {featuresData.map((feature) => (
                  <div key={feature.title} className="px-1">
                    <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors h-full">
                      <div className="text-4xl mb-4">{feature.icon}</div>
                      <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                      <p className="text-gray-300">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuresData.map((feature) => (
                <div key={feature.title} className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-20 bg-gray-50" id="contact-us">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            Contact Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">Get in Touch</h3>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder="Joshua Sam"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder="joshua@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder="How can we help you?"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder="Your message here..."
                  ></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full bg-green-800 text-white px-6 py-3 rounded-md font-medium hover:bg-green-700 transition-colors"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
            <div className="flex flex-col justify-between">
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h3 className="text-2xl font-semibold mb-6 text-gray-900">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <svg className="w-6 h-6 text-green-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-gray-900">Phone</h4>
                      <p className="text-gray-600">+233 (030) 999-9900</p>
                      <p className="text-gray-600">+233 (030) 333-3333</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <svg className="w-6 h-6 text-green-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-gray-900">Email</h4>
                      <p className="text-gray-600">support@virtualdoc.com</p>
                      <p className="text-gray-600">info@virtualdoc.com</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-semibold mb-6 text-gray-900">Business Hours</h3>
                <div className="space-y-2">
                  <div className="pt-4 mt-4 border-t border-gray-200">
                    <p className="text-gray-600">
                      <span className="font-medium text-green-600">Note:</span> Our virtual doctors are available 24/7 for emergency consultations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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
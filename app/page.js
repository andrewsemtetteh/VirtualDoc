'use client';

import Image from "next/image";
import Copyright from './components/Copyright';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
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
              <div>
                <button className="bg-green-800 text-white px-10 py-4 font-semibold text-xl hover:bg-green-700 transition-colors rounded-[30px]">
                  Login
                </button>
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
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            Your Journey to Better Health
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {[
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
              },
              {
                step: "5",
                title: "Payment",
                description: "Secure and flexible payment options"
              }
            ].map((item, index) => (
              <div key={item.step} className="relative">
                <div className="bg-white rounded-xl shadow-lg p-6 h-full hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {index < 4 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Why Choose Virtual Doc?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
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
            ].map((feature) => (
              <div key={feature.title} className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <p>support@virtualdoc.com</p>
              <p>1-800-VIRTUAL</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-gray-300 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors">Find Doctors</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors">HIPAA Compliance</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-gray-300 transition-colors">Twitter</a>
                <a href="#" className="hover:text-gray-300 transition-colors">LinkedIn</a>
                <a href="#" className="hover:text-gray-300 transition-colors">Facebook</a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <Copyright />
          </div>
        </div>
      </footer>
    </div>
  );
}
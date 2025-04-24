'use client';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="footer-content">
            <div className="footer-logo flex items-center mb-4">
              <Heart className="w-6 h-6 text-green-400 mr-2" />
              <h3 className="text-xl font-semibold">Virtual Doc</h3>
            </div>
            <p className="text-gray-400">
              Connecting healthcare professionals with patients through secure, convenient virtual consultations.
            </p>
          </div>
          
          <div className="footer-links grid grid-cols-2 gap-8">
            <div className="footer-column">
              <h4 className="text-lg font-semibold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/features" className="text-gray-400 hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="text-gray-400 hover:text-white transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-gray-400 hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Virtual Doc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 
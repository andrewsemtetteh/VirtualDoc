'use client';

import RegisterForm from '../RegisterForm';
import Navbar from '../../components/Navbar';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <RegisterForm />
      </main>
    </div>
  );
} 
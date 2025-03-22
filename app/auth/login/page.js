'use client';

import LoginForm from '../LoginForm';
import Navbar from '../../components/Navbar';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <LoginForm />
      </main>
    </div>
  );
} 
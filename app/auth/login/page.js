'use client';

import LoginForm from '../LoginForm';
import Navbar from '../../components/Navbar';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}
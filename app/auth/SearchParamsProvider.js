'use client';
import { Suspense } from 'react';

export default function SearchParamsProvider({ children }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {children}
    </Suspense>
  );
}

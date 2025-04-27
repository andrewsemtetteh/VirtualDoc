import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;

    // Redirect to login if no token
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // Role-based access control
    if (pathname.startsWith('/dashboard/admin') && token.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard/unauthorized', req.url));
    }

    if (pathname.startsWith('/dashboard/doctor') && token.role !== 'doctor') {
      return NextResponse.redirect(new URL('/dashboard/unauthorized', req.url));
    }

    if (pathname.startsWith('/dashboard/patient') && token.role !== 'patient') {
      return NextResponse.redirect(new URL('/dashboard/unauthorized', req.url));
    }

    // Check doctor verification status
    if (token.role === 'doctor' && token.status !== 'active' && !pathname.includes('/pending-verification')) {
      return NextResponse.redirect(new URL('/dashboard/doctor/pending-verification', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/protected/:path*'
  ]
}; 
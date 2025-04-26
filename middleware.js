import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Redirect users based on their role
    if (path.startsWith('/dashboard')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
      }

      const role = token.role;
      if (path.startsWith('/dashboard/admin') && role !== 'admin') {
        return NextResponse.redirect(new URL(`/dashboard/${role}`, req.url));
      }
      if (path.startsWith('/dashboard/doctor') && role !== 'doctor') {
        return NextResponse.redirect(new URL(`/dashboard/${role}`, req.url));
      }
      if (path.startsWith('/dashboard/patient') && role !== 'patient') {
        return NextResponse.redirect(new URL(`/dashboard/${role}`, req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*'],
}; 
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/admin-login', request.url));
  }

  return NextResponse.next();
}

// Only match paths that should be protected
export const config = {
  matcher: [
    '/admin/:path*', // protects /admin and all subpages
    '/dashboard/:path*',
    '/protected/:path*',
  ],
};

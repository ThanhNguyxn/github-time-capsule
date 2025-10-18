import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Add security headers to all responses
  const response = NextResponse.next();

  // Security Headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=()'
  );
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.github.com; frame-ancestors 'none';"
  );

  // Protect API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Check for required headers
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    
    // In production, verify origin matches your domain
    if (process.env.NODE_ENV === 'production') {
      // Allow NEXTAUTH_URL origin, GitHub, and dynamic Vercel preview/production URLs
      const allowedOrigins = [
        process.env.NEXTAUTH_URL,
        'https://github.com',
      ];

      // Also allow the request host itself (for Vercel preview domains)
      const requestOrigin = origin || `${request.nextUrl.protocol}//${request.headers.get('host')}`;

      const isAllowed = allowedOrigins.some(allowed => allowed && requestOrigin.startsWith(allowed)) ||
                        // Allow same-host origin (handles Vercel previews and custom domains)
                        requestOrigin.endsWith(request.headers.get('host') || '');

      if (origin && !isAllowed) {
        return new NextResponse('Forbidden', { status: 403 });
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)',
  ],
};

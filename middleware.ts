import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoute = createRouteMatcher([
  '/',
  '/upcoming',
  '/meeting(.*)',
  '/previous',
  '/personal-room',
]);

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Sửa `x-forwarded-host` để khớp với `origin`
  const origin = req.headers.get('origin');
  const response = NextResponse.next();

  if (origin) {
    response.headers.set('x-forwarded-host', new URL(origin).host);
  }

  return response;
}

export default clerkMiddleware((auth, req) => {
  if (protectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};


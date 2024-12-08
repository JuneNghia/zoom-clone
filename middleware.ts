import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse, NextRequest } from "next/server";

const protectedRoute = createRouteMatcher([
  '/',
  '/upcoming',
  '/meeting(.*)',
  '/previous',
  '/personal-room',
]);


export const actionHeaderCheckOverride = (req: NextRequest) => {
  console.debug("REQUEST HEADERS:::: ", req.headers);

  const response = NextResponse.next();
  response.headers.set(
    "x-forwarded-host",
    req.headers.get("origin")?.replace(/(http|https):\/\//, "") || "*"
  );
  return response;
};


export default clerkMiddleware((auth, req) => {
  if (protectedRoute(req)) auth().protect();

  return actionHeaderCheckOverride(req);
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};



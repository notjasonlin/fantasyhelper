import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log('Middleware - Current path:', req.nextUrl.pathname);
  console.log('Middleware - Session exists:', !!session);

  // If there's no session and the user is trying to access a protected route
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    console.log('Middleware - Redirecting to sign-in');
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/sign-in';
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up'],
};

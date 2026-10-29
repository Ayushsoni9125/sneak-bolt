import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { verifyJwtToken } from '@/lib/jwt';
import { getSafeRedirectUrl } from '@/lib/validations';

/**
 * Applies defense-in-depth security headers to any outgoing response.
 */
export function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), browsing-topics=()'
  );
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  );
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://images.unsplash.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
  );
  return response;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — do not remove or change order
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Also support seamless instant session with cryptographically signed JWT
  let activeUser = user;
  let activeRole = 'collector';

  if (!activeUser) {
    const collectorToken = request.cookies.get('collector_session')?.value;
    if (collectorToken) {
      const verified = await verifyJwtToken(collectorToken);
      if (verified) {
        activeUser = {
          id: verified.id,
          email: verified.email,
          user_metadata: { full_name: verified.full_name },
        } as unknown as typeof user;
        activeRole = verified.role;
      }
    }
  }

  const pathname = request.nextUrl.pathname;

  // Protected admin routes
  if (pathname.startsWith('/admin')) {
    if (!activeUser) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      loginUrl.searchParams.set('redirectTo', getSafeRedirectUrl(pathname));
      return applySecurityHeaders(NextResponse.redirect(loginUrl));
    }

    // Role check for admin routes — verified server-side
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        const unauthorizedUrl = request.nextUrl.clone();
        unauthorizedUrl.pathname = '/unauthorized';
        return applySecurityHeaders(NextResponse.redirect(unauthorizedUrl));
      }
    } else if (activeRole !== 'admin') {
      const unauthorizedUrl = request.nextUrl.clone();
      unauthorizedUrl.pathname = '/unauthorized';
      return applySecurityHeaders(NextResponse.redirect(unauthorizedUrl));
    }
  }

  // Protected account routes
  if (pathname.startsWith('/account') && !activeUser) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('redirectTo', getSafeRedirectUrl(pathname));
    return applySecurityHeaders(NextResponse.redirect(loginUrl));
  }

  return applySecurityHeaders(supabaseResponse);
}

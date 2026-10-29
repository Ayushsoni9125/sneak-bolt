import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { verifyJwtToken } from '@/lib/jwt';

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
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
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
        return NextResponse.redirect(unauthorizedUrl);
      }
    } else if (activeRole !== 'admin') {
      const unauthorizedUrl = request.nextUrl.clone();
      unauthorizedUrl.pathname = '/unauthorized';
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  // Protected account routes
  if (pathname.startsWith('/account') && !activeUser) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

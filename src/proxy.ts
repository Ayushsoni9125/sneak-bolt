import { NextResponse, type NextRequest } from 'next/server';
import { updateSession, applySecurityHeaders } from '@/lib/supabase/middleware';

// ── In-Memory Rate Limiting ──────────────────────────────────────────────────
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up stale rate limit entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function checkRateLimit(
  ip: string,
  pathname: string
): { allowed: boolean; remaining: number; limit: number } {
  const now = Date.now();

  // Periodic memory cleanup
  if (now - lastCleanup > CLEANUP_INTERVAL) {
    for (const [key, record] of rateLimitMap.entries()) {
      if (record.resetAt <= now) {
        rateLimitMap.delete(key);
      }
    }
    lastCleanup = now;
  }

  // Tighter limits on authentication & sensitive action endpoints
  const isAuthRoute =
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/api');
  const limit = isAuthRoute ? 40 : 200; // max requests per minute window
  const windowMs = 60 * 1000;

  const key = `${ip}:${isAuthRoute ? 'auth' : 'general'}`;
  const existing = rateLimitMap.get(key);

  if (!existing || existing.resetAt <= now) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, limit };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, limit };
  }

  existing.count += 1;
  return { allowed: true, remaining: limit - existing.count, limit };
}

// ── Allowed HTTP Methods ─────────────────────────────────────────────────────
const ALLOWED_METHODS = new Set(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']);

// ── Suspicious Request Patterns ──────────────────────────────────────────────
const FORBIDDEN_PATH_PATTERNS = [
  /\/\.(?:env|git|data|svn|htaccess|aws|ssh|DS_Store|bak|config)/i,
  /\.\.(?:\/|\\)/, // Directory traversal
  /%00|\\0/, // Null byte injection
  /\/(?:wp-admin|phpmyadmin|actuator|xmlrpc\.php)/i, // Common vulnerability scanners
];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const method = request.method;

  // 1. HTTP Method Check
  if (!ALLOWED_METHODS.has(method)) {
    return applySecurityHeaders(
      new NextResponse('Method Not Allowed', {
        status: 405,
        headers: { Allow: 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS' },
      })
    );
  }

  // 2. Suspicious Path / Path Traversal / Hidden File Protection
  for (const pattern of FORBIDDEN_PATH_PATTERNS) {
    if (pattern.test(pathname) || pattern.test(request.url)) {
      return applySecurityHeaders(
        new NextResponse('Forbidden: Access Denied', { status: 403 })
      );
    }
  }

  // 3. Client IP Identification & Rate Limiting
  const forwardedFor = request.headers.get('x-forwarded-for');
  const clientIp =
    (forwardedFor ? forwardedFor.split(',')[0].trim() : null) ||
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1';

  const rateCheck = checkRateLimit(clientIp, pathname);
  if (!rateCheck.allowed) {
    return applySecurityHeaders(
      new NextResponse('Too Many Requests. Please slow down and try again later.', {
        status: 429,
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Limit': String(rateCheck.limit),
          'X-RateLimit-Remaining': '0',
        },
      })
    );
  }

  // 4. Session & Route Authorization
  const response = await updateSession(request);

  // Set rate limit headers on response
  response.headers.set('X-RateLimit-Limit', String(rateCheck.limit));
  response.headers.set('X-RateLimit-Remaining', String(rateCheck.remaining));

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public asset extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

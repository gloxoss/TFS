import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import PocketBase from 'pocketbase';
import acceptLanguage from 'accept-language';
import { fallbackLng, languages } from './app/i18n/settings';
import { ROLES } from './types/auth';
import { PB_URL, buildCSPHeader } from './lib/pocketbase/config';
import { logger } from './lib/logger';

acceptLanguage.languages(languages);

export const config = {
  // Matcher ignoring `/_next/`, `/api/`, `/images/`, etc
  matcher: ['/((?!api|_next/static|_next/image|images|assets|favicon.ico|favcon.png|sw.js).*)'],
};

/**
 * Safely parse the PocketBase auth cookie
 */
function parseAuthCookie(cookieValue: string) {
  try {
    let decoded = decodeURIComponent(cookieValue);
    // Handle legacy format: strip "pb_auth=" prefix if present
    if (decoded.startsWith("pb_auth=")) {
      decoded = decoded.substring(8);
    }
    return JSON.parse(decoded);
  } catch (e) {
    logger.warn('Failed to parse auth cookie', { error: e });
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const pb = new PocketBase(PB_URL);

  // -----------------------------------------------------------------------
  // 0. Security Headers
  // -----------------------------------------------------------------------
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Content-Security-Policy', buildCSPHeader());
  // Preconnect to grainy gradients (used for effects)
  response.headers.set('Link', '<https://grainy-gradients.vercel.app>; rel=preconnect');

  // -----------------------------------------------------------------------
  // 1. I18n Redirection Logic
  // -----------------------------------------------------------------------
  let lng;
  if (request.cookies.has('i18next')) {
    lng = acceptLanguage.get(request.cookies.get('i18next')?.value);
  }
  if (!lng) {
    lng = acceptLanguage.get(request.headers.get('Accept-Language'));
  }
  if (!lng) {
    lng = fallbackLng;
  }

  // Check if pathname already has a locale
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = languages.every(
    (l) => !pathname.startsWith(`/${l}/`) && pathname !== `/${l}`
  );

  // Redirect if missing locale
  if (pathnameIsMissingLocale) {
    return NextResponse.redirect(
      new URL(`/${lng}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
    );
  }

  // -----------------------------------------------------------------------
  // 2. RBAC Strategy (Unified Security)
  // -----------------------------------------------------------------------

  // Extract path without locale for checking protected routes
  // e.g. "/en/admin" -> "/admin"
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');

  const isAdminPath = pathWithoutLocale.startsWith('/admin') || pathWithoutLocale === '/admin';
  const isDashboardPath = pathWithoutLocale.startsWith('/dashboard') || pathWithoutLocale === '/dashboard';
  const isAccountPath = pathWithoutLocale.startsWith('/account');
  const isLoginPath = pathWithoutLocale.startsWith('/login') || pathWithoutLocale === '/login';
  const isRegisterPath = pathWithoutLocale.startsWith('/register') || pathWithoutLocale === '/register';

  // -----------------------------------------------------------------------
  // 2.1 Client Portal Feature Flag Check
  // -----------------------------------------------------------------------
  const isClientPortalEnabled = process.env.ENABLE_CLIENT_PORTAL === 'true';
  // Login is allowed (admins need it), but register/dashboard/account are blocked for clients
  const isClientOnlyPath = isRegisterPath || isDashboardPath || isAccountPath;

  // Block client-only routes when portal disabled (login stays available for admins)
  if (!isClientPortalEnabled && isClientOnlyPath && !isAdminPath) {
    logger.debug('Client portal disabled, blocking path', { path: pathWithoutLocale });
    const currentLocale = pathname.split('/')[1] || fallbackLng;
    const url = request.nextUrl.clone();
    url.pathname = `/${currentLocale}/`;
    return NextResponse.redirect(url);
  }

  // If it's a protected path, we check auth
  if (isAdminPath || isDashboardPath || isAccountPath) {
    // Load auth state from cookies
    const authCookie = request.cookies.get('pb_auth');

    if (authCookie) {
      const authData = parseAuthCookie(authCookie.value);
      if (authData) {
        pb.authStore.save(authData.token, authData.record);
      }
    }

    const isValid = pb.authStore.isValid;

    // Logic: Redirect if not allowed
    if (!isValid) {
      logger.debug('Auth not valid, redirecting to login');
      // Not logged in -> Go to Login (preserving locale)
      // Extract locale from current path to keep user in same language
      const currentLocale = pathname.split('/')[1] || fallbackLng;
      const url = request.nextUrl.clone();
      url.pathname = `/${currentLocale}/login`;
      url.searchParams.set('redirect', pathname); // Add redirect param
      return NextResponse.redirect(url);
    }

    if (isAdminPath && isValid) {
      // Logged in but checking Role
      const userRole = pb.authStore.model?.role;

      // Strict Admin Check
      if (userRole !== ROLES.ADMIN) {
        logger.debug('Access denied: User is not admin');
        // Not an admin -> Go to Home
        const currentLocale = pathname.split('/')[1] || fallbackLng;
        const url = request.nextUrl.clone();
        url.pathname = `/${currentLocale}/`;
        return NextResponse.redirect(url);
      }
    }
  }

  return response;
}

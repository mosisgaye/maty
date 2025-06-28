// ================================================
// FICHIER: /src/middleware.ts
// ================================================
// Middleware avec protection contre HTTPS en local

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SEO_CONFIG } from './lib/seo/config';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Headers de sécurité et SEO
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Redirections 301 pour anciennes URLs
  const redirects: Record<string, string> = {
    '/mobile': '/forfaits-mobiles',
    '/internet': '/box-internet',
    '/forfait-mobile': '/forfaits-mobiles',
    '/telephone': '/telephones',
  };
  
  const pathname = request.nextUrl.pathname;
  if (redirects[pathname]) {
    return NextResponse.redirect(
      new URL(redirects[pathname], request.url),
      { status: 301 }
    );
  }
  
  // Forcer HTTPS en production SEULEMENT (pas en local)
  const host = request.headers.get('host') || '';
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1') || host.includes('0.0.0.0');
  
  if (process.env.NODE_ENV === 'production' && !isLocalhost) {
    const proto = request.headers.get('x-forwarded-proto');
    if (proto === 'http') {
      return NextResponse.redirect(
        `https://${host}${request.nextUrl.pathname}${request.nextUrl.search}`,
        { status: 301 }
      );
    }
  }
  
  return response;
}

export const config = {
  matcher: [
    // Exclure TOUS les fichiers statiques et API
    '/((?!api|_next/static|_next/image|favicon.ico|favicon.png|favicon.svg|apple-touch-icon.png|android-chrome-.*\\.png|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$|.*\\.webp$|.*\\.xml$|.*\\.txt$|.*\\.webmanifest$).*)',
  ],
};
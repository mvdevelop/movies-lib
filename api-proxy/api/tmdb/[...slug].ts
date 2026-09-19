import { NextRequest, NextResponse } from 'next/server';

/**
 * TMDB API Proxy — Vercel Serverless Function
 *
 * This function proxies requests to the TMDB API, keeping the API key
 * on the server-side where it cannot be extracted from the client bundle.
 *
 * Security features:
 * - Rate limiting per IP address
 * - Request logging for audit
 * - Security headers (CSP, X-Frame-Options, etc.)
 * - Error handling without leaking internals
 * - Response caching
 *
 * @see https://vercel.com/docs/concepts/functions/serverless-functions
 */

// =============================================================================
// Configuration
// =============================================================================

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const CACHE_TTL = 5 * 60; // 5 minutes in seconds

// =============================================================================
// Input validation
// =============================================================================

/**
 * Validates that slug segments contain only safe characters
 * to prevent path traversal or injection attacks.
 */
function validateSlugSegment(segment: string): boolean {
  // Only allow alphanumeric, hyphens, underscores, and dots
  return /^[a-zA-Z0-9._-]+$/.test(segment);
}

/**
 * Validates query parameters to prevent injection.
 */
function validateQueryParam(value: string): boolean {
  // Limit length and allow only URL-safe characters
  if (value.length > 500) return false;
  return /^[a-zA-Z0-9\s.,'"?!:()&/+@_-]+$/.test(value);
}

// =============================================================================
// Rate Limiter (Simple in-memory — for production use Redis)
// =============================================================================

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();
const RATE_LIMIT = 10; // requests per window
const RATE_LIMIT_WINDOW = 60; // seconds

function checkRateLimit(ip: string): { allowed: boolean; resetAt: number } {
  const now = Date.now() / 1000;
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, resetAt: now + RATE_LIMIT_WINDOW };
  }

  if (entry.count >= RATE_LIMIT) {
    return { allowed: false, resetAt: entry.resetTime };
  }

  entry.count += 1;
  return { allowed: true, resetAt: entry.resetTime };
}

// =============================================================================
// Request Handler
// =============================================================================

export const config = {
  // Increase timeout for TMDB API calls
  maxDuration: 30,
};

export async function GET(request: NextRequest, { params }: { params: { slug: string[] } }) {
  const startTime = Date.now();

  // Validate API key is configured
  if (!TMDB_API_KEY) {
    console.error('[API Proxy] TMDB_API_KEY not configured');
    return new NextResponse(
      JSON.stringify({
        error: 'Server misconfiguration',
        message: 'API key not set on server',
      }),
      { status: 500, headers: securityHeaders() }
    );
  }

  // Validate slug segments
  const slug = params.slug;
  if (!slug || slug.length === 0) {
    return new NextResponse(
      JSON.stringify({ error: 'Invalid endpoint' }),
      { status: 400, headers: securityHeaders() }
    );
  }

  for (const segment of slug) {
    if (!validateSlugSegment(segment)) {
      console.warn('[API Proxy] Invalid slug segment:', segment);
      return new NextResponse(
        JSON.stringify({ error: 'Invalid path segment' }),
        { status: 400, headers: securityHeaders() }
      );
    }
  }

  // Validate query parameters
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  for (const [key, value] of searchParams.entries()) {
    if (!validateQueryParam(value)) {
      console.warn('[API Proxy] Invalid query parameter:', key, value);
      return new NextResponse(
        JSON.stringify({ error: 'Invalid query parameter' }),
        { status: 400, headers: securityHeaders() }
      );
    }
  }

  // Rate limiting
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
             request.headers.get('x-real-ip') ||
             'unknown';

  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return new NextResponse(
      JSON.stringify({
        error: 'Rate limit exceeded',
        message: `Too many requests. Try again in ${Math.ceil(rateLimit.resetAt - Date.now() / 1000)} seconds.`,
      }),
      {
        status: 429,
        headers: {
          ...securityHeaders(),
          'Retry-After': String(Math.ceil(rateLimit.resetAt - Date.now() / 1000)),
          'X-RateLimit-Limit': String(RATE_LIMIT),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  // Build TMDB URL
  const apiUrl = new URL(`${BASE_URL}/${slug.join('/')}`);
  searchParams.append('api_key', TMDB_API_KEY);
  searchParams.append('language', 'pt-BR');
  apiUrl.search = searchParams.toString();

  // Log request (sanitized — no API key in logs)
  console.log('[API Proxy] Request:', {
    path: slug.join('/'),
    ip: ip.substring(0, 7), // Partially mask IP for privacy
    params: Object.fromEntries(searchParams.entries()).reduce(
      (acc: Record<string, string>, [key, value]) => {
        if (key !== 'api_key') acc[key] = value;
        return acc;
      },
      {}
    ),
  });

  try {
    const response = await fetch(apiUrl.toString(), {
      headers: {
        Accept: 'application/json',
      },
    });

    const data = await response.json();
    const duration = Date.now() - startTime;

    // Log response (sanitized)
    console.log('[API Proxy] Response:', {
      path: slug.join('/'),
      status: response.status,
      duration: `${duration}ms`,
    });

    // Return response with security headers
    return new NextResponse(JSON.stringify(data), {
      status: response.status,
      headers: {
        ...securityHeaders(),
        'Cache-Control': `public, s-maxw=${CACHE_TTL}, stale-while-revalidate=60`,
        'X-Response-Time': `${duration}ms`,
      },
    });
  } catch (error) {
    console.error('[API Proxy] Error:', error);

    return new NextResponse(
      JSON.stringify({
        error: 'Failed to fetch from TMDB',
        message: 'A network error occurred while contacting the API',
      }),
      {
        status: 502,
        headers: securityHeaders(),
      }
    );
  }
}

/**
 * Returns security headers for all responses.
 */
function securityHeaders(): Record<string, string> {
  return {
    // Prevent XSS
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',

    // Referrer policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // CSP
    'Content-Security-Policy': "default-src 'self'; img-src 'self' https://*.tmdb.org https://*.themoviedb.org data:; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.themoviedb.org",

    // HSTS
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

    // Cache control for errors
    'Cache-Control': 'no-store',
  };
}

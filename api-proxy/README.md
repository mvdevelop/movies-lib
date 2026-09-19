# API Proxy — TMDB

Backend proxy for TMDB API that prevents API key exposure on the client-side.

## Why

The TMDB API key should never be committed to the client-side bundle. This proxy:

1. Stores the API key securely on the server (environment variable)
2. Adds rate limiting per IP to prevent quota abuse
3. Adds security headers (CSP, X-Frame-Options, etc.)
4. Logs requests for observability
5. Caches responses for performance

## Deploy

### Vercel (Recommended)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
cd api-proxy
vercel

# 3. Set environment variable
vercel env add TMDB_API_KEY
```

### Local Development

```bash
npm install
npm run dev
# Proxy available at http://localhost:3000/api
```

## Environment Variables

| Variable      | Description                      |
|---------------|----------------------------------|
| `TMDB_API_KEY` | Your TMDB API v3 key (required) |

## Endpoints

All TMDB endpoints are proxied:

```
GET /api/tmdb/movie/popular
GET /api/tmdb/movie/{id}
GET /api/tmdb/search/movie?query=...
GET /api/tmdb/genre/movie/list
GET /api/tmdb/discover/movie?...
```

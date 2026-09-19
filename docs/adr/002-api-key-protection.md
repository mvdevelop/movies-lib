# ADR-002: API Key Protection Strategy

## Status

Accepted (2025-01-01)

## Context

The TMDB API requires an API key that is typically passed as a query parameter. If the key is exposed in client-side code:

1. **Quota abuse**: Anyone can use the key until the quota is exhausted
2. **Rate limiting bypass**: No server-side rate limiting protection
3. **Terms of service violation**: TMDB may suspend the key
4. **Security risk**: Compromised key affects all users

Originally, the API key was hardcoded in `.env` and passed directly to the browser via `import.meta.env.VITE_API_KEY`.

## Decision

We will implement a **two-layer defense** for API key protection:

### Layer 1: Environment-based protection (current)

- Remove `.env` from version control
- Add `.env.example` as a template with placeholder values
- Add pre-commit hooks to prevent accidental commits of `.env` files
- Add `scripts/security-cleanup.sh` for secret purging from Git history

### Layer 2: Backend proxy (planned)

- Deploy a serverless function as a proxy to TMDB API
- API key stored as a server-side environment variable
- Proxy includes rate limiting (per IP), logging, and caching
- Frontend calls proxy instead of TMDB directly

The backend proxy is implemented at `api-proxy/api/tmdb/[...slug].ts` (Vercel Serverless Function).

### Client Configuration

The client automatically detects whether to use the proxy or direct API:

```typescript
// If VITE_API_PROXY_URL is set, use proxy
// Otherwise, use direct API (for development only)
const BASE_URL =
  import.meta.env.VITE_API_PROXY_URL ||
  import.meta.env.VITE_API_URL ||
  'https://api.themoviedb.org/3';
```

## Consequences

### Positive

- **API key never reaches the browser** (in production with proxy)
- **Rate limiting** enforced at the server level
- **Structured logging** of all API requests
- **Response caching** reduces TMDB API quota consumption
- **Audit trail** of all API access

### Negative

- **Additional infrastructure** (serverless function deployment)
- **Slight latency** increase for proxied requests
- **Increased complexity** in debugging API issues

## Alternatives Considered

| Alternative | Pros | Cons |
|-------------|------|------|
| Client-side key only | Simple, no backend needed | Key exposed in bundle, no rate limiting |
| Backend REST API | Full control, can add auth | More infrastructure, maintenance overhead |
| Edge functions (Cloudflare Workers) | Low latency, good performance | Vendor lock-in |
| API gateway (AWS API Gateway) | Robust, scalable | Complex setup |

## Migration Path

1. **Phase 1** (done): Remove `.env` from Git, add templates
2. **Phase 2** (planned): Deploy proxy to Vercel
3. **Phase 3** (planned): Set `VITE_API_PROXY_URL` in production

## References

- [OWASP API Security Top 10](https://owasp.org/Top10-API/2023/)
- [TMDB API Documentation](https://developer.themoviedb.org/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions)

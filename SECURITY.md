# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Security Measures

This project implements the following security controls:

### 1. Secrets Management
- `.env` files are **never committed** (validated by pre-commit hooks)
- `.env.example` template provided for safe onboarding
- API keys validated at runtime with clear error messages

### 2. Input Validation & Sanitization
- All user inputs are sanitized before use
- Image URLs use whitelist-based validation
- YouTube video keys validated with strict regex (11 alphanumeric chars)

### 3. Rate Limiting
- Client-side rate limiter (4 req/s) prevents API quota abuse
- Planned: Backend proxy with server-side rate limiting

### 4. Error Handling
- Centralized error handling via Axios interceptors
- No stack traces exposed to users
- Structured error logging

### 5. Security Headers (Planned)
- CSP (Content Security Policy)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- HSTS (Strict-Transport-Security)

## Reporting a Vulnerability

If you discover a security vulnerability, please report it by:

1. **Email**: marcosvmdilly@gmail.com
2. **GitHub Security Advisory**: Use the "Report a Vulnerability" tab

### What to include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (optional)

### Response timeline:
- **24 hours**: Initial acknowledgment
- **72 hours**: Investigation and validation
- **7 days**: Patch released (for Critical/High issues)

## Known Issues

- [ ] API Key currently loaded client-side (mitigated by rate limiting, fix: backend proxy)
- [ ] No HTTPS enforcement yet (resolved by GitHub Pages HTTPS)
- [ ] No CSP header (planned via backend/CDN)

## Security Checklist for Contributors

- [ ] No secrets in code or commit history
- [ ] All inputs validated and sanitized
- [ ] No hardcoded credentials
- [ ] Dependencies scanned for vulnerabilities
- [ ] Tests include security-related scenarios

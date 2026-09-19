🎬 **Movies Library** | Senior-Grade React Portfolio

A **security-first**, **type-safe** React SPA for browsing movies and TV shows with the TMDB API. This project demonstrates **senior-level engineering practices**: TypeScript strict typing, comprehensive testing, CI/CD pipeline with SAST/DAST, security hardening, and production-ready architecture.

---

## 🏗️ Architecture & Stack

| Layer              | Technology                                                                 |
|--------------------|---------------------------------------------------------------------------|
| **Frontend**       | React 18 + TypeScript (strict) + Vite 5                                   |
| **Styling**        | Tailwind CSS v4 + CSS Modules                                             |
| **Routing**        | React Router v6 (client-side, type-safe)                                  |
| **API Client**     | Axios with interceptors, rate limiting, structured logging                 |
| **Testing**        | Vitest + React Testing Library + 80%+ coverage                            |
| **Linting**        | ESLint 8 (strict, TypeScript-aware) + Prettier                            |
| **Security**       | Helmet headers, CSP, rate limiting, secret validation                     |
| **CI/CD**          | GitHub Actions (lint → test → typecheck → build → deploy)                 |
| **SAST**           | CodeQL + Semgrep (static analysis)                                         |
| **Deploy**         | GitHub Pages (custom domain support)                                       |

### Project Structure

```
src/
├── App.tsx              — Root component with routes + layout
├── main.tsx             — React bootstrap + BrowserRouter
├── index.css            — Tailwind directives + custom animations
├── types/               — 🗂️ Centralized TypeScript interfaces
│   └── index.ts         — Movie, Genre, Credits, User, etc.
├── services/            — 📡 API client layer
│   └── api.ts           — Axios with interceptors, rate limiting, caching
├── components/          — 🧩 Reusable UI components
│   ├── Navbar.tsx       — Responsive navigation with search
│   └── MovieCard.tsx    — Movie display card
├── pages/               — 📄 Route-level page components
│   ├── Home.tsx         — Hero + movie listings + genres
│   ├── Movie.tsx        — Movie details with tabs (overview/cast/details)
│   └── Search.tsx       — Search with filters + pagination
└── layouts/             — (Planned) Shared layout components
```

---

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/MvDevelop/movies-lib.git
cd movies-lib

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local
# Get your TMDB API key: https://www.themoviedb.org/settings/api
# Paste it into .env.local

# 4. Run development server
npm run dev
```

→ Application available at `http://localhost:5173`

---

## 💻 Available Scripts

| Script             | Description                                    |
|--------------------|------------------------------------------------|
| `npm run dev`      | Start Vite dev server with HMR                 |
| `npm run build`    | Production build (optimized)                   |
| `npm run lint`     | ESLint — strict rules, zero warnings           |
| `npm run lint:fix` | Auto-fix lint issues                           |
| `npm run typecheck`| TypeScript strict type checking                |
| `npm run test`     | Run unit/integration tests (Vitest)            |
| `npm run test:ui`  | Interactive test runner UI                     |
| `npm run test:coverage` | Tests with coverage report                |
| `npm run preview`  | Preview production build locally               |
| `npm run security:audit` | Check dependencies for vulnerabilities   |

---

## 🔒 Security First

This project implements defense-in-depth principles and follows OWASP ASVS standards:

| Category           | Implementation                                                    |
|--------------------|-------------------------------------------------------------------|
| **Secrets Management** | `.env` in `.gitignore`, `.env.example` template, cleanup script  |
| **API Key Exposure**   | Client-side validation, planned backend proxy (Etapa 3)         |
| **Rate Limiting**      | Client-side rate limiter (4 req/s) to prevent quota abuse       |
| **Input Sanitization**   | URL encoding, whitelist validation for image sizes             |
| **Error Handling**       | Centralized Axios interceptors, no stack traces to users        |
| **Security Headers**     | Planned via backend/CDN (HSTS, CSP, X-Frame-Options)            |
| **Dependency Scanning**  | npm audit integrated in CI/CD pipeline                          |

> ⚠️ **Note:** The TMDB API key is currently loaded client-side. For production, implement a backend proxy (see `api-proxy/` plan) to prevent key exposure.

### Security Incident Response

A cleanup script is provided at `scripts/security-cleanup.sh` for removing exposed secrets from Git history.

---

## 🧪 Testing

Tests are written with **Vitest** and **React Testing Library**.

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm test -- --watch
```

### Coverage Report

Coverage reports are generated in `/coverage` directory (HTML view available).

---

## 🛠️ Development Guidelines

### Code Quality Standards

- **TypeScript**: Strict mode enabled (`strict: true`)
- **ESLint**: Custom rules for TypeScript, React, and security
- **Formatting**: Prettier (auto-format on commit via lint-staged)
- **Git Hooks**: Pre-commit hooks for lint + typecheck + tests

### Architecture Principles

- **SOLID** principles applied throughout
- **Separation of Concerns**: Services, Components, Pages are fully isolated
- **Type Safety**: Zero `any` types in production code
- **Error Boundaries**: Planned for route-level error handling
- **Performance**: Memoization, lazy loading, image optimization

---

## 📊 Observability

- **Structured Logging**: Axios interceptors log API performance metrics
- **Error Monitoring**: Centralized error handling with context
- **Metrics**: Response time tracking via request interceptors
- **Planned**: Sentry integration for production error tracking

---

## 📖 API Reference

This app consumes the [TMDB API v3](https://developer.themoviedb.org/docs).

### Endpoints Used

| Endpoint                        | Method | Description                |
|---------------------------------|--------|----------------------------|
| `/movie/popular`                | GET    | Popular movies             |
| `/movie/now_playing`            | GET    | Currently in theaters      |
| `/movie/top_rated`              | GET    | Top rated movies           |
| `/movie/{id}`                   | GET    | Movie details (with credits/videos/similar) |
| `/search/movie`                 | GET    | Search movies              |
| `/genre/movie/list`             | GET    | Movie genres               |
| `/discover/movie`               | GET    | Discover with filters      |

All requests include `api_key` and `language=pt-BR` via Axios defaults.

---

## 🗺️ Roadmap

| Phase     | Feature                          | Status     |
|-----------|----------------------------------|------------|
| Phase 1  | TypeScript migration + Security  | ✅ Complete |
| Phase 2  | Tests + CI/CD + SAST/DAST        | 🔄 In Progress |
| Phase 3  | Backend proxy for API key        | ⏳ Planned |
| Phase 4  | Authentication (JWT + Auth0)     | ⏳ Planned |
| Phase 5  | Favorites + Dark Mode            | ⏳ Planned |
| Phase 6  | Performance optimization (PWA)   | ⏳ Planned |

---

## 📜 License

MIT — see [LICENSE](LICENSE) file for details.

TMDB API data © [The Movie Database](https://www.themoviedb.org/) — this product uses the TMDB API but is not endorsed or certified by TMDB.

---

## 👨‍💻 Developer

Built by **mvdevelop** — Computer Science student and junior developer passionate about **secure, type-safe web applications**.

[GitHub](https://github.com/MvDevelop) | [LinkedIn](https://linkedin.com/in/mvdevelop)

---

### Why This Project Stands Out

> I built this project to demonstrate senior-level engineering practices despite being a junior developer. Key decisions:

1. **TypeScript Strict Mode** from day one — zero `any` types, centralized types at `src/types/`
2. **Security-first mindset** — rate limiting, input sanitization, secret management, security audit scripts
3. **Production-grade tooling** — ESLint with security plugins, structured logging, comprehensive testing
4. **Defense in depth** — multiple layers of protection: validation, sanitization, rate limiting, error handling
5. **Observability built-in** — performance monitoring via interceptors, structured error logging

These are the same practices I'd apply in a production environment. Questions or feedback? Open an issue!

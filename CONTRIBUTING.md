# Contributing to Movies Library

Thank you for your interest in contributing to this project! This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Security](#security)
- [Pull Requests](#pull-requests)

## Code of Conduct

This project follows the spirit of the [Contributor Covenant](https://www.contributor-covenant.org/). Be respectful and constructive in all interactions.

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- Git

### Setup

```bash
# 1. Fork & clone
git clone https://github.com/YOUR-USERNAME/movies-lib.git
cd movies-lib

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local
# Get your TMDB API key: https://www.themoviedb.org/settings/api

# 4. Start development server
npm run dev
```

## Development Workflow

1. **Create a branch** for your feature:
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes** following the code standards below.

3. **Run checks** before committing:
   ```bash
   npm run typecheck
   npm run lint
   npm test
   ```

4. **Commit** using conventional commits:
   ```bash
   git commit -m "feat: add new feature"
   ```

5. **Push and open a PR**:
   ```bash
   git push origin feat/your-feature-name
   ```

## Code Standards

This project uses strict TypeScript and ESLint rules:

- **TypeScript**: `strict: true` mode required
- **No `any` types** — use `unknown` or proper interfaces
- **Type imports**: Use `import type` for type-only imports
- **Prettier**: Run `prettier --write .` before committing

### Import Order

```typescript
// 1. External packages
import { useState } from 'react';
import { Link } from 'react-router-dom';

// 2. Internal type imports
import type { Movie } from '@/types';

// 3. Internal utility imports
import { getImageUrl } from '@/services/api';
```

## Testing

We use **Vitest** with **React Testing Library**:

```bash
# Run all tests
npm test

# Run with watch mode
npm test -- --watch

# Run with coverage
npm run test:coverage
```

### Test Structure

- Unit tests: `src/__tests__/components/` and `src/__tests__/services/`
- Integration tests: `src/__tests__/pages/`
- Coverage threshold: 80% minimum

## Security

See [SECURITY.md](SECURITY.md) for security policies.

**Important**: Never commit `.env` files or API keys. If you accidentally commit a secret:

1. **Immediately** rotate the key
2. Run `scripts/security-cleanup.sh` to purge from Git history
3. Notify the security team

## Pull Requests

1. Ensure all checks pass (CI will verify):
   - ✅ TypeScript type checking
   - ✅ ESLint linting
   - ✅ All tests pass with coverage
   - ✅ Security audit passes

2. **PR Title** should follow conventional commits:
   - `feat: add movie search functionality`
   - `fix: resolve TypeError on mobile view`
   - `security: update axios to fix CVE-2024-XXXX`
   - `refactor: extract API client to separate module`

3. **PR Description** should include:
   - What changes were made
   - Why the changes were needed
   - Any breaking changes
   - Screenshots (if UI changes)

4. **Review Process**:
   - At least 1 approval required
   - All CI checks must pass
   - No Critical/High security issues

## Questions?

Open an issue or reach out on GitHub Discussions!

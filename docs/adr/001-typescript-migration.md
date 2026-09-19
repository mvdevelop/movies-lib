# ADR-001: TypeScript Migration Strategy

## Status

Accepted (2025-01-01)

## Context

The project was initially written in JavaScript (JSX). As the project matures, type safety becomes increasingly important for:

1. **Developer experience**: Catch bugs at compile-time rather than runtime
2. **Code quality**: Enforce interfaces and contracts between components
3. **Maintainability**: Self-documenting code that scales
4. **Recruitability**: TypeScript is a de-facto standard for React projects

## Decision

We will migrate the entire codebase from JavaScript to TypeScript using a **strangler-fig pattern**:

- Migrate files one at a time, starting with the most critical modules
- Use `.tsx` extension for components, `.ts` for non-JSX modules
- Configure `tsconfig.json` with `strict: true` from day one
- Use `allowJs: false` to enforce type-only source files
- Add path aliases for cleaner imports (`@/*` → `./src/*`)

### Migration Order

1. **Types** (`src/types/index.ts`) — Define all interfaces first
2. **Services** (`src/services/api.ts`) — API layer with full typing
3. **Components** (`src/components/*.tsx`) — Reusable UI
4. **Pages** (`src/pages/*.tsx`) — Route-level components
5. **Entry points** (`src/main.tsx`, `src/App.tsx`) — Bootstrap files

## Consequences

### Positive

- Zero `any` types in production code
- Better IDE autocompletion and refactoring support
- Compile-time error detection
- Self-documenting API contracts
- Easier to catch breaking changes in PR reviews

### Negative

- Initial migration overhead (~2 days for a small project)
- Learning curve for junior developers
- Verbose type definitions for complex API responses

## Alternatives Considered

| Alternative | Pros | Cons |
|-------------|------|------|
| Gradual migration (mixed JS/TS) | Less disruptive | `allowJs: true` creates type-unsafe gaps |
| JSDoc with TypeScript checking | No code changes needed | No real type safety; hard to maintain |
| No migration | Zero effort | Misses all benefits; technical debt grows |

## References

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Migrate to TypeScript Guide](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock do IntersectionObserver (necessário para alguns componentes React)
const mockIntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal('IntersectionObserver', mockIntersectionObserver);

// Mock do matchMedia (necessário para testes de componentes responsivos)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock do scrollTo (necessário para testes de paginação)
window.HTMLElement.prototype.scrollTo = vi.fn() as never;

// Configuração de timezone para testes consistentes
process.env.TZ = 'UTC';

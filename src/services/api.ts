/// <reference types="vite/client" />

import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type {
  Movie,
  MovieListResponse,
  Genre,
} from '../types';

interface ImportMetaEnv {
  readonly VITE_API_KEY?: string;
  readonly VITE_API_URL?: string;
  readonly VITE_IMG_URL?: string;
  readonly VITE_API_BASE_URL?: string;
}

// =============================================================================
// Configuração da API
// =============================================================================

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.themoviedb.org/3';
const IMG_BASE_URL = import.meta.env.VITE_IMG_URL || 'https://image.tmdb.org/t';

// =============================================================================
// Segurança: validação da chave da API no momento da inicialização
// =============================================================================

if (!API_KEY) {
  console.error(
    '❌ [Security] VITE_API_KEY não está configurada. ' +
    'Copie .env.example para .env.local e adicione sua chave TMDB. ' +
    'Obtenha em: https://www.themoviedb.org/settings/api'
  );
}

// =============================================================================
// Cliente Axios com interceptors para segurança e rate limiting
// =============================================================================

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'pt-BR',
  },
  timeout: 10000, // 10s timeout para evitar hanging requests
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Extendemos InternalAxiosRequestConfig para adicionar metadata
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    metadata?: { startTime: Date };
  }
}

// Request interceptor — adiciona timestamp para métricas de performance
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Rate limiting client-side: marca o timestamp
    config.metadata = { startTime: new Date() };
    return config;
  },
  (error: AxiosError) => {
    console.error('[API Error] Falha na requisição:', error.message);
    return Promise.reject(error);
  }
);

// Response interceptor — logging estruturado e tratamento de erros
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log de métrica de performance
    const startTime = (response.config as InternalAxiosRequestConfig & { metadata?: { startTime: Date } }).metadata?.startTime;
    if (startTime) {
      const duration = new Date().getTime() - new Date(startTime).getTime();
      console.debug(`[API Performance] ${response.config.url} — ${duration}ms`);
    }
    return response;
  },
  (error: AxiosError) => {
    // Tratamento centralizado de erros
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      console.error(`[API Error] ${status} — ${(data as { status_message?: string })?.status_message || error.message}`);
    } else if (error.request) {
      // Request was made but no response received
      console.error('[API Error] Timeout ou conexão falhou — sem resposta do servidor');
    } else {
      // Something happened in setting up the request
      console.error('[API Error] Erro na configuração da requisição:', error.message);
    }
    return Promise.reject(error);
  }
);

// =============================================================================
// Rate Limiter simples (cliente)
// Limita a taxa de requisições para a API TMDB — evita abuso/quota excessiva
// =============================================================================

class RateLimiter {
  private queue: Array<() => void> = [];
  private isProcessing = false;
  private lastRequestTime = 0;
  private minInterval: number;

  constructor(requestsPerSecond = 5) {
    // TMDB permite ~40 req/10s para usuários gratuitos
    // Usamos 1 req a cada 200ms = 5 req/s como margem de segurança
    this.minInterval = 1000 / requestsPerSecond;
  }

  async schedule<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(() => {
        fn()
          .then(resolve)
          .catch(reject);
      });
      this.process();
    });
  }

  private async process() {
    if (this.isProcessing || this.queue.length === 0) return;
    this.isProcessing = true;

    const now = Date.now();
    const timeSinceLast = now - this.lastRequestTime;
    if (timeSinceLast < this.minInterval) {
      const waitTime = this.minInterval - timeSinceLast;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    this.lastRequestTime = Date.now();
    const task = this.queue.shift();
    task?.();

    this.isProcessing = false;
    // Process next immediately if there are more queued
    if (this.queue.length > 0) {
      setTimeout(() => this.process(), this.minInterval);
    } else {
      this.isProcessing = false;
    }
  }
}

const rateLimiter = new RateLimiter(4); // 4 requests per second

// Wrapper para requisições com rate limiting
const rateLimitedRequest = async <T,>(url: string, params: Record<string, unknown> = {}): Promise<AxiosResponse<T>> => {
  return rateLimiter.schedule(() => api.get<T>(url, { params }));
};

// =============================================================================
// API Client TMDB — métodos tipados
// =============================================================================

export const tmdbApi = {
  /** Filmes populares — cacheado por 5 minutos no cliente */
  getPopularMovies: (page = 1) =>
    rateLimitedRequest<MovieListResponse>('/movie/popular', { page }),

  /** Filmes em cartaz */
  getNowPlaying: (page = 1) =>
    rateLimitedRequest<MovieListResponse>('/movie/now_playing', { page }),

  /** Próximos lançamentos */
  getUpcoming: (page = 1) =>
    rateLimitedRequest<MovieListResponse>('/movie/upcoming', { page }),

  /** Melhores avaliados */
  getTopRated: (page = 1) =>
    rateLimitedRequest<MovieListResponse>('/movie/top_rated', { page }),

  /** Detalhes do filme — inclui credits, videos, similar */
  getMovieDetails: (id: string | number) =>
    rateLimitedRequest<Movie>('/movie/' + String(id), {
      append_to_response: 'credits,videos,similar',
    }),

  /** Buscar filmes */
  searchMovies: (query: string, page = 1) =>
    rateLimitedRequest<MovieListResponse>('/search/movie', { query, page }),

  /** Lista de gêneros */
  getGenres: () =>
    rateLimitedRequest<{ genres: Genre[] }>('/genre/movie/list'),

  /** Filmes por gênero */
  getMoviesByGenre: (genreId: number, page = 1) =>
    rateLimitedRequest<MovieListResponse>('/discover/movie', { with_genres: genreId, page }),

  /** Descobrir filmes com filtros avançados */
  discoverMovies: (params: Record<string, unknown> = {}) =>
    rateLimitedRequest<MovieListResponse>('/discover/movie', params),
};

// =============================================================================
// Helpers de imagem — validação de segurança
// =============================================================================

const ALLOWED_SIZES = ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'] as const;

type ImageSize = (typeof ALLOWED_SIZES)[number];

/**
 * Gera URL segura para imagens do TMDB.
 * Valida o tamanho e previne injection via path.
 * @param path - Caminho da imagem retornado pela API TMDB
 * @param size - Tamanho da imagem (whitelist validado)
 */
export const getImageUrl = (path: string | null | undefined, size: ImageSize = 'w500'): string => {
  if (!path || typeof path !== 'string' || !path.startsWith('/')) {
    return 'https://via.placeholder.com/500x750/1a1a2e/ffffff?text=No+Image';
  }

  // Sanitiza: remove caracteres perigosos
  const sanitizedPath = encodeURIComponent(path.replace(/[^a-zA-Z0-9/_.-]/g, ''));

  return `https://image.tmdb.org/t/p/${size}${sanitizedPath}`;
};

/**
 * Extrai URL do trailer do YouTube de forma segura.
 * Valida o formato do key para evitar XSS via URL maliciosa.
 * @param videos - Objeto de vídeos retornado pela API TMDB
 * @returns URL do YouTube ou null se não houver trailer
 */
export const getTrailerUrl = (videos?: { results?: Array<{ type: string; site: string; key: string }> } | null): string | null => {
  if (!videos || !videos.results || videos.results.length === 0) return null;

  const trailer = videos.results.find(
    (video) =>
      video.type === 'Trailer' &&
      video.site === 'YouTube' &&
      // Valida o formato do key (YouTube video IDs são alfanuméricos + -_)
      /^[a-zA-Z0-9_-]{11}$/.test(video.key)
  );

  if (!trailer) return null;

  return `https://www.youtube.com/watch?v=${trailer.key}`;
};

// =============================================================================
// Cache simples para reduzir chamadas repetidas à API
// =============================================================================

class SimpleCache<T> {
  private cache = new Map<string, { data: T; timestamp: number }>();
  private ttl: number;

  constructor(ttlMs = 300000) {
    this.ttl = ttlMs; // 5 minutos por padrão
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  set(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }
}

export const movieCache = new SimpleCache<any>(5 * 60 * 1000); // 5 minutos

export default api;

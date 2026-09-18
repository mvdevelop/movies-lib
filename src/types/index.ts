/**
 * Tipos centralizados da aplicação.
 * Baseado na API do TMDB (The Movie Database) v3.
 * @see https://developer.themoviedb.org/docs
 */

// =============================================================================
// Tipos TMDB
// =============================================================================

export interface Movie {
  id: number;
  title: string;
  original_title?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
  runtime?: number | null;
  budget?: number;
  revenue?: number;
  tagline?: string | null;
  status?: string;
  original_language?: string;
  genres?: Genre[];
  genre_ids?: number[];
  genre_names?: string[]; // Opcional — usado em alguns endpoints
  production_companies?: ProductionCompany[];
  credits?: Credits;
  videos?: Videos;
  similar?: MovieListResponse;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Videos {
  results: Video[];
}

export interface Video {
  key: string;
  site: string;
  type: string;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
}

export interface MovieListResponse {
  page: number;
  results: Movie[];
  total_results: number;
  total_pages: number;
}

export interface GenresResponse {
  genres: Genre[];
}

// =============================================================================
// Tipos de ComponentProps
// =============================================================================

export interface MovieCardProps {
  movie: Movie;
  showLink?: boolean;
}

export type NavbarProps = Record<string, never>;
// Props futuras para autenticação

// =============================================================================
// Tipos de Estado Global
// =============================================================================

export interface AppState {
  theme: 'light' | 'dark';
  favorites: number[];
  user: User | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// =============================================================================
// Tipos de API
// =============================================================================

export interface ApiErrorResponse {
  success: boolean;
  status_code: number;
  status_message: string;
}

import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Home from '@/pages/Home';
import { tmdbApi } from '@/services/api';
import type { Movie, Genre } from '@/types';
import type { AxiosResponse } from 'axios';

// Mock the API module
vi.mock('@/services/api', () => ({
  tmdbApi: {
    getPopularMovies: vi.fn(),
    getNowPlaying: vi.fn(),
    getTopRated: vi.fn(),
    getGenres: vi.fn(),
  },
  getImageUrl: vi.fn((path: string | null) =>
    path
      ? `https://image.tmdb.org/t/p/w500${path}`
      : 'https://via.placeholder.com/500x750/1a1a2e/ffffff?text=No+Image'
  ),
}));

// Mock console.error to suppress output during tests
const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => '');

describe('Home Page', () => {
  const mockMovies: Movie[] = [
    {
      id: 1,
      title: 'Test Movie 1',
      poster_path: '/poster1.jpg',
      backdrop_path: '/backdrop1.jpg',
      overview: 'Overview 1',
      release_date: '2024-01-01',
      vote_average: 8.5,
      vote_count: 100,
      runtime: 120,
      genre_ids: [28, 12],
    },
    {
      id: 2,
      title: 'Test Movie 2',
      poster_path: '/poster2.jpg',
      backdrop_path: '/backdrop2.jpg',
      overview: 'Overview 2',
      release_date: '2023-06-15',
      vote_average: 7.2,
      vote_count: 80,
      runtime: 95,
      genre_ids: [35, 18],
    },
  ];

  const mockGenres: Genre[] = [
    { id: 28, name: 'Ação' },
    { id: 35, name: 'Comédia' },
    { id: 18, name: 'Drama' },
  ];

  const mockMovieResponse = (results: Movie[]): AxiosResponse => ({
    data: { results },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as never,
  });

  const mockGenreResponse = (): AxiosResponse => ({
    data: { genres: mockGenres },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as never,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy.mockClear();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renders loading state initially', async () => {
    // Don't resolve promises immediately - keep them pending
    vi.mocked(tmdbApi.getPopularMovies).mockImplementation(() => new Promise(() => {}));
    vi.mocked(tmdbApi.getNowPlaying).mockImplementation(() => new Promise(() => {}));
    vi.mocked(tmdbApi.getTopRated).mockImplementation(() => new Promise(() => {}));
    vi.mocked(tmdbApi.getGenres).mockImplementation(() => new Promise(() => {}));

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Loader should be visible
    await waitFor(() => {
      const loader = document.querySelector('.animate-spin');
      expect(loader).toBeInTheDocument();
    });
  });

  it('renders featured movie after loading', async () => {
    vi.mocked(tmdbApi.getPopularMovies).mockResolvedValue(mockMovieResponse(mockMovies));
    vi.mocked(tmdbApi.getNowPlaying).mockResolvedValue(mockMovieResponse(mockMovies));
    vi.mocked(tmdbApi.getTopRated).mockResolvedValue(mockMovieResponse(mockMovies));
    vi.mocked(tmdbApi.getGenres).mockResolvedValue(mockGenreResponse());

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByText('Test Movie 1').length).toBeGreaterThan(0);
    });
  });

  it('renders category tabs', async () => {
    vi.mocked(tmdbApi.getPopularMovies).mockResolvedValue(mockMovieResponse(mockMovies));
    vi.mocked(tmdbApi.getNowPlaying).mockResolvedValue(mockMovieResponse(mockMovies));
    vi.mocked(tmdbApi.getTopRated).mockResolvedValue(mockMovieResponse(mockMovies));
    vi.mocked(tmdbApi.getGenres).mockResolvedValue(mockGenreResponse());

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Populares')).toBeInTheDocument();
      expect(screen.getByText('Em Cartaz')).toBeInTheDocument();
      expect(screen.getByText('Melhores Avaliados')).toBeInTheDocument();
    });
  });

  it('renders genres section', async () => {
    vi.mocked(tmdbApi.getPopularMovies).mockResolvedValue(mockMovieResponse(mockMovies));
    vi.mocked(tmdbApi.getNowPlaying).mockResolvedValue(mockMovieResponse(mockMovies));
    vi.mocked(tmdbApi.getTopRated).mockResolvedValue(mockMovieResponse(mockMovies));
    vi.mocked(tmdbApi.getGenres).mockResolvedValue(mockGenreResponse());

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Gêneros')).toBeInTheDocument();
      expect(screen.getByText('Ação')).toBeInTheDocument();
      expect(screen.getByText('Comédia')).toBeInTheDocument();
    });
  });

  it('renders error state when API fails', async () => {
    vi.mocked(tmdbApi.getPopularMovies).mockRejectedValue(new Error('API Error'));
    vi.mocked(tmdbApi.getNowPlaying).mockRejectedValue(new Error('API Error'));
    vi.mocked(tmdbApi.getTopRated).mockRejectedValue(new Error('API Error'));
    vi.mocked(tmdbApi.getGenres).mockRejectedValue(new Error('API Error'));

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar dados')).toBeInTheDocument();
    });
  });

  it('shows error message with instructions when API fails', async () => {
    vi.mocked(tmdbApi.getPopularMovies).mockRejectedValue(new Error('API Error'));
    vi.mocked(tmdbApi.getNowPlaying).mockRejectedValue(new Error('API Error'));
    vi.mocked(tmdbApi.getTopRated).mockRejectedValue(new Error('API Error'));
    vi.mocked(tmdbApi.getGenres).mockRejectedValue(new Error('API Error'));

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Home shows error view when API fails
      expect(screen.getByText('Erro ao carregar dados')).toBeInTheDocument();
      expect(screen.getByText(/chave da API no arquivo/)).toBeInTheDocument();
    });
  });
});

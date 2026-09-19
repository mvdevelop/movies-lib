import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Home from '@/pages/Home';
import type { Movie, Genre } from '@/types';

// Mock the API module
const mockGetPopularMovies = vi.fn();
const mockGetNowPlaying = vi.fn();
const mockGetTopRated = vi.fn();
const mockGetGenres = vi.fn();

vi.mock('@/services/api', () => ({
  tmdbApi: {
    getPopularMovies: mockGetPopularMovies,
    getNowPlaying: mockGetNowPlaying,
    getTopRated: mockGetTopRated,
    getGenres: mockGetGenres,
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
  ];

  const mockGenres: Genre[] = [
    { id: 28, name: 'Ação' },
    { id: 35, name: 'Comédia' },
    { id: 18, name: 'Drama' },
  ];

  const mockMovieResponse = {
    data: { results: mockMovies, page: 1, total_results: 1, total_pages: 1 },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  };

  const mockGenreResponse = {
    data: { genres: mockGenres },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  };

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy.mockClear();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renders loading state initially', async () => {
    // Don't resolve promises immediately - keep them pending
    mockGetPopularMovies.mockImplementation(() => new Promise(() => {}));
    mockGetNowPlaying.mockImplementation(() => new Promise(() => {}));
    mockGetTopRated.mockImplementation(() => new Promise(() => {}));
    mockGetGenres.mockImplementation(() => new Promise(() => {}));

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Loader should be visible (animate-spin class)
    await waitFor(() => {
      const loader = document.querySelector('.animate-spin');
      expect(loader).toBeInTheDocument();
    });
  });

  it('renders featured movie after loading', async () => {
    mockGetPopularMovies.mockResolvedValue(mockMovieResponse);
    mockGetNowPlaying.mockResolvedValue(mockMovieResponse);
    mockGetTopRated.mockResolvedValue(mockMovieResponse);
    mockGetGenres.mockResolvedValue(mockGenreResponse);

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
    mockGetPopularMovies.mockResolvedValue(mockMovieResponse);
    mockGetNowPlaying.mockResolvedValue(mockMovieResponse);
    mockGetTopRated.mockResolvedValue(mockMovieResponse);
    mockGetGenres.mockResolvedValue(mockGenreResponse);

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
    mockGetPopularMovies.mockResolvedValue(mockMovieResponse);
    mockGetNowPlaying.mockResolvedValue(mockMovieResponse);
    mockGetTopRated.mockResolvedValue(mockMovieResponse);
    mockGetGenres.mockResolvedValue(mockGenreResponse);

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
    mockGetPopularMovies.mockRejectedValue(new Error('API Error'));
    mockGetNowPlaying.mockRejectedValue(new Error('API Error'));
    mockGetTopRated.mockRejectedValue(new Error('API Error'));
    mockGetGenres.mockRejectedValue(new Error('API Error'));

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
    mockGetPopularMovies.mockRejectedValue(new Error('API Error'));
    mockGetNowPlaying.mockRejectedValue(new Error('API Error'));
    mockGetTopRated.mockRejectedValue(new Error('API Error'));
    mockGetGenres.mockRejectedValue(new Error('API Error'));

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar dados')).toBeInTheDocument();
      expect(screen.getByText(/chave da API no arquivo/)).toBeInTheDocument();
    });
  });
});

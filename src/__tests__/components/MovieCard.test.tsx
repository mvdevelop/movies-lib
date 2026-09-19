import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import MovieCard from '@/components/MovieCard';
import type { Movie } from '@/types';

// Mock da função getImageUrl
vi.mock('@/services/api', () => ({
  getImageUrl: (path: string | null) =>
    path ? `https://image.tmdb.org/t/p/w500${path}` : 'https://via.placeholder.com/300x450/1a1a2e/ffffff?text=No+Image',
}));

const mockMovie: Movie = {
  id: 1,
  title: 'Test Movie',
  poster_path: '/test-poster.jpg',
  backdrop_path: '/test-backdrop.jpg',
  overview: 'A test movie overview',
  release_date: '2024-01-15',
  vote_average: 8.5,
  vote_count: 100,
  runtime: 120,
};

const mockMovieNoImage: Movie = {
  id: 2,
  title: 'No Image Movie',
  poster_path: null,
  backdrop_path: null,
  overview: 'No poster available',
  release_date: '2023-05-20',
  vote_average: 7.0,
  vote_count: 50,
};

describe('MovieCard', () => {
  it('renders movie title correctly', () => {
    render(
      <MemoryRouter>
        <MovieCard movie={mockMovie} />
      </MemoryRouter>
    );

    expect(screen.getByText('Test Movie')).toBeInTheDocument();
  });

  it('renders movie rating correctly (featured badge)', () => {
    render(
      <MemoryRouter>
        <MovieCard movie={mockMovie} />
      </MemoryRouter>
    );

    // Rating appears in the badge at top of card
    const ratingElements = screen.getAllByText('8.5');
    expect(ratingElements.length).toBe(2); // Badge + bottom rating
  });

  it('renders movie year correctly', () => {
    render(
      <MemoryRouter>
        <MovieCard movie={mockMovie} />
      </MemoryRouter>
    );

    expect(screen.getByText('2024')).toBeInTheDocument();
  });

  it('renders fallback image when poster_path is null', () => {
    render(
      <MemoryRouter>
        <MovieCard movie={mockMovieNoImage} />
      </MemoryRouter>
    );

    const img = screen.getByAltText('No Image Movie') as HTMLImageElement;
    expect(img.src).toContain('via.placeholder.com');
  });

  it('renders duration when runtime is available', () => {
    render(
      <MemoryRouter>
        <MovieCard movie={mockMovie} />
      </MemoryRouter>
    );

    expect(screen.getByText('2h 0m')).toBeInTheDocument();
  });

  it('renders "Ver Detalhes" button text', () => {
    render(
      <MemoryRouter>
        <MovieCard movie={mockMovie} />
      </MemoryRouter>
    );

    expect(screen.getAllByText('Ver Detalhes').length).toBeGreaterThan(0);
  });

  it('renders overview text', () => {
    render(
      <MemoryRouter>
        <MovieCard movie={mockMovie} />
      </MemoryRouter>
    );

    expect(screen.getByText('A test movie overview')).toBeInTheDocument();
  });

  it('has a link to the movie details page', () => {
    render(
      <MemoryRouter>
        <MovieCard movie={mockMovie} />
      </MemoryRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/movie/1');
  });

  it('hides rating badge when vote_average is not available', () => {
    const movieNoRating: Movie = { ...mockMovie, vote_average: undefined };
    render(
      <MemoryRouter>
        <MovieCard movie={movieNoRating} />
      </MemoryRouter>
    );

    // When vote_average is undefined, the rating badge is hidden
    // The top-right rating badge should not be rendered
    const badge = screen.queryByTestId('rating-badge');
    expect(badge).toBeNull();
  });

  it('renders genres when available', () => {
    const movieWithGenres: Movie = {
      ...mockMovie,
      genres: [
        { id: 1, name: 'Action' },
        { id: 2, name: 'Adventure' },
      ],
    };
    render(
      <MemoryRouter>
        <MovieCard movie={movieWithGenres} />
      </MemoryRouter>
    );

    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('renders "+ count" when more than 2 genres', () => {
    const movieWithGenres: Movie = {
      ...mockMovie,
      genres: [
        { id: 1, name: 'Action' },
        { id: 2, name: 'Adventure' },
        { id: 3, name: 'Sci-Fi' },
      ],
    };
    render(
      <MemoryRouter>
        <MovieCard movie={movieWithGenres} />
      </MemoryRouter>
    );

    expect(screen.getByText('+1')).toBeInTheDocument();
  });

  it('renders without showLink prop (direct display)', () => {
    render(
      <MemoryRouter>
        <MovieCard movie={mockMovie} showLink={false} />
      </MemoryRouter>
    );

    expect(screen.getByText('Test Movie')).toBeInTheDocument();
  });

  it('returns null when movie is not provided', () => {
    const { container } = render(
      // @ts-expect-error Testing null input
      <MovieCard movie={null} />
    );
    expect(container.firstChild).toBeNull();
  });
});

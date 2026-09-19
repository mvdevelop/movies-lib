import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Navbar from '@/components/Navbar';

// Mock useNavigate
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('Navbar', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  it('renders the brand logo', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('MovieLib')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Filmes')).toBeInTheDocument();
    expect(screen.getByText('Séries')).toBeInTheDocument();
    expect(screen.getByText('Minha Lista')).toBeInTheDocument();
  });

  it('renders search bar', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText('Buscar filmes, séries...');
    expect(searchInput).toBeInTheDocument();
  });

  it('navigates to search on form submit with query', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText('Buscar filmes, séries...') as HTMLInputElement;
    const searchButton = screen.getByRole('button', { name: 'Buscar' });

    fireEvent.change(searchInput, { target: { value: 'Inception' } });
    fireEvent.click(searchButton);

    expect(mockNavigate).toHaveBeenCalledWith('/search/Inception');
  });

  it('does not navigate on empty search', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const searchButton = screen.getByRole('button', { name: 'Buscar' });
    fireEvent.click(searchButton);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('toggles mobile menu on button click', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const menuButton = screen.getByLabelText('Alternar menu');

    // Initially, mobile menu should not be visible (Buscar... appears twice in mobile form and desktop)
    const initialButtons = screen.getAllByText('Buscar');
    expect(initialButtons.length).toBe(1); // Only desktop button visible

    // Open mobile menu
    fireEvent.click(menuButton);
    const openButtons = screen.getAllByText('Buscar');
    expect(openButtons.length).toBe(2); // Desktop + mobile

    // Close mobile menu
    fireEvent.click(menuButton);
    const closedButtons = screen.getAllByText('Buscar');
    expect(closedButtons.length).toBe(1); // Back to only desktop
  });

  it('clears search input after navigation', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(
      'Buscar filmes, séries...'
    ) as HTMLInputElement;
    const searchButton = screen.getByRole('button', { name: 'Buscar' });

    fireEvent.change(searchInput, { target: { value: 'Test Movie' } });
    fireEvent.click(searchButton);

    expect(searchInput.value).toBe('');
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Navbar from '@/components/Navbar';

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

  it('has a search button', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const searchButton = screen.getByRole('button', { name: 'Buscar' });
    expect(searchButton).toBeInTheDocument();
  });

  it('renders mobile menu button with correct aria-label', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const menuButton = screen.getByLabelText('Alternar menu');
    expect(menuButton).toBeInTheDocument();
  });

  it('toggles mobile menu on button click', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const menuButton = screen.getByLabelText('Alternar menu');

    // Initially, mobile menu should not be visible
    const initialButtons = screen.getAllByText('Buscar');
    expect(initialButtons.length).toBe(1);

    // Open mobile menu
    fireEvent.click(menuButton);
    const openButtons = screen.getAllByText('Buscar');
    expect(openButtons.length).toBe(2);

    // Close mobile menu
    fireEvent.click(menuButton);
    const closedButtons = screen.getAllByText('Buscar');
    expect(closedButtons.length).toBe(1);
  });

  it('has proper aria-expanded on mobile menu button', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const menuButton = screen.getByLabelText('Alternar menu');
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    // Open and check
    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  });
});

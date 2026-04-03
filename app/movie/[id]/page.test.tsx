import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import MoviePage from './page';
import React from 'react';

// Mock Next.js components
vi.mock('next/image', () => ({
  default: ({ src, alt, width, height, className }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={width} height={height} className={className} />
  ),
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe('MoviePage', () => {
  const mockMovie = {
    id: 1,
    title: 'Inception',
    overview: 'A thief who steals corporate secrets...',
    popularity: 95.5,
    release_date: '2010-07-16',
    poster_path: '/inception.jpg'
  };

  beforeEach(() => {
    vi.resetAllMocks();
    
    // Default fetch mock
    (global.fetch as any).mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockMovie),
    });
  });

  it('renders movie details correctly', async () => {
    const params = Promise.resolve({ id: '1' });
    render(<MoviePage params={params} />);

    // Wait for the movie title to appear
    await waitFor(() => {
      expect(screen.getByText('Inception')).toBeInTheDocument();
    });

    // Check other details
    expect(screen.getByText(mockMovie.overview)).toBeInTheDocument();
    expect(screen.getByText(`Popularity: ${mockMovie.popularity}`)).toBeInTheDocument();
    expect(screen.getByText(`Release Date: ${mockMovie.release_date}`)).toBeInTheDocument();
    
    const img = screen.getByAltText('Inception');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', mockMovie.poster_path);
  });

  it('renders error message when params fetching fails', async () => {
    const params = Promise.reject(new Error('Invalid ID'));
    
    render(<MoviePage params={params} />);

    await waitFor(() => {
      expect(screen.getByText(/Error happened while fetching movies: Invalid ID/i)).toBeInTheDocument();
    });
  });

  it('calls fetch with correct id and revalidate seconds', async () => {
    const params = Promise.resolve({ id: '456' });
    render(<MoviePage params={params} />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/movie/456?revalidate=3600'));
    });
  });
});

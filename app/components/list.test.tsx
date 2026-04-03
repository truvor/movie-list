import { render, screen, waitFor } from '@testing-library/react';
import List from './list';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('List Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Default fetch mock
    (global.fetch as any).mockResolvedValue({
      json: vi.fn().mockResolvedValue([]),
    });
  });

  it('renders the trending movies heading with mocked date', async () => {
    const mockMovies = [
      {
        id: 1,
        title: 'Inception',
        overview: 'A thief who steals corporate secrets...',
        popularity: 95.5,
        release_date: '2010-07-16',
        poster_path: '/path.jpg'
      },
    ];

    (global.fetch as any).mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockMovies),
    });

    render(<List />);

    // Check if the heading with the mocked date is present
    expect(await screen.findByText(/Trending movies on /i)).toBeInTheDocument();

    // Wait for the movie to appear
    await waitFor(() => {
      expect(screen.getByText('Inception')).toBeInTheDocument();
    });
  });

  it('renders an error message when the API request fails', async () => {
    (global.fetch as any).mockRejectedValue(new Error('Failed to fetch'));

    render(<List />);

    await waitFor(() => {
      expect(screen.getByText(/Error happened while fetching movies: Failed to fetch/i)).toBeInTheDocument();
    });
  });

  it('does not render the list if no movies are returned', async () => {
    (global.fetch as any).mockResolvedValue({
      json: vi.fn().mockResolvedValue([]),
    });

    render(<List />);

    // The heading should not be present initially, and since no movies come back, it stays absent
    expect(screen.queryByText(/Trending movies on/i)).not.toBeInTheDocument();
  });
});

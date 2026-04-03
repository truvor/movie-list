import { GET } from './route';
import { NextRequest } from 'next/server';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('Movie API Route', () => {
    const mockMovieData = {
        id: 123,
        title: 'Test Movie',
        overview: 'Overview contents',
        popularity: 100.5,
        release_date: '2024-01-01',
        poster_path: '/poster.jpg'
    };

    beforeEach(() => {
        vi.resetAllMocks();
        
        // Mock environment variables
        process.env.TMDB_API_KEY = 'test-token';
        process.env.IMG_PATH = 'https://image.tmdb.org/t/p/w500';

        // Default fetch mock
        (global.fetch as any).mockResolvedValue({
            ok: true,
            statusText: 'OK',
            json: vi.fn().mockResolvedValue(mockMovieData),
        });
    });

    it('returns transformed movie data on successful fetch', async () => {
        const req = new NextRequest('http://localhost/api/movie/123');
        const params = Promise.resolve({ id: '123' });

        const response = await GET(req, { params });
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toEqual({
            id: mockMovieData.id,
            title: mockMovieData.title,
            overview: mockMovieData.overview,
            popularity: mockMovieData.popularity,
            release_date: mockMovieData.release_date,
            poster_path: 'https://image.tmdb.org/t/p/w500/poster.jpg'
        });
        
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('api.themoviedb.org/3/movie/123'),
            expect.objectContaining({
                headers: {
                    'Authorization': 'Bearer test-token'
                }
            })
        );
    });

    it('uses revalidate search parameter when provided', async () => {
        const req = new NextRequest('http://localhost/api/movie/123?revalidate=60');
        const params = Promise.resolve({ id: '123' });

        await GET(req, { params });

        expect(global.fetch).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                next: { revalidate: 60 }
            })
        );
    });

    it('defaults revalidate to 3600 when not provided', async () => {
        const req = new NextRequest('http://localhost/api/movie/123');
        const params = Promise.resolve({ id: '123' });

        await GET(req, { params });

        expect(global.fetch).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                next: { revalidate: 3600 }
            })
        );
    });

    it('returns 500 status on external API failure', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: false,
            statusText: 'Unauthorized',
        });

        const req = new NextRequest('http://localhost/api/movie/123');
        const params = Promise.resolve({ id: '123' });

        const response = await GET(req, { params });
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Failed to fetch the movie');
        expect(data.details).toContain('Unauthorized');
    });

    it('returns 500 status on network error', async () => {
        (global.fetch as any).mockRejectedValue(new Error('Network error'));

        const req = new NextRequest('http://localhost/api/movie/123');
        const params = Promise.resolve({ id: '123' });

        const response = await GET(req, { params });
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Failed to fetch the movie');
        expect(data.details).toBe('Network error');
    });
});

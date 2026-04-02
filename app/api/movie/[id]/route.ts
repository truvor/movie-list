import { NextRequest } from 'next/server';
import { Movie } from '@/app/types/movie';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { searchParams } = new URL(request.url);
        const revalidateParam = searchParams.get('revalidate');
        const revalidateValue = revalidateParam ? parseInt(revalidateParam, 10) : 3600;

        const { id } = await params;
        const res = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
            headers: {
                'Authorization': `Bearer ${process.env.TMDB_API_KEY}`,
            },
            next: { revalidate: revalidateValue }
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch movie list: ${res.statusText}`);
        }

        const data = await res.json();
        const movie: Movie = {
            id: data.id,
            title: data.title,
            overview: data.overview,
            popularity: data.popularity,
            release_date: data.release_date,
            poster_path: process.env.IMG_PATH + data.poster_path,
        }
        return Response.json(movie);
    } catch (error) {
        return new Response(JSON.stringify({
            error: 'Failed to fetch the movie',
            details: (error as Error).message
        }), { status: 500 });
    }
}

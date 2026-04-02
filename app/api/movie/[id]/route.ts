import { NextRequest } from 'next/server';

export async function GET(request: NextRequest,
    { params }: { params: { id: string } }) {
    try {
        const { id } = await params;
        const res = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
            headers: {
                'Authorization': `Bearer ${process.env.TMDB_API_KEY}`,
            },
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch movie list: ${res.statusText}`);
        }

        const data = await res.json();
        const movie = {
            id: data.id,
            title: data.title,
            description: data.overview,
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

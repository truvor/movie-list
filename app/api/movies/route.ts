export async function GET() {
    try {
        const res = await fetch('https://api.themoviedb.org/3/trending/movie/day', {
            headers: {
                'Authorization': `Bearer ${process.env.TMDB_API_KEY}`,
            },
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch movie list: ${res.statusText}`);
        }

        const data = await res.json();
        if (data.results && Array.isArray(data.results)) {
            return Response.json(data.results);
        } else {
            throw new Error('Invalid response from movie API');
        }
    } catch (error) {
        return new Response(JSON.stringify({
            error: 'Failed to fetch movie list',
            details: (error as Error).message
        }), { status: 500 });
    }
}

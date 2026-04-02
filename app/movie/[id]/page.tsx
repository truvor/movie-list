'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Movie } from "@/app/types/movie";
import Favorite from '@/app/components/favorite';

export default function MoviePage({ params }: { params: Promise<{ id: string }> }) {
    const [movie, setMovie] = useState<Movie | null>(null);
    const [id, setId] = useState<string | null>(null);

    useEffect(() => {
        params.then(res => {
            setId(res.id)
            return res
        }).catch(error => {
            console.error('Error fetching movie:', error);
        });
    }, []);

    useEffect(() => {
        if (id) {
            fetch(`/api/movie/${id}`).then(res => {
                return res.json();
            }).then(data => {
                setMovie(data)
            });
        }

    }, [id]);


    return (
        <main className="p-14 flex flex-row gap-4 items-center">
            {movie && (<>
                <Image src={movie.poster_path || ''} alt={movie?.title || ''} width={200} height={200} className="rounded-md" />
                <div className="flex flex-col gap-4">
                    <div className="flex flex-row items-center"><h1 className="text-3xl font-bold pr-1">{movie?.title}</h1><Favorite id={movie.id} /></div>
                    <p className="max-w-prose opacity-80">{movie?.overview}</p>
                    <div className="flex gap-4 text-sm opacity-60">
                        <span>Popularity: {movie?.popularity}</span>
                        <span>Release Date: {movie?.release_date}</span>
                    </div>
                </div>
            </>)}
        </main>
    );
}
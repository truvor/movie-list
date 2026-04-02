'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Movie } from "@/app/types/movie";

export default function MoviePage({ params }: { params: Promise<{ id: string }> }) {
    const [movie, setMovie] = useState<Movie | null>(null);
    const [id, setId] = useState<string | null>(null);

    params.then(res => {
        setId(res.id)
        return res
    }).catch(error => {
        console.error('Error fetching movie:', error);
    });
    useEffect(() => {
        if (id) {
            fetch(`/api/movie/${id}`).then(res => {
                return res.json();
            }).then(data => {
                setMovie(data)
                console.log('data', data)
            });
        }

    }, [id]);


    return (
        <> {movie && <div className='flex flex-col'>
            <Image src={movie.poster_path || ''} alt={movie?.title || ''} width={200} height={200} />
            <h1>{movie?.title}</h1>
            <p>{movie?.description}</p>
            <span>Popularity: {movie?.popularity}</span>
            <span>Release Date: {movie?.release_date}</span>
        </div>}</>
    )
}
import Link from "next/link";
import { Movie } from "@/app/types/movie";

export default function Card({ movie }: { movie: Movie }) {
    return (
        <div className="flex flex-col w-full pb-2">
            <h5 className="card-title">{movie.title}</h5>
            <p className="card-text">{movie.description}</p>

            <span>Popularity: {movie.popularity}</span>
            <span>Release Date: {movie.release_date}</span>
            <Link href={`/movie/${movie.id}`} className="btn btn-primary">View Details</Link>
        </div>
    )
}
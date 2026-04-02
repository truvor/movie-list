import Link from "next/link";
import Image from "next/image";
import { Movie } from "@/app/types/movie";
import styles from "./card.module.css";

export default function Card({ movie }: { movie: Movie }) {
    return (
        <div className="flex flex-col pb-2 w-full md:w-1/5">
            <div className="flex items-center">
                <Link
                    href={`/movie/${movie.id}`}
                    className={`${styles.details} flex items-center pl-1 pr-1`}
                >
                    <h5 className={styles.title}>{movie.title}</h5>

                    <Image
                        src="/enter.svg"
                        width={20}
                        height={20}
                        alt="Details"
                    />
                </Link>
            </div>
            <div className="flex flex-col text-sm pl-1">
                <p className={styles.overview}>{movie.overview}</p>

                <span><b>Rating:</b> {movie.popularity.toFixed(1)}</span>
                <span><b>Released:</b> {movie.release_date}</span>
            </div>
        </div>
    )
}
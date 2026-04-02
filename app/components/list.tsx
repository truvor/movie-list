"use client";

import { useState, useEffect } from "react";
import { Movie } from "@/app/types/movie";
import Card from "./card/card";

declare const Temporal: any;

export default function List() {
  const [today, setToday] = useState<string | null>(null);
  const [movies, setMovies] = useState<Array<Movie>>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setToday(Temporal.Now.plainDateISO().toLocaleString("en-US", {
      day: "numeric",
      month: "long",
    }));
    const now = Temporal.Now.zonedDateTimeISO();
    const startOfTomorrow = now.add({ days: 1 }).startOfDay();
    const seconds = Math.round(startOfTomorrow.since(now).total({ unit: "seconds" }));

    fetch(`/api/movies?revalidate=${seconds}`).then(res => res.json()).then(data => {
      setMovies(data)
    }).catch(error => {
      setError(error.message)
    });
  }, []);

  return (
    <>
      {error !== null ? <p className="text-red-500">Error happened while fetching movies: {error}</p> :
        movies.length > 0 &&
        <>
          <h1 className="pb-2 text-xl">Trending movies on {today}:</h1>
          <div className="flex flex-wrap gap-4">
            {movies.map((item) => {
              return (
                <Card key={item.id} movie={item} />
              );
            })}
          </div>
        </>
      }
    </>
  );
}

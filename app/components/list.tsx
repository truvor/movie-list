"use client";

import { useState, useEffect } from "react";

declare const Temporal: any;
type Movie = {
  id: number;
  title: string;
  description: string;
  popularity: number;
  release_date: string;
};

const MOCK_DATA = [
  {
    id: 1,
    title: "Superman Returns",
    description: "Superman returns to discover his 5-year absence",
    popularity: 23.183,
    release_date: "2006-06-28",
  },
  {
    id: 2,
    title: "The Incredibles",
    description:
      "Bob Parr has given up his superhero days to log in time as an insurance adjuster",
    popularity: 71.477,
    release_date: "2004-10-27",
  },
  {
    id: 3,
    title: "Hancock",
    description:
      "Hancock is a down-and-out superhero who's forced to employ a PR expert",
    popularity: 53.556,
    release_date: "2008-07-01",
  },
];

export default function List() {
  const [today, setToday] = useState<string | null>(null);
  const [movies, setMovies] = useState<Array<Movie>>([]);

  useEffect(() => {
    const currentDate = Temporal.Now.plainDateISO().toLocaleString("en-US", {
      day: "numeric",
      month: "long",
    });
    setToday(currentDate.toString());
    setMovies(MOCK_DATA);
  }, []);

  return (
    <>
      <h1 className="pb-2">Trending movies on {today}:</h1>
      <ul>
        {movies.length > 0 &&
          movies.map((item) => {
            return (
              <li key={item.id} className="flex flex-col w-full pb-2">
                <span>Title: {item.title}</span>
                <span>Description: {item.description}</span>
                <span>Popularity: {item.popularity}</span>
                <span>Release Date: {item.release_date}</span>
              </li>
            );
          })}
      </ul>
    </>
  );
}

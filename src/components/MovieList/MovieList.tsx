import React from "react";
import Movie from "../Movie/Movie";
import "./MovieList.css";
import { DataProps } from "../Intefaces/DataProps";

interface MovieListProps {
  data: DataProps[];
  date: (arg: string) => string;
  rateMovie: (arg1: number, arg2: number) => void;
}

const MovieList: React.FC<MovieListProps> = ({ data, date, rateMovie }) => {
  return (
    <div>
      <ul className="movie-list">
        {data
          .map((item) => {
            return (
              <li className="movie-list__item" key={item.id}>
                <Movie item={item} date={date} rateMovie={rateMovie} />
              </li>
            );
          })
          .slice(14)}
      </ul>
    </div>
  );
};
export default MovieList;

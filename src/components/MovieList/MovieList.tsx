import React from "react";
import Movie from "../Movie/Movie";
import "./MovieList.css";
import { MovieDataProps } from "../Intefaces/MovieDataProps";

interface MovieListProps {
  data: MovieDataProps[];
  date: (arg: string) => string;
}

const MovieList: React.FC<MovieListProps> = ({ data, date }) => {
  return (
    <div>
      <ul className="movie-list">
        {data
          .map((item) => {
            return (
              <li className="movie-list__item" key={item.id}>
                <Movie item={item} date={date}/>
              </li>
            );
          })
          .slice(14)}
      </ul>
    </div>
  );
};
export default MovieList;
